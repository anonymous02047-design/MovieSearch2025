'use client';

import React, { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';

import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Card, CardContent, TextField, Button, Chip, CircularProgress, Alert, Rating, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Book as BookIcon, Add as AddIcon } from '@mui/icons-material';
import { movieDiaryAPI } from '@/lib/api-client';

export default function MovieDiaryPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    movieTitle: '',
    watchedDate: new Date().toISOString().split('T')[0],
    rating: 0,
    review: '',
    mood: '',
    rewatch: false,
  });

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const response = await movieDiaryAPI.getAll();
      setEntries(response.entries || []);
    } catch (error) {
      console.error('Failed to load diary:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async () => {
    if (!newEntry.movieTitle.trim()) return;

    try {
      await movieDiaryAPI.create({
        movieId: Date.now(),
        movieTitle: newEntry.movieTitle,
        watchedDate: newEntry.watchedDate,
        rating: newEntry.rating || undefined,
        review: newEntry.review || undefined,
        mood: newEntry.mood || undefined,
        rewatch: newEntry.rewatch,
      });
      setDialogOpen(false);
      setNewEntry({
        movieTitle: '',
        watchedDate: new Date().toISOString().split('T')[0],
        rating: 0,
        review: '',
        mood: '',
        rewatch: false,
      });
      await loadEntries();
    } catch (error) {
      console.error('Failed to add entry:', error);
      alert('Failed to add entry');
    }
  };

  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <BookIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Movie Diary</Typography>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
            >
              New Entry
            </Button>
          </Box>

          <Alert severity="success" sx={{ mb: 3 }}>
            Track your daily movie watching journey! Synced to MongoDB.
          </Alert>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : entries.length > 0 ? (
            <Grid container spacing={2}>
              {entries.map((entry) => (
                <Grid size={{ xs: 12 }} key={entry._id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Typography variant="h6">{entry.movieTitle}</Typography>
                        <Chip 
                          label={new Date(entry.watchedDate).toLocaleDateString()} 
                          size="small" 
                          color="primary"
                        />
                      </Box>
                      {entry.rating && (
                        <Box sx={{ mb: 1 }}>
                          <Rating value={entry.rating} readOnly size="small" />
                        </Box>
                      )}
                      {entry.review && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {entry.review}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {entry.mood && <Chip label={entry.mood} size="small" />}
                        {entry.rewatch && <Chip label="Rewatch" size="small" color="secondary" />}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No diary entries yet. Start tracking your movie journey!
            </Typography>
          )}

          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>New Diary Entry</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <TextField
                  fullWidth
                  label="Movie Title"
                  value={newEntry.movieTitle}
                  onChange={(e) => setNewEntry({ ...newEntry, movieTitle: e.target.value })}
                />
                <TextField
                  fullWidth
                  type="date"
                  label="Watch Date"
                  value={newEntry.watchedDate}
                  onChange={(e) => setNewEntry({ ...newEntry, watchedDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>Rating</Typography>
                  <Rating
                    value={newEntry.rating}
                    onChange={(e, value) => setNewEntry({ ...newEntry, rating: value || 0 })}
                  />
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Review (optional)"
                  value={newEntry.review}
                  onChange={(e) => setNewEntry({ ...newEntry, review: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="Mood (optional)"
                  value={newEntry.mood}
                  onChange={(e) => setNewEntry({ ...newEntry, mood: e.target.value })}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button 
                variant="contained" 
                onClick={addEntry}
                disabled={!newEntry.movieTitle.trim()}
              >
                Add Entry
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </AuthGuard>
  );
}

