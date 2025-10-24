'use client';

import React, { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, TextField, Button, List, ListItem, ListItemText, IconButton, CircularProgress, Alert, Chip } from '@mui/material';
import { Memory as MemoryIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { movieMemoryAPI } from '@/lib/api-client';

export default function MovieMemoryPage() {
  const { user } = useUser();
  const [memories, setMemories] = useState<any[]>([]);
  const [newMemory, setNewMemory] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    try {
      const response = await movieMemoryAPI.getAll();
      setMemories(response.memories || []);
    } catch (error) {
      console.error('Failed to load memories:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMemory = async () => {
    if (!newMemory.trim()) return;
    
    setSaving(true);
    try {
      await movieMemoryAPI.create({
        memory: newMemory,
        tags: [],
        isPublic: false,
      });
      setNewMemory('');
      await loadMemories();
    } catch (error) {
      console.error('Failed to add memory:', error);
      alert('Failed to add memory');
    } finally {
      setSaving(false);
    }
  };

  const deleteMemory = async (id: string) => {
    try {
      await movieMemoryAPI.delete(id);
      await loadMemories();
    } catch (error) {
      console.error('Failed to delete memory:', error);
    }
  };

  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <MemoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Movie Memories</Typography>
          </Box>
          
          <Alert severity="success" sx={{ mb: 3 }}>
            Share your movie memories! Synced to MongoDB.
          </Alert>

          <Box sx={{ mb: 3 }}>
            <TextField 
              fullWidth 
              multiline
              rows={3}
              label="Share a movie memory..." 
              value={newMemory} 
              onChange={(e) => setNewMemory(e.target.value)} 
              sx={{ mb: 2 }} 
            />
            <Button 
              variant="contained" 
              onClick={addMemory}
              disabled={saving || !newMemory.trim()}
            >
              {saving ? 'Saving...' : 'Add Memory'}
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : memories.length > 0 ? (
            <List>
              {memories.map((m) => (
                <ListItem 
                  key={m._id} 
                  secondaryAction={
                    <IconButton edge="end" onClick={() => deleteMemory(m._id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                  sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 1 }}
                >
                  <ListItemText 
                    primary={m.memory} 
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(m.createdAt).toLocaleDateString()}
                        </Typography>
                        {m.movieTitle && (
                          <Chip label={m.movieTitle} size="small" sx={{ ml: 1 }} />
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No memories yet. Share your first movie memory!
            </Typography>
          )}
        </Container>
      </Box>
    </AuthGuard>
  );
}

