'use client';

import React, { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  Paper,
  Divider,
  Menu,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  Public as PublicIcon,
  Lock as LockIcon,
  MoreVert as MoreVertIcon,
  List as ListIcon,
  Movie as MovieIcon,
} from '@mui/icons-material';
import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface MovieList {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  movieCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function MyListsPage() {
  const { user } = useUser();
  const [lists, setLists] = useState<MovieList[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingList, setEditingList] = useState<MovieList | null>(null);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [newListPublic, setNewListPublic] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedList, setSelectedList] = useState<MovieList | null>(null);

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      setLoading(true);
      // Simulated data - replace with actual API call
      const mockLists: MovieList[] = [
        {
          id: '1',
          name: 'Top Action Movies',
          description: 'My favorite action-packed films',
          isPublic: true,
          movieCount: 15,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          name: 'Must Watch Classics',
          description: 'Timeless classics everyone should see',
          isPublic: false,
          movieCount: 23,
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
      setLists(mockLists);
    } catch (error) {
      console.error('Error loading lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async () => {
    if (!newListName.trim()) return;

    const newList: MovieList = {
      id: Date.now().toString(),
      name: newListName,
      description: newListDescription,
      isPublic: newListPublic,
      movieCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setLists([...lists, newList]);
    setCreateDialogOpen(false);
    setNewListName('');
    setNewListDescription('');
    setNewListPublic(false);
  };

  const handleDeleteList = (listId: string) => {
    setLists(lists.filter(list => list.id !== listId));
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, list: MovieList) => {
    setAnchorEl(event.currentTarget);
    setSelectedList(list);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedList(null);
  };

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
                  <ListIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight={700} gutterBottom>
                    My Lists
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Create and manage your custom movie lists
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => setCreateDialogOpen(true)}
                sx={{ px: 4, py: 1.5 }}
              >
                Create List
              </Button>
            </Box>
          </Box>

          {/* Stats */}
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary.main" fontWeight={700}>
                    {lists.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Lists
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main" fontWeight={700}>
                    {lists.reduce((sum, list) => sum + list.movieCount, 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Movies
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main" fontWeight={700}>
                    {lists.filter(list => list.isPublic).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Public Lists
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Lists Grid */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} />
            </Box>
          ) : lists.length === 0 ? (
            <Paper elevation={2} sx={{ p: 8, textAlign: 'center' }}>
              <ListIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h5" gutterBottom color="text.secondary">
                No Lists Yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Create your first custom movie list to get started
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCreateDialogOpen(true)}
              >
                Create Your First List
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {lists.map((list) => (
                <Grid item xs={12} sm={6} md={4} key={list.id}>
                  <Card
                    elevation={3}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardContent sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" fontWeight={600} gutterBottom>
                            {list.name}
                          </Typography>
                          <Chip
                            icon={list.isPublic ? <PublicIcon /> : <LockIcon />}
                            label={list.isPublic ? 'Public' : 'Private'}
                            size="small"
                            color={list.isPublic ? 'success' : 'default'}
                            sx={{ mb: 1 }}
                          />
                        </Box>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, list)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {list.description || 'No description'}
                      </Typography>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MovieIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {list.movieCount} {list.movieCount === 1 ? 'movie' : 'movies'}
                        </Typography>
                      </Box>
                    </CardContent>
                    
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        fullWidth
                        onClick={() => {/* Navigate to list detail */}}
                      >
                        View List
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>

        {/* Create/Edit List Dialog */}
        <Dialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {editingList ? 'Edit List' : 'Create New List'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="List Name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label="Description"
                value={newListDescription}
                onChange={(e) => setNewListDescription(e.target.value)}
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  icon={newListPublic ? <PublicIcon /> : <LockIcon />}
                  label={newListPublic ? 'Public List' : 'Private List'}
                  onClick={() => setNewListPublic(!newListPublic)}
                  color={newListPublic ? 'success' : 'default'}
                />
                <Typography variant="caption" color="text.secondary">
                  {newListPublic ? 'Anyone can view this list' : 'Only you can view this list'}
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleCreateList}
              disabled={!newListName.trim()}
            >
              {editingList ? 'Save Changes' : 'Create List'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* List Options Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => {/* Edit list */}}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={() => {/* Share list */}}>
            <ShareIcon fontSize="small" sx={{ mr: 1 }} />
            Share
          </MenuItem>
          <MenuItem
            onClick={() => selectedList && handleDeleteList(selectedList.id)}
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

