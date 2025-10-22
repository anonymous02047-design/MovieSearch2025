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
  Stack,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Tv as TvIcon,
  Star as StarIcon,
  CheckCircle as AvailableIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import EnhancedAuthGuard from '@/components/EnhancedAuthGuard';
import { tmdbClient } from '@/lib/enhancedTmdb';
import { DisplayAd } from '@/components/GoogleAds';
import PaginationControls from '@/components/PaginationControls';

interface StreamingMovie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  overview: string;
  media_type?: string;
}

// Popular streaming providers (Watch Provider IDs from TMDB)
const STREAMING_PROVIDERS = {
  'Netflix': '8',
  'Amazon Prime Video': '9',
  'Disney Plus': '337',
  'Hulu': '15',
  'HBO Max': '384',
  'Apple TV Plus': '350',
  'Paramount Plus': '531',
  'Peacock': '387',
  'All Providers': 'all',
};

function StreamingPageContent() {
  const [movies, setMovies] = useState<StreamingMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [contentType, setContentType] = useState<string>('movie');
  const [region, setRegion] = useState<string>('US');
  
  const router = useRouter();

  useEffect(() => {
    fetchStreamingContent();
  }, [currentPage, selectedProvider, contentType, region]);

  const fetchStreamingContent = async () => {
    try {
      setLoading(true);
      setError(null);

      const discoverParams: any = {
        watch_region: region,
        sort_by: 'popularity.desc',
        page: currentPage,
      };

      // Add provider filter if not 'all'
      if (selectedProvider !== 'all') {
        discoverParams.with_watch_providers = selectedProvider;
      }

      // Fetch content based on type
      let response;
      if (contentType === 'movie') {
        response = await tmdbClient.discoverMovies(discoverParams);
      } else {
        response = await tmdbClient.discoverTVShows(discoverParams);
      }

      if (response && response.results) {
        setMovies(response.results);
        setTotalPages(Math.min(response.total_pages, 50)); // Limit to 50 pages
      }
    } catch (err: any) {
      console.error('Error fetching streaming content:', err);
      setError('Failed to load streaming content. Please try again later.');
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
    });
  };

  const handleContentClick = (item: StreamingMovie) => {
    if (contentType === 'tv' || item.media_type === 'tv') {
      router.push(`/tv/${item.id}`);
    } else {
      router.push(`/movie/${item.id}`);
    }
  };

  const getProviderName = (providerId: string) => {
    return Object.keys(STREAMING_PROVIDERS).find(
      key => STREAMING_PROVIDERS[key as keyof typeof STREAMING_PROVIDERS] === providerId
    ) || 'Streaming';
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
          <TvIcon sx={{ fontSize: 40, mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
          Streaming Now
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Discover what's available on your favorite streaming platforms.
        </Typography>

        {/* Google Ad */}
        <Box sx={{ my: 3 }}>
          <DisplayAd />
        </Box>

        {/* Filters */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Content Type</InputLabel>
            <Select
              value={contentType}
              label="Content Type"
              onChange={(e) => {
                setContentType(e.target.value);
                setCurrentPage(1);
              }}
            >
              <MenuItem value="movie">Movies</MenuItem>
              <MenuItem value="tv">TV Shows</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Streaming Provider</InputLabel>
            <Select
              value={selectedProvider}
              label="Streaming Provider"
              onChange={(e) => {
                setSelectedProvider(e.target.value);
                setCurrentPage(1);
              }}
            >
              {Object.entries(STREAMING_PROVIDERS).map(([name, id]) => (
                <MenuItem key={id} value={id}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Region</InputLabel>
            <Select
              value={region}
              label="Region"
              onChange={(e) => {
                setRegion(e.target.value);
                setCurrentPage(1);
              }}
            >
              <MenuItem value="US">United States</MenuItem>
              <MenuItem value="GB">United Kingdom</MenuItem>
              <MenuItem value="CA">Canada</MenuItem>
              <MenuItem value="AU">Australia</MenuItem>
              <MenuItem value="IN">India</MenuItem>
              <MenuItem value="JP">Japan</MenuItem>
              <MenuItem value="KR">South Korea</MenuItem>
              <MenuItem value="FR">France</MenuItem>
              <MenuItem value="DE">Germany</MenuItem>
              <MenuItem value="BR">Brazil</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {selectedProvider !== 'all' && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Showing content available on <strong>{getProviderName(selectedProvider)}</strong> in{' '}
            <strong>{region}</strong>
          </Alert>
        )}
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
        ) : movies.length === 0 ? (
          <Grid item xs={12}>
            <Alert severity="info">
              No streaming content found with the selected filters.
            </Alert>
          </Grid>
        ) : (
          movies.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
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
                onClick={() => handleContentClick(item)}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="400"
                    image={getImageUrl(item.poster_path)}
                    alt={item.title || item.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  {selectedProvider !== 'all' && (
                    <Chip
                      icon={<AvailableIcon />}
                      label="Available"
                      color="success"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ mb: 1 }}>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        icon={<StarIcon />}
                        label={item.vote_average?.toFixed(1) || 'N/A'}
                        size="small"
                        color="warning"
                      />
                      <Chip
                        label={contentType === 'tv' ? 'TV' : 'Movie'}
                        size="small"
                        color="primary"
                      />
                    </Stack>
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
                    {item.title || item.name}
                  </Typography>

                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                    {formatDate(item.release_date || item.first_air_date || '')}
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
                    {item.overview || 'No description available.'}
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

export default function StreamingPage() {
  return (
    <EnhancedAuthGuard requiresAuth={false}>
      <StreamingPageContent />
    </EnhancedAuthGuard>
  );
}
