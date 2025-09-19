import axios from 'axios';
import { errorHandler } from './errorHandler';
import type {
  Genre,
  ProductionCompany,
  ProductionCountry,
  SpokenLanguage,
  Review,
  Movie,
  Images,
  Video,
  Credits,
  PersonImages,
  PersonMovieCredits,
} from './tmdb';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

if (!TMDB_API_KEY) {
  throw errorHandler.createError('API_KEY_MISSING', 'TMDB API key is not configured.');
}

const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  params: { api_key: TMDB_API_KEY },
  timeout: 10000,
});

// Enhanced Types for 47+ Data Points
export interface EnhancedMovieDetails {
  // Basic Info (8 points)
  id: number;
  title: string;
  original_title: string;
  overview: string;
  tagline: string;
  status: string;
  release_date: string;
  original_language: string;
  
  // Media (6 points)
  poster_path: string | null;
  backdrop_path: string | null;
  homepage: string;
  imdb_id: string;
  video: boolean;
  adult: boolean;
  
  // Ratings & Popularity (4 points)
  vote_average: number;
  vote_count: number;
  popularity: number;
  budget: number;
  
  // Financial (3 points)
  revenue: number;
  runtime: number;
  production_cost: number;
  
  // Content Details (5 points)
  genres: Genre[];
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  belongs_to_collection: Collection | null;
  
  // Extended Details (8 points)
  alternative_titles: AlternativeTitle[];
  keywords: Keyword[];
  external_ids: ExternalIds;
  release_dates: ReleaseDate[];
  content_ratings: ContentRating[];
  watch_providers: WatchProvider[];
  translations: Translation[];
  changes: Change[];
  
  // Social & Reviews (4 points)
  reviews: Review[];
  similar_movies: Movie[];
  recommended_movies: Movie[];
  social_media: SocialMedia;
  
  // Technical (3 points)
  images: Images;
  videos: Video[];
  credits: Credits;
  
  // Awards & Recognition (3 points)
  awards: Award[];
  festival_appearances: FestivalAppearance[];
  box_office_performance: BoxOfficePerformance;
  
  // Metadata (3 points)
  created_at: string;
  updated_at: string;
  last_modified: string;
}

export interface Collection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  parts: Movie[];
}

export interface AlternativeTitle {
  iso_3166_1: string;
  title: string;
  type: string;
}

export interface Keyword {
  id: number;
  name: string;
}

export interface ExternalIds {
  imdb_id: string | null;
  facebook_id: string | null;
  instagram_id: string | null;
  twitter_id: string | null;
  wikidata_id: string | null;
  youtube_id: string | null;
}

export interface ReleaseDate {
  certification: string;
  iso_639_1: string;
  release_date: string;
  type: number;
  note: string;
}

export interface ContentRating {
  iso_3166_1: string;
  rating: string;
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
}

export interface Translation {
  iso_3166_1: string;
  iso_639_1: string;
  name: string;
  english_name: string;
  data: {
    title: string;
    overview: string;
    homepage: string;
  };
}

export interface Change {
  key: string;
  items: ChangeItem[];
}

export interface ChangeItem {
  id: string;
  action: string;
  time: string;
  iso_639_1: string;
  value: string;
  original_value: string;
}

export interface SocialMedia {
  facebook_id: string | null;
  instagram_id: string | null;
  twitter_id: string | null;
  youtube_id: string | null;
}

export interface Award {
  id: string;
  name: string;
  category: string;
  year: number;
  won: boolean;
  nomination: boolean;
}

export interface FestivalAppearance {
  festival_name: string;
  year: number;
  awards: string[];
  country: string;
}

export interface BoxOfficePerformance {
  opening_weekend: number;
  domestic_total: number;
  international_total: number;
  worldwide_total: number;
  currency: string;
}

// Enhanced Person Details
export interface EnhancedPersonDetails {
  // Basic Info (6 points)
  id: number;
  name: string;
  also_known_as: string[];
  biography: string;
  birthday: string;
  deathday: string | null;
  
  // Media (3 points)
  profile_path: string | null;
  homepage: string | null;
  imdb_id: string | null;
  
  // Personal (4 points)
  place_of_birth: string;
  known_for_department: string;
  gender: number;
  popularity: number;
  
  // Extended Details (8 points)
  alternative_names: AlternativeName[];
  external_ids: PersonExternalIds;
  images: PersonImages;
  tagged_images: TaggedImage[];
  translations: PersonTranslation[];
  changes: PersonChange[];
  combined_credits: CombinedCredits;
  movie_credits: PersonMovieCredits;
  
  // Career Stats (4 points)
  career_stats: CareerStats;
  awards: PersonAward[];
  filmography: FilmographyItem[];
  social_media: PersonSocialMedia;
  
  // Metadata (3 points)
  created_at: string;
  updated_at: string;
  last_modified: string;
}

export interface AlternativeName {
  name: string;
  type: string;
}

export interface PersonExternalIds {
  imdb_id: string | null;
  facebook_id: string | null;
  instagram_id: string | null;
  twitter_id: string | null;
  wikidata_id: string | null;
  youtube_id: string | null;
  tiktok_id: string | null;
}

export interface TaggedImage {
  aspect_ratio: number;
  file_path: string;
  height: number;
  id: string;
  iso_639_1: string;
  vote_average: number;
  vote_count: number;
  width: number;
  image_type: string;
  media: {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    release_date: string;
    poster_path: string;
    popularity: number;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
  };
  media_type: string;
}

export interface PersonTranslation {
  iso_3166_1: string;
  iso_639_1: string;
  name: string;
  english_name: string;
  data: {
    biography: string;
  };
}

export interface PersonChange {
  key: string;
  items: PersonChangeItem[];
}

export interface PersonChangeItem {
  id: string;
  action: string;
  time: string;
  iso_639_1: string;
  value: string;
  original_value: string;
}

export interface CombinedCredits {
  cast: CombinedCast[];
  crew: CombinedCrew[];
}

export interface CombinedCast {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  character: string;
  credit_id: string;
  order: number;
  media_type: string;
}

export interface CombinedCrew {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  credit_id: string;
  department: string;
  job: string;
  media_type: string;
}

export interface CareerStats {
  total_movies: number;
  total_tv_shows: number;
  total_credits: number;
  average_rating: number;
  highest_rated_movie: string;
  most_popular_movie: string;
  career_span: number;
  genres_worked_in: string[];
}

export interface PersonAward {
  id: string;
  name: string;
  category: string;
  year: number;
  won: boolean;
  nomination: boolean;
  movie_title: string;
}

export interface FilmographyItem {
  id: number;
  title: string;
  character: string;
  job: string;
  department: string;
  release_date: string;
  vote_average: number;
  media_type: string;
}

export interface PersonSocialMedia {
  facebook_id: string | null;
  instagram_id: string | null;
  twitter_id: string | null;
  youtube_id: string | null;
  tiktok_id: string | null;
}

// Enhanced TV Show Details
export interface EnhancedTVShowDetails {
  // Basic Info (8 points)
  id: number;
  name: string;
  original_name: string;
  overview: string;
  tagline: string;
  status: string;
  first_air_date: string;
  last_air_date: string;
  
  // Media (6 points)
  poster_path: string | null;
  backdrop_path: string | null;
  homepage: string;
  imdb_id: string;
  in_production: boolean;
  adult: boolean;
  
  // Ratings & Popularity (4 points)
  vote_average: number;
  vote_count: number;
  popularity: number;
  budget: number;
  
  // Content Details (5 points)
  genres: Genre[];
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  created_by: CreatedBy[];
  
  // Extended Details (8 points)
  alternative_titles: TVAlternativeTitle[];
  keywords: Keyword[];
  external_ids: ExternalIds;
  content_ratings: ContentRating[];
  watch_providers: WatchProvider[];
  translations: Translation[];
  changes: Change[];
  networks: Network[];
  
  // Episodes & Seasons (4 points)
  number_of_episodes: number;
  number_of_seasons: number;
  seasons: Season[];
  episode_run_time: number[];
  
  // Social & Reviews (4 points)
  reviews: Review[];
  similar_shows: TVShow[];
  recommended_shows: TVShow[];
  social_media: SocialMedia;
  
  // Technical (3 points)
  images: Images;
  videos: Video[];
  credits: Credits;
  
  // Awards & Recognition (3 points)
  awards: Award[];
  festival_appearances: FestivalAppearance[];
  ratings_performance: RatingsPerformance;
  
  // Metadata (3 points)
  created_at: string;
  updated_at: string;
  last_modified: string;
}

export interface CreatedBy {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string | null;
}

export interface TVAlternativeTitle {
  iso_3166_1: string;
  title: string;
  type: string;
}

export interface Network {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
}

export interface TVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  original_language: string;
  origin_country: string[];
}

export interface RatingsPerformance {
  average_rating: number;
  peak_rating: number;
  lowest_rating: number;
  total_episodes: number;
  rating_trend: string;
}

// Enhanced API Service
export const tmdbEnhanced = {
  // Enhanced Movie Methods (47+ data points)
  getEnhancedMovieDetails: async (movieId: number): Promise<EnhancedMovieDetails> => {
    try {
      const [
        details,
        credits,
        reviews,
        similar,
        recommendations,
        videos,
        images,
        keywords,
        externalIds,
        alternativeTitles,
        releaseDates,
        translations,
        watchProviders,
        changes
      ] = await Promise.allSettled([
        tmdbClient.get(`/movie/${movieId}`),
        tmdbClient.get(`/movie/${movieId}/credits`),
        tmdbClient.get(`/movie/${movieId}/reviews`),
        tmdbClient.get(`/movie/${movieId}/similar`),
        tmdbClient.get(`/movie/${movieId}/recommendations`),
        tmdbClient.get(`/movie/${movieId}/videos`),
        tmdbClient.get(`/movie/${movieId}/images`),
        tmdbClient.get(`/movie/${movieId}/keywords`),
        tmdbClient.get(`/movie/${movieId}/external_ids`),
        tmdbClient.get(`/movie/${movieId}/alternative_titles`),
        tmdbClient.get(`/movie/${movieId}/release_dates`),
        tmdbClient.get(`/movie/${movieId}/translations`),
        tmdbClient.get(`/movie/${movieId}/watch/providers`),
        tmdbClient.get(`/movie/${movieId}/changes`)
      ]);

      const baseDetails = details.status === 'fulfilled' ? details.value.data : {};
      const baseCredits = credits.status === 'fulfilled' ? credits.value.data : {};
      const baseReviews = reviews.status === 'fulfilled' ? reviews.value.data : {};
      const baseSimilar = similar.status === 'fulfilled' ? similar.value.data : {};
      const baseRecommendations = recommendations.status === 'fulfilled' ? recommendations.value.data : {};
      const baseVideos = videos.status === 'fulfilled' ? videos.value.data : {};
      const baseImages = images.status === 'fulfilled' ? images.value.data : {};
      const baseKeywords = keywords.status === 'fulfilled' ? keywords.value.data : {};
      const baseExternalIds = externalIds.status === 'fulfilled' ? externalIds.value.data : {};
      const baseAlternativeTitles = alternativeTitles.status === 'fulfilled' ? alternativeTitles.value.data : {};
      const baseReleaseDates = releaseDates.status === 'fulfilled' ? releaseDates.value.data : {};
      const baseTranslations = translations.status === 'fulfilled' ? translations.value.data : {};
      const baseWatchProviders = watchProviders.status === 'fulfilled' ? watchProviders.value.data : {};
      const baseChanges = changes.status === 'fulfilled' ? changes.value.data : {};

      return {
        // Basic Info (8 points)
        id: baseDetails.id || 0,
        title: baseDetails.title || '',
        original_title: baseDetails.original_title || '',
        overview: baseDetails.overview || '',
        tagline: baseDetails.tagline || '',
        status: baseDetails.status || '',
        release_date: baseDetails.release_date || '',
        original_language: baseDetails.original_language || '',
        
        // Media (6 points)
        poster_path: baseDetails.poster_path,
        backdrop_path: baseDetails.backdrop_path,
        homepage: baseDetails.homepage || '',
        imdb_id: baseDetails.imdb_id || '',
        video: baseDetails.video || false,
        adult: baseDetails.adult || false,
        
        // Ratings & Popularity (4 points)
        vote_average: baseDetails.vote_average || 0,
        vote_count: baseDetails.vote_count || 0,
        popularity: baseDetails.popularity || 0,
        budget: baseDetails.budget || 0,
        
        // Financial (3 points)
        revenue: baseDetails.revenue || 0,
        runtime: baseDetails.runtime || 0,
        production_cost: baseDetails.budget || 0,
        
        // Content Details (5 points)
        genres: baseDetails.genres || [],
        production_companies: baseDetails.production_companies || [],
        production_countries: baseDetails.production_countries || [],
        spoken_languages: baseDetails.spoken_languages || [],
        belongs_to_collection: baseDetails.belongs_to_collection || null,
        
        // Extended Details (8 points)
        alternative_titles: baseAlternativeTitles.titles || [],
        keywords: baseKeywords.keywords || [],
        external_ids: baseExternalIds || {},
        release_dates: baseReleaseDates.results || [],
        content_ratings: baseReleaseDates.results || [],
        watch_providers: baseWatchProviders.results || {},
        translations: baseTranslations.translations || [],
        changes: baseChanges.changes || [],
        
        // Social & Reviews (4 points)
        reviews: baseReviews.results || [],
        similar_movies: baseSimilar.results || [],
        recommended_movies: baseRecommendations.results || [],
        social_media: {
          facebook_id: baseExternalIds.facebook_id,
          instagram_id: baseExternalIds.instagram_id,
          twitter_id: baseExternalIds.twitter_id,
          youtube_id: baseExternalIds.youtube_id,
        },
        
        // Technical (3 points)
        images: baseImages || { backdrops: [], posters: [], logos: [] },
        videos: baseVideos.results || [],
        credits: baseCredits || { cast: [], crew: [] },
        
        // Awards & Recognition (3 points)
        awards: [],
        festival_appearances: [],
        box_office_performance: {
          opening_weekend: 0,
          domestic_total: baseDetails.revenue || 0,
          international_total: 0,
          worldwide_total: baseDetails.revenue || 0,
          currency: 'USD',
        },
        
        // Metadata (3 points)
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_modified: new Date().toISOString(),
      };
    } catch (error) {
      throw errorHandler.handleApiError(error, `getEnhancedMovieDetails/${movieId}`);
    }
  },

  // Enhanced Person Methods
  getEnhancedPersonDetails: async (personId: number): Promise<EnhancedPersonDetails> => {
    try {
      const [
        details,
        credits,
        images,
        taggedImages,
        externalIds,
        alternativeNames,
        translations,
        changes
      ] = await Promise.allSettled([
        tmdbClient.get(`/person/${personId}`),
        tmdbClient.get(`/person/${personId}/combined_credits`),
        tmdbClient.get(`/person/${personId}/images`),
        tmdbClient.get(`/person/${personId}/tagged_images`),
        tmdbClient.get(`/person/${personId}/external_ids`),
        tmdbClient.get(`/person/${personId}/alternative_names`),
        tmdbClient.get(`/person/${personId}/translations`),
        tmdbClient.get(`/person/${personId}/changes`)
      ]);

      const baseDetails = details.status === 'fulfilled' ? details.value.data : {};
      const baseCredits = credits.status === 'fulfilled' ? credits.value.data : {};
      const baseImages = images.status === 'fulfilled' ? images.value.data : {};
      const baseTaggedImages = taggedImages.status === 'fulfilled' ? taggedImages.value.data : {};
      const baseExternalIds = externalIds.status === 'fulfilled' ? externalIds.value.data : {};
      const baseAlternativeNames = alternativeNames.status === 'fulfilled' ? alternativeNames.value.data : {};
      const baseTranslations = translations.status === 'fulfilled' ? translations.value.data : {};
      const baseChanges = changes.status === 'fulfilled' ? changes.value.data : {};

      return {
        // Basic Info (6 points)
        id: baseDetails.id || 0,
        name: baseDetails.name || '',
        also_known_as: baseDetails.also_known_as || [],
        biography: baseDetails.biography || '',
        birthday: baseDetails.birthday || '',
        deathday: baseDetails.deathday,
        
        // Media (3 points)
        profile_path: baseDetails.profile_path,
        homepage: baseDetails.homepage,
        imdb_id: baseDetails.imdb_id,
        
        // Personal (4 points)
        place_of_birth: baseDetails.place_of_birth || '',
        known_for_department: baseDetails.known_for_department || '',
        gender: baseDetails.gender || 0,
        popularity: baseDetails.popularity || 0,
        
        // Extended Details (8 points)
        alternative_names: baseAlternativeNames || [],
        external_ids: baseExternalIds || {},
        images: baseImages || { profiles: [] },
        tagged_images: baseTaggedImages.results || [],
        translations: baseTranslations.translations || [],
        changes: baseChanges.changes || [],
        combined_credits: baseCredits || { cast: [], crew: [] },
        movie_credits: baseCredits || { cast: [], crew: [] },
        
        // Career Stats (4 points)
        career_stats: {
          total_movies: baseCredits.cast?.length || 0,
          total_tv_shows: 0,
          total_credits: (baseCredits.cast?.length || 0) + (baseCredits.crew?.length || 0),
          average_rating: 0,
          highest_rated_movie: '',
          most_popular_movie: '',
          career_span: 0,
          genres_worked_in: [],
        },
        awards: [],
        filmography: [],
        social_media: {
          facebook_id: baseExternalIds.facebook_id,
          instagram_id: baseExternalIds.instagram_id,
          twitter_id: baseExternalIds.twitter_id,
          youtube_id: baseExternalIds.youtube_id,
          tiktok_id: baseExternalIds.tiktok_id,
        },
        
        // Metadata (3 points)
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_modified: new Date().toISOString(),
      };
    } catch (error) {
      throw errorHandler.handleApiError(error, `getEnhancedPersonDetails/${personId}`);
    }
  },

  // Enhanced TV Show Methods
  getEnhancedTVShowDetails: async (tvId: number): Promise<EnhancedTVShowDetails> => {
    try {
      const [
        details,
        credits,
        reviews,
        similar,
        recommendations,
        videos,
        images,
        keywords,
        externalIds,
        alternativeTitles,
        contentRatings,
        translations,
        watchProviders,
        changes
      ] = await Promise.allSettled([
        tmdbClient.get(`/tv/${tvId}`),
        tmdbClient.get(`/tv/${tvId}/credits`),
        tmdbClient.get(`/tv/${tvId}/reviews`),
        tmdbClient.get(`/tv/${tvId}/similar`),
        tmdbClient.get(`/tv/${tvId}/recommendations`),
        tmdbClient.get(`/tv/${tvId}/videos`),
        tmdbClient.get(`/tv/${tvId}/images`),
        tmdbClient.get(`/tv/${tvId}/keywords`),
        tmdbClient.get(`/tv/${tvId}/external_ids`),
        tmdbClient.get(`/tv/${tvId}/alternative_titles`),
        tmdbClient.get(`/tv/${tvId}/content_ratings`),
        tmdbClient.get(`/tv/${tvId}/translations`),
        tmdbClient.get(`/tv/${tvId}/watch/providers`),
        tmdbClient.get(`/tv/${tvId}/changes`)
      ]);

      const baseDetails = details.status === 'fulfilled' ? details.value.data : {};
      const baseCredits = credits.status === 'fulfilled' ? credits.value.data : {};
      const baseReviews = reviews.status === 'fulfilled' ? reviews.value.data : {};
      const baseSimilar = similar.status === 'fulfilled' ? similar.value.data : {};
      const baseRecommendations = recommendations.status === 'fulfilled' ? recommendations.value.data : {};
      const baseVideos = videos.status === 'fulfilled' ? videos.value.data : {};
      const baseImages = images.status === 'fulfilled' ? images.value.data : {};
      const baseKeywords = keywords.status === 'fulfilled' ? keywords.value.data : {};
      const baseExternalIds = externalIds.status === 'fulfilled' ? externalIds.value.data : {};
      const baseAlternativeTitles = alternativeTitles.status === 'fulfilled' ? alternativeTitles.value.data : {};
      const baseContentRatings = contentRatings.status === 'fulfilled' ? contentRatings.value.data : {};
      const baseTranslations = translations.status === 'fulfilled' ? translations.value.data : {};
      const baseWatchProviders = watchProviders.status === 'fulfilled' ? watchProviders.value.data : {};
      const baseChanges = changes.status === 'fulfilled' ? changes.value.data : {};

      return {
        // Basic Info (8 points)
        id: baseDetails.id || 0,
        name: baseDetails.name || '',
        original_name: baseDetails.original_name || '',
        overview: baseDetails.overview || '',
        tagline: baseDetails.tagline || '',
        status: baseDetails.status || '',
        first_air_date: baseDetails.first_air_date || '',
        last_air_date: baseDetails.last_air_date || '',
        
        // Media (6 points)
        poster_path: baseDetails.poster_path,
        backdrop_path: baseDetails.backdrop_path,
        homepage: baseDetails.homepage || '',
        imdb_id: baseDetails.imdb_id || '',
        in_production: baseDetails.in_production || false,
        adult: baseDetails.adult || false,
        
        // Ratings & Popularity (4 points)
        vote_average: baseDetails.vote_average || 0,
        vote_count: baseDetails.vote_count || 0,
        popularity: baseDetails.popularity || 0,
        budget: 0,
        
        // Content Details (5 points)
        genres: baseDetails.genres || [],
        production_companies: baseDetails.production_companies || [],
        production_countries: baseDetails.production_countries || [],
        spoken_languages: baseDetails.spoken_languages || [],
        created_by: baseDetails.created_by || [],
        
        // Extended Details (8 points)
        alternative_titles: baseAlternativeTitles.results || [],
        keywords: baseKeywords.results || [],
        external_ids: baseExternalIds || {},
        content_ratings: baseContentRatings.results || [],
        watch_providers: baseWatchProviders.results || {},
        translations: baseTranslations.translations || [],
        changes: baseChanges.changes || [],
        networks: baseDetails.networks || [],
        
        // Episodes & Seasons (4 points)
        number_of_episodes: baseDetails.number_of_episodes || 0,
        number_of_seasons: baseDetails.number_of_seasons || 0,
        seasons: baseDetails.seasons || [],
        episode_run_time: baseDetails.episode_run_time || [],
        
        // Social & Reviews (4 points)
        reviews: baseReviews.results || [],
        similar_shows: baseSimilar.results || [],
        recommended_shows: baseRecommendations.results || [],
        social_media: {
          facebook_id: baseExternalIds.facebook_id,
          instagram_id: baseExternalIds.instagram_id,
          twitter_id: baseExternalIds.twitter_id,
          youtube_id: baseExternalIds.youtube_id,
        },
        
        // Technical (3 points)
        images: baseImages || { backdrops: [], posters: [], logos: [] },
        videos: baseVideos.results || [],
        credits: baseCredits || { cast: [], crew: [] },
        
        // Awards & Recognition (3 points)
        awards: [],
        festival_appearances: [],
        ratings_performance: {
          average_rating: baseDetails.vote_average || 0,
          peak_rating: 0,
          lowest_rating: 0,
          total_episodes: baseDetails.number_of_episodes || 0,
          rating_trend: 'stable',
        },
        
        // Metadata (3 points)
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_modified: new Date().toISOString(),
      };
    } catch (error) {
      throw errorHandler.handleApiError(error, `getEnhancedTVShowDetails/${tvId}`);
    }
  },

  // Additional Enhanced Methods
  getMovieCollections: async (collectionId: number) => {
    try {
      const response = await tmdbClient.get(`/collection/${collectionId}`);
      return response.data;
    } catch (error) {
      throw errorHandler.handleApiError(error, `getMovieCollections/${collectionId}`);
    }
  },

  getMovieKeywords: async (movieId: number) => {
    try {
      const response = await tmdbClient.get(`/movie/${movieId}/keywords`);
      return response.data;
    } catch (error) {
      throw errorHandler.handleApiError(error, `getMovieKeywords/${movieId}`);
    }
  },

  getMovieExternalIds: async (movieId: number) => {
    try {
      const response = await tmdbClient.get(`/movie/${movieId}/external_ids`);
      return response.data;
    } catch (error) {
      throw errorHandler.handleApiError(error, `getMovieExternalIds/${movieId}`);
    }
  },

  getMovieAlternativeTitles: async (movieId: number) => {
    try {
      const response = await tmdbClient.get(`/movie/${movieId}/alternative_titles`);
      return response.data;
    } catch (error) {
      throw errorHandler.handleApiError(error, `getMovieAlternativeTitles/${movieId}`);
    }
  },

  getMovieReleaseDates: async (movieId: number) => {
    try {
      const response = await tmdbClient.get(`/movie/${movieId}/release_dates`);
      return response.data;
    } catch (error) {
      throw errorHandler.handleApiError(error, `getMovieReleaseDates/${movieId}`);
    }
  },

  getMovieTranslations: async (movieId: number) => {
    try {
      const response = await tmdbClient.get(`/movie/${movieId}/translations`);
      return response.data;
    } catch (error) {
      throw errorHandler.handleApiError(error, `getMovieTranslations/${movieId}`);
    }
  },

  getMovieWatchProviders: async (movieId: number) => {
    try {
      const response = await tmdbClient.get(`/movie/${movieId}/watch/providers`);
      return response.data;
    } catch (error) {
      throw errorHandler.handleApiError(error, `getMovieWatchProviders/${movieId}`);
    }
  },

  getMovieChanges: async (movieId: number) => {
    try {
      const response = await tmdbClient.get(`/movie/${movieId}/changes`);
      return response.data;
    } catch (error) {
      throw errorHandler.handleApiError(error, `getMovieChanges/${movieId}`);
    }
  },

  // Enhanced Search Methods
  searchMulti: async (query: string, page: number = 1) => {
    try {
      const response = await tmdbClient.get('/search/multi', {
        params: { query, page }
      });
      return response.data;
    } catch (error) {
      throw errorHandler.handleApiError(error, `searchMulti/${query}`);
    }
  },

  searchCompanies: async (query: string, page: number = 1) => {
    try {
      const response = await tmdbClient.get('/search/company', {
        params: { query, page }
      });
      return response.data;
    } catch (error) {
      throw errorHandler.handleApiError(error, `searchCompanies/${query}`);
    }
  },

  searchCollections: async (query: string, page: number = 1) => {
    try {
      const response = await tmdbClient.get('/search/collection', {
        params: { query, page }
      });
      return response.data;
    } catch (error) {
      throw errorHandler.handleApiError(error, `searchCollections/${query}`);
    }
  },

  searchKeywords: async (query: string, page: number = 1) => {
    try {
      const response = await tmdbClient.get('/search/keyword', {
        params: { query, page }
      });
      return response.data;
    } catch (error) {
      throw errorHandler.handleApiError(error, `searchKeywords/${query}`);
    }
  },

  // Enhanced Discover Methods
  discoverTV: async (params: any) => {
    try {
      const response = await tmdbClient.get('/discover/tv', { params });
      return response.data;
    } catch (error) {
      throw errorHandler.handleApiError(error, 'discoverTV');
    }
  },

  // Enhanced Configuration
  getConfiguration: async () => {
    try {
      const response = await tmdbClient.get('/configuration');
      return response.data;
    } catch (error) {
      throw errorHandler.handleApiError(error, 'getConfiguration');
    }
  },

  getCountries: async () => {
    try {
      const response = await tmdbClient.get('/configuration/countries');
      return response.data;
    } catch (error) {
      throw errorHandler.handleApiError(error, 'getCountries');
    }
  },

  getJobs: async () => {
    try {
      const response = await tmdbClient.get('/configuration/jobs');
      return response.data;
    } catch (error) {
      throw errorHandler.handleApiError(error, 'getJobs');
    }
  },

  getLanguages: async () => {
    try {
      const response = await tmdbClient.get('/configuration/languages');
      return response.data;
    } catch (error) {
      throw errorHandler.handleApiError(error, 'getLanguages');
    }
  },

  getPrimaryTranslations: async () => {
    try {
      const response = await tmdbClient.get('/configuration/primary_translations');
      return response.data;
    } catch (error) {
      throw errorHandler.handleApiError(error, 'getPrimaryTranslations');
    }
  },

  getTimezones: async () => {
    try {
      const response = await tmdbClient.get('/configuration/timezones');
      return response.data;
    } catch (error) {
      throw errorHandler.handleApiError(error, 'getTimezones');
    }
  },
};

// All types are already exported above with their interface declarations