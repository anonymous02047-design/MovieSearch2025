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
  Button,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  IconButton,
  Tooltip,
  Badge,
  Avatar,
} from '@mui/material';
import {
  Person as PersonIcon,
  Star as StarIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Movie as MovieIcon,
} from '@mui/icons-material';
import { tmdbApi } from '@/lib/tmdb';
import { Movie } from '@/lib/tmdb';
import Link from 'next/link';
import SEO from '@/components/SEO';
import ProtectedRoute from '@/components/ProtectedRoute';
import RecaptchaProtection from '@/components/RecaptchaProtection';

function PeoplePageContent() {
  const [people, setPeople] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('popularity');
  const [timeframe, setTimeframe] = useState('week');

  const timeframes = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
  ];

  const sortOptions = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'name', label: 'Name' },
  ];

  const fetchPeople = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await tmdbApi.getTrendingPeople(timeframe, currentPage);
      setPeople(response.results);
      setTotalPages(Math.min(response.total_pages, 500));
    } catch (err) {
      setError('Failed to fetch people');
      console.error('Error fetching people:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, [currentPage, timeframe]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleTimeframeChange = (event: any) => {
    setTimeframe(event.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
  };

  const sortedPeople = [...people].sort((a, b) => {
    switch (sortBy) {
      case 'popularity':
        return b.popularity - a.popularity;
      case 'name':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const renderPersonCard = (person: Movie) => (
    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={person.id}>
      <Card sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
        }
      }}>
        <Box sx={{ position: 'relative', p: 2, textAlign: 'center' }}>
          <Avatar
            src={person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : '/placeholder-movie.svg'}
            alt={person.title}
            sx={{ 
              width: 120, 
              height: 120, 
              mx: 'auto',
              border: '3px solid',
              borderColor: 'primary.main',
              mb: 2
            }}
          />
          <Typography variant="subtitle2" noWrap gutterBottom sx={{ fontWeight: 'bold' }}>
            {person.title}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ mb: 1 }}>
            <StarIcon sx={{ fontSize: 14, color: 'warning.main' }} />
            <Typography variant="caption" color="text.secondary">
              {person.popularity.toFixed(1)}
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ 
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 2
          }}>
            {person.overview || 'Actor/Actress'}
          </Typography>
        </Box>
        <Box sx={{ p: 2, pt: 0 }}>
          <Button
            component={Link}
            href={`/person/${person.id}`}
            variant="contained"
            color="primary"
            fullWidth
            size="small"
            startIcon={<PersonIcon />}
          >
            View Profile
          </Button>
        </Box>
      </Card>
    </Grid>
  );

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
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={fetchPeople}>
            Retry
          </Button>
        }>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <SEO
        title="People - Trending Actors & Celebrities"
        description="Discover trending actors, actresses, and celebrities. Find the most popular people in entertainment right now."
        keywords={['actors', 'actresses', 'celebrities', 'people', 'trending', 'entertainment']}
      />
      <RecaptchaProtection action="people" showStatus={false}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <PersonIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="body1" component="p" sx={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: 'primary.main',
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                👥 People
              </Typography>
            </Stack>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              Discover trending actors, actresses, and celebrities
            </Typography>

            {/* Filters */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Timeframe</InputLabel>
                  <Select
                    value={timeframe}
                    label="Timeframe"
                    onChange={handleTimeframeChange}
                  >
                    {timeframes.map((tf) => (
                      <MenuItem key={tf.value} value={tf.value}>
                        {tf.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={handleSortChange}
                  >
                    {sortOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <IconButton onClick={fetchPeople} color="primary">
                  <RefreshIcon />
                </IconButton>
              </Stack>
            </Paper>
          </Box>

          {/* People Grid */}
          <Grid container spacing={3}>
            {sortedPeople.map(renderPersonCard)}
          </Grid>

          {/* Pagination */}
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

          {/* Stats */}
          <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Stack direction="row" spacing={4} justifyContent="center">
              <Box textAlign="center">
                <Typography variant="h4" color="primary.main">
                  {people.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  People
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h4" color="secondary.main">
                  {people.reduce((sum, person) => sum + person.popularity, 0) / people.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Popularity
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h4" color="success.main">
                  {people.filter(p => p.profile_path).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  With Photos
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Container>
      </RecaptchaProtection>
    </>
  );
}

export default function PeoplePage() {
  return (
    <ProtectedRoute>
      <PeoplePageContent />
    </ProtectedRoute>
  );
}
