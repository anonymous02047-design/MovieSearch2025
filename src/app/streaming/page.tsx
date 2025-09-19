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
  Tabs,
  Tab,
} from '@mui/material';
import {
  PlayArrow as StreamingIcon,
  Search as SearchIcon,
  Star as StarIcon,
  Movie as MovieIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import SEO from '@/components/SEO';
import RecaptchaProtection from '@/components/RecaptchaProtection';

interface StreamingMovie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
  platforms: Array<{
    name: string;
    logo_path: string;
    price: string;
    quality: string[];
    available: boolean;
  }>;
  release_type: 'theatrical' | 'streaming' | 'both';
  streaming_exclusive: boolean;
}

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
      id={`streaming-tabpanel-${index}`}
      aria-labelledby={`streaming-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function StreamingPageContent() {
  const [movies, setMovies] = useState<StreamingMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMovies, setFilteredMovies] = useState<StreamingMovie[]>([]);
  const [sortBy, setSortBy] = useState('popularity');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);

  const sortOptions = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'rating', label: 'Rating' },
    { value: 'release_date', label: 'Release Date' },
    { value: 'title', label: 'Title A-Z' },
  ];

  const platforms = [
    { value: 'all', label: 'All Platforms' },
    { value: 'Netflix', label: 'Netflix' },
    { value: 'Disney+', label: 'Disney+' },
    { value: 'Amazon Prime', label: 'Amazon Prime' },
    { value: 'HBO Max', label: 'HBO Max' },
    { value: 'Hulu', label: 'Hulu' },
    { value: 'Apple TV+', label: 'Apple TV+' },
    { value: 'Paramount+', label: 'Paramount+' },
    { value: 'Peacock', label: 'Peacock' },
  ];

  const mockStreamingMovies: StreamingMovie[] = [
    {
      id: 1,
      title: 'Stranger Things',
      poster_path: '/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
      release_date: '2022-05-27',
      vote_average: 8.7,
      overview: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments...',
      genre_ids: [18, 14, 27],
      release_type: 'streaming',
      streaming_exclusive: true,
      platforms: [
        { name: 'Netflix', logo_path: '/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg', price: '$15.49/month', quality: ['4K', 'HD', 'SD'], available: true },
      ]
    },
    {
      id: 2,
      title: 'The Mandalorian',
      poster_path: '/eU1i6eHXlzMOlEq0ku1Rzq7Y4wA.jpg',
      release_date: '2019-11-12',
      vote_average: 8.5,
      overview: 'The travels of a lone bounty hunter in the outer reaches of the galaxy...',
      genre_ids: [28, 12, 878],
      release_type: 'streaming',
      streaming_exclusive: true,
      platforms: [
        { name: 'Disney+', logo_path: '/7rwgEs15tFwyR9NPQ5vpzxTj19Q.jpg', price: '$7.99/month', quality: ['4K', 'HD'], available: true },
      ]
    },
    {
      id: 3,
      title: 'The Boys',
      poster_path: '/mY7SeH4HFFxW1hiI6cWuwCRKptN.jpg',
      release_date: '2019-07-26',
      vote_average: 8.4,
      overview: 'A group of vigilantes set out to take down corrupt superheroes...',
      genre_ids: [28, 35, 18],
      release_type: 'streaming',
      streaming_exclusive: true,
      platforms: [
        { name: 'Amazon Prime', logo_path: '/emthp39XA2YScoYL1p0sdbAH2WA.jpg', price: '$14.99/month', quality: ['4K', 'HD'], available: true },
      ]
    },
    {
      id: 4,
      title: 'House of the Dragon',
      poster_path: '/z2yahl2uefxDCl0nogcRBstwruJ.jpg',
      release_date: '2022-08-21',
      vote_average: 8.5,
      overview: 'The Targaryen dynasty is at the absolute apex of its power...',
      genre_ids: [18, 14, 28],
      release_type: 'streaming',
      streaming_exclusive: true,
      platforms: [
        { name: 'HBO Max', logo_path: '/aS2zvJWn9mwi1e5ZkkF2mTkuEqp.jpg', price: '$15.99/month', quality: ['4K', 'HD'], available: true },
      ]
    },
    {
      id: 5,
      title: 'Ted Lasso',
      poster_path: '/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg',
      release_date: '2020-08-14',
      vote_average: 8.8,
      overview: 'An American football coach is hired to manage a British soccer team...',
      genre_ids: [35, 18],
      release_type: 'streaming',
      streaming_exclusive: true,
      platforms: [
        { name: 'Apple TV+', logo_path: '/peURlLlj8Rc57RUiGvV0oXKzKvs.jpg', price: '$6.99/month', quality: ['4K', 'HD'], available: true },
      ]
    },
    {
      id: 6,
      title: 'Top Gun: Maverick',
      poster_path: '/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
      release_date: '2022-05-27',
      vote_average: 8.3,
      overview: 'After thirty years, Maverick is still pushing the envelope...',
      genre_ids: [28, 18],
      release_type: 'both',
      streaming_exclusive: false,
      platforms: [
        { name: 'Paramount+', logo_path: '/xbhHHa1YgtpwhC8lb1NQ3ACVcLd.jpg', price: '$9.99/month', quality: ['4K', 'HD'], available: true },
        { name: 'Amazon Prime', logo_path: '/emthp39XA2YScoYL1p0sdbAH2WA.jpg', price: '$14.99/month', quality: ['4K', 'HD'], available: true },
      ]
    },
    {
      id: 7,
      title: 'Dune',
      poster_path: '/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
      release_date: '2021-10-22',
      vote_average: 8.0,
      overview: 'Paul Atreides, a brilliant and gifted young man...',
      genre_ids: [878, 18],
      release_type: 'both',
      streaming_exclusive: false,
      platforms: [
        { name: 'HBO Max', logo_path: '/aS2zvJWn9mwi1e5ZkkF2mTkuEqp.jpg', price: '$15.99/month', quality: ['4K', 'HD'], available: true },
        { name: 'Netflix', logo_path: '/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg', price: '$15.49/month', quality: ['4K', 'HD'], available: false },
      ]
    },
    {
      id: 8,
      title: 'The Bear',
      poster_path: '/y8VfW4VnUDqks8p7P3n1dW0Vz2x.jpg',
      release_date: '2022-06-23',
      vote_average: 8.6,
      overview: 'A young chef from the fine dining world returns to Chicago...',
      genre_ids: [35, 18],
      release_type: 'streaming',
      streaming_exclusive: true,
      platforms: [
        { name: 'Hulu', logo_path: '/aS2zvJWn9mwi1e5ZkkF2mTkuEqp.jpg', price: '$7.99/month', quality: ['HD'], available: true },
      ]
    },
  ];

  const fetchStreamingData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMovies(mockStreamingMovies);
      setTotalPages(1);
    } catch (err) {
      setError('Failed to fetch streaming data');
      console.error('Error fetching streaming data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStreamingData();
  }, [currentPage]);

  useEffect(() => {
    let filtered = movies;

    // Filter by search query
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.overview.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by platform
    if (platformFilter !== 'all') {
      filtered = filtered.filter(movie =>
        movie.platforms.some(platform => platform.name === platformFilter && platform.available)
      );
    }

    // Sort movies
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.vote_average - a.vote_average;
        case 'release_date':
          return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'popularity':
        default:
          return b.vote_average - a.vote_average; // Using rating as popularity proxy
      }
    });

    setFilteredMovies(filtered);
  }, [searchQuery, sortBy, platformFilter, movies]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
  };

  const handlePlatformChange = (event: any) => {
    setPlatformFilter(event.target.value);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getPlatformColor = (platform: string) => {
    const colors: { [key: string]: string } = {
      'Netflix': 'error',
      'Disney+': 'primary',
      'Amazon Prime': 'warning',
      'HBO Max': 'secondary',
      'Hulu': 'success',
      'Apple TV+': 'info',
      'Paramount+': 'primary',
      'Peacock': 'secondary',
    };
    return colors[platform] || 'default';
  };

  const renderMovieCard = (movie: StreamingMovie) => (
    <Grid item xs={12} sm={6} md={4} key={movie.id}>
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

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <CalendarIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {new Date(movie.release_date).getFullYear()}
            </Typography>
            {movie.streaming_exclusive && (
              <Chip
                label="Streaming Exclusive"
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Stack>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Available on:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {movie.platforms.filter(platform => platform.available).map((platform) => (
                <Chip
                  key={platform.name}
                  label={platform.name}
                  size="small"
                  color={getPlatformColor(platform.name) as any}
                  variant="outlined"
                  icon={<CheckCircleIcon />}
                />
              ))}
            </Stack>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Pricing:
            </Typography>
            {movie.platforms.filter(platform => platform.available).map((platform) => (
              <Box key={platform.name} sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {platform.name}: {platform.price}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Quality: {platform.quality.join(', ')}
                </Typography>
              </Box>
            ))}
          </Box>

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
        title="Streaming Movies"
        description="Discover movies available on popular streaming platforms. Find what's new on Netflix, Amazon Prime, Disney+, and more."
        keywords={['streaming movies', 'netflix', 'amazon prime', 'disney+', 'hulu', 'streaming platforms']}
      />
      <RecaptchaProtection action="streaming" showStatus={false}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <StreamingIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h3" component="h1">
            Streaming
          </Typography>
        </Stack>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Discover movies and shows available on your favorite streaming platforms
        </Typography>

        {/* Search and Filters */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search movies and shows..."
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
          <FormControl sx={{ minWidth: 150 }}>
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
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Platform</InputLabel>
            <Select
              value={platformFilter}
              label="Platform"
              onChange={handlePlatformChange}
            >
              {platforms.map((platform) => (
                <MenuItem key={platform.value} value={platform.value}>
                  {platform.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="streaming tabs">
          <Tab label="All Content" />
          <Tab label="Streaming Exclusive" />
          <Tab label="Theatrical + Streaming" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {filteredMovies.map(renderMovieCard)}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {filteredMovies.filter(movie => movie.streaming_exclusive).map(renderMovieCard)}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {filteredMovies.filter(movie => movie.release_type === 'both').map(renderMovieCard)}
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

      {/* No Results */}
      {filteredMovies.length === 0 && (searchQuery || platformFilter !== 'all') && (
        <Box textAlign="center" sx={{ py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No content found matching your criteria
          </Typography>
        </Box>
      )}

      {/* Stats */}
      <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Stack direction="row" spacing={4} justifyContent="center">
          <Box textAlign="center">
            <Typography variant="h4" color="primary.main">
              {filteredMovies.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Content
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" color="secondary.main">
              {filteredMovies.filter(movie => movie.streaming_exclusive).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Streaming Exclusives
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" color="success.main">
              {new Set(filteredMovies.flatMap(movie => movie.platforms.map(p => p.name))).size}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Platforms
            </Typography>
          </Box>
        </Stack>
      </Box>
        </Container>
      </RecaptchaProtection>
    </>
  );
}

export default function StreamingPage() {
  return (
    <ProtectedRoute>
      <StreamingPageContent />
    </ProtectedRoute>
  );
}