'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Pagination,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Collections as CollectionsIcon,
  Search as SearchIcon,
  Movie as MovieIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { tmdb } from '@/lib/tmdb';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import SEO from '@/components/SEO';


interface Collection {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  parts: Movie[];
}

interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  vote_average: number;
}

function CollectionsPageContent() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>([]);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch popular collections (this would need to be implemented in tmdb.ts)
      // For now, we'll use a mock implementation
      const mockCollections: Collection[] = [
        {
          id: 1,
          name: "The Marvel Cinematic Universe",
          overview: "The Marvel Cinematic Universe (MCU) is an American media franchise and shared universe centered on a series of superhero films produced by Marvel Studios.",
          poster_path: "/hq2igFqb31fDqGotz8ZuUfwKgn8.jpg",
          backdrop_path: "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
          parts: [
            { id: 1, title: "Iron Man", release_date: "2008-05-02", poster_path: "/78lPtwv72eTNqFW9COBYI0dWDJa.jpg", vote_average: 7.6 },
            { id: 2, title: "The Incredible Hulk", release_date: "2008-06-13", poster_path: "/gKzYx79y0AQTL4UAk1cBQJ3nvrm.jpg", vote_average: 6.2 },
            { id: 3, title: "Iron Man 2", release_date: "2010-05-07", poster_path: "/6WBeq4fCfn7AN0o21W9qNcRF2l9.jpg", vote_average: 6.6 },
          ]
        },
        {
          id: 2,
          name: "The Dark Knight Trilogy",
          overview: "Christopher Nolan's epic Batman trilogy that redefined the superhero genre with its dark, realistic approach.",
          poster_path: "/hqkocbr4l1n8m7Q1cC1QtvGUcM8.jpg",
          backdrop_path: "/hqkocbr4l1n8m7Q1cC1QtvGUcM8.jpg",
          parts: [
            { id: 4, title: "Batman Begins", release_date: "2005-06-15", poster_path: "/dr6x4GyyegBWtinPBzipY02J2lV.jpg", vote_average: 8.2 },
            { id: 5, title: "The Dark Knight", release_date: "2008-07-18", poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg", vote_average: 9.0 },
            { id: 6, title: "The Dark Knight Rises", release_date: "2012-07-20", poster_path: "/85cWkCVftiVs0BVey6pxX8uNmLt.jpg", vote_average: 8.4 },
          ]
        },
        {
          id: 3,
          name: "The Lord of the Rings",
          overview: "Peter Jackson's epic fantasy trilogy based on J.R.R. Tolkien's novels about the quest to destroy the One Ring.",
          poster_path: "/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
          backdrop_path: "/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
          parts: [
            { id: 7, title: "The Lord of the Rings: The Fellowship of the Ring", release_date: "2001-12-19", poster_path: "/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg", vote_average: 8.4 },
            { id: 8, title: "The Lord of the Rings: The Two Towers", release_date: "2002-12-18", poster_path: "/5M7oN3sznp99hWYQ9sX0xheswWX.jpg", vote_average: 8.4 },
            { id: 9, title: "The Lord of the Rings: The Return of the King", release_date: "2003-12-17", poster_path: "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg", vote_average: 8.7 },
          ]
        },
        {
          id: 4,
          name: "The Fast and the Furious",
          overview: "A high-octane action franchise about street racing, heists, and family bonds.",
          poster_path: "/qAhedRxRYWZAgZ8O8pHIl6QHdD7.jpg",
          backdrop_path: "/qAhedRxRYWZAgZ8O8pHIl6QHdD7.jpg",
          parts: [
            { id: 10, title: "The Fast and the Furious", release_date: "2001-06-22", poster_path: "/qAhedRxRYWZAgZ8O8pHIl6QHdD7.jpg", vote_average: 6.8 },
            { id: 11, title: "2 Fast 2 Furious", release_date: "2003-06-06", poster_path: "/u1Snfl40rXmAJNiMyZUczUyFVuf.jpg", vote_average: 5.9 },
            { id: 12, title: "The Fast and the Furious: Tokyo Drift", release_date: "2006-06-16", poster_path: "/4nWfhk4Vpq6RT9XaPNdHxea3d6m.jpg", vote_average: 6.0 },
          ]
        },
        {
          id: 5,
          name: "The Matrix",
          overview: "A cyberpunk action franchise about a computer programmer who discovers the true nature of reality.",
          poster_path: "/hEpWvX6Bp79eLxY1kX5ZZJcme5U.jpg",
          backdrop_path: "/hEpWvX6Bp79eLxY1kX5ZZJcme5U.jpg",
          parts: [
            { id: 13, title: "The Matrix", release_date: "1999-03-31", poster_path: "/hEpWvX6Bp79eLxY1kX5ZZJcme5U.jpg", vote_average: 8.7 },
            { id: 14, title: "The Matrix Reloaded", release_date: "2003-05-15", poster_path: "/9TGHDvWrqKBzwDxDodHYXPoOE5Q.jpg", vote_average: 7.2 },
            { id: 15, title: "The Matrix Revolutions", release_date: "2003-11-05", poster_path: "/sKogjhfs5q3azmpW7DFKKAeLEG8.jpg", vote_average: 6.8 },
          ]
        },
        {
          id: 6,
          name: "Star Wars",
          overview: "The epic space opera franchise created by George Lucas, following the adventures of the Skywalker family.",
          poster_path: "/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",
          backdrop_path: "/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",
          parts: [
            { id: 16, title: "Star Wars: Episode IV - A New Hope", release_date: "1977-05-25", poster_path: "/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg", vote_average: 8.6 },
            { id: 17, title: "Star Wars: Episode V - The Empire Strikes Back", release_date: "1980-05-21", poster_path: "/lUo74ZbmsFbZqoRfoq0xpfPug2s.jpg", vote_average: 8.7 },
            { id: 18, title: "Star Wars: Episode VI - Return of the Jedi", release_date: "1983-05-25", poster_path: "/mDCBQNhR6R0PVFucJl0O4Hp5klZ.jpg", vote_average: 8.3 },
          ]
        },
      ];

      setCollections(mockCollections);
      setFilteredCollections(mockCollections);
      setTotalPages(1);
    } catch (err) {
      setError('Failed to fetch collections');
      console.error('Error fetching collections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, [currentPage]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCollections(collections);
    } else {
      const filtered = collections.filter(collection =>
        collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collection.overview.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCollections(filtered);
    }
  }, [searchQuery, collections]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <>
      <SEO
        title="Movie Collections"
        description="Explore curated movie collections and franchises. Discover themed collections, series, and movie universes."
        keywords={['movie collections', 'franchises', 'movie series', 'themed collections', 'movie universes']}
      />
      <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <CollectionsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h3" component="h1">
            Movie Collections
          </Typography>
        </Stack>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Explore iconic movie franchises and collections
        </Typography>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search collections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />
      </Box>

      {/* Collections Grid */}
      <Grid container spacing={3}>
        {filteredCollections.map((collection) => (
          <Grid item xs={12} md={6} key={collection.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={collection.poster_path ? `https://image.tmdb.org/t/p/w500${collection.poster_path}` : '/placeholder-movie.svg'}
                alt={collection.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h3" gutterBottom>
                  {collection.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {collection.overview}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <MovieIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {collection.parts.length} movies
                  </Typography>
                </Stack>
                
                {/* Movies in Collection */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Movies in this collection:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {collection.parts.slice(0, 3).map((movie) => (
                      <Chip
                        key={movie.id}
                        label={movie.title}
                        size="small"
                        variant="outlined"
                        component={Link}
                        href={`/movie/${movie.id}`}
                        clickable
                      />
                    ))}
                    {collection.parts.length > 3 && (
                      <Chip
                        label={`+${collection.parts.length - 3} more`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Stack>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  component={Link}
                  href={`/collection/${collection.id}`}
                  size="small"
                  variant="contained"
                  fullWidth
                >
                  View Collection
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {/* No Results */}
      {filteredCollections.length === 0 && searchQuery && (
        <Box textAlign="center" sx={{ py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No collections found for "{searchQuery}"
          </Typography>
        </Box>
      )}
        </Container>
      </>
  );
}

export default function CollectionsPage() {
  return (
    <ProtectedRoute>
      <CollectionsPageContent />
    </ProtectedRoute>
  );
}