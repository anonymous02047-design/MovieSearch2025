'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  Paper
} from '@mui/material';
import { TrendingUp as TrendingIcon, Whatshot as HotIcon } from '@mui/icons-material';
import { tmdbApi, Movie } from '@/lib/tmdb';
import { TVShow } from './TVShowCard';
import MovieCard from './MovieCard';
import TVShowCard from './TVShowCard';
import ResponsiveGrid from './ResponsiveGrid';

type TimeWindow = 'day' | 'week';
type ContentType = 'movie' | 'tv' | 'all';

export default function TrendingSection() {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('day');
  const [contentType, setContentType] = useState<ContentType>('all');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    loadTrending();
  }, [timeWindow, contentType]);

  const loadTrending = async () => {
    setLoading(true);
    setError(null);

    try {
      if (contentType === 'all' || contentType === 'movie') {
        const movieData = await tmdbApi.getTrendingMovies(timeWindow);
        setMovies(movieData.results || []);
      }
      
      if (contentType === 'all' || contentType === 'tv') {
        const tvData = await tmdbApi.getTrendingTV(timeWindow);
        setTvShows(tvData.results || []);
      }
    } catch (err) {
      console.error('Error loading trending:', err);
      setError('Failed to load trending content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 4,
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(135deg, ${alpha('#f44336', 0.1)} 0%, ${alpha('#ff9800', 0.05)} 100%)`
          : `linear-gradient(135deg, ${alpha('#f44336', 0.05)} 0%, ${alpha('#ff9800', 0.02)} 100%)`,
        border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <HotIcon sx={{ color: 'error.main', fontSize: 32 }} />
        <Typography variant="h5" fontWeight={700}>
          Trending Now
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={timeWindow}
          onChange={(_, newValue) => setTimeWindow(newValue)}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
            }
          }}
        >
          <Tab
            icon={<TrendingIcon />}
            iconPosition="start"
            label="Today"
            value="day"
          />
          <Tab
            icon={<TrendingIcon />}
            iconPosition="start"
            label="This Week"
            value="week"
          />
        </Tabs>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Tabs
          value={contentType}
          onChange={(_, newValue) => setContentType(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              minHeight: 40,
            }
          }}
        >
          <Tab label="All" value="all" />
          <Tab label="Movies" value="movie" />
          <Tab label="TV Shows" value="tv" />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box>
          {(contentType === 'all' || contentType === 'movie') && movies.length > 0 && (
            <Box sx={{ mb: contentType === 'all' ? 4 : 0 }}>
              {contentType === 'all' && (
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Movies
                </Typography>
              )}
              <ResponsiveGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing={3}>
                {movies.slice(0, 10).map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ResponsiveGrid>
            </Box>
          )}

          {(contentType === 'all' || contentType === 'tv') && tvShows.length > 0 && (
            <Box>
              {contentType === 'all' && (
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  TV Shows
                </Typography>
              )}
              <ResponsiveGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing={3}>
                {tvShows.slice(0, 10).map(show => (
                  <TVShowCard key={show.id} show={show} />
                ))}
              </ResponsiveGrid>
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
}

