'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  IconButton,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import {
  History as HistoryIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';

interface RecentSearchesProps {
  onSearchSelect: (query: string) => void;
  maxItems?: number;
}

export default function RecentSearches({ onSearchSelect, maxItems = 10 }: RecentSearchesProps) {
  const [searches, setSearches] = useState<string[]>([]);
  const STORAGE_KEY = 'movieSearch_recentSearches';

  useEffect(() => {
    loadSearches();
  }, []);

  const loadSearches = () => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setSearches(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  };

  const addSearch = (query: string) => {
    if (!query.trim()) return;

    const newSearches = [
      query.trim(),
      ...searches.filter((s) => s !== query.trim()),
    ].slice(0, maxItems);

    setSearches(newSearches);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSearches));
      } catch (error) {
        console.error('Error saving recent search:', error);
      }
    }
  };

  const removeSearch = (query: string) => {
    const newSearches = searches.filter((s) => s !== query);
    setSearches(newSearches);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSearches));
      } catch (error) {
        console.error('Error removing recent search:', error);
      }
    }
  };

  const clearAll = () => {
    setSearches([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Popular/Trending searches (mock data - replace with real data)
  const trendingSearches = ['Avengers', 'Inception', 'The Dark Knight', 'Interstellar', 'Oppenheimer'];

  if (searches.length === 0 && trendingSearches.length === 0) {
    return null;
  }

  return (
    <Paper elevation={2} sx={{ mt: 1 }}>
      {/* Recent Searches */}
      {searches.length > 0 && (
        <Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            px={2}
            py={1}
            bgcolor="action.hover"
          >
            <Box display="flex" alignItems="center" gap={1}>
              <HistoryIcon fontSize="small" color="action" />
              <Typography variant="subtitle2" color="text.secondary">
                Recent Searches
              </Typography>
            </Box>
            <IconButton size="small" onClick={clearAll} title="Clear all">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>

          <List dense>
            {searches.map((search, index) => (
              <ListItem
                key={index}
                disablePadding
                secondaryAction={
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => removeSearch(search)}
                    title="Remove"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemButton
                  onClick={() => {
                    onSearchSelect(search);
                    addSearch(search);
                  }}
                >
                  <ListItemIcon>
                    <SearchIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={search} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {searches.length > 0 && trendingSearches.length > 0 && <Divider />}

      {/* Trending Searches */}
      {trendingSearches.length > 0 && (
        <Box>
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            px={2}
            py={1}
            bgcolor="action.hover"
          >
            <TrendingIcon fontSize="small" color="action" />
            <Typography variant="subtitle2" color="text.secondary">
              Trending Searches
            </Typography>
          </Box>

          <Box p={2}>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {trendingSearches.map((search) => (
                <Chip
                  key={search}
                  label={search}
                  size="small"
                  onClick={() => {
                    onSearchSelect(search);
                    addSearch(search);
                  }}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'primary.main',
                      color: 'white',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </Paper>
  );
}

// Export the addSearch function for use in search components
export function useRecentSearches(maxItems: number = 10) {
  const STORAGE_KEY = 'movieSearch_recentSearches';

  const addSearch = (query: string) => {
    if (typeof window === 'undefined' || !query.trim()) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const searches = stored ? JSON.parse(stored) : [];
      const newSearches = [
        query.trim(),
        ...searches.filter((s: string) => s !== query.trim()),
      ].slice(0, maxItems);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSearches));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  return { addSearch };
}

