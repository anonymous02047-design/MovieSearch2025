'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  CircularProgress,
  useTheme,
  alpha,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Collections as CollectionsIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import CollectionCard, { Collection } from '@/components/CollectionCard';
import SEO from '@/components/SEO';

// Popular movie collections
const popularCollections: Collection[] = [
  { id: 531241, name: 'Spider-Man Collection', poster_path: '/nogV4th2P5QWYvQIMiWHj4CFLU9.jpg', backdrop_path: null },
  { id: 10, name: 'Star Wars Collection', poster_path: '/r8Ph5MYXL04Qzu4QBbq2KjqwtkQ.jpg', backdrop_path: null },
  { id: 295, name: 'Pirates of the Caribbean Collection', poster_path: '/bB42AD6HTWlnN8PvZAWWB9EfXSC.jpg', backdrop_path: null },
  { id: 86311, name: 'The Avengers Collection', poster_path: '/yFSIUVTCvgYrpalUktPovmACsKE.jpg', backdrop_path: null },
  { id: 131295, name: 'Deadpool Collection', poster_path: '/hBP7vWyYCJDd6dS58RGRMlbnYYW.jpg', backdrop_path: null },
  { id: 9485, name: 'The Fast and the Furious Collection', poster_path: '/z5A5W3WYJc5sfF8NZaLvh9xgW0y.jpg', backdrop_path: null },
  { id: 535313, name: 'Godzilla Collection', poster_path: '/inNN466SKHNjbGmpfhfsaPQNleS.jpg', backdrop_path: null },
  { id: 2344, name: 'The Matrix Collection', poster_path: '/bV9qTVHTVf0gkW0j7p7M0ISNn6i.jpg', backdrop_path: null },
  { id: 263, name: 'The Dark Knight Collection', poster_path: '/6D2zvY5wKV1PjHBqjBBj0OSBZD9.jpg', backdrop_path: null },
  { id: 528, name: 'The Terminator Collection', poster_path: '/vGujQOfGIaZx5UWxf9JdNEOxl7B.jpg', backdrop_path: null },
  { id: 1241, name: 'Harry Potter Collection', poster_path: '/zV3Lx1VpYfPZKqpRmJEQO01yxXy.jpg', backdrop_path: null },
  { id: 119050, name: 'The Hobbit Collection', poster_path: '/zqv2fTK4mHdlCzTaCnVKnWGUxAT.jpg', backdrop_path: null },
];

export default function CollectionsPage() {
  const theme = useTheme();
  const [collections, setCollections] = useState<Collection[]>(popularCollections);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>(popularCollections);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = collections.filter(collection =>
        collection.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCollections(filtered);
    } else {
      setFilteredCollections(collections);
    }
  }, [searchQuery, collections]);

  return (
    <>
      <SEO
        title="Movie Collections - MovieSearch 2025"
        description="Explore popular movie collections and franchises"
        keywords={['movie collections', 'franchises', 'series', 'movie series']}
      />

      <Box
        sx={{
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)'
            : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
          minHeight: '100vh',
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
              <CollectionsIcon sx={{ fontSize: 48, color: 'primary.main' }} />
              <Typography variant="h3" component="h1" fontWeight={700}>
                Movie Collections
              </Typography>
            </Box>
            <Typography variant="h6" color="text.secondary">
              Explore popular movie franchises and series
            </Typography>
          </Box>

          {/* Search */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <TextField
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ maxWidth: 500, width: '100%' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Collections Grid */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredCollections.map((collection) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={collection.id}>
                  <CollectionCard collection={collection} />
                </Grid>
              ))}
            </Grid>
          )}

          {filteredCollections.length === 0 && !loading && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                No collections found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Try a different search term
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}
