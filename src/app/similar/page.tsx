'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  TextField,
  InputAdornment,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Alert,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  Movie as MovieIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { tmdbApi, Movie } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import ResponsiveGrid from '@/components/ResponsiveGrid';
import EnhancedLoading from '@/components/EnhancedLoading';
import SEO from '@/components/SEO';

export const dynamic = 'force-dynamic';

export default function SimilarMoviesPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const movieId = searchParams.get('id');
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('similarity');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!user) {
      router.push('/sign-in');
      return;
    }

    if (movieId) {
      loadSimilarMovies(parseInt(movieId));
    } else {
      // Load popular movies as default
      loadPopularMovies();
    }
  }, [isLoaded, user, router, movieId, currentPage, sortBy]);

  const loadSimilarMovies = async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      // First get the movie details
      const movieDetails = await tmdbApi.getMovieDetails(id);
      setSelectedMovie(movieDetails);

      // Then get similar movies
      const response = await tmdbApi.getSimilarMovies(id, currentPage);
      setMovies(response.results || []);
      setTotalPages(response.total_pages || 1);
    } catch (err) {
      setError('Failed to load similar movies. Please try again later.');
      console.error('Error loading similar movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadPopularMovies = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await tmdbApi.getPopularMovies(currentPage);
      setMovies(response.results || []);
      setTotalPages(response.total_pages || 1);
    } catch (err) {
      setError('Failed to load movies. Please try again later.');
      console.error('Error loading movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.overview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    router.push(`/similar?id=${movie.id}`);
  };

  if (!isLoaded) {
    return <EnhancedLoading message="Loading..." fullScreen />;
  }

  if (!user) {
    return null; // Will redirect to sign-in
  }

  return (
    <>
      <SEO
        title="Similar Movies - MovieSearch 2025"
        description="Discover movies similar to your favorites. Find recommendations based on your movie preferences and viewing history."
        keywords={['similar movies', 'movie recommendations', 'suggested movies', 'movie discovery']}
      />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom className="fade-in">
            Similar Movies
          </Typography>
          <Typography variant="h6" color="text.secondary" className="fade-in stagger-1">
            Discover movies similar to your favorites
          </Typography>
        </Box>

        {selectedMovie && (
          <Card sx={{ mb: 4 }} className="fade-in stagger-2">
            <CardContent>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} sm={3} md={2}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={
                      selectedMovie.poster_path
                        ? `https://image.tmdb.org/t/p/w300${selectedMovie.poster_path}`
                        : '/placeholder-movie.jpg'
                    }
                    alt={selectedMovie.title}
                    sx={{ borderRadius: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={9} md={10}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Finding movies similar to: {selectedMovie.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {selectedMovie.overview}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {selectedMovie.genre_ids?.map((genreId) => (
                      <Chip
                        key={genreId}
                        label={`Genre ${genreId}`}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Search similar movies..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                className="fade-in stagger-3"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="similarity">Similarity</MenuItem>
                  <MenuItem value="popularity">Popularity</MenuItem>
                  <MenuItem value="rating">Rating</MenuItem>
                  <MenuItem value="release_date">Release Date</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <EnhancedLoading type="movie" message="Loading similar movies..." />
        ) : (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {filteredMovies.length} similar movies found
              </Typography>
            </Box>

            <ResponsiveGrid>
              {filteredMovies.map((movie, index) => (
                <Box
                  key={movie.id}
                  className="fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <MovieCard 
                    movie={movie} 
                    onMovieClick={() => handleMovieSelect(movie)}
                  />
                </Box>
              ))}
            </ResponsiveGrid>

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, page) => setCurrentPage(page)}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </>
  );
}
