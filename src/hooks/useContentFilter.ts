'use client';

import { useState, useCallback } from 'react';

export type ContentType = 'all' | 'movie' | 'tv';
export type SortBy = 'popularity.desc' | 'popularity.asc' | 'vote_average.desc' | 'vote_average.asc' | 'release_date.desc' | 'release_date.asc';

export interface FilterOptions {
  contentType: ContentType;
  genres: number[];
  year?: number;
  minRating?: number;
  maxRating?: number;
  language?: string;
  sortBy: SortBy;
  region?: string;
}

const defaultFilters: FilterOptions = {
  contentType: 'all',
  genres: [],
  sortBy: 'popularity.desc',
};

export const useContentFilter = () => {
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);

  const updateFilter = useCallback((key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const updateFilters = useCallback((newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const toggleGenre = useCallback((genreId: number) => {
    setFilters(prev => {
      const genres = prev.genres.includes(genreId)
        ? prev.genres.filter(id => id !== genreId)
        : [...prev.genres, genreId];
      return { ...prev, genres };
    });
  }, []);

  return {
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    toggleGenre
  };
};

