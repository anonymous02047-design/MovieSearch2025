'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

// Dynamic route configuration
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Rating,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Tv as TvIcon,
  Star as StarIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  Language as LanguageIcon,
  ArrowBack as ArrowBackIcon,
  PlayArrow as PlayIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { tmdbApi } from '@/lib/tmdb';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import SEO from '@/components/SEO';


interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  last_air_date: string;
  number_of_episodes: number;
  number_of_seasons: number;
  vote_average: number;
  vote_count: number;
  popularity: number;
  status: string;
  type: string;
  genres: Array<{ id: number; name: string }>;
  networks: Array<{ id: number; name: string; logo_path: string | null }>;
  created_by: Array<{ id: number; name: string; profile_path: string | null }>;
  production_companies: Array<{ id: number; name: string; logo_path: string | null }>;
  origin_country: string[];
  languages: string[];
  homepage: string | null;
  in_production: boolean;
  last_episode_to_air: {
    id: number;
    name: string;
    overview: string;
    vote_average: number;
    vote_count: number;
    air_date: string;
    episode_number: number;
    production_code: string;
    runtime: number;
    season_number: number;
    show_id: number;
    still_path: string | null;
  } | null;
  next_episode_to_air: {
    id: number;
    name: string;
    overview: string;
    vote_average: number;
    vote_count: number;
    air_date: string;
    episode_number: number;
    production_code: string;
    runtime: number;
    season_number: number;
    show_id: number;
    still_path: string | null;
  } | null;
}

interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  air_date: string;
  episode_count: number;
}

function TVShowPageContent() {
  const params = useParams();
  const tvShowId = params?.id as string;
  
  const [tvShow, setTvShow] = useState<TVShow | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (tvShowId) {
      fetchTVShowDetails();
    }
  }, [tvShowId]);

  const fetchTVShowDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const [tvShowData, seasonsData] = await Promise.all([
        tmdbApi.getTVShowDetails(parseInt(tvShowId)),
        tmdbApi.getTVShowSeasons(parseInt(tvShowId))
      ]);

      setTvShow(tvShowData);
      setSeasons(seasonsData.seasons);
    } catch (err) {
      setError('Failed to fetch TV show details');
      console.error('Error fetching TV show details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: Implement bookmark functionality
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tvShow?.name,
        text: tvShow?.overview,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
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

  if (error || !tvShow) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'TV Show not found'}</Alert>
        <Box sx={{ mt: 2 }}>
          <Button
            component={Link}
            href="/trending"
            startIcon={<ArrowBackIcon />}
            variant="outlined"
          >
            Back to Trending
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <SEO
        title={`${tvShow.name} - TV Show Details`}
        description={`Watch ${tvShow.name} - ${tvShow.overview?.substring(0, 160)}...`}
        keywords={[tvShow.name, 'tv show', 'series', 'episodes', 'seasons', ...tvShow.genres.map(g => g.name)]}
      />
      <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Back Button */}
          <Box sx={{ mb: 3 }}>
            <Button
              component={Link}
              href="/trending"
              startIcon={<ArrowBackIcon />}
              variant="outlined"
            >
              Back to Trending
            </Button>
          </Box>

          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="body1" component="p" gutterBottom sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              fontSize: '14px',
            }}>
              📺 {tvShow.name}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              {tvShow.status} • {tvShow.number_of_seasons} Season{tvShow.number_of_seasons !== 1 ? 's' : ''} • {tvShow.number_of_episodes} Episode{tvShow.number_of_episodes !== 1 ? 's' : ''}
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Poster */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ mb: 3 }}>
                <CardMedia
                  component="img"
                  height="600"
                  image={tvShow.poster_path ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}` : '/placeholder-movie.svg'}
                  alt={tvShow.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Tooltip title={isBookmarked ? "Remove from Watchlist" : "Add to Watchlist"}>
                      <IconButton onClick={handleBookmark} color="primary">
                        {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Share">
                      <IconButton onClick={handleShare} color="primary">
                        <ShareIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* TV Show Details */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Card sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
                  Show Information
                </Typography>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Rating
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Rating value={tvShow.vote_average / 2} precision={0.1} readOnly />
                      <Typography variant="body1">
                        {tvShow.vote_average.toFixed(1)}/10 ({tvShow.vote_count.toLocaleString()} votes)
                      </Typography>
                    </Stack>
                  </Box>

                  {tvShow.first_air_date && (
                    <Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Air Dates
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <CalendarIcon color="action" />
                        <Typography variant="body1">
                          {new Date(tvShow.first_air_date).toLocaleDateString()}
                          {tvShow.last_air_date && (
                            <Typography component="span" color="text.secondary" sx={{ ml: 1 }}>
                              - {new Date(tvShow.last_air_date).toLocaleDateString()}
                            </Typography>
                          )}
                        </Typography>
                      </Stack>
                    </Box>
                  )}

                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Genres
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {tvShow.genres.map((genre) => (
                        <Chip key={genre.id} label={genre.name} color="primary" size="small" />
                      ))}
                    </Stack>
                  </Box>

                  {tvShow.networks && tvShow.networks.length > 0 && (
                    <Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Networks
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {tvShow.networks.map((network) => (
                          <Chip key={network.id} label={network.name} variant="outlined" size="small" />
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {tvShow.created_by && tvShow.created_by.length > 0 && (
                    <Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Created By
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {tvShow.created_by.map((creator) => (
                          <Chip key={creator.id} label={creator.name} variant="outlined" size="small" />
                        ))}
                      </Stack>
                    </Box>
                  )}

                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Popularity Score
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <StarIcon color="warning" />
                      <Typography variant="body1">{tvShow.popularity.toFixed(1)}</Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Card>

              {/* Overview */}
              {tvShow.overview && (
                <Card sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Overview
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    {tvShow.overview}
                  </Typography>
                </Card>
              )}

              {/* Last Episode */}
              {tvShow.last_episode_to_air && (
                <Card sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Last Episode
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {tvShow.last_episode_to_air.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Season {tvShow.last_episode_to_air.season_number}, Episode {tvShow.last_episode_to_air.episode_number}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Aired: {new Date(tvShow.last_episode_to_air.air_date).toLocaleDateString()}
                  </Typography>
                  {tvShow.last_episode_to_air.overview && (
                    <Typography variant="body2">
                      {tvShow.last_episode_to_air.overview}
                    </Typography>
                  )}
                </Card>
              )}

              {/* Next Episode */}
              {tvShow.next_episode_to_air && (
                <Card sx={{ p: 3, mb: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Next Episode
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {tvShow.next_episode_to_air.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Season {tvShow.next_episode_to_air.season_number}, Episode {tvShow.next_episode_to_air.episode_number}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Airs: {new Date(tvShow.next_episode_to_air.air_date).toLocaleDateString()}
                  </Typography>
                  {tvShow.next_episode_to_air.overview && (
                    <Typography variant="body2">
                      {tvShow.next_episode_to_air.overview}
                    </Typography>
                  )}
                </Card>
              )}
            </Grid>
          </Grid>

          {/* Seasons */}
          {seasons.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3, color: 'primary.main' }}>
                📺 Seasons ({seasons.length})
              </Typography>
              <Grid container spacing={3}>
                {seasons.map((season) => (
                  <Grid size={{ xs: 6, sm: 4, md: 3 }} key={season.id}>
                    <Card sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                      }
                    }}>
                      <CardMedia
                        component="img"
                        height="250"
                        image={season.poster_path ? `https://image.tmdb.org/t/p/w300${season.poster_path}` : '/placeholder-movie.svg'}
                        alt={season.name}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        <Typography variant="subtitle2" noWrap gutterBottom sx={{ fontWeight: 'bold' }}>
                          {season.name}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            {season.episode_count} episodes
                          </Typography>
                        </Stack>
                        {season.air_date && (
                          <Typography variant="caption" color="text.secondary">
                            {new Date(season.air_date).getFullYear()}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Container>
      </>
  );
}

export default function TVShowPage() {
  return (
    <ProtectedRoute>
      <TVShowPageContent />
    </ProtectedRoute>
  );
}
