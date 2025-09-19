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
  Language as LanguageIcon,
  Search as SearchIcon,
  Star as StarIcon,
  Movie as MovieIcon,
  FilterList as FilterIcon,
  Public as PublicIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import SEO from '@/components/SEO';
import RecaptchaProtection from '@/components/RecaptchaProtection';

interface Language {
  id: string;
  name: string;
  nativeName: string;
  code: string;
  region: string;
  totalMovies: number;
  averageRating: number;
  notableFilms: Array<{
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
  }>;
  description: string;
  popularity: number;
}

function LanguagesPageContent() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLanguages, setFilteredLanguages] = useState<Language[]>([]);
  const [sortBy, setSortBy] = useState('popularity');
  const [regionFilter, setRegionFilter] = useState('all');

  const sortOptions = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'movies', label: 'Number of Movies' },
    { value: 'rating', label: 'Average Rating' },
  ];

  const regions = [
    { value: 'all', label: 'All Regions' },
    { value: 'North America', label: 'North America' },
    { value: 'Europe', label: 'Europe' },
    { value: 'Asia', label: 'Asia' },
    { value: 'South America', label: 'South America' },
    { value: 'Africa', label: 'Africa' },
    { value: 'Oceania', label: 'Oceania' },
  ];

  const mockLanguages: Language[] = [
    {
      id: 'en',
      name: 'English',
      nativeName: 'English',
      code: 'en',
      region: 'North America',
      totalMovies: 5000,
      averageRating: 6.8,
      popularity: 100,
      description: 'English is the most widely spoken language in cinema, with Hollywood being the global center of English-language film production.',
      notableFilms: [
        { id: 1, title: 'The Dark Knight', poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg', release_date: '2008-07-18', vote_average: 9.0 },
        { id: 2, title: 'Inception', poster_path: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', release_date: '2010-07-16', vote_average: 8.8 },
        { id: 3, title: 'Pulp Fiction', poster_path: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', release_date: '1994-10-14', vote_average: 8.9 },
      ]
    },
    {
      id: 'zh',
      name: 'Chinese',
      nativeName: '中文',
      code: 'zh',
      region: 'Asia',
      totalMovies: 800,
      averageRating: 7.2,
      popularity: 85,
      description: 'Chinese cinema includes films from mainland China, Hong Kong, and Taiwan, known for martial arts films and dramatic storytelling.',
      notableFilms: [
        { id: 4, title: 'Crouching Tiger, Hidden Dragon', poster_path: '/4B2a4vxqw78nsmKnlOj7jpf0H6t.jpg', release_date: '2000-12-08', vote_average: 7.8 },
        { id: 5, title: 'Hero', poster_path: '/mMZKh2t19yaCz8hSsiNIBeU1l0l.jpg', release_date: '2002-10-24', vote_average: 7.9 },
        { id: 6, title: 'In the Mood for Love', poster_path: '/u4nO7s9K2HagOqwOgj3H1Yc4RfC.jpg', release_date: '2000-09-29', vote_average: 8.1 },
      ]
    },
    {
      id: 'ja',
      name: 'Japanese',
      nativeName: '日本語',
      code: 'ja',
      region: 'Asia',
      totalMovies: 600,
      averageRating: 7.5,
      popularity: 80,
      description: 'Japanese cinema is renowned for its unique storytelling, anime, and influential directors like Akira Kurosawa and Hayao Miyazaki.',
      notableFilms: [
        { id: 7, title: 'Spirited Away', poster_path: '/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg', release_date: '2001-07-20', vote_average: 8.6 },
        { id: 8, title: 'Seven Samurai', poster_path: '/8OKmBV5BUFzmozIC3pPxjv0X4yx.jpg', release_date: '1954-04-26', vote_average: 8.6 },
        { id: 9, title: 'My Neighbor Totoro', poster_path: '/rtGDOeG9lzoerkDGZF9dnVeLppL.jpg', release_date: '1988-04-16', vote_average: 8.2 },
      ]
    },
    {
      id: 'ko',
      name: 'Korean',
      nativeName: '한국어',
      code: 'ko',
      region: 'Asia',
      totalMovies: 400,
      averageRating: 7.8,
      popularity: 75,
      description: 'Korean cinema has gained international recognition for its innovative storytelling, particularly in thrillers and dramas.',
      notableFilms: [
        { id: 10, title: 'Parasite', poster_path: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', release_date: '2019-05-30', vote_average: 8.5 },
        { id: 11, title: 'Oldboy', poster_path: '/rIZX6X0MIhyE4T4TXLrGhsLuH4T.jpg', release_date: '2003-11-21', vote_average: 8.3 },
        { id: 12, title: 'The Handmaiden', poster_path: '/tGWTz5aFQZgq3onEmhdNC7Cb4dG.jpg', release_date: '2016-06-01', vote_average: 8.1 },
      ]
    },
    {
      id: 'fr',
      name: 'French',
      nativeName: 'Français',
      code: 'fr',
      region: 'Europe',
      totalMovies: 700,
      averageRating: 7.1,
      popularity: 70,
      description: 'French cinema is known for its artistic approach, auteur theory, and influential movements like the French New Wave.',
      notableFilms: [
        { id: 13, title: 'Amélie', poster_path: '/f0uorE1VH5fQ4nLxjc6F9kEnH7t.jpg', release_date: '2001-04-25', vote_average: 8.3 },
        { id: 14, title: 'The Intouchables', poster_path: '/4mFsNQibDxniqOG1TdO6f26CFc1.jpg', release_date: '2011-11-02', vote_average: 8.5 },
        { id: 15, title: 'La La Land', poster_path: '/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg', release_date: '2016-12-25', vote_average: 8.0 },
      ]
    },
    {
      id: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      code: 'es',
      region: 'Europe',
      totalMovies: 500,
      averageRating: 6.9,
      popularity: 65,
      description: 'Spanish cinema includes films from Spain and Latin America, known for passionate storytelling and unique visual styles.',
      notableFilms: [
        { id: 16, title: 'Pan\'s Labyrinth', poster_path: '/4mFsNQibDxniqOG1TdO6f26CFc1.jpg', release_date: '2006-10-11', vote_average: 8.2 },
        { id: 17, title: 'The Secret in Their Eyes', poster_path: '/4mFsNQibDxniqOG1TdO6f26CFc1.jpg', release_date: '2009-08-13', vote_average: 8.2 },
        { id: 18, title: 'Y Tu Mamá También', poster_path: '/4mFsNQibDxniqOG1TdO6f26CFc1.jpg', release_date: '2001-06-08', vote_average: 7.7 },
      ]
    },
    {
      id: 'de',
      name: 'German',
      nativeName: 'Deutsch',
      code: 'de',
      region: 'Europe',
      totalMovies: 300,
      averageRating: 7.0,
      popularity: 60,
      description: 'German cinema has a rich history including expressionist films, New German Cinema, and contemporary international successes.',
      notableFilms: [
        { id: 19, title: 'The Lives of Others', poster_path: '/4mFsNQibDxniqOG1TdO6f26CFc1.jpg', release_date: '2006-03-23', vote_average: 8.4 },
        { id: 20, title: 'Run Lola Run', poster_path: '/4mFsNQibDxniqOG1TdO6f26CFc1.jpg', release_date: '1998-08-20', vote_average: 7.6 },
        { id: 21, title: 'Good Bye Lenin!', poster_path: '/4mFsNQibDxniqOG1TdO6f26CFc1.jpg', release_date: '2003-02-09', vote_average: 7.7 },
      ]
    },
    {
      id: 'hi',
      name: 'Hindi',
      nativeName: 'हिन्दी',
      code: 'hi',
      region: 'Asia',
      totalMovies: 1200,
      averageRating: 6.5,
      popularity: 90,
      description: 'Hindi cinema, popularly known as Bollywood, is the largest film industry in the world by number of films produced.',
      notableFilms: [
        { id: 22, title: '3 Idiots', poster_path: '/4mFsNQibDxniqOG1TdO6f26CFc1.jpg', release_date: '2009-12-25', vote_average: 8.1 },
        { id: 23, title: 'Lagaan', poster_path: '/4mFsNQibDxniqOG1TdO6f26CFc1.jpg', release_date: '2001-06-15', vote_average: 8.1 },
        { id: 24, title: 'Dangal', poster_path: '/4mFsNQibDxniqOG1TdO6f26CFc1.jpg', release_date: '2016-12-23', vote_average: 8.2 },
      ]
    },
  ];

  const fetchLanguages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLanguages(mockLanguages);
      setTotalPages(1);
    } catch (err) {
      setError('Failed to fetch languages');
      console.error('Error fetching languages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, [currentPage]);

  useEffect(() => {
    let filtered = languages;

    // Filter by search query
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(language =>
        language.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        language.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        language.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by region
    if (regionFilter !== 'all') {
      filtered = filtered.filter(language => language.region === regionFilter);
    }

    // Sort languages
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'movies':
          return b.totalMovies - a.totalMovies;
        case 'rating':
          return b.averageRating - a.averageRating;
        case 'popularity':
        default:
          return b.popularity - a.popularity;
      }
    });

    setFilteredLanguages(filtered);
  }, [searchQuery, sortBy, regionFilter, languages]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
  };

  const handleRegionChange = (event: any) => {
    setRegionFilter(event.target.value);
  };

  const getRegionColor = (region: string) => {
    const colors: { [key: string]: string } = {
      'North America': 'primary',
      'Europe': 'secondary',
      'Asia': 'success',
      'South America': 'warning',
      'Africa': 'info',
      'Oceania': 'error',
    };
    return colors[region] || 'default';
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
        title="Movies by Language"
        description="Discover movies organized by language. Explore films from different countries and cultures around the world."
        keywords={['movies by language', 'foreign films', 'international movies', 'multilingual films', 'world cinema']}
      />
      <RecaptchaProtection action="languages" showStatus={false}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <LanguageIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h3" component="h1">
            Movie Languages
          </Typography>
        </Stack>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Explore cinema from around the world through different languages and cultures
        </Typography>

        {/* Search and Filters */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search languages..."
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
            <InputLabel>Region</InputLabel>
            <Select
              value={regionFilter}
              label="Region"
              onChange={handleRegionChange}
            >
              {regions.map((region) => (
                <MenuItem key={region.value} value={region.value}>
                  {region.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {/* Languages Grid */}
      <Grid container spacing={3}>
        {filteredLanguages.map((language) => (
          <Grid item xs={12} sm={6} md={4} key={language.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <PublicIcon color="primary" />
                  <Box>
                    <Typography variant="h6" component="h3">
                      {language.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {language.nativeName}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <Chip
                    label={language.region}
                    size="small"
                    color={getRegionColor(language.region) as any}
                    variant="outlined"
                  />
                  <TrendingUpIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {language.popularity}% popularity
                  </Typography>
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {language.description}
                </Typography>

                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="primary.main">
                      {language.totalMovies.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Movies
                    </Typography>
                  </Box>
                  <Box textAlign="center">
                    <Rating
                      value={language.averageRating / 2}
                      precision={0.1}
                      size="small"
                      readOnly
                    />
                    <Typography variant="body2" color="text.secondary">
                      {language.averageRating.toFixed(1)} avg
                    </Typography>
                  </Box>
                </Stack>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Notable Films:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {language.notableFilms.slice(0, 2).map((film) => (
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
                    {language.notableFilms.length > 2 && (
                      <Chip
                        label={`+${language.notableFilms.length - 2} more`}
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
                  Explore {language.name} Films
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
      {filteredLanguages.length === 0 && (searchQuery || regionFilter !== 'all') && (
        <Box textAlign="center" sx={{ py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No languages found matching your criteria
          </Typography>
        </Box>
      )}

      {/* Stats */}
      <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Stack direction="row" spacing={4} justifyContent="center">
          <Box textAlign="center">
            <Typography variant="h4" color="primary.main">
              {filteredLanguages.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Languages
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" color="secondary.main">
              {filteredLanguages.reduce((sum, lang) => sum + lang.totalMovies, 0).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Movies
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" color="success.main">
              {new Set(filteredLanguages.map(lang => lang.region)).size}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Regions
            </Typography>
          </Box>
        </Stack>
      </Box>
        </Container>
      </RecaptchaProtection>
    </>
  );
}

export default function LanguagesPage() {
  return (
    <ProtectedRoute>
      <LanguagesPageContent />
    </ProtectedRoute>
  );
}