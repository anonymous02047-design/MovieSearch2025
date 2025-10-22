'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  alpha,
  useTheme,
  Chip
} from '@mui/material';
import { NewReleases as NewIcon, Schedule as ScheduleIcon } from '@mui/icons-material';
import { tmdbApi, Movie } from '@/lib/tmdb';
import MovieCard from './MovieCard';
import ResponsiveGrid from './ResponsiveGrid';

export default function NewReleasesSection() {
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    loadNewReleases();
  }, []);

  const loadNewReleases = async () => {
    setLoading(true);
    setError(null);

    try {
      const [nowPlayingData, upcomingData] = await Promise.all([
        tmdbApi.getNowPlayingMovies(1),
        tmdbApi.getUpcomingMovies(1)
      ]);

      setNowPlaying(nowPlayingData.results?.slice(0, 8) || []);
      setUpcoming(upcomingData.results?.slice(0, 8) || []);
    } catch (err) {
      console.error('Error loading new releases:', err);
      setError('Failed to load new releases');
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
          ? `linear-gradient(135deg, ${alpha('#ff9800', 0.1)} 0%, ${alpha('#ffc107', 0.05)} 100%)`
          : `linear-gradient(135deg, ${alpha('#ff9800', 0.05)} 0%, ${alpha('#ffc107', 0.02)} 100%)`,
        border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <NewIcon sx={{ color: 'warning.main', fontSize: 32 }} />
        <Typography variant="h5" fontWeight={700}>
          New Releases
        </Typography>
        <Chip label="Updated Daily" size="small" color="warning" variant="outlined" />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box>
          {nowPlaying.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <NewIcon color="warning" />
                <Typography variant="h6" fontWeight={600}>
                  Now Playing in Theaters
                </Typography>
              </Box>
              <ResponsiveGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={3}>
                {nowPlaying.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ResponsiveGrid>
            </Box>
          )}

          {upcoming.length > 0 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <ScheduleIcon color="warning" />
                <Typography variant="h6" fontWeight={600}>
                  Coming Soon
                </Typography>
              </Box>
              <ResponsiveGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={3}>
                {upcoming.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ResponsiveGrid>
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
}

