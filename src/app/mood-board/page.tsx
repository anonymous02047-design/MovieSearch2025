'use client';

import React, { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  PhotoLibrary as PhotoLibraryIcon,
} from '@mui/icons-material';

interface MoodBoardItem {
  id: string;
  movieId: number;
  title: string;
  posterPath: string;
  mood: string;
  note: string;
}

export default function MoodBoardPage() {
  const { user } = useUser();
  const [boardItems, setBoardItems] = useState<MoodBoardItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMoodBoard();
  }, []);

  const loadMoodBoard = async () => {
    try {
      // Simulate loading from API
      setLoading(false);
      // TODO: Implement actual API call
    } catch (error) {
      console.error('Error loading mood board:', error);
      setLoading(false);
    }
  };

  const handleAddMovie = () => {
    setOpenAddDialog(true);
  };

  const handleRemoveMovie = (id: string) => {
    setBoardItems(prev => prev.filter(item => item.id !== id));
  };

  const moods = ['Happy', 'Sad', 'Excited', 'Chill', 'Romantic', 'Thrilling', 'Inspiring', 'Nostalgic'];

  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <PhotoLibraryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
                My Movie Mood Board
              </Typography>
            </Box>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              Create a visual collection of movies that match your moods
            </Typography>

            {/* Action Bar */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                placeholder="Search your mood board..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                sx={{ flexGrow: 1, minWidth: 250 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddMovie}
              >
                Add Movie
              </Button>
            </Box>
          </Box>

          {/* Mood Filters */}
          <Box sx={{ mb: 4, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label="All Moods" color="primary" onClick={() => {}} />
            {moods.map((mood) => (
              <Chip key={mood} label={mood} variant="outlined" onClick={() => {}} />
            ))}
          </Box>

          {/* Stats */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                    {boardItems.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Movies
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                    {moods.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mood Categories
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Empty State */}
          {boardItems.length === 0 && !loading && (
            <Alert severity="info" sx={{ mb: 4 }}>
              Your mood board is empty. Start adding movies that match your moods!
            </Alert>
          )}

          {/* Mood Board Grid */}
          <Grid container spacing={3}>
            {boardItems.map((item) => (
              <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Card sx={{ position: 'relative', '&:hover': { transform: 'scale(1.02)', transition: 'transform 0.2s' } }}>
                  <CardMedia
                    component="img"
                    height="400"
                    image={`https://image.tmdb.org/t/p/w500${item.posterPath}`}
                    alt={item.title}
                  />
                  <CardContent>
                    <Typography variant="h6" noWrap>
                      {item.title}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip label={item.mood} size="small" color="primary" />
                    </Box>
                    {item.note && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {item.note}
                      </Typography>
                    )}
                  </CardContent>
                  <IconButton
                    sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'background.paper' }}
                    onClick={() => handleRemoveMovie(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Add Movie Dialog */}
          <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="md" fullWidth>
            <DialogTitle>Add Movie to Mood Board</DialogTitle>
            <DialogContent>
              <Alert severity="info" sx={{ mt: 2 }}>
                Search for a movie and select the mood it represents for you.
              </Alert>
              {/* TODO: Implement movie search and selection */}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
              <Button variant="contained">Add to Board</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </AuthGuard>
  );
}

