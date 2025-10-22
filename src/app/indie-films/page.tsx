'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  Alert,
  Button,
  Stack,
} from '@mui/material';
import {
  Movie as MovieIcon,
  Star as StarIcon,
  TrendingUp as TrendingIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import EnhancedAuthGuard from '@/components/EnhancedAuthGuard';
import { tmdbClient } from '@/lib/enhancedTmdb';
import { DisplayAd } from '@/components/GoogleAds';
import PaginationControls from '@/components/PaginationControls';

interface IndieFilm {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
  production_companies?: any[];
}

// Major indie film studios/production companies
const INDIE_COMPANIES = {
  'A24': '41077',
  'Plan B Entertainment': '3045',
  'Annapurna Pictures': '42310',
  'Fox Searchlight': '43',
  'Focus Features': '10146',
  'Blumhouse Productions': '3172',
  'Participant': '10307',
  'Neon': '90733',
  'STX Entertainment': '88711',
  'Lionsgate': '35',
};

function IndieFilmsPageContent() {
  const [films, setFilms] = useState<IndieFilm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStudio, setSelectedStudio] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('vote_average.desc');
  
  const router = useRouter();

  useEffect(() => {
    fetchIndieFilms();
  }, [currentPage, selectedStudio, sortBy]);

  const fetchIndieFilms = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build company IDs filter
      let companyIds = Object.values(INDIE_COMPANIES).join('|');
      if (selectedStudio !== 'all') {
        companyIds = INDIE_COMPANIES[selectedStudio as keyof typeof INDIE_COMPANIES];
      }

      // Fetch indie films using TMDB discover API
      const response = await tmdbClient.discoverMovies({
        with_companies: companyIds,
        'vote_count.gte': 50, // Minimum votes for quality filter
        sort_by: sortBy,
        page: currentPage,
      });

      if (response && response.results) {
        setFilms(response.results);
        setTotalPages(Math.min(response.total_pages, 50)); // Limit to 50 pages
      }
    } catch (err: any) {
      console.error('Error fetching indie films:', err);
      setError('Failed to load indie films. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path: string | null) => {
    if (!path) return '/placeholder-movie.svg';
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  const formatDate = (date: string) => {
    if (!date) return 'Date not available';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleMovieClick = (id: number) => {
    router.push(`/movie/${id}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 12 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          <MovieIcon sx={{ fontSize: 40, mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
          Independent Films
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Discover critically acclaimed independent films from renowned indie studios like A24, Plan B, Annapurna, and more.
        </Typography>

        {/* Google Ad */}
        <Box sx={{ my: 3 }}>
          <DisplayAd />
        </Box>

        {/* Filters */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Studio</InputLabel>
            <Select
              value={selectedStudio}
              label="Studio"
              onChange={(e) => {
                setSelectedStudio(e.target.value);
                setCurrentPage(1);
              }}
            >
              <MenuItem value="all">All Indie Studios</MenuItem>
              {Object.keys(INDIE_COMPANIES).map((studio) => (
                <MenuItem key={studio} value={studio}>
                  {studio}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
            >
              <MenuItem value="vote_average.desc">Highest Rated</MenuItem>
              <MenuItem value="popularity.desc">Most Popular</MenuItem>
              <MenuItem value="release_date.desc">Newest First</MenuItem>
              <MenuItem value="release_date.asc">Oldest First</MenuItem>
              <MenuItem value="vote_count.desc">Most Voted</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {loading ? (
          [...Array(12)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card>
                <Skeleton variant="rectangular" height={400} />
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : films.length === 0 ? (
          <Grid item xs={12}>
            <Alert severity="info">
              No indie films found with the selected filters.
            </Alert>
          </Grid>
        ) : (
          films.map((film) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={film.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
                onClick={() => handleMovieClick(film.id)}
              >
                <CardMedia
                  component="img"
                  height="400"
                  image={getImageUrl(film.poster_path)}
                  alt={film.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ mb: 1 }}>
                    <Chip
                      icon={<StarIcon />}
                      label={film.vote_average?.toFixed(1) || 'N/A'}
                      size="small"
                      color="warning"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>

                  <Typography
                    gutterBottom
                    variant="h6"
                    component="h2"
                    sx={{
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      minHeight: '3em',
                    }}
                  >
                    {film.title}
                  </Typography>

                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                    {formatDate(film.release_date)}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {film.overview || 'No description available.'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Google Ad */}
      <Box sx={{ my: 4 }}>
        <DisplayAd />
      </Box>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </Container>
  );
}

export default function IndieFilmsPage() {
  return (
    <EnhancedAuthGuard requiresAuth={false}>
      <IndieFilmsPageContent />
    </EnhancedAuthGuard>
  );
}
