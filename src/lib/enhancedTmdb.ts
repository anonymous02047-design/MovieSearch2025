/**
 * Enhanced TMDB API Integration with advanced features
 * - Caching layer
 * - Rate limiting handling
 * - Error retry logic
 * - Type safety
 * - Request queuing
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

interface TMDBConfig {
  apiKey: string;
  baseURL: string;
  timeout: number;
  maxRetries: number;
  retryDelay: number;
  cacheEnabled: boolean;
  cacheTTL: number;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class EnhancedTMDBClient {
  private client: AxiosInstance;
  private config: TMDBConfig;
  private cache: Map<string, CacheEntry<any>>;
  private requestQueue: Map<string, Promise<any>>;
  private rateLimitDelay: number = 0;

  constructor(config?: Partial<TMDBConfig>) {
    this.config = {
      apiKey: process.env.NEXT_PUBLIC_TMDB_API_KEY || '',
      baseURL: process.env.NEXT_PUBLIC_TMDB_API_URL || 'https://api.themoviedb.org/3',
      timeout: 30000,
      maxRetries: 3,
      retryDelay: 1000,
      cacheEnabled: true,
      cacheTTL: 300000, // 5 minutes
      ...config,
    };

    this.cache = new Map();
    this.requestQueue = new Map();

    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add API key to all requests
        if (!config.params) {
          config.params = {};
        }
        config.params.api_key = this.config.apiKey;
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error.config;

        // Handle rate limiting
        if (error.response?.status === 429) {
          const retryAfter = parseInt(error.response.headers['retry-after'] || '5') * 1000;
          this.rateLimitDelay = retryAfter;
          
          console.warn(`TMDB rate limit hit. Retrying after ${retryAfter}ms`);
          
          await this.delay(retryAfter);
          return this.client.request(config);
        }

        // Retry logic
        if (!config.__retryCount) {
          config.__retryCount = 0;
        }

        if (config.__retryCount < this.config.maxRetries) {
          config.__retryCount++;
          
          const shouldRetry = this.shouldRetry(error);
          if (shouldRetry) {
            const delay = this.config.retryDelay * Math.pow(2, config.__retryCount - 1);
            console.warn(`Retrying TMDB request (${config.__retryCount}/${this.config.maxRetries}) after ${delay}ms`);
            
            await this.delay(delay);
            return this.client.request(config);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private shouldRetry(error: any): boolean {
    // Retry on network errors or 5xx server errors
    return (
      !error.response ||
      error.code === 'ECONNABORTED' ||
      error.code === 'ENOTFOUND' ||
      error.code === 'ECONNRESET' ||
      (error.response.status >= 500 && error.response.status < 600)
    );
  }

  private getCacheKey(endpoint: string, params?: any): string {
    const paramsString = params ? JSON.stringify(params) : '';
    return `${endpoint}:${paramsString}`;
  }

  private getFromCache<T>(key: string): T | null {
    if (!this.config.cacheEnabled) return null;

    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  private setToCache<T>(key: string, data: T, ttl?: number): void {
    if (!this.config.cacheEnabled) return;

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.cacheTTL,
    });

    // Cleanup old entries (keep max 100 entries)
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  private async request<T>(
    endpoint: string,
    params?: any,
    config?: AxiosRequestConfig,
    cacheTTL?: number
  ): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, params);

    // Check cache
    const cached = this.getFromCache<T>(cacheKey);
    if (cached) {
      return cached;
    }

    // Check if same request is in progress (request deduplication)
    if (this.requestQueue.has(cacheKey)) {
      return this.requestQueue.get(cacheKey);
    }

    // Apply rate limit delay if needed
    if (this.rateLimitDelay > 0) {
      await this.delay(this.rateLimitDelay);
      this.rateLimitDelay = 0;
    }

    // Make request
    const requestPromise = this.client
      .get<T>(endpoint, { ...config, params })
      .then((response: AxiosResponse<T>) => {
        this.setToCache(cacheKey, response.data, cacheTTL);
        this.requestQueue.delete(cacheKey);
        return response.data;
      })
      .catch((error) => {
        this.requestQueue.delete(cacheKey);
        throw error;
      });

    this.requestQueue.set(cacheKey, requestPromise);
    return requestPromise;
  }

  // Public API methods

  async getMovieDetails(movieId: number): Promise<any> {
    return this.request(`/movie/${movieId}`, { append_to_response: 'credits,videos,images,similar,recommendations' });
  }

  async getTVShowDetails(tvId: number): Promise<any> {
    return this.request(`/tv/${tvId}`, { append_to_response: 'credits,videos,images,similar,recommendations' });
  }

  async searchMovies(query: string, page: number = 1, filters?: any): Promise<any> {
    return this.request('/search/movie', { query, page, ...filters });
  }

  async searchTVShows(query: string, page: number = 1, filters?: any): Promise<any> {
    return this.request('/search/tv', { query, page, ...filters });
  }

  async discoverMovies(filters?: any, page: number = 1): Promise<any> {
    return this.request('/discover/movie', { page, ...filters });
  }

  async discoverTVShows(filters?: any, page: number = 1): Promise<any> {
    return this.request('/discover/tv', { page, ...filters });
  }

  async getTrending(mediaType: 'movie' | 'tv' | 'all' = 'movie', timeWindow: 'day' | 'week' = 'week'): Promise<any> {
    return this.request(`/trending/${mediaType}/${timeWindow}`);
  }

  async getPopular(mediaType: 'movie' | 'tv' = 'movie', page: number = 1): Promise<any> {
    return this.request(`/${mediaType}/popular`, { page });
  }

  async getTopRated(mediaType: 'movie' | 'tv' = 'movie', page: number = 1): Promise<any> {
    return this.request(`/${mediaType}/top_rated`, { page });
  }

  async getNowPlaying(page: number = 1): Promise<any> {
    return this.request('/movie/now_playing', { page });
  }

  async getUpcoming(page: number = 1): Promise<any> {
    return this.request('/movie/upcoming', { page });
  }

  async getGenres(mediaType: 'movie' | 'tv' = 'movie'): Promise<any> {
    return this.request(`/genre/${mediaType}/list`, {}, {}, 86400000); // Cache for 24 hours
  }

  async getPerson(personId: number): Promise<any> {
    return this.request(`/person/${personId}`, { append_to_response: 'movie_credits,tv_credits,images' });
  }

  async getMovieVideos(movieId: number): Promise<any> {
    return this.request(`/movie/${movieId}/videos`);
  }

  async getTVShowVideos(tvId: number): Promise<any> {
    return this.request(`/tv/${tvId}/videos`);
  }

  async getMovieCredits(movieId: number): Promise<any> {
    return this.request(`/movie/${movieId}/credits`);
  }

  async getTVShowCredits(tvId: number): Promise<any> {
    return this.request(`/tv/${tvId}/credits`);
  }

  async getSimilarMovies(movieId: number, page: number = 1): Promise<any> {
    return this.request(`/movie/${movieId}/similar`, { page });
  }

  async getSimilarTVShows(tvId: number, page: number = 1): Promise<any> {
    return this.request(`/tv/${tvId}/similar`, { page });
  }

  async getRecommendations(movieId: number, page: number = 1): Promise<any> {
    return this.request(`/movie/${movieId}/recommendations`, { page });
  }

  async getWatchProviders(movieId: number): Promise<any> {
    return this.request(`/movie/${movieId}/watch/providers`);
  }

  async getConfiguration(): Promise<any> {
    return this.request('/configuration', {}, {}, 604800000); // Cache for 7 days
  }

  // Cache management
  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Export singleton instance
export const tmdbClient = new EnhancedTMDBClient();

// Export class for custom instances
export { EnhancedTMDBClient };

// Export default for backward compatibility
export default tmdbClient;

