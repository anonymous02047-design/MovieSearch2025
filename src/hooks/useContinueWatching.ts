'use client';

import { useState, useEffect, useCallback } from 'react';

export interface WatchProgress {
  id: number;
  title: string;
  type: 'movie' | 'tv';
  poster_path: string | null;
  progress: number; // 0-100
  duration?: number; // in minutes
  lastWatched: number; // timestamp
  seasonNumber?: number;
  episodeNumber?: number;
  episodeTitle?: string;
}

const CONTINUE_WATCHING_KEY = 'continue_watching';
const MAX_ITEMS = 20;

export const useContinueWatching = () => {
  const [continueWatching, setContinueWatching] = useState<WatchProgress[]>([]);

  useEffect(() => {
    loadContinueWatching();
  }, []);

  const loadContinueWatching = () => {
    try {
      const stored = localStorage.getItem(CONTINUE_WATCHING_KEY);
      if (stored) {
        setContinueWatching(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading continue watching:', error);
    }
  };

  const updateProgress = useCallback((item: WatchProgress) => {
    setContinueWatching(prev => {
      // Remove if exists
      const filtered = prev.filter(i => !(i.id === item.id && i.type === item.type));
      
      // Add to beginning if progress is meaningful (between 5% and 95%)
      let newList = filtered;
      if (item.progress >= 5 && item.progress <= 95) {
        newList = [item, ...filtered];
      }
      
      // Limit to MAX_ITEMS
      if (newList.length > MAX_ITEMS) {
        newList = newList.slice(0, MAX_ITEMS);
      }
      
      localStorage.setItem(CONTINUE_WATCHING_KEY, JSON.stringify(newList));
      return newList;
    });
  }, []);

  const removeFromContinueWatching = useCallback((id: number, type: 'movie' | 'tv') => {
    setContinueWatching(prev => {
      const newList = prev.filter(item => !(item.id === id && item.type === type));
      localStorage.setItem(CONTINUE_WATCHING_KEY, JSON.stringify(newList));
      return newList;
    });
  }, []);

  const clearContinueWatching = useCallback(() => {
    setContinueWatching([]);
    localStorage.removeItem(CONTINUE_WATCHING_KEY);
  }, []);

  const getProgress = useCallback((id: number, type: 'movie' | 'tv'): WatchProgress | null => {
    return continueWatching.find(item => item.id === id && item.type === type) || null;
  }, [continueWatching]);

  return {
    continueWatching,
    updateProgress,
    removeFromContinueWatching,
    clearContinueWatching,
    getProgress
  };
};

