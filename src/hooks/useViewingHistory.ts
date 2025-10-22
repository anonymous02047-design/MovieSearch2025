'use client';

import { useState, useEffect, useCallback } from 'react';

export interface ViewingHistoryItem {
  movieId: number;
  title: string;
  posterPath: string | null;
  viewedAt: string;
  duration?: number; // seconds watched
  completed: boolean;
}

const STORAGE_KEY = 'movieSearch_viewingHistory';
const MAX_HISTORY_ITEMS = 100;

export function useViewingHistory() {
  const [history, setHistory] = useState<ViewingHistoryItem[]>([]);

  // Load history from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setHistory(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading viewing history:', error);
      }
    }
  }, []);

  // Save history to localStorage
  const saveHistory = useCallback((newHistory: ViewingHistoryItem[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
        setHistory(newHistory);
      } catch (error) {
        console.error('Error saving viewing history:', error);
      }
    }
  }, []);

  // Add item to history
  const addToHistory = useCallback(
    (item: Omit<ViewingHistoryItem, 'viewedAt'>) => {
      const newItem: ViewingHistoryItem = {
        ...item,
        viewedAt: new Date().toISOString(),
      };

      // Remove existing entry for this movie
      const filteredHistory = history.filter((h) => h.movieId !== item.movieId);

      // Add new entry at the beginning
      const newHistory = [newItem, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);

      saveHistory(newHistory);
    },
    [history, saveHistory]
  );

  // Remove item from history
  const removeFromHistory = useCallback(
    (movieId: number) => {
      const newHistory = history.filter((item) => item.movieId !== movieId);
      saveHistory(newHistory);
    },
    [history, saveHistory]
  );

  // Clear all history
  const clearHistory = useCallback(() => {
    saveHistory([]);
  }, [saveHistory]);

  // Get history for a specific movie
  const getMovieHistory = useCallback(
    (movieId: number) => {
      return history.find((item) => item.movieId === movieId);
    },
    [history]
  );

  // Get recent history (last N days)
  const getRecentHistory = useCallback(
    (days: number = 7) => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      return history.filter(
        (item) => new Date(item.viewedAt) > cutoffDate
      );
    },
    [history]
  );

  // Get statistics
  const getStats = useCallback(() => {
    const totalViewed = history.length;
    const completedCount = history.filter((item) => item.completed).length;
    const recentCount = getRecentHistory(7).length;
    const recentCompleted = getRecentHistory(7).filter((item) => item.completed).length;

    return {
      totalViewed,
      completedCount,
      completionRate: totalViewed > 0 ? (completedCount / totalViewed) * 100 : 0,
      recentCount,
      recentCompleted,
    };
  }, [history, getRecentHistory]);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getMovieHistory,
    getRecentHistory,
    getStats,
  };
}

