'use client';

import React, { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Card, CardContent, Rating, Button, Alert, List, ListItem, ListItemText, IconButton, CircularProgress } from '@mui/material';
import { Star as StarIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { quickRatingAPI } from '@/lib/api-client';

export default function QuickRatePage() {
  const { user } = useUser();
  const [ratings, setRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  const handleRate = async (value: number) => {
    setSaving(true);
    try {
      // For demo: using a sample movie
      await quickRatingAPI.create({
        movieId: Date.now(), // Temporary ID
        movieTitle: 'Sample Movie',
        rating: value,
      });
      await loadRatings();
    } catch (error) {
      console.error('Failed to save rating:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (movieId: number) => {
    try {
      await quickRatingAPI.delete(movieId);
      await loadRatings();
    } catch (error) {
      console.error('Failed to delete rating:', error);
    }
  };

  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <StarIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Quick Rate</Typography>
          </Box>
          <Alert severity="success" sx={{ mb: 3 }}>
            Rate movies instantly! All data synced to MongoDB.
          </Alert>
          
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h5" sx={{ mb: 3 }}>How would you rate this experience?</Typography>
              <Rating 
                size="large" 
                onChange={(e, value) => value && handleRate(value)} 
                disabled={saving}
              />
              {saving && <CircularProgress size={24} sx={{ mt: 2 }} />}
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Total ratings: {ratings.length}
              </Typography>
            </CardContent>
          </Card>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : ratings.length > 0 ? (
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Your Recent Ratings</Typography>
                <List>
                  {ratings.map((rating: any) => (
                    <ListItem
                      key={rating._id}
                      secondaryAction={
                        <IconButton edge="end" onClick={() => handleDelete(rating.movieId)}>
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={rating.movieTitle}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Rating value={rating.rating} readOnly size="small" />
                            <Typography variant="caption">
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
          ) : null}
        </Container>
      </Box>
    </AuthGuard>
  );
}

