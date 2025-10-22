'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Chip,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  alpha,
  useTheme,
  CircularProgress
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon,
  Star as StarIcon,
  ArrowBack as BackIcon,
  Tv as TvIcon,
  CalendarToday as CalendarIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import { tmdbApi } from '@/lib/tmdb';
import { getImageUrl, getBackdropUrl } from '@/lib/tmdb';
import SEO from '@/components/SEO';
import ResponsiveGrid from '@/components/ResponsiveGrid';
import TVShowCard from '@/components/TVShowCard';
import { useWatchlist } from '@/hooks/useWatchlist';
import ShareDialog from '@/components/ShareDialog';
import WatchProvidersSection from '@/components/WatchProvidersSection';
import UserReviewsSection from '@/components/UserReviewsSection';
import UniversalShareDialog from '@/components/UniversalShareDialog';
import TMDBImage from '@/components/TMDBImage';
import SeasonEpisodeTracker from '@/components/SeasonEpisodeTracker';
import MovieTrailerPlayer from '@/components/MovieTrailerPlayer';

interface TVShowDetails {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  last_air_date: string;
  vote_average: number;
  vote_count: number;
  genres: Array<{ id: number; name: string }>;
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time: number[];
  status: string;
  networks: Array<{ id: number; name: string; logo_path: string }>;
  created_by: Array<{ id: number; name: string; profile_path: string }>;
  popularity: number;
  original_language: string;
  origin_country: string[];
}

export default function TVShowDetailPage() {
  const params = useParams();
  const router = useRouter();
  const theme = useTheme();
  const tvId = parseInt(params.id as string);

  const [show, setShow] = useState<TVShowDetails | null>(null);
  const [credits, setCredits] = useState<any>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const [watchProviders, setWatchProviders] = useState<any>(null);
  const [universalShareOpen, setUniversalShareOpen] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [seasons, setSeasons] = useState<any[]>([]);

  const { addToWatchlist, removeFromWatchlist, isInWatchlist, addToFavorites, removeFromFavorites, isInFavorites } = useWatchlist();

  useEffect(() => {
    loadTVShowDetails();
  }, [tvId]);

  const loadTVShowDetails = async () => {
    try {
      setLoading(true);
      const [showData, creditsData, similarData, providersData] = await Promise.all([
        tmdbApi.getTVShowDetails(tvId),
        tmdbApi.getTVCredits(tvId),
        tmdbApi.getTVSimilar(tvId),
        tmdbApi.getTVWatchProviders(tvId)
      ]);

      setShow(showData);
      setCredits(creditsData);
      setSimilar(similarData.results?.slice(0, 8) || []);
      setWatchProviders(providersData.results?.US || null);
    } catch (error) {
      console.error('Error loading TV show details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWatchlist = () => {
    if (!show) return;
    
    const item = {
      id: show.id,
      title: show.name,
      type: 'tv' as const,
      poster_path: show.poster_path,
      vote_average: show.vote_average,
      first_air_date: show.first_air_date
    };

    if (isInWatchlist(show.id, 'tv')) {
      removeFromWatchlist(show.id, 'tv');
    } else {
      addToWatchlist(item);
    }
  };

  const handleFavorite = () => {
    if (!show) return;
    
    const item = {
      id: show.id,
      title: show.name,
      type: 'tv' as const,
      poster_path: show.poster_path,
      vote_average: show.vote_average,
      first_air_date: show.first_air_date
    };

    if (isInFavorites(show.id, 'tv')) {
      removeFromFavorites(show.id, 'tv');
    } else {
      addToFavorites(item);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!show) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4">TV Show not found</Typography>
        <Button onClick={() => router.push('/')} sx={{ mt: 2 }}>
          Go Home
        </Button>
      </Container>
    );
  }

  const year = show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'N/A';
  const rating = show.vote_average ? show.vote_average.toFixed(1) : 'N/A';
  const runtime = show.episode_run_time?.[0] || 'N/A';

  return (
    <>
      <SEO
        title={`${show.name} (${year}) - TV Show Details`}
        description={show.overview}
        keywords={[show.name, 'tv show', ...show.genres.map(g => g.name)]}
        image={getBackdropUrl(show.backdrop_path)}
      />

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '70vh',
          backgroundImage: `url(${getBackdropUrl(show.backdrop_path)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%)',
          }
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => router.back()}
            sx={{ color: 'white', mb: 2 }}
          >
            Back
          </Button>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  aspectRatio: '2/3',
                  background: `url(${getImageUrl(show.poster_path)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                }}
              />
            </Grid>

            <Grid item xs={12} md={8}>
              <Box sx={{ color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TvIcon sx={{ fontSize: 32 }} />
                  <Chip label="TV Show" color="secondary" />
                  <Chip label={show.status} variant="outlined" sx={{ color: 'white', borderColor: 'white' }} />
                </Box>

                <Typography variant="h2" component="h1" fontWeight={700} gutterBottom>
                  {show.name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <StarIcon sx={{ color: '#ffd700' }} />
                    <Typography variant="h5" fontWeight={600}>
                      {rating}
                    </Typography>
                  </Box>
                  <Typography variant="h6">•</Typography>
                  <Typography variant="h6">{year}</Typography>
                  <Typography variant="h6">•</Typography>
                  <Typography variant="h6">{show.number_of_seasons} Season{show.number_of_seasons > 1 ? 's' : ''}</Typography>
                  <Typography variant="h6">•</Typography>
                  <Typography variant="h6">{show.number_of_episodes} Episodes</Typography>
                  {runtime !== 'N/A' && (
                    <>
                      <Typography variant="h6">•</Typography>
                      <Typography variant="h6">{runtime} min/ep</Typography>
                    </>
                  )}
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                  {show.genres.map(genre => (
                    <Chip
                      key={genre.id}
                      label={genre.name}
                      sx={{
                        backgroundColor: alpha('#fff', 0.2),
                        color: 'white',
                        '&:hover': {
                          backgroundColor: alpha('#fff', 0.3),
                        }
                      }}
                    />
                  ))}
                </Box>

                <Typography variant="h6" paragraph sx={{ maxWidth: 800, lineHeight: 1.8 }}>
                  {show.overview}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mt: 4, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<PlayIcon />}
                    sx={{
                      background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    Watch Now
                  </Button>

                  <Tooltip title={isInWatchlist(show.id, 'tv') ? 'Remove from Watchlist' : 'Add to Watchlist'}>
                    <IconButton
                      onClick={handleWatchlist}
                      sx={{
                        backgroundColor: alpha('#fff', 0.2),
                        color: 'white',
                        '&:hover': {
                          backgroundColor: alpha('#fff', 0.3),
                        }
                      }}
                    >
                      {isInWatchlist(show.id, 'tv') ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                    </IconButton>
                  </Tooltip>

                  <Tooltip title={isInFavorites(show.id, 'tv') ? 'Remove from Favorites' : 'Add to Favorites'}>
                    <IconButton
                      onClick={handleFavorite}
                      sx={{
                        backgroundColor: alpha('#fff', 0.2),
                        color: 'white',
                        '&:hover': {
                          backgroundColor: alpha('#fff', 0.3),
                        }
                      }}
                    >
                      {isInFavorites(show.id, 'tv') ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Share">
                    <IconButton
                      onClick={() => setUniversalShareOpen(true)}
                      sx={{
                        backgroundColor: alpha('#fff', 0.2),
                        color: 'white',
                        '&:hover': {
                          backgroundColor: alpha('#fff', 0.3),
                        }
                      }}
                    >
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Watch Providers */}
        {watchProviders && (
          <WatchProvidersSection providers={watchProviders} country="US" />
        )}

        {/* Cast & Crew */}
        {credits && credits.cast && credits.cast.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" gutterBottom fontWeight={700}>
              Cast
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 3,
                overflowX: 'auto',
                pb: 2,
                '&::-webkit-scrollbar': {
                  height: 8,
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.5),
                  borderRadius: 4,
                },
              }}
            >
              {credits.cast.slice(0, 10).map((person: any) => (
                <Card
                  key={person.id}
                  sx={{
                    minWidth: 150,
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    }
                  }}
                  onClick={() => router.push(`/person/${person.id}`)}
                >
                  <Avatar
                    src={getImageUrl(person.profile_path, 'w200')}
                    sx={{ width: 150, height: 150 }}
                    variant="square"
                  >
                    {person.name[0]}
                  </Avatar>
                  <CardContent>
                    <Typography variant="subtitle2" fontWeight={600} noWrap>
                      {person.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {person.character}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        {/* User Reviews */}
        <UserReviewsSection
          contentId={show.id}
          contentType="tv"
          contentTitle={show.name}
        />

        {/* Similar TV Shows */}
        {similar.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h4" gutterBottom fontWeight={700}>
              Similar TV Shows
            </Typography>
            <ResponsiveGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={3}>
              {similar.map((tvShow) => (
                <TVShowCard key={tvShow.id} show={tvShow} />
              ))}
            </ResponsiveGrid>
          </Box>
        )}
      </Container>

      <ShareDialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title={show.name}
        description={show.overview}
      />

      <UniversalShareDialog
        open={universalShareOpen}
        onClose={() => setUniversalShareOpen(false)}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        title={show?.name || 'TV Show Details'}
        description={show?.overview || ''}
        imageUrl={show?.poster_path ? getImageUrl(show.poster_path, 'w500') : ''}
      />

      {trailerOpen && show && (
        <MovieTrailerPlayer
          movieId={show.id}
          movieTitle={show.name}
          open={trailerOpen}
          onClose={() => setTrailerOpen(false)}
        />
      )}
    </>
  );
}
