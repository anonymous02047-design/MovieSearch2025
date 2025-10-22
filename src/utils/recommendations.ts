/**
 * Enhanced Content Recommendations System
 * Country-specific recommendations with TMDB API
 */

import { tmdbApi } from '@/lib/tmdb';
import { getCountryByCode, type Country } from './countries';

export interface RecommendationParams {
  countryCode?: string;
  languages?: string[];
  genres?: number[];
  minRating?: number;
  yearRange?: { start: number; end: number };
  page?: number;
}

export interface CountrySpecificRecommendation {
  title: string;
  description: string;
  movies: any[];
  tvShows: any[];
  country: Country | undefined;
  reason: string;
}

/**
 * Get country-specific recommendations
 */
export async function getCountryRecommendations(
  countryCode: string,
  page: number = 1
): Promise<CountrySpecificRecommendation> {
  const country = getCountryByCode(countryCode);
  
  if (!country) {
    throw new Error(`Country not found: ${countryCode}`);
  }

  try {
    // Discover movies for this region
    const moviesResponse = await tmdbApi.discoverMovies({
      page,
      sort_by: 'popularity.desc',
      with_original_language: country.languages[0],
      include_adult: false,
    });

    // Get trending content
    const trendingResponse = await tmdbApi.getTrendingMovies('week', page);

    // Get popular TV shows for this region
    const tvResponse = await tmdbApi.getPopularTV(page);

    return {
      title: `Popular in ${country.name} ${country.flag}`,
      description: `Movies and TV shows popular in ${country.name}`,
      movies: moviesResponse?.results || [],
      tvShows: tvResponse?.results?.slice(0, 10) || [],
      country,
      reason: `Based on your location in ${country.name}`,
    };
  } catch (error) {
    console.error('Error fetching country recommendations:', error);
    throw error;
  }
}

/**
 * Get language-specific recommendations
 */
export async function getLanguageRecommendations(
  languageCode: string,
  page: number = 1
): Promise<any[]> {
  try {
    const response = await tmdbApi.discoverMovies({
      page,
      sort_by: 'popularity.desc',
      with_original_language: languageCode,
      include_adult: false,
    });

    return response?.results || [];
  } catch (error) {
    console.error('Error fetching language recommendations:', error);
    return [];
  }
}

/**
 * Get regional trending content
 */
export async function getRegionalTrending(
  regionCode: string,
  timeWindow: 'day' | 'week' = 'week',
  page: number = 1
): Promise<any[]> {
  try {
    // TMDB doesn't support region-specific trending directly
    // We'll use discover with region preference
    const response = await tmdbApi.discoverMovies({
      page,
      sort_by: 'popularity.desc',
      include_adult: false,
    });

    return response?.results || [];
  } catch (error) {
    console.error('Error fetching regional trending:', error);
    return [];
  }
}

/**
 * Get multi-region recommendations
 */
export async function getMultiRegionRecommendations(
  countryCodes: string[]
): Promise<Map<string, CountrySpecificRecommendation>> {
  const recommendations = new Map<string, CountrySpecificRecommendation>();

  const promises = countryCodes.map(async (code) => {
    try {
      const rec = await getCountryRecommendations(code);
      recommendations.set(code, rec);
    } catch (error) {
      console.error(`Error fetching recommendations for ${code}:`, error);
    }
  });

  await Promise.all(promises);
  return recommendations;
}

/**
 * Get personalized recommendations based on user preferences and country
 */
export async function getPersonalizedRecommendations(params: RecommendationParams): Promise<any[]> {
  const {
    countryCode,
    languages = [],
    genres = [],
    minRating = 0,
    yearRange,
    page = 1,
  } = params;

  try {
    const discoverParams: any = {
      page,
      sort_by: 'vote_average.desc',
      'vote_count.gte': 100, // Minimum votes for quality
      include_adult: false,
    };

    // Add country-specific language
    if (countryCode) {
      const country = getCountryByCode(countryCode);
      if (country && country.languages.length > 0) {
        discoverParams.with_original_language = country.languages[0];
      }
    }

    // Add language preferences
    if (languages.length > 0) {
      discoverParams.with_original_language = languages[0];
    }

    // Add genre filters
    if (genres.length > 0) {
      discoverParams.with_genres = genres.join(',');
    }

    // Add rating filter
    if (minRating > 0) {
      discoverParams['vote_average.gte'] = minRating;
    }

    // Add year range
    if (yearRange) {
      discoverParams['primary_release_date.gte'] = `${yearRange.start}-01-01`;
      discoverParams['primary_release_date.lte'] = `${yearRange.end}-12-31`;
    }

    const response = await tmdbApi.discoverMovies(discoverParams);
    return response?.results || [];
  } catch (error) {
    console.error('Error fetching personalized recommendations:', error);
    return [];
  }
}

/**
 * Get continent-wide popular content
 */
export async function getContinentRecommendations(
  continent: string,
  page: number = 1
): Promise<any[]> {
  // Major languages by continent
  const continentLanguages: Record<string, string[]> = {
    'Africa': ['ar', 'fr', 'en', 'sw', 'pt'],
    'Asia': ['zh', 'ja', 'ko', 'hi', 'ar', 'id', 'th', 'vi'],
    'Europe': ['en', 'de', 'fr', 'es', 'it', 'ru', 'pl'],
    'North America': ['en', 'es', 'fr'],
    'South America': ['es', 'pt'],
    'Oceania': ['en'],
  };

  const languages = continentLanguages[continent] || ['en'];

  try {
    const response = await tmdbApi.discoverMovies({
      page,
      sort_by: 'popularity.desc',
      with_original_language: languages.join('|'),
      include_adult: false,
    });

    return response?.results || [];
  } catch (error) {
    console.error('Error fetching continent recommendations:', error);
    return [];
  }
}

/**
 * Get watch providers for a specific country
 */
export async function getCountryWatchProviders(
  movieId: number,
  countryCode: string
): Promise<any> {
  try {
    const response = await tmdbApi.getMovieWatchProviders(movieId);
    const countryData = response?.results?.[countryCode];
    
    return countryData || null;
  } catch (error) {
    console.error('Error fetching watch providers:', error);
    return null;
  }
}

/**
 * Get similar users' favorites by country
 * (This would integrate with MongoDB user data)
 */
export function getSimilarUsersFavorites(countryCode: string): Promise<any[]> {
  // This would query MongoDB for users in the same country
  // and aggregate their favorite movies
  return Promise.resolve([]);
}

/**
 * Cache recommendations for performance
 */
const recommendationCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export function getCachedRecommendations(key: string): any | null {
  const cached = recommendationCache.get(key);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  return null;
}

export function setCachedRecommendations(key: string, data: any): void {
  recommendationCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

/**
 * Clear recommendation cache
 */
export function clearRecommendationCache(): void {
  recommendationCache.clear();
}

