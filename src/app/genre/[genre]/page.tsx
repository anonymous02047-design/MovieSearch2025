'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter, useParams } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  TextField,
  InputAdornment,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Movie as MovieIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { tmdbApi, Movie } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import ResponsiveGrid from '@/components/ResponsiveGrid';
import EnhancedLoading from '@/components/EnhancedLoading';
import SEO from '@/components/SEO';

export const dynamic = 'force-dynamic';

const genreMap: { [key: string]: { id: number; name: string } } = {
  'action': { id: 28, name: 'Action' },
  'adventure': { id: 12, name: 'Adventure' },
  'animation': { id: 16, name: 'Animation' },
  'comedy': { id: 35, name: 'Comedy' },
  'crime': { id: 80, name: 'Crime' },
  'documentary': { id: 99, name: 'Documentary' },
  'drama': { id: 18, name: 'Drama' },
  'family': { id: 10751, name: 'Family' },
  'fantasy': { id: 14, name: 'Fantasy' },
  'history': { id: 36, name: 'History' },
  'horror': { id: 27, name: 'Horror' },
  'music': { id: 10402, name: 'Music' },
  'mystery': { id: 9648, name: 'Mystery' },
  'romance': { id: 10749, name: 'Romance' },
  'sci-fi': { id: 878, name: 'Science Fiction' },
  'thriller': { id: 53, name: 'Thriller' },
  'war': { id: 10752, name: 'War' },
  'western': { id: 37, name: 'Western' },
};

export default function GenrePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const params = useParams();
  const genreSlug = params.genre as string;
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [year, setYear] = useState('');

  const genre = genreMap[genreSlug];

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!user) {
      router.push('/sign-in');
      return;
    }

    if (!genre) {
      setError('Genre not found');
      setLoading(false);
      return;
    }

    loadMovies();
  }, [isLoaded, user, router, genre, currentPage, sortBy, year]);

  const loadMovies = async () => {
    if (!genre) return;

    try {
      setLoading(true);
      setError(null);

      const response = await tmdbApi.discoverMovies({
        with_genres: genre.id.toString(),
        sort_by: sortBy,
        page: currentPage,
        ...(year && { primary_release_year: parseInt(year) }),
      });

      setMovies(response.results || []);
      setTotalPages(response.total_pages || 1);
    } catch (err) {
      setError('Failed to load movies. Please try again later.');
      console.error('Error loading movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search functionality here
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.overview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= 1900; i--) {
      years.push(i);
    }
    return years;
  };

  if (!isLoaded) {
    return <EnhancedLoading message="Loading..." fullScreen />;
  }

  if (!user) {
    return null; // Will redirect to sign-in
  }

  if (!genre) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Genre Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            The requested genre does not exist.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <SEO
        title={`${genre.name} Movies - MovieSearch 2025`}
        description={`Discover the best ${genre.name.toLowerCase()} movies. Browse our collection of ${genre.name.toLowerCase()} films with ratings, reviews, and more.`}
        keywords={[genre.name.toLowerCase(), 'movies', 'films', 'cinema', 'entertainment']}
      />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom className="fade-in">
            {genre.name} Movies
          </Typography>
          <Typography variant="h6" color="text.secondary" className="fade-in stagger-1">
            Discover the best {genre.name.toLowerCase()} movies and films
          </Typography>
        </Box>

        {/* Search and Filters */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder={`Search ${genre.name.toLowerCase()} movies...`}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                className="fade-in stagger-2"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="popularity.desc">Most Popular</MenuItem>
                  <MenuItem value="vote_average.desc">Highest Rated</MenuItem>
                  <MenuItem value="release_date.desc">Newest</MenuItem>
                  <MenuItem value="release_date.asc">Oldest</MenuItem>
                  <MenuItem value="revenue.desc">Highest Grossing</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Year</InputLabel>
                <Select
                  value={year}
                  label="Year"
                  onChange={(e) => setYear(e.target.value)}
                >
                  <MenuItem value="">All Years</MenuItem>
                  {generateYears().map((year) => (
                    <MenuItem key={year} value={year.toString()}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <EnhancedLoading type="movie" message={`Loading ${genre.name.toLowerCase()} movies...`} />
        ) : (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {filteredMovies.length} {genre.name.toLowerCase()} movies found
              </Typography>
            </Box>

            <ResponsiveGrid>
              {filteredMovies.map((movie, index) => (
                <Box
                  key={movie.id}
                  className="fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <MovieCard movie={movie} />
                </Box>
              ))}
            </ResponsiveGrid>

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, page) => setCurrentPage(page)}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </>
  );
}
