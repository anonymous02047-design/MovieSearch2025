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
  Tabs,
  Tab,
} from '@mui/material';
import {
  Movie as MovieIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
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


function PopularPageContent() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState(0);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { error, handleError, clearError, isRetryable } = useApiErrorHandler();

  const loadMovies = useCallback(async (type: 'popular' | 'top_rated' | 'now_playing', currentPage: number) => {
    setLoading(true);
    clearError();
    try {
      let response;
      switch (type) {
        case 'popular':
          response = await tmdbApi.getPopularMovies(currentPage);
          break;
        case 'top_rated':
          response = await tmdbApi.getTopRatedMovies(currentPage);
          break;
        case 'now_playing':
          response = await tmdbApi.getNowPlayingMovies(currentPage);
          break;
      }

      if (response && response.results) {
        const setter = type === 'popular' ? setPopularMovies : 
                      type === 'top_rated' ? setTopRatedMovies : setNowPlayingMovies;
        
        setter((prevMovies) => {
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
      handleError(err, `Failed to load ${type.replace('_', ' ')} movies`);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [clearError, handleError]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      const type = activeTab === 0 ? 'popular' : activeTab === 1 ? 'top_rated' : 'now_playing';
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading, hasMore, activeTab]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setPage(1);
    setHasMore(true);
    
    // Load movies for the selected tab if not already loaded
    const type = newValue === 0 ? 'popular' : newValue === 1 ? 'top_rated' : 'now_playing';
    const movies = newValue === 0 ? popularMovies : newValue === 1 ? topRatedMovies : nowPlayingMovies;
    
    if (movies.length === 0) {
      loadMovies(type, 1);
    }
  };

  useEffect(() => {
    // Load popular movies by default
    loadMovies('popular', page);
  }, [page, loadMovies]);

  const getCurrentMovies = () => {
    switch (activeTab) {
      case 0: return popularMovies;
      case 1: return topRatedMovies;
      case 2: return nowPlayingMovies;
      default: return popularMovies;
    }
  };

  const getCurrentTitle = () => {
    switch (activeTab) {
      case 0: return 'Popular Movies';
      case 1: return 'Top Rated Movies';
      case 2: return 'Now Playing Movies';
      default: return 'Popular Movies';
    }
  };

  const currentMovies = getCurrentMovies();
  const isEmpty = currentMovies.length === 0 && !loading && !error;

  return (
    <>
      <SEO
        title={getCurrentTitle()}
        description="Discover the most popular, top-rated, and now playing movies. Find your next favorite film from our curated collection."
        keywords={['movies', 'popular', 'top rated', 'now playing', 'trending', 'cinema']}
      />
      <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}>
              🎬 {getCurrentTitle()}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              Discover the best movies everyone's talking about
            </Typography>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
            <Tabs value={activeTab} onChange={handleTabChange} centered>
              <Tab 
                label="Popular" 
                icon={<TrendingUpIcon />} 
                iconPosition="start"
                sx={{ textTransform: 'none', fontWeight: 600 }}
              />
              <Tab 
                label="Top Rated" 
                icon={<StarIcon />} 
                iconPosition="start"
                sx={{ textTransform: 'none', fontWeight: 600 }}
              />
              <Tab 
                label="Now Playing" 
                icon={<MovieIcon />} 
                iconPosition="start"
                sx={{ textTransform: 'none', fontWeight: 600 }}
              />
            </Tabs>
          </Box>

          {error && (
            <ErrorDisplay
              message={error.message}
              isRetryable={isRetryable}
              onRetry={() => {
                const type = activeTab === 0 ? 'popular' : activeTab === 1 ? 'top_rated' : 'now_playing';
                loadMovies(type, page);
              }}
            />
          )}

          {isEmpty && (
            <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
              <MovieIcon sx={{ fontSize: 80, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                No movies available at the moment.
              </Typography>
            </Box>
          )}

          <ResponsiveGrid>
            {currentMovies.map((movie) => (
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

export default function PopularPage() {
  return (
    <ProtectedRoute>
      <PopularPageContent />
    </ProtectedRoute>
  );
}