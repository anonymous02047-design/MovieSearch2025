'use client';

import React, { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Stack,
  Paper,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  CalendarToday as CalendarIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { tmdbApi, Movie } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import ResponsiveGrid from '@/components/ResponsiveGrid';
import { getImageUrl, formatDate } from '@/lib/tmdb';
import ProtectedRoute from '@/components/ProtectedRoute';

function UpcomingMoviesPageContent() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadUpcomingMovies();
  }, []);

  const loadUpcomingMovies = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await tmdbApi.getUpcomingMovies(page);
      if (page === 1) {
        setMovies(response.results);
      } else {
        setMovies(prev => [...prev, ...response.results]);
      }
      setTotalPages(response.total_pages);
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to load upcoming movies. Please try again.');
      console.error('Error loading upcoming movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      loadUpcomingMovies(currentPage + 1);
    }
  };

  const hasMoreMovies = currentPage < totalPages;
  const currentDate = new Date();
  const nextMonthMovies = movies.filter(movie => {
    if (!movie.release_date) return false;
    const releaseDate = new Date(movie.release_date);
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return releaseDate <= nextMonth && releaseDate > currentDate;
  });

  const highlyAnticipated = movies
    .filter(movie => movie.vote_average >= 7.0)
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 4);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Paper
        sx={{
          background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
          color: 'white',
          p: 4,
          mb: 4,
          borderRadius: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ScheduleIcon sx={{ fontSize: 40, mr: 2 }} />
          <Box>
            <Typography variant="h3" component="h1" gutterBottom>
              Upcoming Movies
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Discover the most anticipated movies coming to theaters soon
            </Typography>
          </Box>
        </Box>
        
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Chip
            icon={<CalendarIcon />}
            label={`${movies.length} Movies`}
            variant="outlined"
            sx={{ color: 'white', borderColor: 'white' }}
          />
          <Chip
            icon={<StarIcon />}
            label="Coming Soon"
            variant="outlined"
            sx={{ color: 'white', borderColor: 'white' }}
          />
        </Stack>
      </Paper>

      {/* Highly Anticipated Movies */}
      {highlyAnticipated.length > 0 && (
        <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' }}>
          <Typography variant="h5" gutterBottom sx={{ color: 'white', mb: 3 }}>
            🔥 Highly Anticipated
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            {highlyAnticipated && highlyAnticipated.map((movie) => (
              <Box key={movie.id}>
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
                    },
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  <CardMedia
                    component="img"
                    image={getImageUrl(movie.poster_path, 'w300')}
                    alt={movie.title}
                    sx={{ aspectRatio: '2/3' }}
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <StarIcon sx={{ color: '#ffd700', fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2" sx={{ color: '#ffd700', fontWeight: 'bold' }}>
                        {movie.vote_average.toFixed(1)}
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                      {movie.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {movie.release_date && formatDate(movie.release_date)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        color: 'text.secondary',
                      }}
                    >
                      {movie.overview}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Paper>
      )}

      {/* Next Month Releases */}
      {nextMonthMovies.length > 0 && (
        <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' }}>
          <Typography variant="h5" gutterBottom sx={{ color: 'white', mb: 3 }}>
            📅 Next Month Releases
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3 }}>
            {nextMonthMovies && nextMonthMovies.slice(0, 6).map((movie) => (
              <Box key={movie.id}>
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    },
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  <CardMedia
                    component="img"
                    image={getImageUrl(movie.poster_path, 'w300')}
                    alt={movie.title}
                    sx={{ aspectRatio: '2/3' }}
                  />
                  <CardContent sx={{ p: 1.5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        fontSize: '0.8rem',
                      }}
                    >
                      {movie.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {movie.release_date && formatDate(movie.release_date)}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Paper>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading && movies.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            All Upcoming Movies
          </Typography>
          
          <ResponsiveGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={3}>
            {movies && movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </ResponsiveGrid>

          {movies.length === 0 && !loading && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No movies found.
              </Typography>
            </Box>
          )}

          {hasMoreMovies && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                variant="contained"
                onClick={handleLoadMore}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
                size="large"
              >
                Load More Movies
              </Button>
            </Box>
          )}
        </>
      )}
      </Container>
  );
}

export default function UpcomingMoviesPage() {
  return (
    <ProtectedRoute>
      <UpcomingMoviesPageContent />
    </ProtectedRoute>
  );
}
