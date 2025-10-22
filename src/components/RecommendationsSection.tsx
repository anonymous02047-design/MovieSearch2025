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
  Chip,
  Button
} from '@mui/material';
import {
  Lightbulb as RecommendIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { tmdbApi, Movie } from '@/lib/tmdb';
import { TVShow } from './TVShowCard';
import MovieCard from './MovieCard';
import TVShowCard from './TVShowCard';
import ResponsiveGrid from './ResponsiveGrid';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useContinueWatching } from '@/hooks/useContinueWatching';

export default function RecommendationsSection() {
  const [recommendations, setRecommendations] = useState<(Movie | TVShow)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  
  const { watchlist, favorites } = useWatchlist();
  const { continueWatching } = useContinueWatching();

  useEffect(() => {
    loadRecommendations();
  }, [watchlist, favorites, continueWatching]);

  const loadRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      const allRecommendations: (Movie | TVShow)[] = [];
      
      // Get recommendations based on watchlist and favorites
      const sourceItems = [...favorites, ...watchlist].slice(0, 5);
      
      if (sourceItems.length > 0) {
        // Get recommendations for each item
        for (const item of sourceItems) {
          try {
            if (item.type === 'movie') {
              const recs = await tmdbApi.getRecommendedMovies(item.id);
              if (recs?.results) {
                allRecommendations.push(...recs.results.slice(0, 3).map((m: Movie) => ({ ...m, media_type: 'movie' as const })));
              }
            } else {
              const recs = await tmdbApi.getTVRecommendations(item.id);
              if (recs?.results) {
                allRecommendations.push(...recs.results.slice(0, 3).map((t: TVShow) => ({ ...t, media_type: 'tv' as const })));
              }
            }
          } catch (err) {
            console.error(`Error getting recommendations for ${item.id}:`, err);
          }
        }
      }
      
      // If no personalized recommendations, get trending
      if (allRecommendations.length === 0) {
        const [trendingMovies, trendingTV] = await Promise.all([
          tmdbApi.getTrendingMovies('week'),
          tmdbApi.getTrendingTV('week')
        ]);
        
        if (trendingMovies?.results) {
          allRecommendations.push(...trendingMovies.results.slice(0, 6).map((m: Movie) => ({ ...m, media_type: 'movie' as const })));
        }
        if (trendingTV?.results) {
          allRecommendations.push(...trendingTV.results.slice(0, 6).map((t: TVShow) => ({ ...t, media_type: 'tv' as const })));
        }
      }
      
      // Remove duplicates and limit to 12 items
      const uniqueRecs = Array.from(
        new Map(allRecommendations.map(item => [(item as any).id, item])).values()
      ).slice(0, 12);
      
      setRecommendations(uniqueRecs);
    } catch (err) {
      console.error('Error loading recommendations:', err);
      setError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  if (recommendations.length === 0 && !loading) {
    return null;
  }

  const isPersonalized = watchlist.length > 0 || favorites.length > 0;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 4,
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(135deg, ${alpha('#9c27b0', 0.1)} 0%, ${alpha('#e91e63', 0.05)} 100%)`
          : `linear-gradient(135deg, ${alpha('#9c27b0', 0.05)} 0%, ${alpha('#e91e63', 0.02)} 100%)`,
        border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RecommendIcon sx={{ color: 'secondary.main', fontSize: 32 }} />
          <Typography variant="h5" fontWeight={700}>
            {isPersonalized ? 'Recommended for You' : 'Trending Recommendations'}
          </Typography>
          {isPersonalized && (
            <Chip label="Personalized" size="small" color="secondary" variant="outlined" />
          )}
        </Box>
        <Button
          startIcon={<RefreshIcon />}
          onClick={loadRecommendations}
          variant="outlined"
          size="small"
        >
          Refresh
        </Button>
      </Box>

      {isPersonalized && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Based on your watchlist, favorites, and viewing history
        </Typography>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <ResponsiveGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={3}>
          {recommendations.map((item: any) => {
            const isMovie = item.media_type === 'movie' || item.title;
            return isMovie ? (
              <MovieCard key={`movie-${item.id}`} movie={item as Movie} />
            ) : (
              <TVShowCard key={`tv-${item.id}`} show={item as TVShow} />
            );
          })}
        </ResponsiveGrid>
      )}
    </Paper>
  );
}

