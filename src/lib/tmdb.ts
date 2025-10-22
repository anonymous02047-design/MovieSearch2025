/**
 * TMDB (The Movie Database) API Service
 * 
 * This module provides a comprehensive interface for interacting with The Movie Database API.
 * It includes type definitions, utility functions, and a service object for making API calls.
 * 
 * @author MovieSearch Team
 * @version 1.0.0
 */

import axios from 'axios';
import { errorHandler } from './errorHandler';

// Rate limiting configuration
const RATE_LIMIT_DELAY = 200; // 200ms delay between requests
const MAX_REQUESTS_PER_SECOND = 4; // TMDB allows 4 requests per second
let lastRequestTime = 0;
let requestQueue: Array<() => Promise<any>> = [];
let isProcessingQueue = false;

// Environment configuration
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

// Validate API key configuration
if (!TMDB_API_KEY) {
  throw errorHandler.createError('API_KEY_MISSING', 'TMDB API key is not configured. Please set NEXT_PUBLIC_TMDB_API_KEY in your environment variables.');
}

// Create axios client with default configuration
const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
  timeout: 10000, // 10 second timeout
});

// Rate limiting function
const rateLimitedRequest = async <T>(requestFn: () => Promise<T>): Promise<T> => {
  return new Promise((resolve, reject) => {
    requestQueue.push(async () => {
      try {
        const result = await requestFn();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });

    if (!isProcessingQueue) {
      processRequestQueue();
    }
  });
};

// Process request queue with rate limiting
const processRequestQueue = async () => {
  if (isProcessingQueue || requestQueue.length === 0) return;
  
  isProcessingQueue = true;
  
  while (requestQueue.length > 0) {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest));
    }
    
    const request = requestQueue.shift();
    if (request) {
      lastRequestTime = Date.now();
      try {
        await request();
      } catch (error) {
        console.error('Request failed:', error);
      }
    }
  }
  
  isProcessingQueue = false;
};

// Types
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number;
  budget: number;
  revenue: number;
  status: string;
  tagline: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  homepage: string;
  imdb_id: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Credits {
  cast: Cast[];
  crew: Crew[];
}

export interface Review {
  id: string;
  author: string;
  content: string;
  created_at: string;
  rating: number | null;
  url: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface Image {
  file_path: string;
  width: number;
  height: number;
  aspect_ratio: number;
  vote_average: number;
  vote_count: number;
}

export interface Images {
  backdrops: Image[];
  posters: Image[];
  logos: Image[];
}

export interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  biography: string;
  birthday: string;
  deathday: string | null;
  place_of_birth: string;
  known_for_department: string;
  popularity: number;
  also_known_as: string[];
  gender: number;
  homepage: string | null;
  imdb_id: string | null;
}

export interface PersonImages {
  profiles: Image[];
}

export interface PersonMovieCredits {
  cast: Movie[];
  crew: Movie[];
}

export interface Collection {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  parts: Movie[];
}

export interface SearchParams {
  query: string;
  page?: number;
  include_adult?: boolean;
  year?: number;
  primary_release_year?: number;
}

export interface DiscoverParams {
  page?: number;
  sort_by?: string;
  include_adult?: boolean;
  include_video?: boolean;
  year?: number;
  primary_release_year?: number;
  with_genres?: string;
  with_original_language?: string;
  vote_average_gte?: number;
  vote_average_lte?: number;
  vote_count_gte?: number;
  with_runtime_gte?: number;
  with_runtime_lte?: number;
}

// API Functions
export const tmdbApi = {
  // Search movies
  searchMovies: async (params: SearchParams) => {
    return rateLimitedRequest(async () => {
      try {
        const response = await tmdbClient.get('/search/movie', { params });
        return response.data;
      } catch (error) {
        const appError = errorHandler.handleApiError(error, 'searchMovies');
        if (error.response?.status === 404) {
          return null;
        }
        throw appError;
      }
    });
  },

  // Get movie details
  getMovieDetails: async (movieId: number) => {
    return rateLimitedRequest(async () => {
      try {
        const response = await tmdbClient.get(`/movie/${movieId}`);
        return response.data as MovieDetails;
      } catch (error) {
        const appError = errorHandler.handleApiError(error, `getMovieDetails/${movieId}`);
        if (error.response?.status === 404) {
          return null;
        }
        throw appError;
      }
    });
  },

  // Get movie credits
  getMovieCredits: async (movieId: number) => {
    const response = await tmdbClient.get(`/movie/${movieId}/credits`);
    return response.data as Credits;
  },

  // Get movie reviews
  getMovieReviews: async (movieId: number, page: number = 1) => {
    const response = await tmdbClient.get(`/movie/${movieId}/reviews`, {
      params: { page },
    });
    return response.data;
  },

  // Get similar movies
  getSimilarMovies: async (movieId: number, page: number = 1) => {
    const response = await tmdbClient.get(`/movie/${movieId}/similar`, {
      params: { page },
    });
    return response.data;
  },

  // Get recommended movies
  getRecommendedMovies: async (movieId: number, page: number = 1) => {
    const response = await tmdbClient.get(`/movie/${movieId}/recommendations`, {
      params: { page },
    });
    return response.data;
  },

  // Discover movies
  discoverMovies: async (params: DiscoverParams) => {
    const response = await tmdbClient.get('/discover/movie', { params });
    return response.data;
  },

  // Get popular movies
  getPopularMovies: async (page: number = 1) => {
    const response = await tmdbClient.get('/movie/popular', {
      params: { page },
    });
    return response.data;
  },

  // Get top rated movies
  getTopRatedMovies: async (page: number = 1) => {
    const response = await tmdbClient.get('/movie/top_rated', {
      params: { page },
    });
    return response.data;
  },

  // Get now playing movies
  getNowPlayingMovies: async (page: number = 1) => {
    const response = await tmdbClient.get('/movie/now_playing', {
      params: { page },
    });
    return response.data;
  },

  // Get upcoming movies
  getUpcomingMovies: async (page: number = 1) => {
    const response = await tmdbClient.get('/movie/upcoming', {
      params: { page },
    });
    return response.data;
  },

  // Get genres
  getGenres: async () => {
    const response = await tmdbClient.get('/genre/movie/list');
    return response.data;
  },

  // Get movies by genre
  getMoviesByGenre: async (genreId: number, page: number = 1) => {
    const response = await tmdbClient.get('/discover/movie', {
      params: { 
        with_genres: genreId,
        page,
        sort_by: 'popularity.desc'
      },
    });
    return response.data;
  },

  // Get configuration
  getConfiguration: async () => {
    const response = await tmdbClient.get('/configuration');
    return response.data;
  },

  // Get movie videos (trailers, teasers, etc.)
  getMovieVideos: async (movieId: number) => {
    const response = await tmdbClient.get(`/movie/${movieId}/videos`);
    return response.data;
  },

  // Get movie images (posters, backdrops, etc.)
  getMovieImages: async (movieId: number) => {
    const response = await tmdbClient.get(`/movie/${movieId}/images`);
    return response.data;
  },

  // Get person details
  getPersonDetails: async (personId: number) => {
    const response = await tmdbClient.get(`/person/${personId}`);
    return response.data;
  },

  // Get person movie credits
  getPersonMovieCredits: async (personId: number) => {
    const response = await tmdbClient.get(`/person/${personId}/movie_credits`);
    return response.data;
  },

  // Get person combined credits
  getPersonCredits: async (personId: number) => {
    const response = await tmdbClient.get(`/person/${personId}/combined_credits`);
    return response.data;
  },

  // Get person images
  getPersonImages: async (personId: number) => {
    const response = await tmdbClient.get(`/person/${personId}/images`);
    return response.data;
  },

  // Get collection details
  getCollectionDetails: async (collectionId: number) => {
    const response = await tmdbClient.get(`/collection/${collectionId}`);
    return response.data as Collection;
  },

  // Get popular people
  getPopularPeople: async (page: number = 1) => {
    return rateLimitedRequest(async () => {
      const response = await tmdbClient.get('/person/popular', {
        params: { page },
      });
      return response.data;
    });
  },

  // Get person external IDs
  getPersonExternalIds: async (personId: number) => {
    const response = await tmdbClient.get(`/person/${personId}/external_ids`);
    return response.data;
  },

  // Get person tagged images
  getPersonTaggedImages: async (personId: number, page: number = 1) => {
    const response = await tmdbClient.get(`/person/${personId}/tagged_images`, {
      params: { page },
    });
    return response.data;
  },

  // Get person TV credits
  getPersonTVCredits: async (personId: number) => {
    const response = await tmdbClient.get(`/person/${personId}/tv_credits`);
    return response.data;
  },

  // Get person combined credits
  getPersonCombinedCredits: async (personId: number) => {
    const response = await tmdbClient.get(`/person/${personId}/combined_credits`);
    return response.data;
  },

  // Get movie external IDs
  getMovieExternalIds: async (movieId: number) => {
    const response = await tmdbClient.get(`/movie/${movieId}/external_ids`);
    return response.data;
  },

  // Get movie keywords
  getMovieKeywords: async (movieId: number) => {
    const response = await tmdbClient.get(`/movie/${movieId}/keywords`);
    return response.data;
  },

  // Get movie lists
  getMovieLists: async (movieId: number, page: number = 1) => {
    const response = await tmdbClient.get(`/movie/${movieId}/lists`, {
      params: { page },
    });
    return response.data;
  },

  // Get movie recommendations
  getMovieRecommendations: async (movieId: number, page: number = 1) => {
    const response = await tmdbClient.get(`/movie/${movieId}/recommendations`, {
      params: { page },
    });
    return response.data;
  },

  // Get movie release dates
  getMovieReleaseDates: async (movieId: number) => {
    const response = await tmdbClient.get(`/movie/${movieId}/release_dates`);
    return response.data;
  },

  // Get movie translations
  getMovieTranslations: async (movieId: number) => {
    const response = await tmdbClient.get(`/movie/${movieId}/translations`);
    return response.data;
  },

  // Get movie watch providers
  getMovieWatchProviders: async (movieId: number) => {
    const response = await tmdbClient.get(`/movie/${movieId}/watch/providers`);
    return response.data;
  },

  // Get movie alternative titles
  getMovieAlternativeTitles: async (movieId: number) => {
    const response = await tmdbClient.get(`/movie/${movieId}/alternative_titles`);
    return response.data;
  },

  // Get movie changes
  getMovieChanges: async (movieId: number, startDate?: string, endDate?: string) => {
    const response = await tmdbClient.get(`/movie/${movieId}/changes`, {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },

  // Get trending movies
  getTrendingMovies: async (timeWindow: 'day' | 'week' = 'week', page: number = 1) => {
    return rateLimitedRequest(async () => {
      const response = await tmdbClient.get(`/trending/movie/${timeWindow}`, {
        params: { page },
      });
      return response.data;
    });
  },

  // Get trending people
  getTrendingPeople: async (timeWindow: 'day' | 'week' = 'week', page: number = 1) => {
    return rateLimitedRequest(async () => {
      const response = await tmdbClient.get(`/trending/person/${timeWindow}`, {
        params: { page },
      });
      return response.data;
    });
  },

  // Get trending TV shows
  getTrendingTV: async (timeWindow: 'day' | 'week' = 'week', page: number = 1) => {
    return rateLimitedRequest(async () => {
      const response = await tmdbClient.get(`/trending/tv/${timeWindow}`, {
        params: { page },
      });
      return response.data;
    });
  },

  // Get trending all
  getTrendingAll: async (timeWindow: 'day' | 'week' = 'week', page: number = 1) => {
    const response = await tmdbClient.get(`/trending/all/${timeWindow}`, {
      params: { page },
    });
    return response.data;
  },

  // Get watch providers regions
  getWatchProviderRegions: async () => {
    const response = await tmdbClient.get('/watch/providers/regions');
    return response.data;
  },

  // Get watch providers movie
  getWatchProviderMovie: async (region?: string) => {
    const response = await tmdbClient.get('/watch/providers/movie', {
      params: { watch_region: region },
    });
    return response.data;
  },

  // Get watch providers TV
  getWatchProviderTV: async (region?: string) => {
    const response = await tmdbClient.get('/watch/providers/tv', {
      params: { watch_region: region },
    });
    return response.data;
  },

  // Get movie account states
  getMovieAccountStates: async (movieId: number, sessionId?: string) => {
    const response = await tmdbClient.get(`/movie/${movieId}/account_states`, {
      params: { session_id: sessionId },
    });
    return response.data;
  },

  // Get TV show details
  getTVDetails: async (tvId: number) => {
    const response = await tmdbClient.get(`/tv/${tvId}`);
    return response.data;
  },

  // Get TV show details (alias for getTVDetails)
  getTVShowDetails: async (tvId: number) => {
    const response = await tmdbClient.get(`/tv/${tvId}`);
    return response.data;
  },

  // Get TV show seasons
  getTVShowSeasons: async (tvId: number) => {
    const response = await tmdbClient.get(`/tv/${tvId}`);
    return response.data;
  },

  // Get TV show credits
  getTVCredits: async (tvId: number) => {
    const response = await tmdbClient.get(`/tv/${tvId}/credits`);
    return response.data;
  },

  // Get TV show external IDs
  getTVExternalIds: async (tvId: number) => {
    const response = await tmdbClient.get(`/tv/${tvId}/external_ids`);
    return response.data;
  },

  // Get TV show images
  getTVImages: async (tvId: number) => {
    const response = await tmdbClient.get(`/tv/${tvId}/images`);
    return response.data;
  },

  // Get TV show keywords
  getTVKeywords: async (tvId: number) => {
    const response = await tmdbClient.get(`/tv/${tvId}/keywords`);
    return response.data;
  },

  // Get TV show recommendations
  getTVRecommendations: async (tvId: number, page: number = 1) => {
    const response = await tmdbClient.get(`/tv/${tvId}/recommendations`, {
      params: { page },
    });
    return response.data;
  },

  // Get TV show reviews
  getTVReviews: async (tvId: number, page: number = 1) => {
    const response = await tmdbClient.get(`/tv/${tvId}/reviews`, {
      params: { page },
    });
    return response.data;
  },

  // Get TV show similar
  getTVSimilar: async (tvId: number, page: number = 1) => {
    const response = await tmdbClient.get(`/tv/${tvId}/similar`, {
      params: { page },
    });
    return response.data;
  },

  // Get TV show translations
  getTVTranslations: async (tvId: number) => {
    const response = await tmdbClient.get(`/tv/${tvId}/translations`);
    return response.data;
  },

  // Get TV show videos
  getTVVideos: async (tvId: number) => {
    const response = await tmdbClient.get(`/tv/${tvId}/videos`);
    return response.data;
  },

  // Get TV show watch providers
  getTVWatchProviders: async (tvId: number) => {
    const response = await tmdbClient.get(`/tv/${tvId}/watch/providers`);
    return response.data;
  },

  // Get TV show alternative titles
  getTVAlternativeTitles: async (tvId: number) => {
    const response = await tmdbClient.get(`/tv/${tvId}/alternative_titles`);
    return response.data;
  },

  // Get TV show changes
  getTVChanges: async (tvId: number, startDate?: string, endDate?: string) => {
    const response = await tmdbClient.get(`/tv/${tvId}/changes`, {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },

  // Get TV show content ratings
  getTVContentRatings: async (tvId: number) => {
    const response = await tmdbClient.get(`/tv/${tvId}/content_ratings`);
    return response.data;
  },

  // Get TV show episode groups
  getTVEpisodeGroups: async (tvId: number) => {
    const response = await tmdbClient.get(`/tv/${tvId}/episode_groups`);
    return response.data;
  },

  // Get TV show season details
  getTVSeasonDetails: async (tvId: number, seasonNumber: number) => {
    const response = await tmdbClient.get(`/tv/${tvId}/season/${seasonNumber}`);
    return response.data;
  },

  // Get TV show season credits
  getTVSeasonCredits: async (tvId: number, seasonNumber: number) => {
    const response = await tmdbClient.get(`/tv/${tvId}/season/${seasonNumber}/credits`);
    return response.data;
  },

  // Get top rated TV shows
  getTopRatedTV: async (page: number = 1) => {
    const response = await tmdbClient.get('/tv/top_rated', {
      params: { page },
    });
    return response.data;
  },

  // Get airing today TV shows
  getAiringTodayTV: async (page: number = 1) => {
    const response = await tmdbClient.get('/tv/airing_today', {
      params: { page },
    });
    return response.data;
  },

  // Get on the air TV shows
  getOnTheAirTV: async (page: number = 1) => {
    const response = await tmdbClient.get('/tv/on_the_air', {
      params: { page },
    });
    return response.data;
  },

  // Get popular TV shows
  getPopularTV: async (page: number = 1) => {
    const response = await tmdbClient.get('/tv/popular', {
      params: { page },
    });
    return response.data;
  },

  // Get TV show season external IDs
  getTVSeasonExternalIds: async (tvId: number, seasonNumber: number) => {
    const response = await tmdbClient.get(`/tv/${tvId}/season/${seasonNumber}/external_ids`);
    return response.data;
  },

  // Get TV show season images
  getTVSeasonImages: async (tvId: number, seasonNumber: number) => {
    const response = await tmdbClient.get(`/tv/${tvId}/season/${seasonNumber}/images`);
    return response.data;
  },

  // Get TV show season videos
  getTVSeasonVideos: async (tvId: number, seasonNumber: number) => {
    const response = await tmdbClient.get(`/tv/${tvId}/season/${seasonNumber}/videos`);
    return response.data;
  },

  // Get TV show episode details
  getTVEpisodeDetails: async (tvId: number, seasonNumber: number, episodeNumber: number) => {
    const response = await tmdbClient.get(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`);
    return response.data;
  },

  // Get TV show episode credits
  getTVEpisodeCredits: async (tvId: number, seasonNumber: number, episodeNumber: number) => {
    const response = await tmdbClient.get(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}/credits`);
    return response.data;
  },

  // Get TV show episode external IDs
  getTVEpisodeExternalIds: async (tvId: number, seasonNumber: number, episodeNumber: number) => {
    const response = await tmdbClient.get(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}/external_ids`);
    return response.data;
  },

  // Get TV show episode images
  getTVEpisodeImages: async (tvId: number, seasonNumber: number, episodeNumber: number) => {
    const response = await tmdbClient.get(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}/images`);
    return response.data;
  },

  // Get TV show episode videos
  getTVEpisodeVideos: async (tvId: number, seasonNumber: number, episodeNumber: number) => {
    const response = await tmdbClient.get(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}/videos`);
    return response.data;
  },

  // Get TV show episode translations
  getTVEpisodeTranslations: async (tvId: number, seasonNumber: number, episodeNumber: number) => {
    const response = await tmdbClient.get(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}/translations`);
    return response.data;
  },

  // Get TV show episode account states
  getTVEpisodeAccountStates: async (tvId: number, seasonNumber: number, episodeNumber: number, sessionId?: string) => {
    const response = await tmdbClient.get(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}/account_states`, {
      params: { session_id: sessionId },
    });
    return response.data;
  },

  // Get TV show episode changes
  getTVEpisodeChanges: async (episodeId: number, startDate?: string, endDate?: string) => {
    const response = await tmdbClient.get(`/tv/episode/${episodeId}/changes`, {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },

  // Get TV show episode group details
  getTVEpisodeGroupDetails: async (episodeGroupId: string) => {
    const response = await tmdbClient.get(`/tv/episode_group/${episodeGroupId}`);
    return response.data;
  },

  // Get TV show episode group images
  getTVEpisodeGroupImages: async (episodeGroupId: string) => {
    const response = await tmdbClient.get(`/tv/episode_group/${episodeGroupId}/images`);
    return response.data;
  },

  // Get TV show episode group external IDs
  getTVEpisodeGroupExternalIds: async (episodeGroupId: string) => {
    const response = await tmdbClient.get(`/tv/episode_group/${episodeGroupId}/external_ids`);
    return response.data;
  },

  // Get TV show episode group translations
  getTVEpisodeGroupTranslations: async (episodeGroupId: string) => {
    const response = await tmdbClient.get(`/tv/episode_group/${episodeGroupId}/translations`);
    return response.data;
  },

  // Get TV show episode group videos
  getTVEpisodeGroupVideos: async (episodeGroupId: string) => {
    const response = await tmdbClient.get(`/tv/episode_group/${episodeGroupId}/videos`);
    return response.data;
  },

  // Get TV show episode group watch providers
  getTVEpisodeGroupWatchProviders: async (episodeGroupId: string) => {
    const response = await tmdbClient.get(`/tv/episode_group/${episodeGroupId}/watch/providers`);
    return response.data;
  },

  // Get TV show episode group alternative titles
  getTVEpisodeGroupAlternativeTitles: async (episodeGroupId: string) => {
    const response = await tmdbClient.get(`/tv/episode_group/${episodeGroupId}/alternative_titles`);
    return response.data;
  },

  // Get TV show episode group changes
  getTVEpisodeGroupChanges: async (episodeGroupId: string, startDate?: string, endDate?: string) => {
    const response = await tmdbClient.get(`/tv/episode_group/${episodeGroupId}/changes`, {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },

  // Get TV show episode group content ratings
  getTVEpisodeGroupContentRatings: async (episodeGroupId: string) => {
    const response = await tmdbClient.get(`/tv/episode_group/${episodeGroupId}/content_ratings`);
    return response.data;
  },

  // Get TV show episode group credits
  getTVEpisodeGroupCredits: async (episodeGroupId: string) => {
    const response = await tmdbClient.get(`/tv/episode_group/${episodeGroupId}/credits`);
    return response.data;
  },

  // Get TV show episode group keywords
  getTVEpisodeGroupKeywords: async (episodeGroupId: string) => {
    const response = await tmdbClient.get(`/tv/episode_group/${episodeGroupId}/keywords`);
    return response.data;
  },

  // Get TV show episode group lists
  getTVEpisodeGroupLists: async (episodeGroupId: string, page: number = 1) => {
    const response = await tmdbClient.get(`/tv/episode_group/${episodeGroupId}/lists`, {
      params: { page },
    });
    return response.data;
  },

  // Get TV show episode group recommendations
  getTVEpisodeGroupRecommendations: async (episodeGroupId: string, page: number = 1) => {
    const response = await tmdbClient.get(`/tv/episode_group/${episodeGroupId}/recommendations`, {
      params: { page },
    });
    return response.data;
  },

  // Get TV show episode group reviews
  getTVEpisodeGroupReviews: async (episodeGroupId: string, page: number = 1) => {
    const response = await tmdbClient.get(`/tv/episode_group/${episodeGroupId}/reviews`, {
      params: { page },
    });
    return response.data;
  },

  // Get TV show episode group similar
  getTVEpisodeGroupSimilar: async (episodeGroupId: string, page: number = 1) => {
    const response = await tmdbClient.get(`/tv/episode_group/${episodeGroupId}/similar`, {
      params: { page },
    });
    return response.data;
  },

  // Get TV show episode group account states
  getTVEpisodeGroupAccountStates: async (episodeGroupId: string, sessionId?: string) => {
    const response = await tmdbClient.get(`/tv/episode_group/${episodeGroupId}/account_states`, {
      params: { session_id: sessionId },
    });
    return response.data;
  },
};

// Utility functions
export const getImageUrl = (path: string | null, size: string = 'w500') => {
  if (!path) return '/placeholder-movie.svg';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null, size: string = 'w1280') => {
  if (!path) return '/placeholder-backdrop.svg';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const formatRuntime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
