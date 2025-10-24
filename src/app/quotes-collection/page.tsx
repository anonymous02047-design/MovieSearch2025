'use client';

import React, { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';

import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Card, CardContent, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Alert, IconButton } from '@mui/material';
import { FormatQuote as QuoteIcon, Add as AddIcon, Delete as DeleteIcon, Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon } from '@mui/icons-material';
import { movieQuoteAPI } from '@/lib/api-client';

export default function QuotesCollectionPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newQuote, setNewQuote] = useState({
    movieTitle: '',
    quote: '',
    character: '',
    actor: '',
  });

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      const response = await movieQuoteAPI.getAll();
      setQuotes(response.quotes || []);
    } catch (error) {
      console.error('Failed to load quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const addQuote = async () => {
    if (!newQuote.movieTitle.trim() || !newQuote.quote.trim()) return;

    try {
      await movieQuoteAPI.create({
        movieId: Date.now(),
        movieTitle: newQuote.movieTitle,
        quote: newQuote.quote,
        character: newQuote.character,
        actor: newQuote.actor,
        isFavorite: false,
      });
      setDialogOpen(false);
      setNewQuote({ movieTitle: '', quote: '', character: '', actor: '' });
      await loadQuotes();
    } catch (error) {
      console.error('Failed to add quote:', error);
      alert('Failed to add quote');
    }
  };

  const toggleFavorite = async (quote: any) => {
    try {
      await movieQuoteAPI.update(quote._id, {
        isFavorite: !quote.isFavorite,
      });
      await loadQuotes();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const deleteQuote = async (id: string) => {
    try {
      await movieQuoteAPI.delete(id);
      await loadQuotes();
    } catch (error) {
      console.error('Failed to delete quote:', error);
    }
  };

  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <QuoteIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Quotes Collection</Typography>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
            >
              Add Quote
            </Button>
          </Box>

          <Alert severity="success" sx={{ mb: 3 }}>
            Save your favorite movie quotes! Synced to MongoDB.
          </Alert>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : quotes.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {quotes.map((quote) => (
                <Card key={quote._id}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontStyle: 'italic', flex: 1 }}>
                        "{quote.quote}"
                      </Typography>
                      <Box>
                        <IconButton size="small" onClick={() => toggleFavorite(quote)}>
                          {quote.isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                        </IconButton>
                        <IconButton size="small" onClick={() => deleteQuote(quote._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      <strong>{quote.movieTitle}</strong>
                    </Typography>
                    {quote.character && (
                      <Typography variant="body2" color="text.secondary">
                        — {quote.character}{quote.actor && ` (${quote.actor})`}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No quotes yet. Start collecting!
            </Typography>
          )}

          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Add Movie Quote</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <TextField
                  fullWidth
                  label="Movie Title"
                  value={newQuote.movieTitle}
                  onChange={(e) => setNewQuote({ ...newQuote, movieTitle: e.target.value })}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Quote"
                  value={newQuote.quote}
                  onChange={(e) => setNewQuote({ ...newQuote, quote: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="Character (optional)"
                  value={newQuote.character}
                  onChange={(e) => setNewQuote({ ...newQuote, character: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="Actor (optional)"
                  value={newQuote.actor}
                  onChange={(e) => setNewQuote({ ...newQuote, actor: e.target.value })}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button 
                variant="contained" 
                onClick={addQuote}
                disabled={!newQuote.movieTitle.trim() || !newQuote.quote.trim()}
              >
                Add Quote
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </AuthGuard>
  );
}
