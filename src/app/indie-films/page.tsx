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
  MovieFilter as IndieIcon,
  Search as SearchIcon,
  Star as StarIcon,
  Movie as MovieIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as BudgetIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import SEO from '@/components/SEO';
import RecaptchaProtection from '@/components/RecaptchaProtection';

interface IndieFilm {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  budget: number;
  revenue: number;
  runtime: number;
  director: string;
  cast: string[];
  genres: string[];
  production_companies: string[];
  awards: string[];
  festival_circuit: string[];
  critical_reception: {
    score: number;
    reviews: number;
  };
}

function IndieFilmsPageContent() {
  const [films, setFilms] = useState<IndieFilm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFilms, setFilteredFilms] = useState<IndieFilm[]>([]);
  const [sortBy, setSortBy] = useState('rating');
  const [budgetFilter, setBudgetFilter] = useState('all');

  const sortOptions = [
    { value: 'rating', label: 'Rating' },
    { value: 'release_date', label: 'Release Date' },
    { value: 'budget', label: 'Budget' },
    { value: 'title', label: 'Title A-Z' },
  ];

  const budgetRanges = [
    { value: 'all', label: 'All Budgets' },
    { value: 'micro', label: 'Micro-budget (<$100K)' },
    { value: 'low', label: 'Low Budget ($100K-$1M)' },
    { value: 'medium', label: 'Medium Budget ($1M-$10M)' },
    { value: 'high', label: 'High Budget ($10M+)' },
  ];

  const mockIndieFilms: IndieFilm[] = [
    {
      id: 1,
      title: 'Moonlight',
      poster_path: '/qAwFbszz0kRyTuXm9KHBym6ulYN.jpg',
      release_date: '2016-10-21',
      vote_average: 8.1,
      overview: 'A young African-American man grapples with his identity and sexuality while experiencing the everyday struggles of childhood, adolescence, and burgeoning adulthood.',
      budget: 1500000,
      revenue: 65000000,
      runtime: 111,
      director: 'Barry Jenkins',
      cast: ['Trevante Rhodes', 'André Holland', 'Janelle Monáe', 'Ashton Sanders'],
      genres: ['Drama'],
      production_companies: ['A24', 'Plan B Entertainment'],
      awards: ['Academy Award for Best Picture', 'Golden Globe for Best Drama'],
      festival_circuit: ['Telluride Film Festival', 'Toronto International Film Festival'],
      critical_reception: { score: 98, reviews: 350 }
    },
    {
      id: 2,
      title: 'Lady Bird',
      poster_path: '/iySFtKLrWvVzXzlFj4xGfyzDEmu.jpg',
      release_date: '2017-11-03',
      vote_average: 7.4,
      overview: 'In 2002, an artistically inclined seventeen-year-old girl comes of age in Sacramento, California.',
      budget: 10000000,
      revenue: 79000000,
      runtime: 94,
      director: 'Greta Gerwig',
      cast: ['Saoirse Ronan', 'Laurie Metcalf', 'Tracy Letts', 'Lucas Hedges'],
      genres: ['Comedy', 'Drama'],
      production_companies: ['A24', 'IAC Films'],
      awards: ['Golden Globe for Best Musical or Comedy'],
      festival_circuit: ['Telluride Film Festival', 'Toronto International Film Festival'],
      critical_reception: { score: 99, reviews: 400 }
    },
    {
      id: 3,
      title: 'The Florida Project',
      poster_path: '/bn9iQd4ZJfTuz3C5i6kfO0V4o6d.jpg',
      release_date: '2017-10-06',
      vote_average: 7.6,
      overview: 'Set over one summer, the film follows precocious six-year-old Moonee as she courts mischief and adventure with her ragtag playmates.',
      budget: 2000000,
      revenue: 11000000,
      runtime: 111,
      director: 'Sean Baker',
      cast: ['Brooklynn Prince', 'Bria Vinaite', 'Willem Dafoe', 'Valeria Cotto'],
      genres: ['Drama'],
      production_companies: ['A24', 'Cre Film'],
      awards: ['Independent Spirit Award for Best Supporting Male'],
      festival_circuit: ['Cannes Film Festival', 'Telluride Film Festival'],
      critical_reception: { score: 96, reviews: 280 }
    },
    {
      id: 4,
      title: 'Hereditary',
      poster_path: '/p9fmuz2Oj3HtEJEqbIwkFGUhVXD.jpg',
      release_date: '2018-06-08',
      vote_average: 7.3,
      overview: 'A grieving family is haunted by tragic and disturbing occurrences.',
      budget: 10000000,
      revenue: 82000000,
      runtime: 127,
      director: 'Ari Aster',
      cast: ['Toni Collette', 'Alex Wolff', 'Milly Shapiro', 'Gabriel Byrne'],
      genres: ['Horror', 'Mystery', 'Thriller'],
      production_companies: ['A24', 'PalmStar Media'],
      awards: ['Gotham Award for Best Actress'],
      festival_circuit: ['Sundance Film Festival'],
      critical_reception: { score: 87, reviews: 320 }
    },
    {
      id: 5,
      title: 'The Farewell',
      poster_path: '/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg',
      release_date: '2019-07-12',
      vote_average: 7.5,
      overview: 'A Chinese family discovers their grandmother has only a short while left to live and decide to keep her in the dark.',
      budget: 3000000,
      revenue: 23000000,
      runtime: 98,
      director: 'Lulu Wang',
      cast: ['Awkwafina', 'Tzi Ma', 'Diana Lin', 'Zhao Shuzhen'],
      genres: ['Comedy', 'Drama'],
      production_companies: ['A24', 'Big Beach'],
      awards: ['Independent Spirit Award for Best Feature'],
      festival_circuit: ['Sundance Film Festival'],
      critical_reception: { score: 98, reviews: 250 }
    },
    {
      id: 6,
      title: 'Parasite',
      poster_path: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
      release_date: '2019-05-30',
      vote_average: 8.5,
      overview: 'A poor family schemes to become employed by a wealthy family by infiltrating their household and posing as unrelated, highly qualified individuals.',
      budget: 11400000,
      revenue: 258000000,
      runtime: 132,
      director: 'Bong Joon-ho',
      cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong', 'Choi Woo-shik'],
      genres: ['Comedy', 'Drama', 'Thriller'],
      production_companies: ['CJ Entertainment', 'Barunson E&A'],
      awards: ['Academy Award for Best Picture', 'Palme d\'Or'],
      festival_circuit: ['Cannes Film Festival', 'Toronto International Film Festival'],
      critical_reception: { score: 96, reviews: 500 }
    }
  ];

  const fetchIndieFilms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFilms(mockIndieFilms);
      setTotalPages(1);
    } catch (err) {
      setError('Failed to fetch indie films');
      console.error('Error fetching indie films:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndieFilms();
  }, [currentPage]);

  useEffect(() => {
    let filtered = films;

    // Filter by search query
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(film =>
        film.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        film.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
        film.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
        film.cast.some(actor => actor.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by budget
    if (budgetFilter !== 'all') {
      filtered = filtered.filter(film => {
        switch (budgetFilter) {
          case 'micro':
            return film.budget < 100000;
          case 'low':
            return film.budget >= 100000 && film.budget < 1000000;
          case 'medium':
            return film.budget >= 1000000 && film.budget < 10000000;
          case 'high':
            return film.budget >= 10000000;
          default:
            return true;
        }
      });
    }

    // Sort films
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'release_date':
          return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
        case 'budget':
          return b.budget - a.budget;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
        default:
          return b.vote_average - a.vote_average;
      }
    });

    setFilteredFilms(filtered);
  }, [searchQuery, sortBy, budgetFilter, films]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
  };

  const handleBudgetChange = (event: any) => {
    setBudgetFilter(event.target.value);
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  const getBudgetColor = (budget: number) => {
    if (budget < 100000) return 'success';
    if (budget < 1000000) return 'primary';
    if (budget < 10000000) return 'warning';
    return 'error';
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
        title="Indie Films"
        description="Discover independent films and indie cinema. Explore unique stories from independent filmmakers and studios."
        keywords={['indie films', 'independent movies', 'indie cinema', 'independent filmmakers', 'art house films']}
      />
      <RecaptchaProtection action="indie-films" showStatus={false}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <IndieIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h3" component="h1">
            Independent Films
          </Typography>
        </Stack>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Discover groundbreaking independent cinema that pushes creative boundaries and tells authentic stories
        </Typography>

        {/* Search and Filters */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search indie films..."
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
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Budget Range</InputLabel>
            <Select
              value={budgetFilter}
              label="Budget Range"
              onChange={handleBudgetChange}
            >
              {budgetRanges.map((range) => (
                <MenuItem key={range.value} value={range.value}>
                  {range.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {/* Films Grid */}
      <Grid container spacing={3}>
        {filteredFilms.map((film) => (
          <Grid item xs={12} sm={6} md={4} key={film.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="300"
                image={film.poster_path ? `https://image.tmdb.org/t/p/w500${film.poster_path}` : '/placeholder-movie.svg'}
                alt={film.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3" gutterBottom noWrap>
                  {film.title}
                </Typography>
                
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <Rating
                    value={film.vote_average / 2}
                    precision={0.1}
                    size="small"
                    readOnly
                  />
                  <Typography variant="body2" color="text.secondary">
                    {film.vote_average.toFixed(1)}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <CalendarIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(film.release_date).getFullYear()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • {film.runtime} min
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                  <Box textAlign="center">
                    <BudgetIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Budget: {formatCurrency(film.budget)}
                    </Typography>
                  </Box>
                  <Box textAlign="center">
                    <TrendingUpIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Revenue: {formatCurrency(film.revenue)}
                    </Typography>
                  </Box>
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {film.overview}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Director: {film.director}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    Cast: {film.cast.slice(0, 2).join(', ')}
                    {film.cast.length > 2 && ` +${film.cast.length - 2} more`}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {film.genres.slice(0, 3).map((genre) => (
                    <Chip
                      key={genre}
                      label={genre}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </CardContent>
              <CardActions>
                <Button
                  component={Link}
                  href={`/movie/${film.id}`}
                  size="small"
                  variant="contained"
                  fullWidth
                >
                  View Details
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
      {filteredFilms.length === 0 && (searchQuery || budgetFilter !== 'all') && (
        <Box textAlign="center" sx={{ py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No indie films found matching your criteria
          </Typography>
        </Box>
      )}

      {/* Stats */}
      <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Stack direction="row" spacing={4} justifyContent="center">
          <Box textAlign="center">
            <Typography variant="h4" color="primary.main">
              {filteredFilms.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Independent Films
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" color="secondary.main">
              {formatCurrency(filteredFilms.reduce((sum, film) => sum + film.budget, 0))}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Budget
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" color="success.main">
              {filteredFilms.length > 0 ? (filteredFilms.reduce((sum, film) => sum + film.vote_average, 0) / filteredFilms.length).toFixed(1) : '0.0'}
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

export default function IndieFilmsPage() {
  return (
    <ProtectedRoute>
      <IndieFilmsPageContent />
    </ProtectedRoute>
  );
}

