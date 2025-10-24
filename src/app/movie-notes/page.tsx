'use client';

import React, { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';

import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Card, CardContent, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Alert, Chip, IconButton, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Note as NoteIcon, Add as AddIcon, Delete as DeleteIcon, PushPin as PinIcon } from '@mui/icons-material';
import { movieNoteAPI } from '@/lib/api-client';

export default function MovieNotesPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState({
    movieTitle: '',
    note: '',
    category: 'personal',
    isPinned: false,
  });

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const response = await movieNoteAPI.getAll();
      setNotes(response.notes || []);
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async () => {
    if (!newNote.movieTitle.trim() || !newNote.note.trim()) return;

    try {
      await movieNoteAPI.create({
        movieId: Date.now(),
        movieTitle: newNote.movieTitle,
        note: newNote.note,
        category: newNote.category,
        isPinned: newNote.isPinned,
      });
      setDialogOpen(false);
      setNewNote({ movieTitle: '', note: '', category: 'personal', isPinned: false });
      await loadNotes();
    } catch (error) {
      console.error('Failed to add note:', error);
      alert('Failed to add note');
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await movieNoteAPI.delete(id);
      await loadNotes();
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const togglePin = async (note: any) => {
    try {
      await movieNoteAPI.update(note._id, {
        isPinned: !note.isPinned,
      });
      await loadNotes();
    } catch (error) {
      console.error('Failed to toggle pin:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: any = {
      analysis: 'primary',
      quote: 'secondary',
      trivia: 'success',
      personal: 'info',
      review: 'warning',
      other: 'default',
    };
    return colors[category] || 'default';
  };

  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <NoteIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Movie Notes</Typography>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
            >
              New Note
            </Button>
          </Box>

          <Alert severity="success" sx={{ mb: 3 }}>
            Take detailed notes about movies! Synced to MongoDB.
          </Alert>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : notes.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {notes.map((note) => (
                <Card key={note._id} sx={{ bgcolor: note.isPinned ? 'action.hover' : 'background.paper' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="h6">{note.movieTitle}</Typography>
                          {note.isPinned && <PinIcon fontSize="small" color="primary" />}
                        </Box>
                        <Chip 
                          label={note.category} 
                          size="small" 
                          color={getCategoryColor(note.category)}
                        />
                      </Box>
                      <Box>
                        <IconButton size="small" onClick={() => togglePin(note)}>
                          <PinIcon color={note.isPinned ? 'primary' : 'inherit'} />
                        </IconButton>
                        <IconButton size="small" onClick={() => deleteNote(note._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>
                      {note.note}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No notes yet. Start taking notes!
            </Typography>
          )}

          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>New Movie Note</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <TextField
                  fullWidth
                  label="Movie Title"
                  value={newNote.movieTitle}
                  onChange={(e) => setNewNote({ ...newNote, movieTitle: e.target.value })}
                />
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newNote.category}
                    label="Category"
                    onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
                  >
                    <MenuItem value="analysis">Analysis</MenuItem>
                    <MenuItem value="quote">Quote</MenuItem>
                    <MenuItem value="trivia">Trivia</MenuItem>
                    <MenuItem value="personal">Personal</MenuItem>
                    <MenuItem value="review">Review</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label="Note"
                  value={newNote.note}
                  onChange={(e) => setNewNote({ ...newNote, note: e.target.value })}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button 
                variant="contained" 
                onClick={addNote}
                disabled={!newNote.movieTitle.trim() || !newNote.note.trim()}
              >
                Add Note
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </AuthGuard>
  );
}

