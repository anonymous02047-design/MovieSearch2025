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
  Rating,
  Stack,
  Tabs,
  Tab,
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
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  CalendarToday as CalendarIcon,
  Visibility as VisibilityIcon,
  Movie as MovieIcon,
  Tv as TvIcon,
  Person as PersonIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
} from '@mui/icons-material';
import { tmdbApi } from '@/lib/tmdb';
import { Movie } from '@/lib/tmdb';
import Link from 'next/link';
import SEO from '@/components/SEO';
import ProtectedRoute from '@/components/ProtectedRoute';
// Removed unused import

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`trending-tabpanel-${index}`}
      aria-labelledby={`trending-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function TrendingPageContent() {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [trendingTV, setTrendingTV] = useState<Movie[]>([]);
  const [trendingPeople, setTrendingPeople] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [timeframe, setTimeframe] = useState('day');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const timeframes = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
  ];

  const fetchTrendingData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [moviesData, tvData, peopleData] = await Promise.all([
        tmdbApi.getTrendingMovies(timeframe, currentPage),
        tmdbApi.getTrendingTV(timeframe, currentPage),
        tmdbApi.getTrendingPeople(timeframe, currentPage),
      ]);

      setTrendingMovies(moviesData.results);
      setTrendingTV(tvData.results);
      setTrendingPeople(peopleData.results);
      setTotalPages(Math.min(moviesData.total_pages, 500));
    } catch (err) {
      setError('Failed to fetch trending data');
      console.error('Error fetching trending data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingData();
  }, [timeframe, currentPage]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTimeframeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeframe(event.target.value);
    setCurrentPage(1);
  };

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

  const renderMovieCard = (movie: Movie) => (
    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={movie.id}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="300"
          image={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-movie.svg'}
          alt={movie.title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="h3" gutterBottom noWrap>
            {movie.title}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Rating
              value={movie.vote_average / 2}
              precision={0.1}
              size="small"
              readOnly
            />
            <Typography variant="body2" color="text.secondary">
              {movie.vote_average.toFixed(1)}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <CalendarIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {formatDate(movie.release_date)}
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" noWrap>
            {movie.overview}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            component={Link}
            href={`/movie/${movie.id}`}
            size="small"
            variant="contained"
            fullWidth
          >
            View Details
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );

  const renderTVCard = (show: Movie) => (
    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={show.id}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="300"
          image={show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : '/placeholder-movie.svg'}
          alt={show.name}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="h3" gutterBottom noWrap>
            {show.name}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Rating
              value={show.vote_average / 2}
              precision={0.1}
              size="small"
              readOnly
            />
            <Typography variant="body2" color="text.secondary">
              {show.vote_average.toFixed(1)}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <CalendarIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {formatDate(show.first_air_date)}
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" noWrap>
            {show.overview}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            component={Link}
            href={`/tv/${show.id}`}
            size="small"
            variant="contained"
            fullWidth
          >
            View Details
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );

  const renderPersonCard = (person: Movie) => (
    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={person.id}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="300"
          image={person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : '/placeholder-movie.svg'}
          alt={person.name}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="h3" gutterBottom noWrap>
            {person.name}
          </Typography>
          <Chip
            label={person.known_for_department}
            size="small"
            color="primary"
            sx={{ mb: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            Known for: {person.known_for?.map((item: Movie) => item.title || item.name).join(', ')}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            component={Link}
            href={`/person/${person.id}`}
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
        title="Trending Movies & TV Shows"
        description="Discover what's popular right now in movies, TV shows, and people. Stay up-to-date with the latest trending content and find your next favorite entertainment."
        keywords={['trending movies', 'trending tv shows', 'popular movies', 'popular tv shows', 'whats trending', 'trending now']}
        type="website"
      />
      <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="body1" component="p" sx={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: 'primary.main',
          }}>
            Trending
          </Typography>
        </Stack>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Discover what's popular right now in movies, TV shows, and people
        </Typography>

        {/* Timeframe Selector */}
        <FormControl size="small" sx={{ minWidth: 150, mb: 3 }}>
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
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="trending tabs">
          <Tab label="Movies" />
          <Tab label="TV Shows" />
          <Tab label="People" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {trendingMovies.map(renderMovieCard)}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {trendingTV.map(renderTVCard)}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {trendingPeople.map(renderPersonCard)}
        </Grid>
      </TabPanel>

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
      </Container>
    </>
  );
}

export default function TrendingPage() {
  return (
    <ProtectedRoute>
      <TrendingPageContent />
    </ProtectedRoute>
  );
}