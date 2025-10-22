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
import { tmdbApi } from '@/lib/tmdb';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import SEO from '@/components/SEO';


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

  const fetchDecadesData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch real movie data for each decade from TMDB
      const decadePromises = decades.map(async (decade) => {
        try {
          // Fetch movies from this decade
          const moviesData = await tmdbApi.discoverMovies({
            page: 1,
            sort_by: 'popularity.desc',
            primary_release_year: decade.startYear,
            include_adult: false,
          });

          const movies = moviesData?.results?.slice(0, 10) || [];
          
          // Calculate stats
          const totalMovies = moviesData?.total_results || 0;
          const averageRating = movies.length > 0
            ? movies.reduce((sum: number, m: any) => sum + (m.vote_average || 0), 0) / movies.length
            : 0;

          // Get genre distribution
          const genreCounts: Record<number, number> = {};
          movies.forEach((movie: any) => {
            movie.genre_ids?.forEach((genreId: number) => {
              genreCounts[genreId] = (genreCounts[genreId] || 0) + 1;
            });
          });

          // Get genre names (we'll use predefined common genres)
          const genreNames: Record<number, string> = {
            28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
            80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
            14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
            9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction',
            10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
          };

          const topGenres = Object.entries(genreCounts)
            .map(([id, count]) => ({
              id: parseInt(id),
              name: genreNames[parseInt(id)] || `Genre ${id}`,
              count: count as number
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 4);

          return {
            decade: decade.label,
            startYear: decade.startYear,
            endYear: decade.endYear,
            movies: movies.map((m: any) => ({
              id: m.id,
              title: m.title,
              release_date: m.release_date,
              poster_path: m.poster_path,
              vote_average: m.vote_average,
              overview: m.overview,
              genre_ids: m.genre_ids
            })),
            totalMovies,
            averageRating: parseFloat(averageRating.toFixed(1)),
            topGenres,
            description: `Explore the best movies from the ${decade.label}, featuring ${totalMovies.toLocaleString()} titles from ${decade.startYear} to ${decade.endYear}.`
          };
        } catch (error) {
          console.error(`Error fetching data for ${decade.label}:`, error);
          return {
            decade: decade.label,
            startYear: decade.startYear,
            endYear: decade.endYear,
            movies: [],
            totalMovies: 0,
            averageRating: 0,
            topGenres: [],
            description: `Movies from the ${decade.label}.`
          };
        }
      });

      const decadesResults = await Promise.all(decadePromises);
      setDecadesData(decadesResults);
      setTotalPages(1);
    } catch (err) {
      setError('Failed to fetch decades data. Please try again.');
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