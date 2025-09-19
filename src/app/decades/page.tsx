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
  History as HistoryIcon,
  Search as SearchIcon,
  Star as StarIcon,
  Movie as MovieIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { tmdb } from '@/lib/tmdb';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import SEO from '@/components/SEO';
import RecaptchaProtection from '@/components/RecaptchaProtection';

interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
}

interface DecadeData {
  decade: string;
  startYear: number;
  endYear: number;
  movies: Movie[];
  totalMovies: number;
  averageRating: number;
  topGenres: Array<{
    id: number;
    name: string;
    count: number;
  }>;
  description: string;
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
      id={`decades-tabpanel-${index}`}
      aria-labelledby={`decades-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function DecadesPageContent() {
  const [decadesData, setDecadesData] = useState<DecadeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDecades, setFilteredDecades] = useState<DecadeData[]>([]);
  const [sortBy, setSortBy] = useState('decade');
  const [tabValue, setTabValue] = useState(0);

  const sortOptions = [
    { value: 'decade', label: 'Decade (Newest First)' },
    { value: 'movies', label: 'Number of Movies' },
    { value: 'rating', label: 'Average Rating' },
  ];

  const decades = [
    { value: '2020s', label: '2020s', startYear: 2020, endYear: 2029 },
    { value: '2010s', label: '2010s', startYear: 2010, endYear: 2019 },
    { value: '2000s', label: '2000s', startYear: 2000, endYear: 2009 },
    { value: '1990s', label: '1990s', startYear: 1990, endYear: 1999 },
    { value: '1980s', label: '1980s', startYear: 1980, endYear: 1989 },
    { value: '1970s', label: '1970s', startYear: 1970, endYear: 1979 },
    { value: '1960s', label: '1960s', startYear: 1960, endYear: 1969 },
    { value: '1950s', label: '1950s', startYear: 1950, endYear: 1959 },
  ];

  const mockDecadesData: DecadeData[] = [
    {
      decade: '2020s',
      startYear: 2020,
      endYear: 2029,
      totalMovies: 150,
      averageRating: 7.2,
      description: 'The 2020s have brought us innovative storytelling, advanced visual effects, and diverse representation in cinema.',
      topGenres: [
        { id: 28, name: 'Action', count: 45 },
        { id: 18, name: 'Drama', count: 38 },
        { id: 35, name: 'Comedy', count: 32 },
        { id: 878, name: 'Science Fiction', count: 28 },
      ],
      movies: [
        { id: 1, title: 'Dune', release_date: '2021-10-22', poster_path: '/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', vote_average: 8.0, overview: 'Paul Atreides, a brilliant and gifted young man...', genre_ids: [878, 18] },
        { id: 2, title: 'Top Gun: Maverick', release_date: '2022-05-27', poster_path: '/62HCnUTziyWcpDaBO2i1DX17ljH.jpg', vote_average: 8.3, overview: 'After thirty years, Maverick is still pushing the envelope...', genre_ids: [28, 18] },
        { id: 3, title: 'Everything Everywhere All at Once', release_date: '2022-03-25', poster_path: '/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg', vote_average: 8.1, overview: 'An aging Chinese immigrant is swept up in an insane adventure...', genre_ids: [28, 12, 35] },
      ]
    },
    {
      decade: '2010s',
      startYear: 2010,
      endYear: 2019,
      totalMovies: 200,
      averageRating: 7.0,
      description: 'The 2010s marked the rise of superhero films, streaming platforms, and global cinema reaching new heights.',
      topGenres: [
        { id: 28, name: 'Action', count: 65 },
        { id: 878, name: 'Science Fiction', count: 52 },
        { id: 18, name: 'Drama', count: 48 },
        { id: 35, name: 'Comedy', count: 35 },
      ],
      movies: [
        { id: 4, title: 'Inception', release_date: '2010-07-16', poster_path: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', vote_average: 8.8, overview: 'A thief who steals corporate secrets through dream-sharing technology...', genre_ids: [28, 878, 53] },
        { id: 5, title: 'The Dark Knight Rises', release_date: '2012-07-20', poster_path: '/85cWkCVftiVs0BVey6pxX8uNmLt.jpg', vote_average: 8.4, overview: 'Eight years after the Joker\'s reign of anarchy...', genre_ids: [28, 80, 18] },
        { id: 6, title: 'Avengers: Endgame', release_date: '2019-04-26', poster_path: '/or06FN3Dka5tukK1e9sl16pB3iy.jpg', vote_average: 8.4, overview: 'After the devastating events of Avengers: Infinity War...', genre_ids: [28, 12, 878] },
      ]
    },
    {
      decade: '2000s',
      startYear: 2000,
      endYear: 2009,
      totalMovies: 180,
      averageRating: 6.8,
      description: 'The 2000s brought us groundbreaking franchises, digital effects, and the beginning of the modern blockbuster era.',
      topGenres: [
        { id: 28, name: 'Action', count: 58 },
        { id: 18, name: 'Drama', count: 45 },
        { id: 35, name: 'Comedy', count: 42 },
        { id: 878, name: 'Science Fiction', count: 35 },
      ],
      movies: [
        { id: 7, title: 'The Lord of the Rings: The Fellowship of the Ring', release_date: '2001-12-19', poster_path: '/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg', vote_average: 8.4, overview: 'A meek Hobbit from the Shire and eight companions...', genre_ids: [12, 18, 14] },
        { id: 8, title: 'The Dark Knight', release_date: '2008-07-18', poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg', vote_average: 9.0, overview: 'When the menace known as the Joker wreaks havoc...', genre_ids: [28, 80, 18] },
        { id: 9, title: 'Pirates of the Caribbean: The Curse of the Black Pearl', release_date: '2003-07-09', poster_path: '/z8onk7LV9Mmw6zKz4hT6pzzvmvl.jpg', vote_average: 7.8, overview: 'Blacksmith Will Turner teams up with eccentric pirate...', genre_ids: [12, 28, 35] },
      ]
    },
    {
      decade: '1990s',
      startYear: 1990,
      endYear: 1999,
      totalMovies: 160,
      averageRating: 7.1,
      description: 'The 1990s were a golden age of cinema with innovative storytelling, breakthrough technology, and iconic films.',
      topGenres: [
        { id: 18, name: 'Drama', count: 52 },
        { id: 35, name: 'Comedy', count: 48 },
        { id: 28, name: 'Action', count: 35 },
        { id: 10749, name: 'Romance', count: 25 },
      ],
      movies: [
        { id: 10, title: 'The Shawshank Redemption', release_date: '1994-09-23', poster_path: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', vote_average: 8.7, overview: 'Framed in the 1940s for the double murder of his wife...', genre_ids: [18, 80] },
        { id: 11, title: 'Pulp Fiction', release_date: '1994-10-14', poster_path: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', vote_average: 8.9, overview: 'The lives of two mob hitmen, a boxer, a gangster...', genre_ids: [80, 18] },
        { id: 12, title: 'Forrest Gump', release_date: '1994-07-06', poster_path: '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', vote_average: 8.8, overview: 'The presidencies of Kennedy and Johnson, the Vietnam War...', genre_ids: [35, 18, 10749] },
      ]
    },
  ];

  const fetchDecadesData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDecadesData(mockDecadesData);
      setTotalPages(1);
    } catch (err) {
      setError('Failed to fetch decades data');
      console.error('Error fetching decades data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecadesData();
  }, [currentPage]);

  useEffect(() => {
    let filtered = decadesData;

    // Filter by search query
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(decade =>
        decade.decade.toLowerCase().includes(searchQuery.toLowerCase()) ||
        decade.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        decade.movies.some(movie => movie.title.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort decades
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'movies':
          return b.totalMovies - a.totalMovies;
        case 'rating':
          return b.averageRating - a.averageRating;
        case 'decade':
        default:
          return b.startYear - a.startYear;
      }
    });

    setFilteredDecades(filtered);
  }, [searchQuery, sortBy, decadesData]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const renderDecadeCard = (decade: DecadeData) => (
    <Grid item xs={12} md={6} key={decade.decade}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <HistoryIcon color="primary" />
            <Typography variant="h5" component="h3">
              {decade.decade}
            </Typography>
          </Stack>
          
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <CalendarIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {decade.startYear} - {decade.endYear}
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {decade.description}
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Box textAlign="center">
              <Typography variant="h6" color="primary.main">
                {decade.totalMovies}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Movies
              </Typography>
            </Box>
            <Box textAlign="center">
              <Rating
                value={decade.averageRating / 2}
                precision={0.1}
                size="small"
                readOnly
              />
              <Typography variant="body2" color="text.secondary">
                {decade.averageRating.toFixed(1)} avg
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Top Genres:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {decade.topGenres.slice(0, 4).map((genre) => (
                <Chip
                  key={genre.id}
                  label={`${genre.name} (${genre.count})`}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Notable Films:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {decade.movies.slice(0, 3).map((movie) => (
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
              {decade.movies.length > 3 && (
                <Chip
                  label={`+${decade.movies.length - 3} more`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Stack>
          </Box>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            variant="contained"
            fullWidth
          >
            Explore {decade.decade}
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
        title="Movies by Decade"
        description="Explore movies organized by decade. Discover films from the 1920s to the present day, organized by era."
        keywords={['movies by decade', 'vintage movies', 'movie eras', 'cinema history', 'decade movies']}
      />
      <RecaptchaProtection action="decades" showStatus={false}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <HistoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h3" component="h1">
            Movie Decades
          </Typography>
        </Stack>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Explore cinema through the decades and discover the evolution of filmmaking
        </Typography>

        {/* Search and Sort */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search decades or movies..."
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

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="decades tabs">
          <Tab label="All Decades" />
          <Tab label="Modern Era (2000s+)" />
          <Tab label="Classic Era (Pre-2000s)" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {filteredDecades.map(renderDecadeCard)}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {filteredDecades.filter(decade => decade.startYear >= 2000).map(renderDecadeCard)}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {filteredDecades.filter(decade => decade.startYear < 2000).map(renderDecadeCard)}
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
      {filteredDecades.length === 0 && searchQuery && (
        <Box textAlign="center" sx={{ py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No decades found for "{searchQuery}"
          </Typography>
        </Box>
      )}

      {/* Stats */}
      <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Stack direction="row" spacing={4} justifyContent="center">
          <Box textAlign="center">
            <Typography variant="h4" color="primary.main">
              {filteredDecades.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Decades
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" color="secondary.main">
              {filteredDecades.reduce((sum, decade) => sum + decade.totalMovies, 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Movies
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" color="success.main">
              {filteredDecades.length > 0 ? (filteredDecades.reduce((sum, decade) => sum + decade.averageRating, 0) / filteredDecades.length).toFixed(1) : '0.0'}
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

export default function DecadesPage() {
  return (
    <ProtectedRoute>
      <DecadesPageContent />
    </ProtectedRoute>
  );
}