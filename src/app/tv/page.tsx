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
} from '@mui/material';
import {
  Tv as TvIcon,
  Star as StarIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
} from '@mui/icons-material';
import { tmdbApi } from '@/lib/tmdb';
import { Movie } from '@/lib/tmdb';
import Link from 'next/link';
import SEO from '@/components/SEO';
import ProtectedRoute from '@/components/ProtectedRoute';
import RecaptchaProtection from '@/components/RecaptchaProtection';

function TVShowsPageContent() {
  const [tvShows, setTvShows] = useState<Movie[]>([]);
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
    { value: 'vote_average', label: 'Rating' },
    { value: 'first_air_date', label: 'Release Date' },
    { value: 'name', label: 'Name' },
  ];

  const fetchTVShows = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await tmdbApi.getTrendingTV(timeframe, currentPage);
      setTvShows(response.results);
      setTotalPages(Math.min(response.total_pages, 500));
    } catch (err) {
      setError('Failed to fetch TV shows');
      console.error('Error fetching TV shows:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTVShows();
  }, [currentPage, timeframe]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleTimeframeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeframe(event.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  const sortedTVShows = [...tvShows].sort((a, b) => {
    switch (sortBy) {
      case 'popularity':
        return b.popularity - a.popularity;
      case 'vote_average':
        return b.vote_average - a.vote_average;
      case 'first_air_date':
        return new Date(b.release_date || '').getTime() - new Date(a.release_date || '').getTime();
      case 'name':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const renderTVShowCard = (tvShow: Movie) => (
    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={tvShow.id}>
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
        <CardMedia
          component="img"
          height="300"
          image={tvShow.poster_path ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}` : '/placeholder-movie.svg'}
          alt={tvShow.title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Typography variant="subtitle2" noWrap gutterBottom sx={{ fontWeight: 'bold' }}>
            {tvShow.title}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            {tvShow.release_date && (
              <Typography variant="caption" color="text.secondary">
                {new Date(tvShow.release_date).getFullYear()}
              </Typography>
            )}
            {tvShow.vote_average > 0 && (
              <>
                <StarIcon sx={{ fontSize: 14, color: 'warning.main' }} />
                <Typography variant="caption" color="text.secondary">
                  {tvShow.vote_average.toFixed(1)}
                </Typography>
              </>
            )}
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ 
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {tvShow.overview}
          </Typography>
        </CardContent>
        <Box sx={{ p: 2, pt: 0 }}>
          <Button
            component={Link}
            href={`/tv/${tvShow.id}`}
            variant="contained"
            color="primary"
            fullWidth
            size="small"
            startIcon={<TvIcon />}
          >
            View Details
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
          <Button color="inherit" size="small" onClick={fetchTVShows}>
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
        title="TV Shows - Trending Series"
        description="Discover trending TV shows and series. Find the most popular shows airing now and explore your next favorite series."
        keywords={['tv shows', 'series', 'trending tv', 'popular shows', 'television', 'streaming']}
      />
      <RecaptchaProtection action="tv_shows" showStatus={false}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <TvIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="body1" component="p" sx={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: 'primary.main',
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                📺 TV Shows
              </Typography>
            </Stack>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              Discover trending TV shows and series
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

                <IconButton onClick={fetchTVShows} color="primary">
                  <RefreshIcon />
                </IconButton>
              </Stack>
            </Paper>
          </Box>

          {/* TV Shows Grid */}
          <Grid container spacing={3}>
            {sortedTVShows.map(renderTVShowCard)}
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
                  {tvShows.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  TV Shows
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h4" color="secondary.main">
                  {tvShows.reduce((sum, show) => sum + show.vote_average, 0) / tvShows.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Rating
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h4" color="success.main">
                  {tvShows.reduce((sum, show) => sum + show.popularity, 0) / tvShows.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Popularity
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Container>
      </RecaptchaProtection>
    </>
  );
}

export default function TVShowsPage() {
  return (
    <ProtectedRoute>
      <TVShowsPageContent />
    </ProtectedRoute>
  );
}
