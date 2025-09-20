'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Alert,
  Pagination,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  Movie as MovieIcon,
  Tv as TvIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

// Prevent static generation for search page
export const dynamic = 'force-dynamic';

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path?: string;
  profile_path?: string;
  media_type: 'movie' | 'tv' | 'person';
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  genre_ids: number[];
}

interface SearchResponse {
  results: SearchResult[];
  total_pages: number;
  total_results: number;
  page: number;
}

export default function SearchPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [mediaType, setMediaType] = useState<'all' | 'movie' | 'tv' | 'person'>('all');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!user) {
      router.push('/sign-in');
      return;
    }
  }, [isLoaded, user, router]);

  const search = async (searchQuery: string, page: number = 1) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setTotalResults(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        query: searchQuery,
        page: page.toString(),
        include_adult: 'false',
      });

      if (mediaType !== 'all') {
        params.append('media_type', mediaType);
      }

      const response = await fetch(`/api/search?${params}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data: SearchResponse = await response.json();
      setResults(data.results || []);
      setTotalPages(data.total_pages || 1);
      setTotalResults(data.total_results || 0);
      setCurrentPage(data.page || 1);
    } catch (err) {
      setError('Failed to search. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      search(query, currentPage);
    }
  }, [query, currentPage, mediaType]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setCurrentPage(1);
    search(query, 1);
    
    // Update URL
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (mediaType !== 'all') params.set('type', mediaType);
    router.push(`/search?${params.toString()}`);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMediaTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newMediaType = event.target.value as 'all' | 'movie' | 'tv' | 'person';
    setMediaType(newMediaType);
    setCurrentPage(1);
  };

  const getResultUrl = (result: SearchResult) => {
    switch (result.media_type) {
      case 'movie':
        return `/movie/${result.id}`;
      case 'tv':
        return `/tv/${result.id}`;
      case 'person':
        return `/person/${result.id}`;
      default:
        return '#';
    }
  };

  const getResultTitle = (result: SearchResult) => {
    return result.title || result.name || 'Unknown';
  };

  const getResultImage = (result: SearchResult) => {
    const imagePath = result.poster_path || result.profile_path;
    return imagePath 
      ? `https://image.tmdb.org/t/p/w500${imagePath}`
      : '/placeholder-movie.jpg';
  };

  const getResultSubtitle = (result: SearchResult) => {
    if (result.media_type === 'person') {
      return 'Actor/Director';
    }
    const date = result.release_date || result.first_air_date;
    return date ? new Date(date).getFullYear().toString() : 'Unknown Year';
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect to sign-in
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Search Movies, TV Shows & People
        </Typography>
        
        <Box component="form" onSubmit={handleSearch} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for movies, TV shows, actors, directors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Media Type</InputLabel>
              <Select
                value={mediaType}
                label="Media Type"
                onChange={handleMediaTypeChange}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="movie">Movies</MenuItem>
                <MenuItem value="tv">TV Shows</MenuItem>
                <MenuItem value="person">People</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {totalResults > 0 && (
          <Typography variant="body1" color="text.secondary" align="center">
            Found {totalResults.toLocaleString()} results for "{query}"
          </Typography>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && results.length > 0 && (
        <>
          <Grid container spacing={3}>
            {results.map((result) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={`${result.media_type}-${result.id}`}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    }
                  }}
                  onClick={() => router.push(getResultUrl(result))}
                >
                  <CardMedia
                    component="img"
                    height="300"
                    image={getResultImage(result)}
                    alt={getResultTitle(result)}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom noWrap>
                      {getResultTitle(result)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {getResultSubtitle(result)}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Chip 
                        label={result.media_type.toUpperCase()} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                      {result.vote_average > 0 && (
                        <Chip 
                          label={`${result.vote_average.toFixed(1)}★`} 
                          size="small" 
                          color="secondary"
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {result.overview}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}

      {!loading && query && results.length === 0 && !error && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No results found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your search terms or filters
          </Typography>
        </Box>
      )}

      {!query && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Start your search
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Search for movies, TV shows, actors, and directors
          </Typography>
        </Box>
      )}
    </Container>
  );
}
