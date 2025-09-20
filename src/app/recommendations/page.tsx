'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  Stack,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Grid,
} from '@mui/material';
import {
  Movie as MovieIcon,
  Star as StarIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { tmdbApi, Movie } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import ResponsiveGrid from '@/components/ResponsiveGrid';
import ProtectedRoute from '@/components/ProtectedRoute';
import SEO from '@/components/SEO';


function RecommendationsPageContent() {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [minRating, setMinRating] = useState<number>(6.0);
  const [availableGenres, setAvailableGenres] = useState<{ id: number; name: string }[]>([]);

  const loadGenres = async () => {
    try {
      const response = await tmdbApi.getGenres();
      setAvailableGenres(response.genres || []);
    } catch (err) {
      console.error('Error loading genres:', err);
    }
  };

  const loadRecommendations = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get personalized recommendations based on user preferences
      const [popularMovies, topRatedMovies, upcomingMovies] = await Promise.allSettled([
        tmdbApi.getPopularMovies(1),
        tmdbApi.getTopRatedMovies(1),
        tmdbApi.getUpcomingMovies(1),
      ]);

      let allMovies: Movie[] = [];

      if (popularMovies.status === 'fulfilled') {
        allMovies = [...allMovies, ...(popularMovies.value.results || [])];
      }
      if (topRatedMovies.status === 'fulfilled') {
        allMovies = [...allMovies, ...(topRatedMovies.value.results || [])];
      }
      if (upcomingMovies.status === 'fulfilled') {
        allMovies = [...allMovies, ...(upcomingMovies.value.results || [])];
      }

      // Filter and sort recommendations
      const filteredMovies = allMovies.filter(movie => {
        const matchesGenre = selectedGenres.length === 0 || 
          movie.genre_ids.some(id => selectedGenres.includes(id));
        const matchesYear = movie.release_date ? 
          new Date(movie.release_date).getFullYear() >= selectedYear - 2 : true;
        const matchesRating = movie.vote_average >= minRating;
        
        return matchesGenre && matchesYear && matchesRating;
      });

      // Remove duplicates and sort by rating
      const uniqueMovies = filteredMovies.filter((movie, index, self) => 
        index === self.findIndex(m => m.id === movie.id)
      );

      uniqueMovies.sort((a, b) => b.vote_average - a.vote_average);
      
      setRecommendations(uniqueMovies.slice(0, 20));
    } catch (err) {
      setError('Failed to load recommendations. Please try again.');
      console.error('Error loading recommendations:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedGenres, selectedYear, minRating]);

  useEffect(() => {
    loadRecommendations();
    loadGenres();
  }, [loadRecommendations]);

  const handleGenreChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedGenres(event.target.value as number[]);
  };

  const handleYearChange = (event: Event, newValue: number | number[]) => {
    setSelectedYear(newValue as number);
  };

  const handleRatingChange = (event: Event, newValue: number | number[]) => {
    setMinRating(newValue as number);
  };

  const handleRefresh = () => {
    loadRecommendations();
  };

  return (
    <>
      <SEO
        title="Movie Recommendations"
        description="Get personalized movie recommendations based on your preferences. Discover new films tailored to your taste."
        keywords={['movie recommendations', 'personalized movies', 'movie suggestions', 'film recommendations', 'movie discovery']}
      />
      <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          🎬 Personalized Recommendations
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Discover your next favorite movie based on your preferences
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <FilterIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ color: 'white' }}>
            Customize Your Recommendations
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: 'white' }}>Genres</InputLabel>
              <Select
                multiple
                value={selectedGenres}
                onChange={handleGenreChange}
                sx={{ 
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' }
                }}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const genre = availableGenres.find(g => g.id === value);
                      return (
                        <Chip 
                          key={value} 
                          label={genre?.name || value} 
                          size="small" 
                          sx={{ color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {availableGenres.map((genre) => (
                  <MenuItem key={genre.id} value={genre.id}>
                    {genre.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography gutterBottom sx={{ color: 'white' }}>
              Release Year: {selectedYear}
            </Typography>
            <Slider
              value={selectedYear}
              onChange={handleYearChange}
              min={1990}
              max={2024}
              step={1}
              sx={{ color: 'primary.main' }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography gutterBottom sx={{ color: 'white' }}>
              Minimum Rating: {minRating}
            </Typography>
            <Slider
              value={minRating}
              onChange={handleRatingChange}
              min={0}
              max={10}
              step={0.1}
              sx={{ color: 'primary.main' }}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{ 
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF5252, #26A69A)',
              }
            }}
          >
            Refresh Recommendations
          </Button>
        </Box>
      </Paper>

      {/* Recommendations */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={60} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : (
        <>
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" gutterBottom>
              Your Personalized Recommendations ({recommendations.length})
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip 
                icon={<MovieIcon />} 
                label={`${recommendations.length} Movies`} 
                color="primary" 
                variant="outlined" 
              />
              <Chip 
                icon={<StarIcon />} 
                label={`Avg Rating: ${recommendations.length > 0 ? (recommendations.reduce((sum, movie) => sum + movie.vote_average, 0) / recommendations.length).toFixed(1) : '0.0'}`} 
                color="secondary" 
                variant="outlined" 
              />
            </Stack>
          </Box>

          {recommendations.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No recommendations found with your current filters
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Try adjusting your preferences or clearing some filters
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  setSelectedGenres([]);
                  setSelectedYear(2024);
                  setMinRating(6.0);
                }}
              >
                Clear All Filters
              </Button>
            </Box>
          ) : (
            <ResponsiveGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={3}>
              {recommendations && recommendations.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ResponsiveGrid>
          )}
        </>
      )}
        </Container>
      </>
  );
}

export default function RecommendationsPage() {
  return (
    <ProtectedRoute>
      <RecommendationsPageContent />
    </ProtectedRoute>
  );
}
