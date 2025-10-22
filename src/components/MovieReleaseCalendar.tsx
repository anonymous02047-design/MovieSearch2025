'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  Movie as MovieIcon,
} from '@mui/icons-material';
import { Movie, getImageUrl, formatDate } from '@/lib/tmdb';
import { useRouter } from 'next/navigation';

interface MovieReleaseCalendarProps {
  region?: string;
}

export default function MovieReleaseCalendar({ region = 'US' }: MovieReleaseCalendarProps) {
  const router = useRouter();
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('month');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUpcomingMovies();
  }, [timeframe, region]);

  const getDateRange = () => {
    const now = new Date();
    const start = new Date(now);
    let end = new Date(now);

    switch (timeframe) {
      case 'week':
        end.setDate(end.getDate() + 7);
        break;
      case 'month':
        end.setMonth(end.getMonth() + 1);
        break;
      case 'quarter':
        end.setMonth(end.getMonth() + 3);
        break;
    }

    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  };

  const fetchUpcomingMovies = async () => {
    setLoading(true);
    setError(null);

    try {
      const { start, end } = getDateRange();

      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?` +
          `api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}` +
          `&region=${region}` +
          `&primary_release_date.gte=${start}` +
          `&primary_release_date.lte=${end}` +
          `&sort_by=popularity.desc` +
          `&with_release_type=2|3`
      );

      if (!response.ok) throw new Error('Failed to fetch upcoming movies');

      const data = await response.json();
      setMovies(data.results || []);
    } catch (err) {
      setError('Failed to load upcoming releases');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const groupMoviesByMonth = () => {
    const grouped: Record<string, Movie[]> = {};

    movies.forEach((movie) => {
      const date = new Date(movie.release_date);
      const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(movie);
    });

    return grouped;
  };

  const groupedMovies = groupMoviesByMonth();

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <CalendarIcon color="primary" />
          <Typography variant="h5">Upcoming Releases</Typography>
        </Box>

        <ToggleButtonGroup
          value={timeframe}
          exclusive
          onChange={(e, value) => value && setTimeframe(value)}
          size="small"
        >
          <ToggleButton value="week">This Week</ToggleButton>
          <ToggleButton value="month">This Month</ToggleButton>
          <ToggleButton value="quarter">Next 3 Months</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Movies List */}
      {!loading && !error && Object.keys(groupedMovies).length === 0 && (
        <Alert severity="info">No upcoming releases found for this period.</Alert>
      )}

      {!loading && !error && Object.entries(groupedMovies).map(([month, monthMovies]) => (
        <Box key={month} mb={4}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MovieIcon fontSize="small" />
            {month}
            <Chip label={`${monthMovies.length} movies`} size="small" />
          </Typography>

          <Grid container spacing={2}>
            {monthMovies.map((movie) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' },
                  }}
                  onClick={() => router.push(`/movie/${movie.id}`)}
                >
                  <CardMedia
                    component="img"
                    height="300"
                    image={getImageUrl(movie.poster_path, 'w500')}
                    alt={movie.title}
                  />
                  <CardContent>
                    <Typography variant="subtitle1" noWrap fontWeight="bold">
                      {movie.title}
                    </Typography>
                    <Chip
                      label={formatDate(movie.release_date)}
                      size="small"
                      color="primary"
                      sx={{ mt: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      ⭐ {movie.vote_average > 0 ? movie.vote_average.toFixed(1) : 'Not rated yet'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
}

