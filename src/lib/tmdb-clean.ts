import axios from 'axios';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

if (!TMDB_API_KEY) {
  throw new Error('TMDB API key is not configured. Please set NEXT_PUBLIC_TMDB_API_KEY in your environment variables.');
}

const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

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

// Helper function to handle API errors
const handleApiError = (error: unknown, endpoint: string) => {
  console.error(`Error calling ${endpoint}:`, error);
  
  // Type guard for axios error
  const isAxiosError = (err: unknown): err is { response?: { status: number } } => {
    return typeof err === 'object' && err !== null && 'response' in err;
  };
  
  if (isAxiosError(error) && error.response?.status === 404) {
    console.warn(`Endpoint ${endpoint} returned 404 - may not exist in TMDB API`);
    return null;
  }
  throw error;
};

// API Functions
export const tmdbApi = {
  // Search movies
  searchMovies: async (params: SearchParams) => {
    try {
      const response = await tmdbClient.get('/search/movie', { params });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'searchMovies');
    }
  },

  // Get movie details
  getMovieDetails: async (movieId: number) => {
    try {
      const response = await tmdbClient.get(`/movie/${movieId}`);
      return response.data as MovieDetails;
    } catch (error) {
      return handleApiError(error, 'getMovieDetails');
    }
  },

  // Get movie credits
  getMovieCredits: async (movieId: number) => {
    try {
      const response = await tmdbClient.get(`/movie/${movieId}/credits`);
      return response.data as Credits;
    } catch (error) {
      return handleApiError(error, 'getMovieCredits');
    }
  },

  // Get movie reviews
  getMovieReviews: async (movieId: number, page: number = 1) => {
    try {
      const response = await tmdbClient.get(`/movie/${movieId}/reviews`, {
        params: { page },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getMovieReviews');
    }
  },

  // Get similar movies
  getSimilarMovies: async (movieId: number, page: number = 1) => {
    try {
      const response = await tmdbClient.get(`/movie/${movieId}/similar`, {
        params: { page },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getSimilarMovies');
    }
  },

  // Get recommended movies
  getRecommendedMovies: async (movieId: number, page: number = 1) => {
    try {
      const response = await tmdbClient.get(`/movie/${movieId}/recommendations`, {
        params: { page },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getRecommendedMovies');
    }
  },

  // Discover movies
  discoverMovies: async (params: DiscoverParams) => {
    try {
      const response = await tmdbClient.get('/discover/movie', { params });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'discoverMovies');
    }
  },

  // Get popular movies
  getPopularMovies: async (page: number = 1) => {
    try {
      const response = await tmdbClient.get('/movie/popular', {
        params: { page },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getPopularMovies');
    }
  },

  // Get top rated movies
  getTopRatedMovies: async (page: number = 1) => {
    try {
      const response = await tmdbClient.get('/movie/top_rated', {
        params: { page },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getTopRatedMovies');
    }
  },

  // Get now playing movies
  getNowPlayingMovies: async (page: number = 1) => {
    try {
      const response = await tmdbClient.get('/movie/now_playing', {
        params: { page },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getNowPlayingMovies');
    }
  },

  // Get upcoming movies
  getUpcomingMovies: async (page: number = 1) => {
    try {
      const response = await tmdbClient.get('/movie/upcoming', {
        params: { page },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getUpcomingMovies');
    }
  },

  // Get genres
  getGenres: async () => {
    try {
      const response = await tmdbClient.get('/genre/movie/list');
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getGenres');
    }
  },

  // Get configuration
  getConfiguration: async () => {
    try {
      const response = await tmdbClient.get('/configuration');
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getConfiguration');
    }
  },

  // Get movie videos (trailers, teasers, etc.)
  getMovieVideos: async (movieId: number) => {
    try {
      const response = await tmdbClient.get(`/movie/${movieId}/videos`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getMovieVideos');
    }
  },

  // Get movie images (posters, backdrops, etc.)
  getMovieImages: async (movieId: number) => {
    try {
      const response = await tmdbClient.get(`/movie/${movieId}/images`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getMovieImages');
    }
  },

  // Get person details
  getPersonDetails: async (personId: number) => {
    try {
      const response = await tmdbClient.get(`/person/${personId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getPersonDetails');
    }
  },

  // Get person movie credits
  getPersonMovieCredits: async (personId: number) => {
    try {
      const response = await tmdbClient.get(`/person/${personId}/movie_credits`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getPersonMovieCredits');
    }
  },

  // Get person images
  getPersonImages: async (personId: number) => {
    try {
      const response = await tmdbClient.get(`/person/${personId}/images`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getPersonImages');
    }
  },

  // Get collection details
  getCollectionDetails: async (collectionId: number) => {
    try {
      const response = await tmdbClient.get(`/collection/${collectionId}`);
      return response.data as Collection;
    } catch (error) {
      return handleApiError(error, 'getCollectionDetails');
    }
  },

  // Get popular people
  getPopularPeople: async (page: number = 1) => {
    try {
      const response = await tmdbClient.get('/person/popular', {
        params: { page },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getPopularPeople');
    }
  },

  // Get trending movies
  getTrendingMovies: async (timeWindow: 'day' | 'week' = 'week', page: number = 1) => {
    try {
      const response = await tmdbClient.get(`/trending/movie/${timeWindow}`, {
        params: { page },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getTrendingMovies');
    }
  },

  // Get trending people
  getTrendingPeople: async (timeWindow: 'day' | 'week' = 'week', page: number = 1) => {
    try {
      const response = await tmdbClient.get(`/trending/person/${timeWindow}`, {
        params: { page },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getTrendingPeople');
    }
  },

  // Get trending all
  getTrendingAll: async (timeWindow: 'day' | 'week' = 'week', page: number = 1) => {
    try {
      const response = await tmdbClient.get(`/trending/all/${timeWindow}`, {
        params: { page },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getTrendingAll');
    }
  },

  // Get movie external IDs
  getMovieExternalIds: async (movieId: number) => {
    try {
      const response = await tmdbClient.get(`/movie/${movieId}/external_ids`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getMovieExternalIds');
    }
  },

  // Get movie keywords
  getMovieKeywords: async (movieId: number) => {
    try {
      const response = await tmdbClient.get(`/movie/${movieId}/keywords`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getMovieKeywords');
    }
  },

  // Get movie watch providers
  getMovieWatchProviders: async (movieId: number) => {
    try {
      const response = await tmdbClient.get(`/movie/${movieId}/watch/providers`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getMovieWatchProviders');
    }
  },

  // Get movie alternative titles
  getMovieAlternativeTitles: async (movieId: number) => {
    try {
      const response = await tmdbClient.get(`/movie/${movieId}/alternative_titles`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getMovieAlternativeTitles');
    }
  },

  // Get movie translations
  getMovieTranslations: async (movieId: number) => {
    try {
      const response = await tmdbClient.get(`/movie/${movieId}/translations`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getMovieTranslations');
    }
  },

  // Get movie release dates
  getMovieReleaseDates: async (movieId: number) => {
    try {
      const response = await tmdbClient.get(`/movie/${movieId}/release_dates`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getMovieReleaseDates');
    }
  },

  // Get person external IDs
  getPersonExternalIds: async (personId: number) => {
    try {
      const response = await tmdbClient.get(`/person/${personId}/external_ids`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getPersonExternalIds');
    }
  },

  // Get person combined credits
  getPersonCombinedCredits: async (personId: number) => {
    try {
      const response = await tmdbClient.get(`/person/${personId}/combined_credits`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getPersonCombinedCredits');
    }
  },

  // Get watch providers regions
  getWatchProviderRegions: async () => {
    try {
      const response = await tmdbClient.get('/watch/providers/regions');
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getWatchProviderRegions');
    }
  },

  // Get watch providers movie
  getWatchProviderMovie: async (region?: string) => {
    try {
      const response = await tmdbClient.get('/watch/providers/movie', {
        params: { watch_region: region },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getWatchProviderMovie');
    }
  },

  // Get watch providers TV
  getWatchProviderTV: async (region?: string) => {
    try {
      const response = await tmdbClient.get('/watch/providers/tv', {
        params: { watch_region: region },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getWatchProviderTV');
    }
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
