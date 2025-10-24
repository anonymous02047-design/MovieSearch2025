'use client';

import React, { useState } from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  IconButton,
} from '@mui/material';
import {
  Label as LabelIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalOffer as TagIcon,
} from '@mui/icons-material';

interface CustomTag {
  id: string;
  name: string;
  color: string;
  movieCount: number;
}

export default function CustomTagsPage() {
  const { user } = useUser();
  const [tags, setTags] = useState<CustomTag[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#1976d2');

  const colors = [
    '#1976d2', '#dc004e', '#9c27b0', '#f57c00',
    '#388e3c', '#d32f2f', '#7b1fa2', '#0288d1'
  ];

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      const newTag: CustomTag = {
        id: Date.now().toString(),
        name: newTagName,
        color: selectedColor,
        movieCount: 0,
      };
      setTags([...tags, newTag]);
      setNewTagName('');
      setOpenDialog(false);
    }
  };

  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <TagIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
              Custom Movie Tags
            </Typography>
          </Box>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Organize your movies with personalized tags
          </Typography>

          {/* Stats */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                    {tags.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Tags
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                    0
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tagged Movies
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Create Tag Button */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{ mb: 3 }}
          >
            Create New Tag
          </Button>

          {tags.length === 0 && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Create custom tags to organize your movie collection your way!
            </Alert>
          )}

          {/* Tags Grid */}
          <Grid container spacing={3}>
            {tags.map((tag) => (
              <Grid key={tag.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Chip
                        label={tag.name}
                        sx={{ bgcolor: tag.color, color: 'white', fontWeight: 'bold' }}
                      />
                      <Box>
                        <IconButton size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      {tag.movieCount} movies
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Create Tag Dialog */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Create New Tag</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Tag Name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                sx={{ mt: 2, mb: 3 }}
              />
              <Typography variant="body2" sx={{ mb: 1 }}>Choose a color:</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {colors.map((color) => (
                  <Box
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: color,
                      borderRadius: 1,
                      cursor: 'pointer',
                      border: selectedColor === color ? '3px solid #000' : 'none',
                    }}
                  />
                ))}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button variant="contained" onClick={handleCreateTag}>Create Tag</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </AuthGuard>
  );
}

