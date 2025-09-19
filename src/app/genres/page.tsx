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
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
} from '@mui/material';
import {
  Movie as MovieIcon,
  Category as CategoryIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { tmdbApi, Movie, Genre } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import ResponsiveGrid from '@/components/ResponsiveGrid';
import RecaptchaProtection from '@/components/RecaptchaProtection';
import { useApiErrorHandler } from '@/hooks/useErrorHandler';
import { LoadingSpinner, LoadingSkeleton, RetryButton } from '@/components/LoadingStates';
import ErrorDisplay from '@/components/ErrorDisplay';
import SEO from '@/components/SEO';
import ProtectedRoute from '@/components/ProtectedRoute';

function GenresPageContent() {
  const { user } = useUser();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [genreMovies, setGenreMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [moviesLoading, setMoviesLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { error, handleError, clearError, isRetryable } = useApiErrorHandler();

  const loadGenres = useCallback(async () => {
    setLoading(true);
    clearError();
    try {
      const response = await tmdbApi.getGenres();
      if (response && response.genres) {
        setGenres(response.genres);
      }
    } catch (err) {
      handleError(err, 'Failed to load genres');
    } finally {
      setLoading(false);
    }
  }, [clearError, handleError]);

  const loadGenreMovies = useCallback(async (genreId: number, currentPage: number) => {
    setMoviesLoading(true);
    clearError();
    try {
      const response = await tmdbApi.getMoviesByGenre(genreId, currentPage);
      if (response && response.results) {
        setGenreMovies((prevMovies) => {
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
      handleError(err, 'Failed to load genre movies');
      setHasMore(false);
    } finally {
      setMoviesLoading(false);
    }
  }, [clearError, handleError]);

  const handleGenreSelect = (genre: Genre) => {
    setSelectedGenre(genre);
    setGenreMovies([]);
    setPage(1);
    setHasMore(true);
    loadGenreMovies(genre.id, 1);
  };

  const handleLoadMore = useCallback(() => {
    if (!moviesLoading && hasMore && selectedGenre) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [moviesLoading, hasMore, selectedGenre]);

  useEffect(() => {
    loadGenres();
  }, [loadGenres]);

  useEffect(() => {
    if (selectedGenre && page > 1) {
      loadGenreMovies(selectedGenre.id, page);
    }
  }, [page, selectedGenre, loadGenreMovies]);

  const isEmpty = genreMovies.length === 0 && !moviesLoading && !error && selectedGenre;

  return (
    <>
      <SEO
        title="Movie Genres"
        description="Explore movies by genre. Discover action, comedy, drama, horror, romance, and many more movie categories to find your perfect film."
        keywords={['movies', 'genres', 'categories', 'action', 'comedy', 'drama', 'horror', 'romance', 'cinema']}
      />
      <RecaptchaProtection action="genres" showStatus={false}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}>
              🎭 Movie Genres
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              Explore movies by genre and discover your next favorite film
            </Typography>
          </Box>

          {error && (
            <ErrorDisplay
              message={error.message}
              isRetryable={isRetryable}
              onRetry={() => {
                if (selectedGenre) {
                  loadGenreMovies(selectedGenre.id, page);
                } else {
                  loadGenres();
                }
              }}
            />
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <LoadingSpinner message="Loading genres..." />
            </Box>
          ) : (
            <>
              {/* Genre Selection */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                  Select a Genre
                </Typography>
                <Grid container spacing={2}>
                  {genres.map((genre) => (
                    <Grid item xs={6} sm={4} md={3} lg={2} key={genre.id}>
                      <Card 
                        sx={{ 
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 4,
                          },
                          ...(selectedGenre?.id === genre.id && {
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                          })
                        }}
                        onClick={() => handleGenreSelect(genre)}
                      >
                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                          <CategoryIcon sx={{ fontSize: 40, mb: 1 }} />
                          <Typography variant="body2" fontWeight="bold">
                            {genre.name}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Selected Genre Movies */}
              {selectedGenre && (
                <Box>
                  <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                    {selectedGenre.name} Movies
                  </Typography>

                  {isEmpty && (
                    <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                      <MovieIcon sx={{ fontSize: 80, mb: 2 }} />
                      <Typography variant="h5" gutterBottom>
                        No {selectedGenre.name.toLowerCase()} movies available at the moment.
                      </Typography>
                    </Box>
                  )}

                  <ResponsiveGrid>
                    {genreMovies.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                    {moviesLoading && (
                      Array.from({ length: 12 }).map((_, index) => (
                        <LoadingSkeleton key={index} type="card" />
                      ))
                    )}
                  </ResponsiveGrid>

                  {hasMore && !moviesLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                      <Button
                        variant="contained"
                        onClick={handleLoadMore}
                        disabled={moviesLoading}
                        startIcon={moviesLoading ? <CircularProgress size={20} color="inherit" /> : null}
                      >
                        {moviesLoading ? 'Loading More...' : 'Load More'}
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </>
          )}
        </Container>
      </RecaptchaProtection>
    </>
  );
}

export default function GenresPage() {
  return (
    <ProtectedRoute>
      <GenresPageContent />
    </ProtectedRoute>
  );
}