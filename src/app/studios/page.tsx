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
  Business as StudioIcon,
  Search as SearchIcon,
  Star as StarIcon,
  Movie as MovieIcon,
  FilterList as FilterIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import SEO from '@/components/SEO';
import RecaptchaProtection from '@/components/RecaptchaProtection';

interface Studio {
  id: number;
  name: string;
  logo_path: string;
  origin_country: string;
  headquarters: string;
  founded: number;
  description: string;
  parent_company?: string;
  notable_films: Array<{
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
  }>;
  total_films: number;
  average_rating: number;
  revenue: string;
}

function StudiosPageContent() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStudios, setFilteredStudios] = useState<Studio[]>([]);
  const [sortBy, setSortBy] = useState('popularity');
  const [countryFilter, setCountryFilter] = useState('all');

  const sortOptions = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'founded', label: 'Founded Year' },
    { value: 'rating', label: 'Average Rating' },
    { value: 'films', label: 'Number of Films' },
  ];

  const countries = [
    { value: 'all', label: 'All Countries' },
    { value: 'US', label: 'United States' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'FR', label: 'France' },
    { value: 'DE', label: 'Germany' },
    { value: 'JP', label: 'Japan' },
    { value: 'KR', label: 'South Korea' },
    { value: 'IN', label: 'India' },
    { value: 'CA', label: 'Canada' },
    { value: 'AU', label: 'Australia' },
  ];

  const mockStudios: Studio[] = [
    {
      id: 1,
      name: 'Walt Disney Studios',
      logo_path: '/1G6MqpInBIXFELlYu2pqvCLrgqh.jpg',
      origin_country: 'US',
      headquarters: 'Burbank, California, USA',
      founded: 1923,
      description: 'Walt Disney Studios is an American film studio and a division of The Walt Disney Company. It is one of the most successful film studios in the world.',
      parent_company: 'The Walt Disney Company',
      notable_films: [
        { id: 1, title: 'The Lion King', poster_path: '/2bXbqYdUdNVa8VIWXVfclP2ICtT.jpg', release_date: '2019-07-19', vote_average: 7.1 },
        { id: 2, title: 'Frozen II', poster_path: '/mINJaa34MtknCYl5AjtNJzWj8cD.jpg', release_date: '2019-11-22', vote_average: 6.8 },
        { id: 3, title: 'Avengers: Endgame', poster_path: '/or06FN3Dka5tukK1e9sl16pB3iy.jpg', release_date: '2019-04-26', vote_average: 8.4 },
      ],
      total_films: 500,
      average_rating: 7.2,
      revenue: '$11.7B'
    },
    {
      id: 2,
      name: 'Warner Bros. Pictures',
      logo_path: '/8rUnVMVZjlmQsJ45UGotD0Uznxj.png',
      origin_country: 'US',
      headquarters: 'Burbank, California, USA',
      founded: 1923,
      description: 'Warner Bros. Pictures is an American film studio and a subsidiary of Warner Bros. Entertainment, which is owned by Warner Bros. Discovery.',
      parent_company: 'Warner Bros. Discovery',
      notable_films: [
        { id: 4, title: 'The Dark Knight', poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg', release_date: '2008-07-18', vote_average: 9.0 },
        { id: 5, title: 'Inception', poster_path: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', release_date: '2010-07-16', vote_average: 8.8 },
        { id: 6, title: 'The Matrix', poster_path: '/hEpWvX6Bp79eLxY1kX5ZZJcme5U.jpg', release_date: '1999-03-31', vote_average: 8.7 },
      ],
      total_films: 400,
      average_rating: 7.5,
      revenue: '$4.8B'
    },
    {
      id: 3,
      name: 'Universal Pictures',
      logo_path: '/8rUnVMVZjlmQsJ45UGotD0Uznxj.png',
      origin_country: 'US',
      headquarters: 'Universal City, California, USA',
      founded: 1912,
      description: 'Universal Pictures is an American film studio owned by Comcast through its wholly owned subsidiary NBCUniversal.',
      parent_company: 'NBCUniversal',
      notable_films: [
        { id: 7, title: 'Jurassic Park', poster_path: '/oU7Oq2kFAAlGqbU4VoAE36g4hoI.jpg', release_date: '1993-06-11', vote_average: 8.1 },
        { id: 8, title: 'E.T. the Extra-Terrestrial', poster_path: '/qKMqJCldp5fPsuv6Vb0RbKY9K8U.jpg', release_date: '1982-06-11', vote_average: 7.9 },
        { id: 9, title: 'Back to the Future', poster_path: '/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg', release_date: '1985-07-03', vote_average: 8.5 },
      ],
      total_films: 350,
      average_rating: 7.0,
      revenue: '$4.1B'
    },
    {
      id: 4,
      name: 'Sony Pictures Entertainment',
      logo_path: '/8rUnVMVZjlmQsJ45UGotD0Uznxj.png',
      origin_country: 'US',
      headquarters: 'Culver City, California, USA',
      founded: 1987,
      description: 'Sony Pictures Entertainment is an American entertainment company that produces, acquires, and distributes filmed entertainment.',
      parent_company: 'Sony Corporation',
      notable_films: [
        { id: 10, title: 'Spider-Man: Into the Spider-Verse', poster_path: '/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg', release_date: '2018-12-14', vote_average: 8.4 },
        { id: 11, title: 'Jumanji: Welcome to the Jungle', poster_path: '/bXrZ5iHBEjH7WMidbUDQ0U2ybmA.jpg', release_date: '2017-12-20', vote_average: 6.3 },
        { id: 12, title: 'Men in Black', poster_path: '/uLOmOF5IzWoyrgIF5MfUnh5pa1X.jpg', release_date: '1997-07-02', vote_average: 7.3 },
      ],
      total_films: 300,
      average_rating: 6.8,
      revenue: '$3.2B'
    },
    {
      id: 5,
      name: 'Paramount Pictures',
      logo_path: '/8rUnVMVZjlmQsJ45UGotD0Uznxj.png',
      origin_country: 'US',
      headquarters: 'Hollywood, California, USA',
      founded: 1912,
      description: 'Paramount Pictures is an American film studio and a subsidiary of Paramount Global. It is the fifth oldest film studio in the world.',
      parent_company: 'Paramount Global',
      notable_films: [
        { id: 13, title: 'Titanic', poster_path: '/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg', release_date: '1997-12-19', vote_average: 7.9 },
        { id: 14, title: 'Forrest Gump', poster_path: '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', release_date: '1994-07-06', vote_average: 8.8 },
        { id: 15, title: 'Top Gun: Maverick', poster_path: '/62HCnUTziyWcpDaBO2i1DX17ljH.jpg', release_date: '2022-05-27', vote_average: 8.3 },
      ],
      total_films: 250,
      average_rating: 7.3,
      revenue: '$2.8B'
    },
    {
      id: 6,
      name: 'Studio Ghibli',
      logo_path: '/8rUnVMVZjlmQsJ45UGotD0Uznxj.png',
      origin_country: 'JP',
      headquarters: 'Koganei, Tokyo, Japan',
      founded: 1985,
      description: 'Studio Ghibli is a Japanese animation studio based in Koganei, Tokyo. It is best known for its animated feature films.',
      notable_films: [
        { id: 16, title: 'Spirited Away', poster_path: '/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg', release_date: '2001-07-20', vote_average: 8.6 },
        { id: 17, title: 'My Neighbor Totoro', poster_path: '/rtGDOeG9lzoerkDGZF9dnVeLppL.jpg', release_date: '1988-04-16', vote_average: 8.2 },
        { id: 18, title: 'Princess Mononoke', poster_path: '/jHWmNr7m544fJ8eItsfNk8FS2k0.jpg', release_date: '1997-07-12', vote_average: 8.4 },
      ],
      total_films: 22,
      average_rating: 8.1,
      revenue: '$200M'
    },
  ];

  const fetchStudios = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStudios(mockStudios);
      setTotalPages(1);
    } catch (err) {
      setError('Failed to fetch studios');
      console.error('Error fetching studios:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudios();
  }, [currentPage]);

  useEffect(() => {
    let filtered = studios;

    // Filter by search query
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(studio =>
        studio.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        studio.headquarters.toLowerCase().includes(searchQuery.toLowerCase()) ||
        studio.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by country
    if (countryFilter !== 'all') {
      filtered = filtered.filter(studio => studio.origin_country === countryFilter);
    }

    // Sort studios
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'founded':
          return a.founded - b.founded;
        case 'rating':
          return b.average_rating - a.average_rating;
        case 'films':
          return b.total_films - a.total_films;
        case 'popularity':
        default:
          return b.total_films - a.total_films; // Using total films as popularity proxy
      }
    });

    setFilteredStudios(filtered);
  }, [searchQuery, sortBy, countryFilter, studios]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
  };

  const handleCountryChange = (event: any) => {
    setCountryFilter(event.target.value);
  };

  const getCountryName = (code: string) => {
    const country = countries.find(c => c.value === code);
    return country ? country.label : code;
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
        title="Movie Studios"
        description="Explore major movie studios and production companies. Discover films from Hollywood studios and independent producers."
        keywords={['movie studios', 'production companies', 'hollywood studios', 'film studios', 'movie producers']}
      />
      <RecaptchaProtection action="studios" showStatus={false}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <StudioIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h3" component="h1">
            Film Studios
          </Typography>
        </Stack>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Discover major film studios, production companies, and their notable works
        </Typography>

        {/* Search and Filters */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search studios..."
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
            <InputLabel>Country</InputLabel>
            <Select
              value={countryFilter}
              label="Country"
              onChange={handleCountryChange}
            >
              {countries.map((country) => (
                <MenuItem key={country.value} value={country.value}>
                  {country.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {/* Studios Grid */}
      <Grid container spacing={3}>
        {filteredStudios.map((studio) => (
          <Grid item xs={12} md={6} key={studio.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Box
                    component="img"
                    src={studio.logo_path ? `https://image.tmdb.org/t/p/w200${studio.logo_path}` : '/placeholder-movie.svg'}
                    alt={studio.name}
                    sx={{ width: 60, height: 60, objectFit: 'contain' }}
                  />
                  <Box>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {studio.name}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {studio.headquarters}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <Chip
                    label={getCountryName(studio.origin_country)}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <CalendarIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Founded {studio.founded}
                  </Typography>
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {studio.description}
                </Typography>

                {studio.parent_company && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    <strong>Parent Company:</strong> {studio.parent_company}
                  </Typography>
                )}

                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="primary.main">
                      {studio.total_films}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Films
                    </Typography>
                  </Box>
                  <Box textAlign="center">
                    <Rating
                      value={studio.average_rating / 2}
                      precision={0.1}
                      size="small"
                      readOnly
                    />
                    <Typography variant="body2" color="text.secondary">
                      {studio.average_rating.toFixed(1)} avg
                    </Typography>
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="h6" color="success.main">
                      {studio.revenue}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Revenue
                    </Typography>
                  </Box>
                </Stack>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Notable Films:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {studio.notable_films.slice(0, 3).map((film) => (
                      <Chip
                        key={film.id}
                        label={film.title}
                        size="small"
                        variant="outlined"
                        component={Link}
                        href={`/movie/${film.id}`}
                        clickable
                      />
                    ))}
                    {studio.notable_films.length > 3 && (
                      <Chip
                        label={`+${studio.notable_films.length - 3} more`}
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
                  View Studio Details
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
      {filteredStudios.length === 0 && (searchQuery || countryFilter !== 'all') && (
        <Box textAlign="center" sx={{ py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No studios found matching your criteria
          </Typography>
        </Box>
      )}

      {/* Stats */}
      <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Stack direction="row" spacing={4} justifyContent="center">
          <Box textAlign="center">
            <Typography variant="h4" color="primary.main">
              {filteredStudios.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Studios
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" color="secondary.main">
              {filteredStudios.reduce((sum, studio) => sum + studio.total_films, 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Films
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" color="success.main">
              {filteredStudios.length > 0 ? (filteredStudios.reduce((sum, studio) => sum + studio.average_rating, 0) / filteredStudios.length).toFixed(1) : '0.0'}
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

export default function StudiosPage() {
  return (
    <ProtectedRoute>
      <StudiosPageContent />
    </ProtectedRoute>
  );
}