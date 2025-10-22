/**
 * TMDB API Proxy Client
 * Uses the Next.js API proxy to remove rate limits and add caching
 */

import { retryWithBackoff, withTimeout, APIError } from '@/utils/errorHandling';

const USE_PROXY = true; // Set to true to use proxy, false for direct API calls
const PROXY_BASE_URL = '/api/tmdb';
const DIRECT_BASE_URL = 'https://api.themoviedb.org/3';

interface TMDBRequestOptions {
  useProxy?: boolean;
  timeout?: number;
  retries?: number;
  cache?: RequestCache;
}

/**
 * Fetch data from TMDB API with proxy support
 */
export async function tmdbFetch<T = any>(
  endpoint: string,
  params: Record<string, string | number> = {},
  options: TMDBRequestOptions = {}
): Promise<T> {
  const {
    useProxy = USE_PROXY,
    timeout = 30000,
    retries = 3,
    cache = 'default',
  } = options;

  // Build URL
  const baseUrl = useProxy ? PROXY_BASE_URL : DIRECT_BASE_URL;
  const url = new URL(`${baseUrl}/${endpoint.replace(/^\//, '')}`);

  // Add query parameters
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  // Add API key if not using proxy
  if (!useProxy && process.env.NEXT_PUBLIC_TMDB_API_KEY) {
    url.searchParams.append('api_key', process.env.NEXT_PUBLIC_TMDB_API_KEY);
  }

  // Fetch with retry and timeout
  const fetchWithRetry = () =>
    retryWithBackoff(
      async () => {
        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new APIError(
            errorData.status_message || `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            { endpoint, params }
          );
        }

        return response.json();
      },
      retries,
      1000
    );

  try {
    return await withTimeout(fetchWithRetry(), timeout);
  } catch (error) {
    console.error('TMDB Fetch Error:', { endpoint, params, error });
    throw error;
  }
}

/**
 * TMDB API Client with Proxy Support
 */
export const tmdbProxyClient = {
  // Movies
  async getMovie(movieId: number, appendToResponse?: string[]) {
    const params: Record<string, string | number> = {};
    if (appendToResponse && appendToResponse.length > 0) {
      params.append_to_response = appendToResponse.join(',');
    }
    return tmdbFetch(`movie/${movieId}`, params);
  },

  async getMovieVideos(movieId: number) {
    return tmdbFetch(`movie/${movieId}/videos`);
  },

  async getMovieCredits(movieId: number) {
    return tmdbFetch(`movie/${movieId}/credits`);
  },

  async getSimilarMovies(movieId: number, page = 1) {
    return tmdbFetch(`movie/${movieId}/similar`, { page });
  },

  async getRecommendedMovies(movieId: number, page = 1) {
    return tmdbFetch(`movie/${movieId}/recommendations`, { page });
  },

  // Search
  async searchMovies(query: string, page = 1, year?: number) {
    const params: Record<string, string | number> = { query, page };
    if (year) params.year = year;
    return tmdbFetch('search/movie', params);
  },

  async searchMulti(query: string, page = 1) {
    return tmdbFetch('search/multi', { query, page });
  },

  // Discover
  async discoverMovies(filters: Record<string, any> = {}, page = 1) {
    return tmdbFetch('discover/movie', { ...filters, page });
  },

  async discoverTVShows(filters: Record<string, any> = {}, page = 1) {
    return tmdbFetch('discover/tv', { ...filters, page });
  },

  // Trending
  async getTrending(mediaType: 'movie' | 'tv' | 'all' = 'movie', timeWindow: 'day' | 'week' = 'day') {
    return tmdbFetch(`trending/${mediaType}/${timeWindow}`);
  },

  // Lists
  async getPopular(mediaType: 'movie' | 'tv' = 'movie', page = 1) {
    return tmdbFetch(`${mediaType}/popular`, { page });
  },

  async getTopRated(mediaType: 'movie' | 'tv' = 'movie', page = 1) {
    return tmdbFetch(`${mediaType}/top_rated`, { page });
  },

  async getUpcoming(page = 1) {
    return tmdbFetch('movie/upcoming', { page });
  },

  async getNowPlaying(page = 1) {
    return tmdbFetch('movie/now_playing', { page });
  },

  // TV Shows
  async getTVShow(tvId: number, appendToResponse?: string[]) {
    const params: Record<string, string | number> = {};
    if (appendToResponse && appendToResponse.length > 0) {
      params.append_to_response = appendToResponse.join(',');
    }
    return tmdbFetch(`tv/${tvId}`, params);
  },

  async getTVShowVideos(tvId: number) {
    return tmdbFetch(`tv/${tvId}/videos`);
  },

  async getTVShowCredits(tvId: number) {
    return tmdbFetch(`tv/${tvId}/credits`);
  },

  async getSimilarTVShows(tvId: number, page = 1) {
    return tmdbFetch(`tv/${tvId}/similar`, { page });
  },

  // Person
  async getPerson(personId: number) {
    return tmdbFetch(`person/${personId}`);
  },

  async getPersonMovieCredits(personId: number) {
    return tmdbFetch(`person/${personId}/movie_credits`);
  },

  // Genres
  async getMovieGenres() {
    return tmdbFetch('genre/movie/list');
  },

  async getTVGenres() {
    return tmdbFetch('genre/tv/list');
  },

  // Configuration
  async getConfiguration() {
    return tmdbFetch('configuration');
  },

  // Watch Providers
  async getWatchProviders(movieId: number) {
    return tmdbFetch(`movie/${movieId}/watch/providers`);
  },

  // Images
  async getMovieImages(movieId: number) {
    return tmdbFetch(`movie/${movieId}/images`);
  },

  // Reviews
  async getMovieReviews(movieId: number, page = 1) {
    return tmdbFetch(`movie/${movieId}/reviews`, { page });
  },

  // Keywords
  async getMovieKeywords(movieId: number) {
    return tmdbFetch(`movie/${movieId}/keywords`);
  },
};

// Export default
export default tmdbProxyClient;

