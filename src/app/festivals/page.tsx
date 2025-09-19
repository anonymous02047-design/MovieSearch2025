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
  Festival as FestivalIcon,
  Search as SearchIcon,
  Star as StarIcon,
  Movie as MovieIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Public as PublicIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Festival {
  id: number;
  name: string;
  location: string;
  country: string;
  startDate: string;
  endDate: string;
  description: string;
  type: 'International' | 'National' | 'Regional' | 'Specialized';
  focus: string[];
  notableFilms: Array<{
    id: number;
    title: string;
    poster_path: string;
    year: number;
    award: string;
  }>;
  prestige: number;
  website: string;
  logo_path: string;
}

function FestivalsPageContent() {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFestivals, setFilteredFestivals] = useState<Festival[]>([]);
  const [sortBy, setSortBy] = useState('prestige');
  const [typeFilter, setTypeFilter] = useState('all');

  const sortOptions = [
    { value: 'prestige', label: 'Prestige' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'startDate', label: 'Start Date' },
    { value: 'location', label: 'Location' },
  ];

  const types = [
    { value: 'all', label: 'All Types' },
    { value: 'International', label: 'International' },
    { value: 'National', label: 'National' },
    { value: 'Regional', label: 'Regional' },
    { value: 'Specialized', label: 'Specialized' },
  ];

  const mockFestivals: Festival[] = [
    {
      id: 1,
      name: 'Cannes Film Festival',
      location: 'Cannes',
      country: 'France',
      startDate: '2024-05-14',
      endDate: '2024-05-25',
      description: 'The most prestigious film festival in the world, showcasing the best in international cinema and serving as a launchpad for many award-winning films.',
      type: 'International',
      focus: ['Art House', 'International Cinema', 'Auteur Films', 'Documentaries'],
      notableFilms: [
        { id: 1, title: 'Parasite', poster_path: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', year: 2019, award: 'Palme d\'Or' },
        { id: 2, title: 'Titane', poster_path: '/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg', year: 2021, award: 'Palme d\'Or' },
        { id: 3, title: 'Triangle of Sadness', poster_path: '/kSf9svfL2WrKeuK8W08xeR5lTn8.jpg', year: 2022, award: 'Palme d\'Or' },
      ],
      prestige: 10,
      website: 'https://www.festival-cannes.com',
      logo_path: '/cannes-logo.jpg'
    },
    {
      id: 2,
      name: 'Sundance Film Festival',
      location: 'Park City',
      country: 'United States',
      startDate: '2024-01-18',
      endDate: '2024-01-28',
      description: 'The premier showcase for independent cinema in the United States, known for discovering breakthrough films and launching careers of emerging filmmakers.',
      type: 'International',
      focus: ['Independent Films', 'Documentaries', 'Emerging Filmmakers', 'American Cinema'],
      notableFilms: [
        { id: 4, title: 'Whiplash', poster_path: '/l4OjPqyVf6eajQ4nwjvFb1gqI5c.jpg', year: 2014, award: 'Grand Jury Prize' },
        { id: 5, title: 'Get Out', poster_path: '/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg', year: 2017, award: 'Audience Award' },
        { id: 6, title: 'CODA', poster_path: '/BzVjmm8l23rPsijLiNLUzuQtyd.jpg', year: 2021, award: 'Grand Jury Prize' },
      ],
      prestige: 9,
      website: 'https://www.sundance.org',
      logo_path: '/sundance-logo.jpg'
    },
    {
      id: 3,
      name: 'Venice Film Festival',
      location: 'Venice',
      country: 'Italy',
      startDate: '2024-08-28',
      endDate: '2024-09-07',
      description: 'The oldest film festival in the world, held annually on the island of Lido in Venice, showcasing international cinema with a focus on artistic excellence.',
      type: 'International',
      focus: ['Art House', 'International Cinema', 'Classic Films', 'European Cinema'],
      notableFilms: [
        { id: 7, title: 'Joker', poster_path: '/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', year: 2019, award: 'Golden Lion' },
        { id: 8, title: 'Nomadland', poster_path: '/66pyvzXx6zQUpJfQi8GcHMh6u8Z.jpg', year: 2020, award: 'Golden Lion' },
        { id: 9, title: 'Happening', poster_path: '/happening-poster.jpg', year: 2021, award: 'Golden Lion' },
      ],
      prestige: 9,
      website: 'https://www.labiennale.org',
      logo_path: '/venice-logo.jpg'
    },
    {
      id: 4,
      name: 'Toronto International Film Festival',
      location: 'Toronto',
      country: 'Canada',
      startDate: '2024-09-05',
      endDate: '2024-09-15',
      description: 'One of the largest public film festivals in the world, known for its diverse programming and as a key stop on the awards season circuit.',
      type: 'International',
      focus: ['International Cinema', 'Documentaries', 'Canadian Films', 'Awards Season'],
      notableFilms: [
        { id: 10, title: 'La La Land', poster_path: '/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg', year: 2016, award: 'People\'s Choice Award' },
        { id: 11, title: 'Green Book', poster_path: '/7BsvSuDQuoqhWmU2fK7C2yMo4yP.jpg', year: 2018, award: 'People\'s Choice Award' },
        { id: 12, title: 'Jojo Rabbit', poster_path: '/7GsM4mtM0worCtIVeiQt28HieeN.jpg', year: 2019, award: 'People\'s Choice Award' },
      ],
      prestige: 8,
      website: 'https://www.tiff.net',
      logo_path: '/tiff-logo.jpg'
    },
    {
      id: 5,
      name: 'Berlin International Film Festival',
      location: 'Berlin',
      country: 'Germany',
      startDate: '2024-02-15',
      endDate: '2024-02-25',
      description: 'One of the "Big Three" European film festivals, known for its political focus and commitment to showcasing films that address social issues.',
      type: 'International',
      focus: ['Political Films', 'International Cinema', 'European Films', 'Social Issues'],
      notableFilms: [
        { id: 13, title: 'Parasite', poster_path: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', year: 2019, award: 'Golden Bear' },
        { id: 14, title: 'There Is No Evil', poster_path: '/there-is-no-evil-poster.jpg', year: 2020, award: 'Golden Bear' },
        { id: 15, title: 'Bad Luck Banging or Loony Porn', poster_path: '/bad-luck-banging-poster.jpg', year: 2021, award: 'Golden Bear' },
      ],
      prestige: 8,
      website: 'https://www.berlinale.de',
      logo_path: '/berlinale-logo.jpg'
    },
    {
      id: 6,
      name: 'SXSW Film Festival',
      location: 'Austin',
      country: 'United States',
      startDate: '2024-03-08',
      endDate: '2024-03-16',
      description: 'Part of the larger SXSW Conference, this festival focuses on emerging talent and innovative storytelling, with a strong emphasis on technology and interactivity.',
      type: 'Specialized',
      focus: ['Emerging Talent', 'Technology', 'Interactive Media', 'Music Films'],
      notableFilms: [
        { id: 16, title: 'A Quiet Place', poster_path: '/nAU74GmpUk7t5iklEp3bufwDq4n.jpg', year: 2018, award: 'Audience Award' },
        { id: 17, title: 'Us', poster_path: '/ux2dU1jQ2ACIMShzB3yP93Udpzc.jpg', year: 2019, award: 'Audience Award' },
        { id: 18, title: 'Everything Everywhere All at Once', poster_path: '/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg', year: 2022, award: 'Audience Award' },
      ],
      prestige: 7,
      website: 'https://www.sxsw.com',
      logo_path: '/sxsw-logo.jpg'
    },
  ];

  const fetchFestivals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFestivals(mockFestivals);
      setTotalPages(1);
    } catch (err) {
      setError('Failed to fetch festivals');
      console.error('Error fetching festivals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFestivals();
  }, [currentPage]);

  useEffect(() => {
    let filtered = festivals;

    // Filter by search query
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(festival =>
        festival.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        festival.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        festival.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        festival.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(festival => festival.type === typeFilter);
    }

    // Sort festivals
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'startDate':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'location':
          return a.location.localeCompare(b.location);
        case 'prestige':
        default:
          return b.prestige - a.prestige;
      }
    });

    setFilteredFestivals(filtered);
  }, [searchQuery, sortBy, typeFilter, festivals]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
  };

  const handleTypeChange = (event: any) => {
    setTypeFilter(event.target.value);
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'International': 'primary',
      'National': 'secondary',
      'Regional': 'success',
      'Specialized': 'warning',
    };
    return colors[type] || 'default';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <FestivalIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h3" component="h1">
            Film Festivals
          </Typography>
        </Stack>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Discover the world's most prestigious film festivals and their award-winning selections
        </Typography>

        {/* Search and Filters */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search festivals..."
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
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter}
              label="Type"
              onChange={handleTypeChange}
            >
              {types.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {/* Festivals Grid */}
      <Grid container spacing={3}>
        {filteredFestivals.map((festival) => (
          <Grid item xs={12} md={6} key={festival.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Box
                    component="img"
                    src={festival.logo_path || '/placeholder-movie.svg'}
                    alt={festival.name}
                    sx={{ width: 60, height: 60, objectFit: 'contain' }}
                  />
                  <Box>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {festival.name}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {festival.location}, {festival.country}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <Chip
                    label={festival.type}
                    size="small"
                    color={getTypeColor(festival.type) as any}
                    variant="outlined"
                  />
                  <Rating
                    value={festival.prestige / 2}
                    precision={0.5}
                    size="small"
                    readOnly
                  />
                  <Typography variant="body2" color="text.secondary">
                    {festival.prestige}/10
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <CalendarIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(festival.startDate)} - {formatDate(festival.endDate)}
                  </Typography>
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {festival.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Focus Areas:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {festival.focus.map((area) => (
                      <Chip
                        key={area}
                        label={area}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Notable Award Winners:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {festival.notableFilms.slice(0, 2).map((film) => (
                      <Chip
                        key={film.id}
                        label={`${film.title} (${film.year})`}
                        size="small"
                        variant="outlined"
                        component={Link}
                        href={`/movie/${film.id}`}
                        clickable
                      />
                    ))}
                    {festival.notableFilms.length > 2 && (
                      <Chip
                        label={`+${festival.notableFilms.length - 2} more`}
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
                  href={festival.website}
                  target="_blank"
                >
                  Visit Festival Website
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
      {filteredFestivals.length === 0 && (searchQuery || typeFilter !== 'all') && (
        <Box textAlign="center" sx={{ py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No festivals found matching your criteria
          </Typography>
        </Box>
      )}

      {/* Stats */}
      <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Stack direction="row" spacing={4} justifyContent="center">
          <Box textAlign="center">
            <Typography variant="h4" color="primary.main">
              {filteredFestivals.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Festivals
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" color="secondary.main">
              {new Set(filteredFestivals.map(f => f.country)).size}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Countries
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" color="success.main">
              {filteredFestivals.reduce((sum, f) => sum + f.notableFilms.length, 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Award Winners
            </Typography>
          </Box>
        </Stack>
      </Box>
      </Container>
  );
}

export default function FestivalsPage() {
  return (
    <ProtectedRoute>
      <FestivalsPageContent />
    </ProtectedRoute>
  );
}