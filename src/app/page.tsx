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

import { useApiErrorHandler } from '@/hooks/useErrorHandler';
import { LoadingSpinner, LoadingSkeleton, RetryButton } from '@/components/LoadingStates';
import ErrorDisplay from '@/components/ErrorDisplay';
import SEO from '@/components/SEO';
import GradientHeading from '@/components/GradientHeading';
import ContentTypeSwitcher from '@/components/ContentTypeSwitcher';
import FilterPanel from '@/components/FilterPanel';
import CountryBanner from '@/components/CountryBanner';
import ContinueWatchingSection from '@/components/ContinueWatchingSection';
import TrendingSection from '@/components/TrendingSection';
import PopularByCountrySection from '@/components/PopularByCountrySection';
import NewReleasesSection from '@/components/NewReleasesSection';
import RecommendationsSection from '@/components/RecommendationsSection';
import QuickActions from '@/components/QuickActions';
import ScrollToTop from '@/components/ScrollToTop';
import { useDefaultShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useCountryDetection } from '@/hooks/useCountryDetection';
import { useContentFilter, ContentType } from '@/hooks/useContentFilter';
import { TVShow } from '@/components/TVShowCard';
import TVShowCard from '@/components/TVShowCard';

function HomeContent() {
  const { user } = useUser();
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchResults, setSearchResults] = useState<(Movie | TVShow)[]>([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showCountryBanner, setShowCountryBanner] = useState(true);
  const [availableGenres, setAvailableGenres] = useState<Array<{ id: number; name: string }>>([]);
  
  const { country: countryData, loading: countryLoading, refresh: refreshCountry } = useCountryDetection();
  const { filters, updateFilter, updateFilters, resetFilters } = useContentFilter();
  
  // Always initialize error handler - no conditional hooks
  const { error, loading, handleAsyncError, retry, isRetryable } = useApiErrorHandler();
  
  // Enable keyboard shortcuts
  useDefaultShortcuts();

  // User is guaranteed to be authenticated at this point

  // Load genres
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genresData = await tmdbApi.getGenres();
        setAvailableGenres(genresData.genres || []);
      } catch (err) {
        console.error('Error loading genres:', err);
      }
    };
    loadGenres();
  }, []);

  const loadContent = useCallback(async (page: number = 1, append: boolean = false) => {
    const result = await handleAsyncError(
      async () => {
        const allContent: (Movie | TVShow)[] = [];
        
        if (filters.contentType === 'all' || filters.contentType === 'movie') {
          const discoverParams: any = {
            page,
            sort_by: filters.sortBy,
          };
          
          if (filters.genres.length > 0) {
            discoverParams.with_genres = filters.genres.join(',');
          }
          if (filters.year) {
            discoverParams.year = filters.year;
          }
          if (filters.minRating) {
            discoverParams.vote_average_gte = filters.minRating;
          }
          if (filters.maxRating) {
            discoverParams.vote_average_lte = filters.maxRating;
          }
          if (filters.language) {
            discoverParams.with_original_language = filters.language;
          }
          if (countryData?.code) {
            discoverParams.region = countryData.code;
          }
          
          const movieResponse = await tmdbApi.discoverMovies(discoverParams);
          if (movieResponse && movieResponse.results) {
            allContent.push(...movieResponse.results.map((m: Movie) => ({ ...m, media_type: 'movie' as const })));
          }
        }
        
        if (filters.contentType === 'all' || filters.contentType === 'tv') {
          const tvResponse = await tmdbApi.getTrendingTV('week');
          if (tvResponse && tvResponse.results) {
            allContent.push(...tvResponse.results.slice(0, 10).map((t: TVShow) => ({ ...t, media_type: 'tv' as const })));
          }
        }
        
        if (allContent.length > 0) {
          return {
            content: allContent,
            totalPages: 1000,
            currentPage: page,
            hasMore: allContent.length >= 20,
          };
        }
        throw new Error('No content data received from API.');
      },
      'Home.loadContent'
    );

    if (result) {
      const movieResults = result.content.filter((item: any) => item.media_type === 'movie' || !item.media_type || item.title) as Movie[];
      const tvResults = result.content.filter((item: any) => item.media_type === 'tv' || item.name) as TVShow[];
      
      if (append) {
        setMovies(prev => [...prev, ...movieResults]);
        setTvShows(prev => [...prev, ...tvResults]);
      } else {
        setMovies(movieResults);
        setTvShows(tvResults);
      }
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
    }
  }, [handleAsyncError, filters, countryData]);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      loadContent();
      return;
    }

    // Check if user is authenticated
    if (!user) {
      console.log('Authentication required: Redirecting to sign-in page');
      setTimeout(() => {
        router.push('/sign-in');
      }, 100);
      return;
    }

    setSearchQuery(query);

    const result = await handleAsyncError(
      async () => {
        const allResults: (Movie | TVShow)[] = [];
        
        // Search movies
        const movieResponse = await tmdbApi.searchMovies({
          query: query.trim(),
          page: 1
        });
        
        if (movieResponse && movieResponse.results) {
          allResults.push(...movieResponse.results.map((m: Movie) => ({ ...m, media_type: 'movie' as const })));
        }

        // For TV shows, we can use trending as a substitute since TMDB search requires different endpoint
        // In production, you'd want to implement a proper TV search
        const tvResponse = await tmdbApi.getTrendingTV('week');
        if (tvResponse && tvResponse.results) {
          const filteredTV = tvResponse.results.filter((show: TVShow) => 
            show.name.toLowerCase().includes(query.toLowerCase())
          );
          allResults.push(...filteredTV.slice(0, 5).map((t: TVShow) => ({ ...t, media_type: 'tv' as const })));
        }

        if (allResults.length > 0) {
          return {
            results: allResults,
            totalPages: Math.ceil(allResults.length / 20),
            currentPage: 1,
          };
        }
        throw new Error('No content found for your search.');
      },
      'Home.handleSearch'
    );

    if (result) {
      setSearchResults(result.results);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
    }
  }, [handleAsyncError, loadContent, user, router]);

  const handleLoadMore = useCallback(async () => {
    if (currentPage >= totalPages) return;
    const nextPage = currentPage + 1;
    
    if (searchQuery) {
      // For search, just show what we have
      setCurrentPage(nextPage);
    } else {
      loadContent(nextPage, true);
    }
  }, [currentPage, totalPages, searchQuery, loadContent]);

  // Load content when filters or country changes
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');

    if (searchParam) {
      setSearchQuery(searchParam);
      handleSearch(searchParam);
    } else {
      loadContent();
    }
  }, [filters, countryData]);

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

  const displayMovies = searchQuery ? searchResults.filter((item: any) => item.title || (!item.name && !item.media_type)) : movies;
  const displayTVShows = searchQuery ? searchResults.filter((item: any) => item.name || item.media_type === 'tv') : tvShows;
  const hasMoreContent = currentPage < totalPages;

  return (
    <>
      <SEO
        title="Discover Your Next Favorite Movie & TV Show"
        description="Explore thousands of movies and TV shows with advanced search and filtering. Get personalized recommendations based on your country, read reviews, and discover your next favorite content."
        keywords={['movie discovery', 'movie search', 'tv shows', 'web series', 'film recommendations', 'movie database', 'cinema', 'streaming']}
        type="website"
      />
      {showWelcome && (
          <PostAuthWelcome onComplete={() => setShowWelcome(false)} />
        )}
        
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Country Banner */}
          {countryData && showCountryBanner && (
            <CountryBanner 
              countryData={countryData} 
              onRefresh={refreshCountry}
              onDismiss={() => setShowCountryBanner(false)}
            />
          )}

          {/* Welcome Message */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="body1" component="p" gutterBottom sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              fontSize: '14px',
            }}>
              🎬 Welcome back, {user?.firstName || 'Movie Lover'}!
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Discover your next favorite movie or TV show'}
            </Typography>
          </Box>

          {/* Continue Watching Section */}
          <ContinueWatchingSection />

          {/* Personalized Recommendations */}
          <RecommendationsSection />

          {/* Trending Section */}
          <TrendingSection />

          {/* Popular by Country Section */}
          <PopularByCountrySection />

          {/* New Releases Section */}
          <NewReleasesSection />

          {/* Content Type Switcher */}
          <ContentTypeSwitcher 
            value={filters.contentType}
            onChange={(value) => updateFilter('contentType', value)}
          />

          {/* Filter Panel */}
          <FilterPanel
            filters={filters}
            onFilterChange={updateFilters}
            onReset={resetFilters}
            availableGenres={availableGenres}
          />

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
                  loadContent();
                }}
                sx={{ height: 32 }}
              >
                Clear Search
              </Button>
            </Stack>
          )}

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

          {loading && !displayMovies.length && !displayTVShows.length ? (
            <ResponsiveGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={3}>
              {Array.from({ length: 8 }).map((_, index) => (
                <Box key={index} sx={{ aspectRatio: '2/3' }}>
                  <LoadingSkeleton type="card" count={1} />
                </Box>
              ))}
            </ResponsiveGrid>
          ) : (
            <>
              {/* Movies Section */}
              {(filters.contentType === 'all' || filters.contentType === 'movie') && displayMovies.length > 0 && (
                <Box sx={{ mb: 6 }}>
                  {filters.contentType === 'all' && (
                    <Typography variant="h5" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
                      Movies
                    </Typography>
                  )}
                  <ResponsiveGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={3}>
                    {displayMovies.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                  </ResponsiveGrid>
                </Box>
              )}

              {/* TV Shows Section */}
              {(filters.contentType === 'all' || filters.contentType === 'tv') && displayTVShows.length > 0 && (
                <Box sx={{ mb: 6 }}>
                  {filters.contentType === 'all' && (
                    <Typography variant="h5" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
                      TV Shows
                    </Typography>
                  )}
                  <ResponsiveGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={3}>
                    {displayTVShows.map((show) => (
                      <TVShowCard key={show.id} show={show} />
                    ))}
                  </ResponsiveGrid>
                </Box>
              )}

              {displayMovies.length === 0 && displayTVShows.length === 0 && !loading && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <MovieIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                  <Typography variant="h5" color="text.secondary" gutterBottom>
                    {searchQuery ? 'No content found for your search.' : 'No content available.'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {searchQuery ? 'Try searching with different keywords or browse popular content.' : 'Check back later for new releases.'}
                  </Typography>
                  {searchQuery && (
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                        loadContent();
                      }}
                      startIcon={<ClearIcon />}
                    >
                      Clear Search
                    </Button>
                  )}
                </Box>
              )}

              {hasMoreContent && (displayMovies.length > 0 || displayTVShows.length > 0) && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <RetryButton
                    onClick={handleLoadMore}
                    loading={loading}
                    isRetryable={isRetryable}
                    onRetry={retry}
                    buttonText="Load More Content"
                  />
                </Box>
              )}
            </>
          )}
        </Container>

        {/* Quick Actions FAB */}
        <QuickActions />

        {/* Scroll to Top Button */}
        <ScrollToTop />
      </>
  );
}

// Export the component wrapped with ProtectedRoute
export default function Home() {
  const { user, isLoaded } = useUser();
  
  // Always call useEffect at the top level - no conditional hooks
  React.useEffect(() => {
    if (isLoaded && !user) {
      window.location.href = '/welcome';
    }
  }, [isLoaded, user]);
  
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
  
  // If user is not authenticated, show redirecting message
  if (!user) {
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