'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
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
  AccountCircle as AccountIcon,
  Star as StarIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { tmdbApi, Movie } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import ResponsiveGrid from '@/components/ResponsiveGrid';
import PostAuthWelcome from '@/components/PostAuthWelcome';
import RecaptchaProtection from '@/components/RecaptchaProtection';
import { useApiErrorHandler } from '@/hooks/useErrorHandler';
import { LoadingSpinner, LoadingSkeleton, RetryButton } from '@/components/LoadingStates';
import ErrorDisplay from '@/components/ErrorDisplay';
import SEO from '@/components/SEO';
import GradientHeading from '@/components/GradientHeading';

function HomeContent() {
  const { user } = useUser();
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [showWelcome, setShowWelcome] = useState(false);
  
  // Always initialize error handler - no conditional hooks
  const { error, loading, handleAsyncError, retry, isRetryable } = useApiErrorHandler();

  // User is guaranteed to be authenticated at this point

  const loadPopularMovies = useCallback(async (page: number = 1, append: boolean = false) => {
    const result = await handleAsyncError(
      async () => {
        // Load multiple pages to get 27 movies initially
        const pagesToLoad = page === 1 ? 2 : 1; // Load 2 pages initially (40 movies), then 1 page at a time
        const allMovies: Movie[] = [];
        
        for (let p = page; p < page + pagesToLoad; p++) {
          const response = await tmdbApi.getPopularMovies(p);
          if (response && response.results) {
            allMovies.push(...response.results);
          }
        }
        
        if (allMovies.length > 0) {
          return {
            movies: allMovies,
            totalPages: 1000, // TMDB has many pages, we'll limit to reasonable number
            currentPage: page + pagesToLoad - 1,
            hasMore: allMovies.length >= 20, // Check if we got a full page
          };
        }
        throw new Error('No movies data received from API.');
      },
      'Home.loadPopularMovies'
    );

    if (result) {
      if (append) {
        setMovies(prev => [...prev, ...result.movies]);
      } else {
        setMovies(result.movies);
      }
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
    }
  }, [handleAsyncError]);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      loadPopularMovies();
      return;
    }

    // Check if user is authenticated
    if (!user) {
      // Show a brief message and then redirect
      console.log('Authentication required: Redirecting to sign-in page');
      
      // Small delay to ensure user sees the action
      setTimeout(() => {
        router.push('/sign-in');
      }, 100);
      return;
    }

    setSearchQuery(query);

    const result = await handleAsyncError(
      async () => {
        const response = await tmdbApi.searchMovies({
          query: query.trim(),
          page: 1
        });

        if (response && response.results) {
          return {
            results: response.results,
            totalPages: response.total_pages || 1,
            currentPage: 1,
          };
        }
        throw new Error('No movies found for your search.');
      },
      'Home.handleSearch'
    );

    if (result) {
      setSearchResults(result.results);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
    }
  }, [handleAsyncError, loadPopularMovies, user]);

  const handleLoadMore = useCallback(async () => {
    if (currentPage >= totalPages) return;

    const nextPage = currentPage + 1;
    
    if (searchQuery) {
      const result = await handleAsyncError(
        async () => {
          const response = await tmdbApi.searchMovies({
            query: searchQuery,
            page: nextPage
          });
          if (response && response.results) {
            return response.results;
          }
          throw new Error('No more search results found.');
        },
        'Home.handleLoadMore.search'
      );

      if (result) {
        setSearchResults(prev => [...prev, ...result]);
        setCurrentPage(nextPage);
      }
    } else {
      const result = await handleAsyncError(
        async () => {
          const response = await tmdbApi.getPopularMovies(nextPage);
          if (response && response.results) {
            return response.results;
          }
          throw new Error('No more movies found.');
        },
        'Home.handleLoadMore.popular'
      );

      if (result) {
        setMovies(prev => [...prev, ...result]);
        setCurrentPage(nextPage);
      }
    }
  }, [currentPage, totalPages, searchQuery, handleAsyncError]);

  // Load popular movies on component mount
  useEffect(() => {
    // Check for search parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');

    if (searchParam) {
      setSearchQuery(searchParam);
      handleSearch(searchParam);
    } else {
      loadPopularMovies();
    }
  }, [handleSearch, loadPopularMovies]);

  // Show welcome tour for new users
  useEffect(() => {
    if (user) {
      // Check if this is a new user (created within last 5 minutes)
      const userCreatedAt = new Date(user.createdAt);
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

      if (userCreatedAt > fiveMinutesAgo) {
        setShowWelcome(true);
      }
    }
  }, [user]);

  // Remove authentication loading check since ProtectedRoute handles this

  const displayMovies = searchQuery ? searchResults : movies;
  const hasMoreMovies = currentPage < totalPages;

  return (
    <>
      <SEO
        title="Discover Your Next Favorite Movie"
        description="Explore thousands of movies with advanced search and filtering. Get personalized recommendations, read reviews, and discover your next favorite film."
        keywords={['movie discovery', 'movie search', 'film recommendations', 'movie database', 'cinema']}
        type="website"
      />
      <RecaptchaProtection action="home" showStatus={false}>
        {showWelcome && (
          <PostAuthWelcome onComplete={() => setShowWelcome(false)} />
        )}
        
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="body1" component="p" gutterBottom sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              fontSize: '14px',
            }}>
              🎬 Welcome back, {user?.firstName || 'Movie Lover'}!
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Discover your next favorite movie'}
            </Typography>
            
            
            {searchQuery && (
              <Stack direction="row" spacing={1} sx={{ mb: 2, justifyContent: 'center' }}>
                <Chip
                  label={`${searchResults.length} results`}
                  color="primary"
                  variant="outlined"
                  sx={{ fontSize: '0.875rem', height: 32 }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    loadPopularMovies();
                  }}
                  sx={{ height: 32 }}
                >
                  Clear Search
                </Button>
              </Stack>
            )}
          </Box>

          {error && (
            <Box sx={{ mb: 3 }}>
              <ErrorDisplay 
                error={error} 
                severity="error" 
                showRetry={isRetryable}
                onRetry={retry}
                dismissible={true}
              />
            </Box>
          )}

          {loading && !displayMovies.length ? (
            <ResponsiveGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={3}>
              {Array.from({ length: 8 }).map((_, index) => (
                <Box key={index} sx={{ aspectRatio: '2/3' }}>
                  <LoadingSkeleton type="card" count={1} />
                </Box>
              ))}
            </ResponsiveGrid>
          ) : (
            <>
              <ResponsiveGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={3}>
                {displayMovies && displayMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ResponsiveGrid>

              {displayMovies.length === 0 && !loading && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <MovieIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                  <Typography variant="h5" color="text.secondary" gutterBottom>
                    {searchQuery ? 'No movies found for your search.' : 'No movies available.'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {searchQuery ? 'Try searching with different keywords or browse popular movies.' : 'Check back later for new releases.'}
                  </Typography>
                  {searchQuery && (
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                        loadPopularMovies();
                      }}
                      startIcon={<ClearIcon />}
                    >
                      Clear Search
                    </Button>
                  )}
                </Box>
              )}

              {hasMoreMovies && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <RetryButton
                    onClick={handleLoadMore}
                    loading={loading}
                    isRetryable={isRetryable}
                    onRetry={retry}
                    buttonText="Load More Movies"
                  />
                </Box>
              )}
            </>
          )}
        </Container>
      </RecaptchaProtection>
    </>
  );
}

// Export the component wrapped with ProtectedRoute
export default function Home() {
  const { user, isLoaded } = useUser();
  
  // Show loading while checking authentication
  if (!isLoaded) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <LoadingSpinner message="Loading..." />
      </Box>
    );
  }
  
  // If user is not authenticated, redirect to welcome page
  if (!user) {
    // Use useEffect to redirect to avoid hydration issues
    React.useEffect(() => {
      window.location.href = '/welcome';
    }, []);
    
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <LoadingSpinner message="Redirecting to welcome page..." />
      </Box>
    );
  }
  
  // If user is authenticated, show the main content
  return <HomeContent />;
}