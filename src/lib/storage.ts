/**
 * Local Storage Utilities
 * 
 * This module provides utilities for managing user data in localStorage,
 * including favorites, watchlist, and search history.
 * 
 * Features:
 * - Type-safe storage operations
 * - Error handling for storage failures
 * - User-specific storage keys
 * - Automatic data validation
 * 
 * @author MovieSearch Team
 * @version 1.0.0
 */

// Type definitions for stored data
export interface StoredMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  addedAt: string;
}

export interface SearchHistoryItem {
  query: string;
  timestamp: string;
  resultsCount?: number;
}

// Storage keys for different data types
const STORAGE_KEYS = {
  FAVORITES: 'movieSearch_favorites',
  WATCHLIST: 'movieSearch_watchlist',
  SEARCH_HISTORY: 'movieSearch_searchHistory',
} as const;

// Helper function to get user-specific storage key
const getUserStorageKey = (baseKey: string, userId?: string): string => {
  return userId ? `${baseKey}_${userId}` : baseKey;
};

// Favorites
export const getFavorites = (): StoredMovie[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
};

export const addToFavorites = (movie: StoredMovie): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const favorites = getFavorites();
    const exists = favorites.some(fav => fav.id === movie.id);
    
    if (!exists) {
      const newFavorites = [...favorites, { ...movie, addedAt: new Date().toISOString() }];
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(newFavorites));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return false;
  }
};

export const removeFromFavorites = (movieId: number): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const favorites = getFavorites();
    const newFavorites = favorites.filter(fav => fav.id !== movieId);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(newFavorites));
    return newFavorites.length < favorites.length; // Return true if something was removed
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return false;
  }
};

export const isFavorite = (movieId: number): boolean => {
  const favorites = getFavorites();
  return favorites.some(fav => fav.id === movieId);
};

// Watchlist
export const getWatchlist = (): StoredMovie[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading watchlist:', error);
    return [];
  }
};

export const addToWatchlist = (movie: StoredMovie): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const watchlist = getWatchlist();
    const exists = watchlist.some(item => item.id === movie.id);
    
    if (!exists) {
      const newWatchlist = [...watchlist, { ...movie, addedAt: new Date().toISOString() }];
      localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(newWatchlist));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return false;
  }
};

export const removeFromWatchlist = (movieId: number): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const watchlist = getWatchlist();
    const newWatchlist = watchlist.filter(item => item.id !== movieId);
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(newWatchlist));
    return newWatchlist.length < watchlist.length; // Return true if something was removed
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return false;
  }
};

export const isInWatchlist = (movieId: number): boolean => {
  const watchlist = getWatchlist();
  return watchlist.some(item => item.id === movieId);
};

// Search History
export const getSearchHistory = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading search history:', error);
    return [];
  }
};

export const addToSearchHistory = (query: string): void => {
  if (typeof window === 'undefined' || !query.trim()) return;
  try {
    const history = getSearchHistory();
    const newHistory = [query.trim(), ...history.filter(item => item !== query.trim())].slice(0, 10);
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Error adding to search history:', error);
  }
};

export const removeFromSearchHistory = (index: number): void => {
  if (typeof window === 'undefined') return;
  try {
    const history = getSearchHistory();
    const newHistory = history.filter((_, i) => i !== index);
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Error removing from search history:', error);
  }
};

export const clearSearchHistory = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
  } catch (error) {
    console.error('Error clearing search history:', error);
  }
};

// Export data
export const exportFavorites = (): string => {
  const favorites = getFavorites();
  const data = {
    type: 'MovieSearch Favorites',
    exportDate: new Date().toISOString(),
    count: favorites.length,
    movies: favorites,
  };
  return JSON.stringify(data, null, 2);
};

export const exportWatchlist = (): string => {
  const watchlist = getWatchlist();
  const data = {
    type: 'MovieSearch Watchlist',
    exportDate: new Date().toISOString(),
    count: watchlist.length,
    movies: watchlist,
  };
  return JSON.stringify(data, null, 2);
};

// Import data
export const importData = (jsonData: string): { success: boolean; message: string } => {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.type === 'MovieSearch Favorites' && Array.isArray(data.movies)) {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(data.movies));
      return { success: true, message: `Imported ${data.movies.length} favorites` };
    }
    
    if (data.type === 'MovieSearch Watchlist' && Array.isArray(data.movies)) {
      localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(data.movies));
      return { success: true, message: `Imported ${data.movies.length} watchlist items` };
    }
    
    return { success: false, message: 'Invalid data format' };
  } catch {
    return { success: false, message: 'Invalid JSON data' };
  }
};

// User-specific storage functions
export const getUserFavorites = (userId: string): StoredMovie[] => {
  if (typeof window === 'undefined') return [];
  try {
    const key = getUserStorageKey(STORAGE_KEYS.FAVORITES, userId);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading user favorites:', error);
    return [];
  }
};

export const addToUserFavorites = (userId: string, movie: StoredMovie): void => {
  if (typeof window === 'undefined') return;
  try {
    const favorites = getUserFavorites(userId);
    const exists = favorites.some(fav => fav.id === movie.id);
    
    if (!exists) {
      const newFavorites = [...favorites, { ...movie, addedAt: new Date().toISOString() }];
      const key = getUserStorageKey(STORAGE_KEYS.FAVORITES, userId);
      localStorage.setItem(key, JSON.stringify(newFavorites));
    }
  } catch (error) {
    console.error('Error adding to user favorites:', error);
  }
};

export const removeFromUserFavorites = (userId: string, movieId: number): void => {
  if (typeof window === 'undefined') return;
  try {
    const favorites = getUserFavorites(userId);
    const newFavorites = favorites.filter(fav => fav.id !== movieId);
    const key = getUserStorageKey(STORAGE_KEYS.FAVORITES, userId);
    localStorage.setItem(key, JSON.stringify(newFavorites));
  } catch (error) {
    console.error('Error removing from user favorites:', error);
  }
};

export const getUserWatchlist = (userId: string): StoredMovie[] => {
  if (typeof window === 'undefined') return [];
  try {
    const key = getUserStorageKey(STORAGE_KEYS.WATCHLIST, userId);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading user watchlist:', error);
    return [];
  }
};

export const addToUserWatchlist = (userId: string, movie: StoredMovie): void => {
  if (typeof window === 'undefined') return;
  try {
    const watchlist = getUserWatchlist(userId);
    const exists = watchlist.some(item => item.id === movie.id);
    
    if (!exists) {
      const newWatchlist = [...watchlist, { ...movie, addedAt: new Date().toISOString() }];
      const key = getUserStorageKey(STORAGE_KEYS.WATCHLIST, userId);
      localStorage.setItem(key, JSON.stringify(newWatchlist));
    }
  } catch (error) {
    console.error('Error adding to user watchlist:', error);
  }
};

export const removeFromUserWatchlist = (userId: string, movieId: number): void => {
  if (typeof window === 'undefined') return;
  try {
    const watchlist = getUserWatchlist(userId);
    const newWatchlist = watchlist.filter(item => item.id !== movieId);
    const key = getUserStorageKey(STORAGE_KEYS.WATCHLIST, userId);
    localStorage.setItem(key, JSON.stringify(newWatchlist));
  } catch (error) {
    console.error('Error removing from user watchlist:', error);
  }
};

export const getUserSearchHistory = (userId: string): SearchHistoryItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const key = getUserStorageKey(STORAGE_KEYS.SEARCH_HISTORY, userId);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading user search history:', error);
    return [];
  }
};

export const addToUserSearchHistory = (userId: string, query: string, resultsCount?: number): void => {
  if (typeof window === 'undefined' || !query.trim()) return;
  try {
    const history = getUserSearchHistory(userId);
    const newItem: SearchHistoryItem = {
      query: query.trim(),
      timestamp: new Date().toISOString(),
      resultsCount,
    };
    const newHistory = [newItem, ...history.filter(item => item.query !== query.trim())].slice(0, 20);
    const key = getUserStorageKey(STORAGE_KEYS.SEARCH_HISTORY, userId);
    localStorage.setItem(key, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Error adding to user search history:', error);
  }
};

export const clearUserSearchHistory = (userId: string): void => {
  if (typeof window === 'undefined') return;
  try {
    const key = getUserStorageKey(STORAGE_KEYS.SEARCH_HISTORY, userId);
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing user search history:', error);
  }
};

// User ratings system
export const getUserRatings = (userId: string): Record<number, number> => {
  if (typeof window === 'undefined') return {};
  try {
    const key = getUserStorageKey('movieSearch_ratings', userId);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading user ratings:', error);
    return {};
  }
};

export const setUserRating = (userId: string, movieId: number, rating: number): void => {
  if (typeof window === 'undefined') return;
  try {
    const ratings = getUserRatings(userId);
    ratings[movieId] = rating;
    const key = getUserStorageKey('movieSearch_ratings', userId);
    localStorage.setItem(key, JSON.stringify(ratings));
  } catch (error) {
    console.error('Error setting user rating:', error);
  }
};

export const getUserRating = (userId: string, movieId: number): number | null => {
  const ratings = getUserRatings(userId);
  return ratings[movieId] || null;
};
