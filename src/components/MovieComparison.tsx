'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Alert,
  Autocomplete,
  TextField,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { Movie, getImageUrl, formatDate, formatCurrency } from '@/lib/tmdb';
import { getGenreNames } from '@/lib/genres';

interface MovieComparisonProps {
  open: boolean;
  onClose: () => void;
  initialMovies?: Movie[];
}

export default function MovieComparison({ open, onClose, initialMovies = [] }: MovieComparisonProps) {
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>(initialMovies.slice(0, 4));
  const maxMovies = 4;

  const handleAddMovie = (movie: Movie) => {
    if (selectedMovies.length < maxMovies && !selectedMovies.find(m => m.id === movie.id)) {
      setSelectedMovies([...selectedMovies, movie]);
    }
  };

  const handleRemoveMovie = (movieId: number) => {
    setSelectedMovies(selectedMovies.filter(m => m.id !== movieId));
  };

  const comparisonData = [
    { label: 'Title', getValue: (m: Movie) => m.title },
    { label: 'Release Date', getValue: (m: Movie) => formatDate(m.release_date) },
    { label: 'Rating', getValue: (m: Movie) => `${m.vote_average.toFixed(1)} / 10` },
    { label: 'Votes', getValue: (m: Movie) => m.vote_count.toLocaleString() },
    { label: 'Popularity', getValue: (m: Movie) => m.popularity.toFixed(0) },
    { label: 'Language', getValue: (m: Movie) => m.original_language.toUpperCase() },
    { label: 'Genres', getValue: (m: Movie) => getGenreNames(m.genre_ids || []).join(', ') },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Compare Movies</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {selectedMovies.length === 0 ? (
          <Alert severity="info">
            Select at least 2 movies to compare (maximum {maxMovies})
          </Alert>
        ) : (
          <Grid container spacing={2}>
            {/* Movie Cards */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                {selectedMovies.map((movie) => (
                  <Grid item xs={12} sm={6} md={3} key={movie.id}>
                    <Card>
                      <Box position="relative">
                        <CardMedia
                          component="img"
                          height="300"
                          image={getImageUrl(movie.poster_path, 'w500')}
                          alt={movie.title}
                        />
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.9)' },
                          }}
                          size="small"
                          onClick={() => handleRemoveMovie(movie.id)}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <CardContent>
                        <Typography variant="h6" noWrap>{movie.title}</Typography>
                        <Box display="flex" alignItems="center" gap={1} mt={1}>
                          <StarIcon sx={{ color: 'gold', fontSize: 20 }} />
                          <Typography variant="body2">
                            {movie.vote_average.toFixed(1)}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
                
                {/* Add Movie Card */}
                {selectedMovies.length < maxMovies && (
                  <Grid item xs={12} sm={6} md={3}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 400,
                        border: '2px dashed',
                        borderColor: 'primary.main',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    >
                      <Box textAlign="center" p={2}>
                        <AddIcon sx={{ fontSize: 64, color: 'primary.main' }} />
                        <Typography variant="body1" mt={2}>
                          Add Movie to Compare
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ({maxMovies - selectedMovies.length} remaining)
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </Grid>

            {/* Comparison Table */}
            {selectedMovies.length >= 2 && (
              <Grid item xs={12} mt={2}>
                <Typography variant="h6" gutterBottom>
                  Side-by-Side Comparison
                </Typography>
                <Table>
                  <TableBody>
                    {comparisonData.map((row) => (
                      <TableRow key={row.label}>
                        <TableCell sx={{ fontWeight: 'bold', width: '150px' }}>
                          {row.label}
                        </TableCell>
                        {selectedMovies.map((movie) => (
                          <TableCell key={movie.id}>
                            {row.getValue(movie)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Winner Analysis */}
                <Box mt={3} p={2} bgcolor="success.light" borderRadius={2}>
                  <Typography variant="h6" gutterBottom>
                    Quick Analysis
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2">Highest Rated:</Typography>
                      <Typography variant="body1">
                        {selectedMovies.reduce((prev, curr) => 
                          prev.vote_average > curr.vote_average ? prev : curr
                        ).title}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2">Most Popular:</Typography>
                      <Typography variant="body1">
                        {selectedMovies.reduce((prev, curr) => 
                          prev.popularity > curr.popularity ? prev : curr
                        ).title}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2">Most Recent:</Typography>
                      <Typography variant="body1">
                        {selectedMovies.reduce((prev, curr) => 
                          new Date(prev.release_date) > new Date(curr.release_date) ? prev : curr
                        ).title}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          onClick={() => setSelectedMovies([])}
          disabled={selectedMovies.length === 0}
          color="error"
        >
          Clear All
        </Button>
      </DialogActions>
    </Dialog>
  );
}

