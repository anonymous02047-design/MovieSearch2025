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
  Movie as ClassicIcon,
  Search as SearchIcon,
  Star as StarIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Theaters as TheaterIcon,
  EmojiEvents as AwardIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import SEO from '@/components/SEO';
import RecaptchaProtection from '@/components/RecaptchaProtection';

interface ClassicFilm {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  runtime: number;
  director: string;
  cast: string[];
  genres: string[];
  studio: string;
  awards: string[];
  cultural_impact: string[];
  restoration_status: 'Original' | 'Restored' | 'Remastered' | '4K';
  availability: string[];
  critical_consensus: string;
}

function ClassicsPageContent() {
  const [films, setFilms] = useState<ClassicFilm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFilms, setFilteredFilms] = useState<ClassicFilm[]>([]);
  const [sortBy, setSortBy] = useState('release_date');
  const [decadeFilter, setDecadeFilter] = useState('all');

  const sortOptions = [
    { value: 'release_date', label: 'Release Date' },
    { value: 'rating', label: 'Rating' },
    { value: 'title', label: 'Title A-Z' },
    { value: 'cultural_impact', label: 'Cultural Impact' },
  ];

  const decades = [
    { value: 'all', label: 'All Decades' },
    { value: '1920s', label: '1920s' },
    { value: '1930s', label: '1930s' },
    { value: '1940s', label: '1940s' },
    { value: '1950s', label: '1950s' },
    { value: '1960s', label: '1960s' },
    { value: '1970s', label: '1970s' },
    { value: '1980s', label: '1980s' },
    { value: '1990s', label: '1990s' },
  ];

  const mockClassicFilms: ClassicFilm[] = [
    {
      id: 1,
      title: 'Citizen Kane',
      poster_path: '/sav0jxhqiH0bPr2vZFU0Kjt2nZL.jpg',
      release_date: '1941-09-05',
      vote_average: 8.3,
      overview: 'Following the death of publishing tycoon Charles Foster Kane, reporters scramble to uncover the meaning of his final utterance: \'Rosebud.\'',
      runtime: 119,
      director: 'Orson Welles',
      cast: ['Orson Welles', 'Joseph Cotten', 'Dorothy Comingore', 'Everett Sloane'],
      genres: ['Drama', 'Mystery'],
      studio: 'RKO Radio Pictures',
      awards: ['Academy Award for Best Original Screenplay'],
      cultural_impact: ['Revolutionary cinematography', 'Influenced modern filmmaking', 'Considered greatest film ever made'],
      restoration_status: '4K',
      availability: ['HBO Max', 'Criterion Collection', 'Amazon Prime'],
      critical_consensus: 'Widely regarded as the greatest film ever made, Citizen Kane revolutionized cinema with its innovative techniques and complex narrative structure.'
    },
    {
      id: 2,
      title: 'Casablanca',
      poster_path: '/5K7cOHoay2mZusSInzSjEDxXz52.jpg',
      release_date: '1942-11-26',
      vote_average: 8.5,
      overview: 'A cynical expatriate American cafe owner struggles to decide whether or not to help his former lover and her fugitive husband escape the Nazis in French Morocco.',
      runtime: 102,
      director: 'Michael Curtiz',
      cast: ['Humphrey Bogart', 'Ingrid Bergman', 'Paul Henreid', 'Claude Rains'],
      genres: ['Drama', 'Romance', 'War'],
      studio: 'Warner Bros.',
      awards: ['Academy Award for Best Picture', 'Academy Award for Best Director'],
      cultural_impact: ['Iconic dialogue', 'Timeless romance', 'Anti-fascist themes'],
      restoration_status: '4K',
      availability: ['HBO Max', 'TCM', 'Amazon Prime'],
      critical_consensus: 'A perfect blend of romance, drama, and political intrigue that has become one of the most beloved films in cinema history.'
    },
    {
      id: 3,
      title: 'The Godfather',
      poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
      release_date: '1972-03-24',
      vote_average: 9.2,
      overview: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
      runtime: 175,
      director: 'Francis Ford Coppola',
      cast: ['Marlon Brando', 'Al Pacino', 'James Caan', 'Robert Duvall'],
      genres: ['Crime', 'Drama'],
      studio: 'Paramount Pictures',
      awards: ['Academy Award for Best Picture', 'Academy Award for Best Actor'],
      cultural_impact: ['Defined the gangster genre', 'Influenced countless films', 'Cultural phenomenon'],
      restoration_status: '4K',
      availability: ['Paramount+', 'Amazon Prime', 'iTunes'],
      critical_consensus: 'A masterful exploration of power, family, and corruption that redefined the gangster genre and remains one of cinema\'s greatest achievements.'
    },
    {
      id: 4,
      title: 'Gone with the Wind',
      poster_path: '/lNz2Ow0w1GGBz4S6y6eFq71Bq3r.jpg',
      release_date: '1939-12-15',
      vote_average: 8.2,
      overview: 'A manipulative woman and a roguish man conduct a turbulent romance during the American Civil War and Reconstruction periods.',
      runtime: 238,
      director: 'Victor Fleming',
      cast: ['Vivien Leigh', 'Clark Gable', 'Olivia de Havilland', 'Hattie McDaniel'],
      genres: ['Drama', 'Romance', 'War'],
      studio: 'MGM',
      awards: ['Academy Award for Best Picture', 'Academy Award for Best Actress'],
      cultural_impact: ['Epic scale', 'Technicolor achievement', 'Controversial legacy'],
      restoration_status: '4K',
      availability: ['HBO Max', 'TCM', 'Amazon Prime'],
      critical_consensus: 'A sweeping epic that showcases Hollywood\'s golden age at its most lavish, though its racial politics remain problematic.'
    },
    {
      id: 5,
      title: 'Lawrence of Arabia',
      poster_path: '/qumGqj20ED5vqB6sZfW2JmHqFyL.jpg',
      release_date: '1962-12-11',
      vote_average: 8.3,
      overview: 'The story of T.E. Lawrence, the English officer who successfully united and led the diverse, often warring, Arab tribes during World War I.',
      runtime: 227,
      director: 'David Lean',
      cast: ['Peter O\'Toole', 'Alec Guinness', 'Anthony Quinn', 'Jack Hawkins'],
      genres: ['Adventure', 'Biography', 'Drama', 'History'],
      studio: 'Columbia Pictures',
      awards: ['Academy Award for Best Picture', 'Academy Award for Best Director'],
      cultural_impact: ['Epic cinematography', 'Desert landscapes', 'Influenced adventure films'],
      restoration_status: '4K',
      availability: ['Sony Pictures', 'Amazon Prime', 'iTunes'],
      critical_consensus: 'A magnificent epic that showcases the power of cinema to transport audiences to distant lands and times.'
    },
    {
      id: 6,
      title: 'The Wizard of Oz',
      poster_path: '/4p1N2Qrt8j0H8xMHMHvtRxv9weZ.jpg',
      release_date: '1939-08-25',
      vote_average: 8.1,
      overview: 'Young Dorothy Gale and her dog Toto are swept away by a tornado from their Kansas farm to the magical Land of Oz.',
      runtime: 102,
      director: 'Victor Fleming',
      cast: ['Judy Garland', 'Frank Morgan', 'Ray Bolger', 'Bert Lahr'],
      genres: ['Adventure', 'Family', 'Fantasy', 'Musical'],
      studio: 'MGM',
      awards: ['Academy Award for Best Original Song', 'Academy Award for Best Original Score'],
      cultural_impact: ['Technicolor breakthrough', 'Beloved family classic', 'Cultural icon'],
      restoration_status: '4K',
      availability: ['HBO Max', 'TCM', 'Amazon Prime'],
      critical_consensus: 'A timeless family classic that continues to enchant audiences with its magical story and groundbreaking use of Technicolor.'
    }
  ];

  const fetchClassicFilms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFilms(mockClassicFilms);
      setTotalPages(1);
    } catch (err) {
      setError('Failed to fetch classic films');
      console.error('Error fetching classic films:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassicFilms();
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

    // Filter by decade
    if (decadeFilter !== 'all') {
      const decade = parseInt(decadeFilter.replace('s', ''));
      filtered = filtered.filter(film => {
        const year = new Date(film.release_date).getFullYear();
        return year >= decade && year < decade + 10;
      });
    }

    // Sort films
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.vote_average - a.vote_average;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'cultural_impact':
          return b.cultural_impact.length - a.cultural_impact.length;
        case 'release_date':
        default:
          return new Date(a.release_date).getTime() - new Date(b.release_date).getTime();
      }
    });

    setFilteredFilms(filtered);
  }, [searchQuery, sortBy, decadeFilter, films]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
  };

  const handleDecadeChange = (event: any) => {
    setDecadeFilter(event.target.value);
  };

  const getRestorationColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Original': 'default',
      'Restored': 'primary',
      'Remastered': 'secondary',
      '4K': 'success',
    };
    return colors[status] || 'default';
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
        title="Classic Movies"
        description="Explore timeless classic movies and cinema masterpieces. Discover legendary films that have shaped the history of cinema."
        keywords={['classic movies', 'cinema classics', 'vintage films', 'movie masterpieces', 'timeless films']}
      />
      <RecaptchaProtection action="classics" showStatus={false}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <ClassicIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h3" component="h1">
            Classic Films
          </Typography>
        </Stack>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Explore the timeless masterpieces that defined cinema and continue to inspire filmmakers today
        </Typography>

        {/* Search and Filters */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search classic films..."
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
            <InputLabel>Decade</InputLabel>
            <Select
              value={decadeFilter}
              label="Decade"
              onChange={handleDecadeChange}
            >
              {decades.map((decade) => (
                <MenuItem key={decade.value} value={decade.value}>
                  {decade.label}
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

                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <TheaterIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {film.studio}
                  </Typography>
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

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                  {film.genres.slice(0, 3).map((genre) => (
                    <Chip
                      key={genre}
                      label={genre}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <Chip
                    label={film.restoration_status}
                    size="small"
                    color={getRestorationColor(film.restoration_status) as any}
                    variant="outlined"
                  />
                  <AwardIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {film.awards.length} awards
                  </Typography>
                </Stack>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Available on:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {film.availability.slice(0, 2).map((platform) => (
                      <Chip
                        key={platform}
                        label={platform}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                    {film.availability.length > 2 && (
                      <Chip
                        label={`+${film.availability.length - 2}`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Stack>
                </Box>
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
      {filteredFilms.length === 0 && (searchQuery || decadeFilter !== 'all') && (
        <Box textAlign="center" sx={{ py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No classic films found matching your criteria
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
              Classic Films
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" color="secondary.main">
              {new Set(filteredFilms.map(f => f.studio)).size}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Studios
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" color="success.main">
              {filteredFilms.reduce((sum, f) => sum + f.awards.length, 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Awards
            </Typography>
          </Box>
        </Stack>
      </Box>
        </Container>
      </RecaptchaProtection>
    </>
  );
}

export default function ClassicsPage() {
  return (
    <ProtectedRoute>
      <ClassicsPageContent />
    </ProtectedRoute>
  );
}