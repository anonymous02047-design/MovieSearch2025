'use client';

import React, { useState, useEffect, useCallback } from 'react';

export const dynamic = 'force-dynamic';
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
  Star as StarIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { tmdbApi, Movie } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import ResponsiveGrid from '@/components/ResponsiveGrid';

import { useApiErrorHandler } from '@/hooks/useErrorHandler';
import { LoadingSkeleton } from '@/components/LoadingStates';
import ErrorDisplay from '@/components/ErrorDisplay';
import SEO from '@/components/SEO';
import ProtectedRoute from '@/components/ProtectedRoute';
// PageLayout is already provided by AdminLayoutWrapper

function TopRatedPageContent() {
  const { user } = useUser();
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { error, handleError, clearError, isRetryable } = useApiErrorHandler();

  const loadTopRatedMovies = useCallback(async (currentPage: number) => {
    setLoading(true);
    clearError();
    try {
      const response = await tmdbApi.getTopRatedMovies(currentPage);
      if (response && response.results) {
        setTopRatedMovies((prevMovies) => {
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
      handleError(err, 'Failed to load top rated movies');
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
    loadTopRatedMovies(page);
  }, [page, loadTopRatedMovies]);

  const isEmpty = topRatedMovies.length === 0 && !loading && !error;

  return (
    <>
      <SEO
        title="Top Rated Movies"
        description="Discover the highest rated movies of all time. Find critically acclaimed films that have earned the highest ratings from audiences and critics."
        keywords={['movies', 'top rated', 'highest rated', 'critically acclaimed', 'best movies', 'cinema']}
      />
      <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}>
              ⭐ Top Rated Movies
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              Discover the highest rated movies of all time
            </Typography>
          </Box>

          {error && (
            <ErrorDisplay
              message={error.message}
              isRetryable={isRetryable}
              onRetry={() => loadTopRatedMovies(page)}
            />
          )}

          {isEmpty && (
            <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
              <MovieIcon sx={{ fontSize: 80, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                No top rated movies available at the moment.
              </Typography>
            </Box>
          )}

          <ResponsiveGrid>
            {topRatedMovies.map((movie) => (
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

export default function TopRatedPage() {
  return (
    <ProtectedRoute>
      <TopRatedPageContent />
    </ProtectedRoute>
  );
}