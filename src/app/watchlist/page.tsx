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
  Bookmark as BookmarkIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Clear as ClearIcon,
  PlayArrow as PlayIcon,
} from '@mui/icons-material';
import { getWatchlist, exportWatchlist, StoredMovie } from '@/lib/storage';
import { Movie } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import ResponsiveGrid from '@/components/ResponsiveGrid';
import ProtectedRoute from '@/components/ProtectedRoute';

function WatchlistPageContent() {
  const [watchlist, setWatchlist] = useState<StoredMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  useEffect(() => {
    loadWatchlist();
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

  const loadWatchlist = () => {
    setLoading(true);
    const watchlistMovies = getWatchlist();
    setWatchlist(watchlistMovies);
    setLoading(false);
  };

  const handleRemoveWatchlist = (movieId: number) => {
    // Remove from watchlist using localStorage directly
    const watchlist = JSON.parse(localStorage.getItem('movieSearch_watchlist') || '[]');
    const newWatchlist = watchlist.filter((item: StoredMovie) => item.id !== movieId);
    localStorage.setItem('movieSearch_watchlist', JSON.stringify(newWatchlist));
    loadWatchlist();
  };


  const handleClearAll = () => {
    // Clear all watchlist
    localStorage.removeItem('movieSearch_watchlist');
    setWatchlist([]);
    setClearDialogOpen(false);
  };

  const handleExportWatchlist = () => {
    const data = exportWatchlist();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'movie-watchlist.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareWatchlist = async () => {
    const data = exportWatchlist();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Movie Watchlist',
          text: `Check out my ${watchlist.length} movies to watch!`,
          files: [new File([data], 'watchlist.json', { type: 'application/json' })],
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
          background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
          color: 'white',
          p: 4,
          mb: 4,
          borderRadius: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BookmarkIcon sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h3" component="h1" gutterBottom>
                My Watchlist
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Movies you want to watch later
              </Typography>
            </Box>
          </Box>
          
          {watchlist.length > 0 && (
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleExportWatchlist}
                sx={{ color: 'white', borderColor: 'white' }}
              >
                Export
              </Button>
              <Button
                variant="outlined"
                startIcon={<ShareIcon />}
                onClick={handleShareWatchlist}
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
            icon={<BookmarkIcon />}
            label={`${watchlist.length} Movies`}
            variant="outlined"
            sx={{ color: 'white', borderColor: 'white' }}
          />
          <Chip
            icon={<PlayIcon />}
            label="To Watch"
            variant="outlined"
            sx={{ color: 'white', borderColor: 'white' }}
          />
        </Stack>
      </Paper>

      {watchlist.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <BookmarkIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom color="text.secondary">
            No Movies in Watchlist
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Add movies to your watchlist by clicking the bookmark icon on any movie card.
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.href = '/'}
            startIcon={<BookmarkIcon />}
          >
            Browse Movies
          </Button>
        </Box>
      ) : (
        <>
          <ResponsiveGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={3}>
            {watchlist && watchlist.map((movie) => (
              <Box key={movie.id} sx={{ position: 'relative' }}>
                <MovieCard 
                  movie={convertStoredMovieToMovie(movie)} 
                  onToggleWatchlist={handleRemoveWatchlist}
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
                  onClick={() => handleRemoveWatchlist(movie.id)}
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
          Clear All Watchlist
        </DialogTitle>
        <DialogContent sx={{ color: 'white' }}>
          <Typography>
            Are you sure you want to remove all {watchlist.length} movies from your watchlist? 
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

export default function WatchlistPage() {
  return (
    <ProtectedRoute>
      <WatchlistPageContent />
    </ProtectedRoute>
  );
}
