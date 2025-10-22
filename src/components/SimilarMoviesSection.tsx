'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
} from '@mui/material';
import {
  ArrowForward as ArrowIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { Movie, getImageUrl, formatDate } from '@/lib/tmdb';

interface SimilarMoviesSectionProps {
  movieId: number;
  maxResults?: number;
}

export default function SimilarMoviesSection({ movieId, maxResults = 6 }: SimilarMoviesSectionProps) {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSimilarMovies();
  }, [movieId]);

  const fetchSimilarMovies = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=1`
      );

      if (!response.ok) throw new Error('Failed to fetch similar movies');

      const data = await response.json();
      setMovies(data.results?.slice(0, maxResults) || []);
    } catch (err) {
      setError('Failed to load similar movies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (movies.length === 0) {
    return null;
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Similar Movies
        </Typography>
        <Chip label={`${movies.length} movies`} />
      </Box>

      <Grid container spacing={2}>
        {movies.map((movie) => (
          <Grid item xs={6} sm={4} md={2} key={movie.id}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                },
              }}
              onClick={() => router.push(`/movie/${movie.id}`)}
            >
              <Box position="relative">
                <CardMedia
                  component="img"
                  height="240"
                  image={getImageUrl(movie.poster_path, 'w342')}
                  alt={movie.title}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(0,0,0,0.8)',
                    borderRadius: 1,
                    px: 1,
                    py: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <StarIcon sx={{ fontSize: 16, color: 'gold' }} />
                  <Typography variant="caption" color="white" fontWeight="bold">
                    {movie.vote_average.toFixed(1)}
                  </Typography>
                </Box>
              </Box>
              <CardContent>
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  noWrap
                  title={movie.title}
                >
                  {movie.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(movie.release_date)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {movies.length === maxResults && (
        <Box display="flex" justifyContent="center" mt={3}>
          <IconButton
            color="primary"
            onClick={() => router.push(`/discover?similar=${movieId}`)}
            sx={{
              border: 1,
              borderColor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.main',
                color: 'white',
              },
            }}
          >
            <ArrowIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}

