'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Button,
  Chip,
  Stack,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { getFavorites, removeFromFavorites, exportFavorites, StoredMovie } from '@/lib/storage';
import { Movie } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import ResponsiveGrid from '@/components/ResponsiveGrid';
import ProtectedRoute from '@/components/ProtectedRoute';

function FavoritesPageContent() {
  const [favorites, setFavorites] = useState<StoredMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const convertStoredMovieToMovie = (storedMovie: StoredMovie): Movie => {
    return {
      id: storedMovie.id,
      title: storedMovie.title,
      poster_path: storedMovie.poster_path,
      release_date: storedMovie.release_date,
      vote_average: storedMovie.vote_average,
      overview: '',
      backdrop_path: null,
      vote_count: 0,
      genre_ids: [],
      adult: false,
      original_language: 'en',
      original_title: storedMovie.title,
      popularity: 0,
      video: false,
    };
  };

  const loadFavorites = () => {
    setLoading(true);
    const favoriteMovies = getFavorites();
    setFavorites(favoriteMovies);
    setLoading(false);
  };

  const handleRemoveFavorite = (movieId: number) => {
    removeFromFavorites(movieId);
    loadFavorites();
  };

  const handleClearAll = () => {
    // Clear all favorites
    localStorage.removeItem('movieSearch_favorites');
    setFavorites([]);
    setClearDialogOpen(false);
  };

  const handleExportFavorites = () => {
    const data = exportFavorites();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'movie-favorites.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareFavorites = async () => {
    const data = exportFavorites();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Favorite Movies',
          text: `Check out my ${favorites.length} favorite movies!`,
          files: [new File([data], 'favorites.json', { type: 'application/json' })],
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(data);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Paper
        sx={{
          background: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)',
          color: 'white',
          p: 4,
          mb: 4,
          borderRadius: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FavoriteIcon sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h3" component="h1" gutterBottom>
                My Favorites
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Your personal collection of favorite movies
              </Typography>
            </Box>
          </Box>
          
          {favorites.length > 0 && (
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleExportFavorites}
                sx={{ color: 'white', borderColor: 'white' }}
              >
                Export
              </Button>
              <Button
                variant="outlined"
                startIcon={<ShareIcon />}
                onClick={handleShareFavorites}
                sx={{ color: 'white', borderColor: 'white' }}
              >
                Share
              </Button>
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={() => setClearDialogOpen(true)}
                sx={{ color: 'white', borderColor: 'white' }}
              >
                Clear All
              </Button>
            </Stack>
          )}
        </Box>
        
        <Stack direction="row" spacing={2}>
          <Chip
            icon={<FavoriteIcon />}
            label={`${favorites.length} Movies`}
            variant="outlined"
            sx={{ color: 'white', borderColor: 'white' }}
          />
        </Stack>
      </Paper>

      {favorites.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <FavoriteIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom color="text.secondary">
            No Favorite Movies Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Start adding movies to your favorites by clicking the heart icon on any movie card.
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.href = '/'}
            startIcon={<FavoriteIcon />}
          >
            Browse Movies
          </Button>
        </Box>
      ) : (
        <>
          <ResponsiveGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={3}>
            {favorites && favorites.map((movie) => (
              <Box key={movie.id} sx={{ position: 'relative' }}>
                <MovieCard 
                  movie={convertStoredMovieToMovie(movie)} 
                  onToggleFavorite={handleRemoveFavorite}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    color: 'error.main',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    },
                  }}
                  onClick={() => handleRemoveFavorite(movie.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </ResponsiveGrid>
        </>
      )}

      {/* Clear All Dialog */}
      <Dialog
        open={clearDialogOpen}
        onClose={() => setClearDialogOpen(false)}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>
          Clear All Favorites
        </DialogTitle>
        <DialogContent sx={{ color: 'white' }}>
          <Typography>
            Are you sure you want to remove all {favorites.length} movies from your favorites? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setClearDialogOpen(false)}
            sx={{ color: 'white' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleClearAll}
            color="error"
            variant="contained"
          >
            Clear All
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default function FavoritesPage() {
  return (
    <ProtectedRoute>
      <FavoritesPageContent />
    </ProtectedRoute>
  );
}
