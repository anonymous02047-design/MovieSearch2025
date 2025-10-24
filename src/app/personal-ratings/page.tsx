'use client';

import React, { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';

import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Card, CardContent, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Alert, Rating, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Star as StarIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { quickRatingAPI } from '@/lib/api-client';

export default function PersonalRatingsPage() {
  const [ratings, setRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newRating, setNewRating] = useState({
    movieTitle: '',
    rating: 0,
  });

  useEffect(() => {
    loadRatings();
  }, []);

  const loadRatings = async () => {
    try {
      const response = await quickRatingAPI.getAll();
      setRatings(response.ratings || []);
    } catch (error) {
      console.error('Failed to load ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const addRating = async () => {
    if (!newRating.movieTitle.trim() || !newRating.rating) return;

    try {
      await quickRatingAPI.create({
        movieId: Date.now(),
        movieTitle: newRating.movieTitle,
        rating: newRating.rating,
      });
      setDialogOpen(false);
      setNewRating({ movieTitle: '', rating: 0 });
      await loadRatings();
    } catch (error) {
      console.error('Failed to add rating:', error);
      alert('Failed to add rating');
    }
  };

  const deleteRating = async (movieId: number) => {
    try {
      await quickRatingAPI.delete(movieId);
      await loadRatings();
    } catch (error) {
      console.error('Failed to delete rating:', error);
    }
  };

  const averageRating = ratings.length > 0
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : '0.0';

  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <StarIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Personal Ratings</Typography>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
            >
              Rate Movie
            </Button>
          </Box>

          <Alert severity="success" sx={{ mb: 3 }}>
            Your comprehensive movie rating system! Synced to MongoDB.
          </Alert>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                <Box>
                  <Typography variant="h4" color="primary.main">{ratings.length}</Typography>
                  <Typography variant="body2" color="text.secondary">Movies Rated</Typography>
                </Box>
                <Box>
                  <Typography variant="h4" color="primary.main">{averageRating}</Typography>
                  <Typography variant="body2" color="text.secondary">Average Rating</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : ratings.length > 0 ? (
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Your Ratings</Typography>
                <List>
                  {ratings.map((rating) => (
                    <ListItem
                      key={rating._id}
                      secondaryAction={
                        <IconButton edge="end" onClick={() => deleteRating(rating.movieId)}>
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={rating.movieTitle}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <Rating value={rating.rating} readOnly size="small" />
                            <Typography variant="caption" color="text.secondary">
                              {new Date(rating.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No ratings yet. Start rating movies!
            </Typography>
          )}

          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Rate a Movie</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <TextField
                  fullWidth
                  label="Movie Title"
                  value={newRating.movieTitle}
                  onChange={(e) => setNewRating({ ...newRating, movieTitle: e.target.value })}
                />
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>Your Rating</Typography>
                  <Rating
                    value={newRating.rating}
                    onChange={(e, value) => setNewRating({ ...newRating, rating: value || 0 })}
                    size="large"
                  />
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button 
                variant="contained" 
                onClick={addRating}
                disabled={!newRating.movieTitle.trim() || !newRating.rating}
              >
                Save Rating
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </AuthGuard>
  );
}
