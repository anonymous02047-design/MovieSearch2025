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
  AttachMoney as BoxOfficeIcon,
  Search as SearchIcon,
  Star as StarIcon,
  Movie as MovieIcon,
  FilterList as FilterIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  Public as PublicIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import SEO from '@/components/SEO';


interface BoxOfficeMovie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  domestic_gross: number;
  worldwide_gross: number;
  budget: number;
  profit: number;
  profit_margin: number;
  opening_weekend: number;
  theaters: number;
  weeks_in_release: number;
  distributor: string;
  genre_ids: number[];
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
      id={`boxoffice-tabpanel-${index}`}
      aria-labelledby={`boxoffice-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function BoxOfficePageContent() {
  const [movies, setMovies] = useState<BoxOfficeMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMovies, setFilteredMovies] = useState<BoxOfficeMovie[]>([]);
  const [sortBy, setSortBy] = useState('worldwide_gross');
  const [yearFilter, setYearFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);

  const sortOptions = [
    { value: 'worldwide_gross', label: 'Worldwide Gross' },
    { value: 'domestic_gross', label: 'Domestic Gross' },
    { value: 'profit', label: 'Profit' },
    { value: 'profit_margin', label: 'Profit Margin' },
    { value: 'opening_weekend', label: 'Opening Weekend' },
    { value: 'rating', label: 'Rating' },
  ];

  const years = Array.from({ length: 10 }, (_, i) => 2024 - i);

  const mockBoxOfficeMovies: BoxOfficeMovie[] = [
    {
      id: 1,
      title: 'Avatar: The Way of Water',
      poster_path: '/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
      release_date: '2022-12-16',
      vote_average: 7.6,
      overview: 'Set more than a decade after the events of the first film...',
      domestic_gross: 684000000,
      worldwide_gross: 2320000000,
      budget: 460000000,
      profit: 1860000000,
      profit_margin: 404.3,
      opening_weekend: 134000000,
      theaters: 4202,
      weeks_in_release: 26,
      distributor: '20th Century Studios',
      genre_ids: [28, 12, 878]
    },
    {
      id: 2,
      title: 'Top Gun: Maverick',
      poster_path: '/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
      release_date: '2022-05-27',
      vote_average: 8.3,
      overview: 'After thirty years, Maverick is still pushing the envelope...',
      domestic_gross: 718000000,
      worldwide_gross: 1493000000,
      budget: 170000000,
      profit: 1323000000,
      profit_margin: 778.2,
      opening_weekend: 126700000,
      theaters: 4727,
      weeks_in_release: 24,
      distributor: 'Paramount Pictures',
      genre_ids: [28, 18]
    },
    {
      id: 3,
      title: 'Black Panther: Wakanda Forever',
      poster_path: '/sv1xJUazXeYqALzczSZ3O6nkH75.jpg',
      release_date: '2022-11-11',
      vote_average: 7.3,
      overview: 'Queen Ramonda, Shuri, M\'Baku, Okoye and the Dora Milaje...',
      domestic_gross: 453000000,
      worldwide_gross: 859000000,
      budget: 250000000,
      profit: 609000000,
      profit_margin: 243.6,
      opening_weekend: 181000000,
      theaters: 4205,
      weeks_in_release: 20,
      distributor: 'Walt Disney Studios',
      genre_ids: [28, 12, 878]
    },
    {
      id: 4,
      title: 'Jurassic World Dominion',
      poster_path: '/kAVRgw7GgK1CfYEJq8ME6EvRIgU.jpg',
      release_date: '2022-06-10',
      vote_average: 6.0,
      overview: 'Four years after the destruction of Isla Nublar...',
      domestic_gross: 376000000,
      worldwide_gross: 1001000000,
      budget: 185000000,
      profit: 816000000,
      profit_margin: 441.1,
      opening_weekend: 145000000,
      theaters: 4671,
      weeks_in_release: 18,
      distributor: 'Universal Pictures',
      genre_ids: [28, 12, 878]
    },
    {
      id: 5,
      title: 'Doctor Strange in the Multiverse of Madness',
      poster_path: '/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg',
      release_date: '2022-05-06',
      vote_average: 6.9,
      overview: 'Doctor Strange, with the help of mystical allies...',
      domestic_gross: 411000000,
      worldwide_gross: 956000000,
      budget: 200000000,
      profit: 756000000,
      profit_margin: 378.0,
      opening_weekend: 187000000,
      theaters: 4155,
      weeks_in_release: 16,
      distributor: 'Walt Disney Studios',
      genre_ids: [28, 12, 878]
    },
    {
      id: 6,
      title: 'Minions: The Rise of Gru',
      poster_path: '/wKiOkZTN9lUUWZLq94IafP9iC9S.jpg',
      release_date: '2022-07-01',
      vote_average: 6.5,
      overview: 'The untold story of one twelve-year-old\'s dream...',
      domestic_gross: 370000000,
      worldwide_gross: 940000000,
      budget: 80000000,
      profit: 860000000,
      profit_margin: 1075.0,
      opening_weekend: 107000000,
      theaters: 4407,
      weeks_in_release: 22,
      distributor: 'Universal Pictures',
      genre_ids: [16, 35, 28]
    },
  ];

  const fetchBoxOfficeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMovies(mockBoxOfficeMovies);
      setTotalPages(1);
    } catch (err) {
      setError('Failed to fetch box office data');
      console.error('Error fetching box office data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoxOfficeData();
  }, [currentPage]);

  useEffect(() => {
    let filtered = movies;

    // Filter by search query
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.distributor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by year
    if (yearFilter !== 'all') {
      filtered = filtered.filter(movie => 
        movie.release_date.startsWith(yearFilter)
      );
    }

    // Sort movies
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'domestic_gross':
          return b.domestic_gross - a.domestic_gross;
        case 'profit':
          return b.profit - a.profit;
        case 'profit_margin':
          return b.profit_margin - a.profit_margin;
        case 'opening_weekend':
          return b.opening_weekend - a.opening_weekend;
        case 'rating':
          return b.vote_average - a.vote_average;
        case 'worldwide_gross':
        default:
          return b.worldwide_gross - a.worldwide_gross;
      }
    });

    setFilteredMovies(filtered);
  }, [searchQuery, sortBy, yearFilter, movies]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
  };

  const handleYearChange = (event: any) => {
    setYearFilter(event.target.value);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(0)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  const getProfitColor = (margin: number) => {
    if (margin >= 500) return 'success';
    if (margin >= 200) return 'primary';
    if (margin >= 100) return 'warning';
    return 'error';
  };

  const renderMovieCard = (movie: BoxOfficeMovie) => (
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
          </Stack>

          <Stack spacing={1} sx={{ mb: 2 }}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Worldwide:
              </Typography>
              <Typography variant="body2" fontWeight="bold" color="primary.main">
                {formatCurrency(movie.worldwide_gross)}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Domestic:
              </Typography>
              <Typography variant="body2">
                {formatCurrency(movie.domestic_gross)}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Budget:
              </Typography>
              <Typography variant="body2">
                {formatCurrency(movie.budget)}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Profit:
              </Typography>
              <Typography variant="body2" fontWeight="bold" color={`${getProfitColor(movie.profit_margin)}.main`}>
                {formatCurrency(movie.profit)}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Margin:
              </Typography>
              <Chip
                label={`${movie.profit_margin.toFixed(1)}%`}
                size="small"
                color={getProfitColor(movie.profit_margin) as any}
                variant="outlined"
              />
            </Box>
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
        title="Box Office Movies"
        description="Discover the highest-grossing movies and box office hits. Explore top-earning films and blockbuster releases."
        keywords={['box office', 'highest grossing movies', 'blockbuster movies', 'movie revenue', 'top movies']}
      />
      <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <BoxOfficeIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h3" component="h1">
            Box Office
          </Typography>
        </Stack>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Track the highest-grossing movies, box office performance, and financial success
        </Typography>

        {/* Search and Filters */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search movies or distributors..."
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
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={yearFilter}
              label="Year"
              onChange={handleYearChange}
            >
              <MenuItem value="all">All Years</MenuItem>
              {years.map((year) => (
                <MenuItem key={year} value={year.toString()}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="box office tabs">
          <Tab label="All Time" />
          <Tab label="2024" />
          <Tab label="2023" />
          <Tab label="2022" />
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
          {filteredMovies.filter(movie => movie.release_date.startsWith('2024')).map(renderMovieCard)}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {filteredMovies.filter(movie => movie.release_date.startsWith('2023')).map(renderMovieCard)}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          {filteredMovies.filter(movie => movie.release_date.startsWith('2022')).map(renderMovieCard)}
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
      {filteredMovies.length === 0 && (searchQuery || yearFilter !== 'all') && (
        <Box textAlign="center" sx={{ py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No movies found matching your criteria
          </Typography>
        </Box>
      )}

      {/* Stats */}
      <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Stack direction="row" spacing={4} justifyContent="center">
          <Box textAlign="center">
            <Typography variant="h4" color="primary.main">
              {formatCurrency(filteredMovies.reduce((sum, movie) => sum + movie.worldwide_gross, 0))}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Worldwide Gross
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" color="secondary.main">
              {formatCurrency(filteredMovies.reduce((sum, movie) => sum + movie.profit, 0))}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Profit
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" color="success.main">
              {filteredMovies.length > 0 ? (filteredMovies.reduce((sum, movie) => sum + movie.profit_margin, 0) / filteredMovies.length).toFixed(1) : '0.0'}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Avg Profit Margin
            </Typography>
          </Box>
        </Stack>
      </Box>
        </Container>
      </>
  );
}

export default function BoxOfficePage() {
  return (
    <ProtectedRoute>
      <BoxOfficePageContent />
    </ProtectedRoute>
  );
}