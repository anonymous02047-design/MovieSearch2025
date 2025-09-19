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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
} from '@mui/material';
import {
  Movie as MovieIcon,
  Search as SearchIcon,
  Star as StarIcon,
  FilterList as FilterIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { tmdbApi } from '@/lib/tmdb';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import SEO from '@/components/SEO';
import RecaptchaProtection from '@/components/RecaptchaProtection';

interface Director {
  id: number;
  name: string;
  profile_path: string;
  known_for_department: string;
  known_for: Array<{
    id: number;
    title?: string;
    name?: string;
    poster_path: string;
    media_type: string;
    vote_average: number;
  }>;
  popularity: number;
  adult: boolean;
}

function DirectorsPageContent() {
  const [directors, setDirectors] = useState<Director[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDirectors, setFilteredDirectors] = useState<Director[]>([]);
  const [sortBy, setSortBy] = useState('popularity');

  const sortOptions = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'rating', label: 'Average Rating' },
  ];

  const fetchDirectors = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await tmdbApi.getPopularPeople(currentPage);
      
      // Filter for directors only - check known_for_department
      const directorsOnly = response.results.filter(
        person => person.known_for_department === 'Directing'
      );
      
      // If no directors found, show all people for now
      if (directorsOnly.length === 0) {
        setDirectors(response.results.slice(0, 20));
      } else {
        setDirectors(directorsOnly);
      }
      setTotalPages(Math.min(response.total_pages, 500));
    } catch (err) {
      setError('Failed to fetch directors');
      console.error('Error fetching directors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirectors();
  }, [currentPage]);

  useEffect(() => {
    let filtered = directors;

    // Filter by search query
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(director =>
        director.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort directors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          const aRating = a.known_for.reduce((sum, work) => sum + work.vote_average, 0) / a.known_for.length;
          const bRating = b.known_for.reduce((sum, work) => sum + work.vote_average, 0) / b.known_for.length;
          return bRating - aRating;
        case 'popularity':
        default:
          return b.popularity - a.popularity;
      }
    });

    setFilteredDirectors(filtered);
  }, [searchQuery, sortBy, directors]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
  };

  const getAverageRating = (director: Director) => {
    if (!director.known_for || director.known_for.length === 0) return 0;
    const sum = director.known_for.reduce((acc, work) => acc + work.vote_average, 0);
    return sum / director.known_for.length;
  };

  const getTopMovies = (director: Director) => {
    return director.known_for
      .filter(work => work.media_type === 'movie')
      .sort((a, b) => b.vote_average - a.vote_average)
      .slice(0, 3);
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
        title="Movie Directors"
        description="Discover talented movie directors and their filmography. Explore the work of acclaimed filmmakers and rising directors."
        keywords={['movie directors', 'filmmakers', 'directors', 'filmography', 'movie makers', 'cinema directors']}
      />
      <RecaptchaProtection action="directors" showStatus={false}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <MovieIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="body1" component="p" sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            fontSize: '14px',
          }}>
            🎬 Directors
          </Typography>
        </Stack>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Discover talented directors and their acclaimed works
        </Typography>

        {/* Search and Sort */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search directors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sortBy}
              label="Sort by"
              onChange={handleSortChange}
              startAdornment={<FilterIcon sx={{ mr: 1 }} />}
            >
              {sortOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {/* Directors Grid */}
      <Grid container spacing={3}>
        {filteredDirectors.map((director) => {
          const averageRating = getAverageRating(director);
          const topMovies = getTopMovies(director);
          
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={director.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={director.profile_path ? `https://image.tmdb.org/t/p/w500${director.profile_path}` : '/placeholder-movie.svg'}
                  alt={director.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom noWrap>
                    {director.name}
                  </Typography>
                  
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <Chip
                      label="Director"
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <StarIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {director.popularity.toFixed(1)}
                    </Typography>
                  </Stack>

                  {averageRating > 0 && (
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                      <Rating
                        value={averageRating / 2}
                        precision={0.1}
                        size="small"
                        readOnly
                      />
                      <Typography variant="body2" color="text.secondary">
                        {averageRating.toFixed(1)} avg
                      </Typography>
                    </Stack>
                  )}

                  {topMovies.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Notable Films:
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {topMovies.map((movie) => (
                          <Chip
                            key={movie.id}
                            label={movie.title || movie.name}
                            size="small"
                            variant="outlined"
                            component={Link}
                            href={`/movie/${movie.id}`}
                            clickable
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </CardContent>
                <CardActions>
                  <Button
                    component={Link}
                    href={`/person/${director.id}`}
                    size="small"
                    variant="contained"
                    fullWidth
                  >
                    View Profile
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
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
      {filteredDirectors.length === 0 && searchQuery && (
        <Box textAlign="center" sx={{ py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No directors found for "{searchQuery}"
          </Typography>
        </Box>
      )}

      {/* Stats */}
      <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Stack direction="row" spacing={4} justifyContent="center">
          <Box textAlign="center">
            <Typography variant="h4" color="primary.main">
              {filteredDirectors.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Directors
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" color="secondary.main">
              {filteredDirectors.reduce((sum, dir) => sum + dir.known_for.length, 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Films
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" color="success.main">
              {filteredDirectors.length > 0 ? (filteredDirectors.reduce((sum, dir) => sum + getAverageRating(dir), 0) / filteredDirectors.length).toFixed(1) : '0.0'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Avg Rating
            </Typography>
          </Box>
        </Stack>
      </Box>
        </Container>
      </RecaptchaProtection>
    </>
  );
}

export default function DirectorsPage() {
  return (
    <ProtectedRoute>
      <DirectorsPageContent />
    </ProtectedRoute>
  );
}