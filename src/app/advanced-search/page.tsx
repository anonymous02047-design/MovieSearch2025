'use client';

import React, { useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Switch,
  FormControlLabel,
  Slider,
  useTheme,
  alpha,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { tmdbApi, Movie } from '@/lib/tmdb';
import { TVShow } from '@/components/TVShowCard';
import MovieCard from '@/components/MovieCard';
import TVShowCard from '@/components/TVShowCard';
import ResponsiveGrid from '@/components/ResponsiveGrid';
import SEO from '@/components/SEO';

const genres = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

function AdvancedSearchPageContent() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [contentType, setContentType] = useState<'movie' | 'tv'>('movie');
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [year, setYear] = useState<number | ''>('');
  const [rating, setRating] = useState<number[]>([0, 10]);
  const [includeAdult, setIncludeAdult] = useState(false);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [results, setResults] = useState<(Movie | TVShow)[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);

    try {
      const params: any = {
        page: 1,
        sort_by: sortBy,
        include_adult: includeAdult,
      };

      if (selectedGenres.length > 0) {
        params.with_genres = selectedGenres.join(',');
      }

      if (year) {
        params.year = year;
      }

      if (rating[0] > 0 || rating[1] < 10) {
        params['vote_average.gte'] = rating[0];
        params['vote_average.lte'] = rating[1];
      }

      const response = await tmdbApi.discoverMovies(params);
      setResults(response.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedGenres([]);
    setYear('');
    setRating([0, 10]);
    setIncludeAdult(false);
    setSortBy('popularity.desc');
    setResults([]);
    setSearched(false);
  };

  const toggleGenre = (genreId: number) => {
    setSelectedGenres(prev =>
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  return (
    <>
      <SEO
        title="Advanced Search - MovieSearch 2025"
        description="Find exactly what you're looking for with advanced search filters"
        keywords={['advanced search', 'movie filters', 'find movies', 'search options']}
      />

      <Box
        sx={{
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)'
            : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
          minHeight: '100vh',
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
              <SearchIcon sx={{ fontSize: 48, color: 'primary.main' }} />
              <Typography variant="h3" component="h1" fontWeight={700}>
                Advanced Search
              </Typography>
            </Box>
            <Typography variant="h6" color="text.secondary">
              Find exactly what you're looking for
            </Typography>
          </Box>

          {/* Search Form */}
          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Content Type */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Content Type</InputLabel>
                  <Select
                    value={contentType}
                    label="Content Type"
                    onChange={(e) => setContentType(e.target.value as 'movie' | 'tv')}
                  >
                    <MenuItem value="movie">Movies</MenuItem>
                    <MenuItem value="tv">TV Shows</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Sort By */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="popularity.desc">Most Popular</MenuItem>
                    <MenuItem value="popularity.asc">Least Popular</MenuItem>
                    <MenuItem value="vote_average.desc">Highest Rated</MenuItem>
                    <MenuItem value="vote_average.asc">Lowest Rated</MenuItem>
                    <MenuItem value="release_date.desc">Newest First</MenuItem>
                    <MenuItem value="release_date.asc">Oldest First</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Year */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Year</InputLabel>
                  <Select
                    value={year}
                    label="Year"
                    onChange={(e) => setYear(e.target.value as number | '')}
                  >
                    <MenuItem value="">All Years</MenuItem>
                    {years.map(y => (
                      <MenuItem key={y} value={y}>{y}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Rating */}
              <Grid item xs={12} md={6}>
                <Typography variant="body2" gutterBottom>
                  Rating: {rating[0]} - {rating[1]}
                </Typography>
                <Slider
                  value={rating}
                  onChange={(_, newValue) => setRating(newValue as number[])}
                  valueLabelDisplay="auto"
                  min={0}
                  max={10}
                  step={0.5}
                  marks={[
                    { value: 0, label: '0' },
                    { value: 5, label: '5' },
                    { value: 10, label: '10' }
                  ]}
                />
              </Grid>

              {/* Genres */}
              <Grid item xs={12}>
                <Typography variant="body2" gutterBottom>
                  Genres
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {genres.map(genre => (
                    <Chip
                      key={genre.id}
                      label={genre.name}
                      onClick={() => toggleGenre(genre.id)}
                      color={selectedGenres.includes(genre.id) ? 'primary' : 'default'}
                      variant={selectedGenres.includes(genre.id) ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Grid>

              {/* Include Adult */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={includeAdult}
                      onChange={(e) => setIncludeAdult(e.target.checked)}
                    />
                  }
                  label="Include Adult Content"
                />
              </Grid>

              {/* Buttons */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<SearchIcon />}
                    onClick={handleSearch}
                    disabled={loading}
                    sx={{ px: 4 }}
                  >
                    Search
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<ClearIcon />}
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Results */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} />
            </Box>
          ) : searched ? (
            <Box>
              <Typography variant="h5" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
                {results.length} Results Found
              </Typography>
              {results.length > 0 ? (
                <ResponsiveGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={3}>
                  {results.map((item: any) => {
                    const isMovie = item.title || !item.name;
                    return isMovie ? (
                      <MovieCard key={item.id} movie={item as Movie} />
                    ) : (
                      <TVShowCard key={item.id} show={item as TVShow} />
                    );
                  })}
                </ResponsiveGrid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h5" color="text.secondary" gutterBottom>
                    No results found
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Try adjusting your search criteria
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <FilterIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
              <Typography variant="h5" color="text.secondary" gutterBottom>
                Configure your search criteria above
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Use the filters to find exactly what you're looking for
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}

export default function AdvancedSearchPage() {
  return (
    <AuthGuard>
      <AdvancedSearchPageContent />
    </AuthGuard>
  );
}
