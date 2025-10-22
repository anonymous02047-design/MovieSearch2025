'use client';

import { useState, useEffect, useCallback } from 'react';

export interface WatchlistItem {
  id: number;
  title: string;
  type: 'movie' | 'tv';
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  addedAt: number;
}

const WATCHLIST_KEY = 'user_watchlist';
const FAVORITES_KEY = 'user_favorites';

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [favorites, setFavorites] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    loadWatchlist();
    loadFavorites();
  }, []);

  const loadWatchlist = () => {
    try {
      const stored = localStorage.getItem(WATCHLIST_KEY);
      if (stored) {
        setWatchlist(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading watchlist:', error);
    }
  };

  const loadFavorites = () => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const addToWatchlist = useCallback((item: Omit<WatchlistItem, 'addedAt'>) => {
    setWatchlist(prev => {
      const exists = prev.some(i => i.id === item.id && i.type === item.type);
      if (exists) return prev;
      
      const newList = [...prev, { ...item, addedAt: Date.now() }];
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(newList));
      return newList;
    });
  }, []);

  const removeFromWatchlist = useCallback((id: number, type: 'movie' | 'tv') => {
    setWatchlist(prev => {
      const newList = prev.filter(item => !(item.id === id && item.type === type));
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(newList));
      return newList;
    });
  }, []);

  const isInWatchlist = useCallback((id: number, type: 'movie' | 'tv') => {
    return watchlist.some(item => item.id === id && item.type === type);
  }, [watchlist]);

  const addToFavorites = useCallback((item: Omit<WatchlistItem, 'addedAt'>) => {
    setFavorites(prev => {
      const exists = prev.some(i => i.id === item.id && i.type === item.type);
      if (exists) return prev;
      
      const newList = [...prev, { ...item, addedAt: Date.now() }];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newList));
      return newList;
    });
  }, []);

  const removeFromFavorites = useCallback((id: number, type: 'movie' | 'tv') => {
    setFavorites(prev => {
      const newList = prev.filter(item => !(item.id === id && item.type === type));
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newList));
      return newList;
    });
  }, []);

  const isInFavorites = useCallback((id: number, type: 'movie' | 'tv') => {
    return favorites.some(item => item.id === id && item.type === type);
  }, [favorites]);

  const clearWatchlist = useCallback(() => {
    setWatchlist([]);
    localStorage.removeItem(WATCHLIST_KEY);
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    localStorage.removeItem(FAVORITES_KEY);
  }, []);

  return {
    watchlist,
    favorites,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    addToFavorites,
    removeFromFavorites,
    isInFavorites,
    clearWatchlist,
    clearFavorites
  };
};

