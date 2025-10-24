'use client';

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Avatar,
  Paper,
  Grid,
  IconButton,
  Chip,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  MenuBook as JournalIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  CalendarToday as CalendarIcon,
  Movie as MovieIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface JournalEntry {
  id: string;
  movieTitle: string;
  watchDate: string;
  rating: number;
  review: string;
  mood: string;
  rewatched: boolean;
  tags: string[];
  createdAt: string;
}

export default function MovieJournalPage() {
  const { user } = useUser();
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      movieTitle: 'Inception',
      watchDate: '2024-01-15',
      rating: 5,
      review: 'Mind-bending masterpiece! The layers of dreams within dreams were brilliantly executed. Hans Zimmer\'s score was perfect.',
      mood: '🤯',
      rewatched: false,
      tags: ['sci-fi', 'thriller', 'mind-bending'],
      createdAt: '2024-01-15T20:30:00',
    },
    {
      id: '2',
      movieTitle: 'The Shawshank Redemption',
      watchDate: '2024-02-03',
      rating: 5,
      review: 'Absolutely phenomenal. A timeless story of hope and friendship. Morgan Freeman and Tim Robbins were incredible.',
      mood: '😊',
      rewatched: true,
      tags: ['drama', 'classic', 'inspiring'],
      createdAt: '2024-02-03T19:45:00',
    },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [newEntry, setNewEntry] = useState({
    movieTitle: '',
    watchDate: new Date().toISOString().split('T')[0],
    rating: 0,
    review: '',
    mood: '',
    rewatched: false,
    tags: '',
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const moods = ['😊', '😢', '😂', '😱', '🤯', '😴', '🔥', '❤️'];

  const handleAddEntry = () => {
    const entry: JournalEntry = {
      id: Date.now().toString(),
      movieTitle: newEntry.movieTitle,
      watchDate: newEntry.watchDate,
      rating: newEntry.rating,
      review: newEntry.review,
      mood: newEntry.mood,
      rewatched: newEntry.rewatched,
      tags: newEntry.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: new Date().toISOString(),
    };
    setEntries([entry, ...entries]);
    setDialogOpen(false);
    setNewEntry({
      movieTitle: '',
      watchDate: new Date().toISOString().split('T')[0],
      rating: 0,
      review: '',
      mood: '',
      rewatched: false,
      tags: '',
    });
  };

  const handleDeleteEntry = (entryId: string) => {
    setEntries(entries.filter(entry => entry.id !== entryId));
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, entry: JournalEntry) => {
    setAnchorEl(event.currentTarget);
    setSelectedEntry(entry);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEntry(null);
  };

  const totalMovies = entries.length;
  const averageRating = entries.reduce((sum, entry) => sum + entry.rating, 0) / entries.length || 0;
  const rewatchedCount = entries.filter(entry => entry.rewatched).length;

  return (
    <AuthGuard>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        
        <Container maxWidth="lg" sx={{ mt: 12, mb: 8, flex: 1 }}>
          {/* Page Header */}
          <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                  <JournalIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight={700} gutterBottom>
                    Movie Journal
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Track your thoughts and memories from every movie
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => setDialogOpen(true)}
                sx={{ px: 4, py: 1.5 }}
              >
                New Entry
              </Button>
            </Box>
          </Box>

          {/* Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h4" color="primary.main" fontWeight={700}>
                  {totalMovies}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Entries
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main" fontWeight={700}>
                  {averageRating.toFixed(1)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Rating
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h4" color="info.main" fontWeight={700}>
                  {rewatchedCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rewatched
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Journal Entries */}
          {entries.length === 0 ? (
            <Paper elevation={2} sx={{ p: 8, textAlign: 'center' }}>
              <JournalIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h5" gutterBottom color="text.secondary">
                No Journal Entries Yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Start documenting your movie-watching journey
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setDialogOpen(true)}
              >
                Create Your First Entry
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {entries.map((entry) => (
                <Grid item xs={12} key={entry.id}>
                  <Card elevation={3}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Typography variant="h5" fontWeight={600}>
                              {entry.movieTitle}
                            </Typography>
                            <Typography variant="h5">{entry.mood}</Typography>
                            {entry.rewatched && (
                              <Chip label="Rewatch" size="small" color="info" />
                            )}
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <CalendarIcon fontSize="small" color="action" />
                              <Typography variant="body2" color="text.secondary">
                                {new Date(entry.watchDate).toLocaleDateString()}
                              </Typography>
                            </Box>
                            <Rating value={entry.rating} readOnly size="small" />
                            <Typography variant="body2" color="text.secondary">
                              {entry.rating}/5
                            </Typography>
                          </Box>
                        </Box>
                        <IconButton onClick={(e) => handleMenuOpen(e, entry)}>
                          <MoreVertIcon />
                        </IconButton>
                      </Box>

                      <Typography variant="body1" color="text.primary" paragraph sx={{ mb: 2 }}>
                        {entry.review}
                      </Typography>

                      {entry.tags.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {entry.tags.map((tag, index) => (
                            <Chip key={index} label={tag} size="small" variant="outlined" />
                          ))}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>

        {/* Add/Edit Entry Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingEntry ? 'Edit Entry' : 'New Journal Entry'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Movie Title"
                value={newEntry.movieTitle}
                onChange={(e) => setNewEntry({ ...newEntry, movieTitle: e.target.value })}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label="Watch Date"
                type="date"
                value={newEntry.watchDate}
                onChange={(e) => setNewEntry({ ...newEntry, watchDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
                required
              />
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Rating
                </Typography>
                <Rating
                  value={newEntry.rating}
                  onChange={(_, newValue) => setNewEntry({ ...newEntry, rating: newValue || 0 })}
                  size="large"
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  How did it make you feel?
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {moods.map((mood) => (
                    <Button
                      key={mood}
                      variant={newEntry.mood === mood ? 'contained' : 'outlined'}
                      onClick={() => setNewEntry({ ...newEntry, mood })}
                      sx={{ fontSize: '1.5rem', minWidth: 60 }}
                    >
                      {mood}
                    </Button>
                  ))}
                </Box>
              </Box>
              <TextField
                fullWidth
                label="Your Review"
                value={newEntry.review}
                onChange={(e) => setNewEntry({ ...newEntry, review: e.target.value })}
                multiline
                rows={4}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label="Tags (comma separated)"
                value={newEntry.tags}
                onChange={(e) => setNewEntry({ ...newEntry, tags: e.target.value })}
                placeholder="e.g. sci-fi, thriller, mind-bending"
                sx={{ mb: 2 }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleAddEntry}
              disabled={!newEntry.movieTitle || !newEntry.review || newEntry.rating === 0}
            >
              {editingEntry ? 'Save Changes' : 'Add Entry'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Entry Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => {/* Edit entry */}}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => selectedEntry && handleDeleteEntry(selectedEntry.id)}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>

        <Footer />
      </Box>
    </AuthGuard>
  );
}

