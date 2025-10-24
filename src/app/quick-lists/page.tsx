'use client';

import React, { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';

import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Card, CardContent, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Alert, Grid, IconButton, List, ListItem, ListItemText } from '@mui/material';
import { List as ListIcon, Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { quickListAPI } from '@/lib/api-client';

export default function QuickListsPage() {
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newList, setNewList] = useState({
    name: '',
    description: '',
    isPublic: false,
  });

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      const response = await quickListAPI.getAll();
      setLists(response.lists || []);
    } catch (error) {
      console.error('Failed to load lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const createList = async () => {
    if (!newList.name.trim()) return;

    try {
      await quickListAPI.create({
        name: newList.name,
        description: newList.description,
        isPublic: newList.isPublic,
      });
      setDialogOpen(false);
      setNewList({ name: '', description: '', isPublic: false });
      await loadLists();
    } catch (error) {
      console.error('Failed to create list:', error);
      alert('Failed to create list');
    }
  };

  const deleteList = async (id: string) => {
    if (!confirm('Delete this list?')) return;
    try {
      await quickListAPI.delete(id);
      await loadLists();
    } catch (error) {
      console.error('Failed to delete list:', error);
    }
  };

  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ListIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Quick Lists</Typography>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
            >
              New List
            </Button>
          </Box>

          <Alert severity="success" sx={{ mb: 3 }}>
            Create and manage movie lists instantly! Synced to MongoDB.
          </Alert>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : lists.length > 0 ? (
            <Grid container spacing={2}>
              {lists.map((list) => (
                <Grid size={{ xs: 12, sm: 6 }} key={list._id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Typography variant="h6">{list.name}</Typography>
                        <IconButton size="small" onClick={() => deleteList(list._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                      {list.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {list.description}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        {list.movies?.length || 0} movies
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No lists yet. Create your first list!
            </Typography>
          )}

          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Create New List</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <TextField
                  fullWidth
                  label="List Name"
                  value={newList.name}
                  onChange={(e) => setNewList({ ...newList, name: e.target.value })}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description (optional)"
                  value={newList.description}
                  onChange={(e) => setNewList({ ...newList, description: e.target.value })}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button 
                variant="contained" 
                onClick={createList}
                disabled={!newList.name.trim()}
              >
                Create List
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </AuthGuard>
  );
}
