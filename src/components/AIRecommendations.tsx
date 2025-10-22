'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Chip,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MovieIcon from '@mui/icons-material/Movie';

interface AIRecommendationsProps {
  open: boolean;
  onClose: () => void;
  onMovieSelect?: (movieTitle: string) => void;
}

const MOODS = [
  'Happy',
  'Sad',
  'Excited',
  'Relaxed',
  'Romantic',
  'Adventurous',
  'Thoughtful',
  'Scared',
  'Nostalgic',
  'Energetic',
];

const GENRES = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'History',
  'Horror',
  'Music',
  'Mystery',
  'Romance',
  'Science Fiction',
  'TV Movie',
  'Thriller',
  'War',
  'Western',
];

export default function AIRecommendations({
  open,
  onClose,
  onMovieSelect,
}: AIRecommendationsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [mood, setMood] = useState('');
  const [preferences, setPreferences] = useState('');
  const [favoriteMovies, setFavoriteMovies] = useState<string[]>([]);
  const [movieInput, setMovieInput] = useState('');

  const handleAddMovie = () => {
    if (movieInput.trim() && !favoriteMovies.includes(movieInput.trim())) {
      setFavoriteMovies([...favoriteMovies, movieInput.trim()]);
      setMovieInput('');
    }
  };

  const handleRemoveMovie = (movie: string) => {
    setFavoriteMovies(favoriteMovies.filter(m => m !== movie));
  };

  const handleGetRecommendations = async () => {
    setLoading(true);
    setError(null);
    setRecommendations([]);

    try {
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          favoriteGenres: selectedGenres,
          favoriteMovies,
          mood,
          preferences,
          count: 5,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to get recommendations');
      }

      setRecommendations(data.recommendations || []);
    } catch (err: any) {
      console.error('AI Recommendations Error:', err);
      setError(err.message || 'Failed to get AI recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedGenres([]);
    setMood('');
    setPreferences('');
    setFavoriteMovies([]);
    setMovieInput('');
    setRecommendations([]);
    setError(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AutoAwesomeIcon color="primary" />
        AI-Powered Movie Recommendations
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Favorite Genres */}
          <Autocomplete
            multiple
            options={GENRES}
            value={selectedGenres}
            onChange={(_, newValue) => setSelectedGenres(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Favorite Genres"
                placeholder="Select genres you enjoy"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  size="small"
                  color="primary"
                />
              ))
            }
          />

          {/* Mood */}
          <FormControl fullWidth>
            <InputLabel>Current Mood</InputLabel>
            <Select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              label="Current Mood"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {MOODS.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Favorite Movies */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Favorite Movies
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                fullWidth
                size="small"
                value={movieInput}
                onChange={(e) => setMovieInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddMovie()}
                placeholder="Type a movie title and press Enter"
              />
              <Button onClick={handleAddMovie} variant="outlined" size="small">
                Add
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {favoriteMovies.map((movie) => (
                <Chip
                  key={movie}
                  label={movie}
                  onDelete={() => handleRemoveMovie(movie)}
                  color="secondary"
                  size="small"
                />
              ))}
            </Box>
          </Box>

          {/* Additional Preferences */}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Additional Preferences"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="E.g., I prefer movies with strong female leads, plot twists, or happy endings..."
          />

          {/* Get Recommendations Button */}
          <Button
            variant="contained"
            size="large"
            onClick={handleGetRecommendations}
            disabled={loading || (selectedGenres.length === 0 && favoriteMovies.length === 0 && !mood)}
            startIcon={loading ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
            fullWidth
          >
            {loading ? 'Getting Recommendations...' : 'Get AI Recommendations'}
          </Button>

          {/* Recommendations Display */}
          {recommendations.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MovieIcon color="primary" />
                Recommended for You
              </Typography>
              <Stack spacing={1}>
                {recommendations.map((movie, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      '&:hover': {
                        bgcolor: 'action.hover',
                        cursor: onMovieSelect ? 'pointer' : 'default',
                      },
                    }}
                    onClick={() => onMovieSelect && onMovieSelect(movie)}
                  >
                    <Typography variant="body1">
                      {index + 1}. {movie}
                    </Typography>
                    {onMovieSelect && (
                      <Button size="small" variant="outlined">
                        View Details
                      </Button>
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleReset} disabled={loading}>
          Reset
        </Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

