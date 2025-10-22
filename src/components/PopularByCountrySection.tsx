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
import { Public as GlobalIcon } from '@mui/icons-material';
import { tmdbApi, Movie } from '@/lib/tmdb';
import { TVShow } from './TVShowCard';
import MovieCard from './MovieCard';
import TVShowCard from './TVShowCard';
import ResponsiveGrid from './ResponsiveGrid';
import { useCountryDetection } from '@/hooks/useCountryDetection';

export default function PopularByCountrySection() {
  const { countryData } = useCountryDetection();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (countryData) {
      loadPopularByCountry();
    }
  }, [countryData]);

  const loadPopularByCountry = async () => {
    if (!countryData) return;

    setLoading(true);
    setError(null);

    try {
      // Get popular movies for the country's language
      const movieData = await tmdbApi.discoverMovies({
        page: 1,
        sort_by: 'popularity.desc',
        with_original_language: countryData.language,
      });

      // Get popular TV shows (TMDB doesn't have discover for TV, use trending)
      const tvData = await tmdbApi.getTrendingTV('week');

      setMovies(movieData.results?.slice(0, 8) || []);
      setTvShows(tvData.results?.slice(0, 8) || []);
    } catch (err) {
      console.error('Error loading popular by country:', err);
      setError('Failed to load popular content for your country');
    } finally {
      setLoading(false);
    }
  };

  if (!countryData) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 4,
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(135deg, ${alpha('#4caf50', 0.1)} 0%, ${alpha('#8bc34a', 0.05)} 100%)`
          : `linear-gradient(135deg, ${alpha('#4caf50', 0.05)} 0%, ${alpha('#8bc34a', 0.02)} 100%)`,
        border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        <GlobalIcon sx={{ color: 'success.main', fontSize: 32 }} />
        <Typography variant="h5" fontWeight={700}>
          Popular in {countryData.country}
        </Typography>
        <Chip
          label={countryData.flag}
          size="small"
          sx={{ fontSize: '1.2rem' }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box>
          {movies.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Movies
              </Typography>
              <ResponsiveGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={3}>
                {movies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ResponsiveGrid>
            </Box>
          )}

          {tvShows.length > 0 && (
            <Box>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                TV Shows
              </Typography>
              <ResponsiveGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={3}>
                {tvShows.map(show => (
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

