'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import {
  Movie as MovieIcon,
  PlayArrow as PlayIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { tmdbApi, Movie } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import ResponsiveGrid from '@/components/ResponsiveGrid';

import { useApiErrorHandler } from '@/hooks/useErrorHandler';
import { LoadingSpinner, LoadingSkeleton, RetryButton } from '@/components/LoadingStates';
import ErrorDisplay from '@/components/ErrorDisplay';
import SEO from '@/components/SEO';
import ProtectedRoute from '@/components/ProtectedRoute';
// PageLayout is already provided by AdminLayoutWrapper

function NowPlayingPageContent() {
  const { user } = useUser();
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { error, handleError, clearError, isRetryable } = useApiErrorHandler();

  const loadNowPlayingMovies = useCallback(async (currentPage: number) => {
    setLoading(true);
    clearError();
    try {
      const response = await tmdbApi.getNowPlayingMovies(currentPage);
      if (response && response.results) {
        setNowPlayingMovies((prevMovies) => {
          const newMovies = response.results.filter(
            (newMovie) => !prevMovies.some((prevMovie) => prevMovie.id === newMovie.id)
          );
          return [...prevMovies, ...newMovies];
        });
        setHasMore(response.page < response.total_pages);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      handleError(err, 'Failed to load now playing movies');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [clearError, handleError]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    loadNowPlayingMovies(page);
  }, [page, loadNowPlayingMovies]);

  const isEmpty = nowPlayingMovies.length === 0 && !loading && !error;

  return (
    <>
      <SEO
        title="Now Playing Movies"
        description="Discover movies currently playing in theaters. Find the latest releases and new films that are now showing at cinemas near you."
        keywords={['movies', 'now playing', 'in theaters', 'new releases', 'cinema', 'latest movies']}
      />
      <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}>
              🎬 Now Playing Movies
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              Discover movies currently playing in theaters
            </Typography>
          </Box>

          {error && (
            <ErrorDisplay
              message={error.message}
              isRetryable={isRetryable}
              onRetry={() => loadNowPlayingMovies(page)}
            />
          )}

          {isEmpty && (
            <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
              <MovieIcon sx={{ fontSize: 80, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                No movies currently playing at the moment.
              </Typography>
            </Box>
          )}

          <ResponsiveGrid>
            {nowPlayingMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
            {loading && (
              Array.from({ length: 12 }).map((_, index) => (
                <LoadingSkeleton key={index} type="card" />
              ))
            )}
          </ResponsiveGrid>

          {hasMore && !loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                variant="contained"
                onClick={handleLoadMore}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading ? 'Loading More...' : 'Load More'}
              </Button>
            </Box>
          )}
        </Container>
      </>
  );
}

export default function NowPlayingPage() {
  return (
    <ProtectedRoute>
      <NowPlayingPageContent />
    </ProtectedRoute>
  );
}