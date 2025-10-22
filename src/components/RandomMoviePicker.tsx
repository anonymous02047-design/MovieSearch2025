'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  Casino as DiceIcon,
  Star as StarIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { Movie, getImageUrl, formatDate } from '@/lib/tmdb';
import { getGenreNames } from '@/lib/genres';

interface RandomMoviePickerProps {
  open: boolean;
  onClose: () => void;
}

export default function RandomMoviePicker({ open, onClose }: RandomMoviePickerProps) {
  const router = useRouter();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter options
  const [genre, setGenre] = useState<number | 'any'>('any');
  const [minRating, setMinRating] = useState<number>(0);
  const [yearRange, setYearRange] = useState<string>('all');

  const genres = [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 18, name: 'Drama' },
    { id: 14, name: 'Fantasy' },
    { id: 27, name: 'Horror' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Sci-Fi' },
    { id: 53, name: 'Thriller' },
  ];

  const yearRanges = [
    { value: 'all', label: 'All Time' },
    { value: '2020s', label: '2020s', start: 2020, end: 2024 },
    { value: '2010s', label: '2010s', start: 2010, end: 2019 },
    { value: '2000s', label: '2000s', start: 2000, end: 2009 },
    { value: '90s', label: '1990s', start: 1990, end: 1999 },
    { value: 'classic', label: 'Classic (Before 1990)', start: 1900, end: 1989 },
  ];

  const pickRandomMovie = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build query parameters
      const params = new URLSearchParams({
        api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY || '',
        page: String(Math.floor(Math.random() * 20) + 1), // Random page 1-20
        sort_by: 'popularity.desc',
        'vote_count.gte': '100',
      });

      if (genre !== 'any') {
        params.append('with_genres', String(genre));
      }

      if (minRating > 0) {
        params.append('vote_average.gte', String(minRating));
      }

      const selectedRange = yearRanges.find((r) => r.value === yearRange);
      if (selectedRange && 'start' in selectedRange) {
        params.append('primary_release_date.gte', `${selectedRange.start}-01-01`);
        params.append('primary_release_date.lte', `${selectedRange.end}-12-31`);
      }

      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        // Pick random movie from results
        const randomIndex = Math.floor(Math.random() * data.results.length);
        setSelectedMovie(data.results[randomIndex]);
      } else {
        setError('No movies found with these criteria. Try adjusting the filters.');
      }
    } catch (err) {
      setError('Failed to fetch random movie. Please try again.');
      console.error('Error fetching random movie:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMovie = () => {
    if (selectedMovie) {
      router.push(`/movie/${selectedMovie.id}`);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <DiceIcon color="primary" />
            <Typography variant="h6">Random Movie Picker</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Filters */}
        <Stack spacing={2} mb={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Genre</InputLabel>
            <Select
              value={genre}
              label="Genre"
              onChange={(e) => setGenre(e.target.value as number | 'any')}
            >
              <MenuItem value="any">Any Genre</MenuItem>
              {genres.map((g) => (
                <MenuItem key={g.id} value={g.id}>
                  {g.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Minimum Rating</InputLabel>
            <Select
              value={minRating}
              label="Minimum Rating"
              onChange={(e) => setMinRating(Number(e.target.value))}
            >
              <MenuItem value={0}>Any Rating</MenuItem>
              <MenuItem value={5}>5+ Stars</MenuItem>
              <MenuItem value={6}>6+ Stars</MenuItem>
              <MenuItem value={7}>7+ Stars</MenuItem>
              <MenuItem value={8}>8+ Stars</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Time Period</InputLabel>
            <Select
              value={yearRange}
              label="Time Period"
              onChange={(e) => setYearRange(e.target.value)}
            >
              {yearRanges.map((range) => (
                <MenuItem key={range.value} value={range.value}>
                  {range.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {/* Loading State */}
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Selected Movie */}
        {!loading && !error && selectedMovie && (
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={getImageUrl(selectedMovie.poster_path, 'w500')}
              alt={selectedMovie.title}
            />
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {selectedMovie.title}
              </Typography>

              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <StarIcon sx={{ color: 'gold' }} />
                <Typography variant="h6">{selectedMovie.vote_average.toFixed(1)}</Typography>
                <Typography variant="body2" color="text.secondary">
                  ({selectedMovie.vote_count.toLocaleString()} votes)
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} mb={2} flexWrap="wrap" useFlexGap>
                <Chip label={formatDate(selectedMovie.release_date)} size="small" />
                {selectedMovie.genre_ids &&
                  getGenreNames(selectedMovie.genre_ids)
                    .slice(0, 3)
                    .map((genreName) => (
                      <Chip key={genreName} label={genreName} size="small" variant="outlined" />
                    ))}
              </Stack>

              <Typography variant="body2" color="text.secondary">
                {selectedMovie.overview}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Initial State */}
        {!loading && !error && !selectedMovie && (
          <Box textAlign="center" py={4}>
            <DiceIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Ready to Discover?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click the button below to find a random movie based on your preferences!
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {selectedMovie && (
          <Button startIcon={<ViewIcon />} onClick={handleViewMovie} variant="contained">
            View Details
          </Button>
        )}
        <Button
          startIcon={<DiceIcon />}
          onClick={pickRandomMovie}
          variant={selectedMovie ? 'outlined' : 'contained'}
          disabled={loading}
        >
          {selectedMovie ? 'Try Another' : 'Pick Random Movie'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

