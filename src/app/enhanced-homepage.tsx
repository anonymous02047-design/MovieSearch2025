'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Stack,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  TextField,
  InputAdornment,
  Fade,
  Slide,
  Zoom,
  Paper,
  Avatar,
  Badge,
  Divider,
} from '@mui/material';
import {
  Movie as MovieIcon,
  Tv as TvIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  PlayArrow as PlayIcon,
  Favorite as FavoriteIcon,
  Bookmark as BookmarkIcon,
  Share as ShareIcon,
  FilterList as FilterIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Refresh as RefreshIcon,
  ArrowForward as ArrowForwardIcon,
  LocalMovies as LocalMoviesIcon,
  Theaters as TheatersIcon,
  EmojiEvents as EmojiEventsIcon,
} from '@mui/icons-material';
import { tmdbApi, Movie } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import ResponsiveGrid from '@/components/ResponsiveGrid';
import EnhancedLoading from '@/components/EnhancedLoading';
import SEO from '@/components/SEO';

// Prevent static generation
export const dynamic = 'force-dynamic';

interface HeroSectionProps {
  onSearch: (query: string) => void;
}

function HeroSection({ onSearch }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
          `,
          animation: 'float 6s ease-in-out infinite',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in timeout={1000}>
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                mb: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                background: 'linear-gradient(45deg, #fff, #f0f0f0)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Discover Your Next Favorite Movie
            </Typography>
            
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                opacity: 0.9,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              Explore thousands of movies, TV shows, and actors with our advanced search and recommendation engine
            </Typography>

            <Paper
              component="form"
              onSubmit={handleSearch}
              sx={{
                maxWidth: 600,
                mx: 'auto',
                p: 2,
                bgcolor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <TextField
                fullWidth
                placeholder="Search for movies, TV shows, actors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #1976D2, #1CB5E0)',
                          }
                        }}
                      >
                        Search
                      </Button>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      border: 'none',
                    },
                  },
                }}
              />
            </Paper>

            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              sx={{ mt: 4, flexWrap: 'wrap', gap: 2 }}
            >
              <Chip
                icon={<MovieIcon />}
                label="Popular Movies"
                clickable
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                  }
                }}
              />
              <Chip
                icon={<TvIcon />}
                label="TV Shows"
                clickable
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                  }
                }}
              />
              <Chip
                icon={<StarIcon />}
                label="Top Rated"
                clickable
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                  }
                }}
              />
            </Stack>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}

interface QuickStatsProps {
  stats: {
    totalMovies: number;
    totalTVShows: number;
    totalActors: number;
    totalUsers: number;
  };
}

function QuickStats({ stats }: QuickStatsProps) {
  const statItems = [
    { label: 'Movies', value: stats.totalMovies, icon: <MovieIcon />, color: 'primary' },
    { label: 'TV Shows', value: stats.totalTVShows, icon: <TvIcon />, color: 'secondary' },
    { label: 'Actors', value: stats.totalActors, icon: <PersonIcon />, color: 'success' },
    { label: 'Users', value: stats.totalUsers, icon: <StarIcon />, color: 'warning' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
        Our Platform at a Glance
      </Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
        Join millions of movie enthusiasts discovering their next favorite film
      </Typography>
      
      <Grid container spacing={3}>
        {statItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={item.label}>
            <Slide direction="up" in timeout={800 + index * 200}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
                  }
                }}
              >
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    mx: 'auto',
                    mb: 2,
                    bgcolor: `${item.color}.main`,
                  }}
                >
                  {item.icon}
                </Avatar>
                <Typography variant="h3" component="div" gutterBottom>
                  {item.value.toLocaleString()}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {item.label}
                </Typography>
              </Card>
            </Slide>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

interface FeaturedSectionProps {
  title: string;
  movies: Movie[];
  loading: boolean;
  onViewAll: () => void;
  icon: React.ReactNode;
}

function FeaturedSection({ title, movies, loading, onViewAll, icon }: FeaturedSectionProps) {
  return (
    <Box sx={{ py: 6, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {icon}
            <Typography variant="h4" component="h2">
              {title}
            </Typography>
          </Box>
          <Button
            endIcon={<ArrowForwardIcon />}
            onClick={onViewAll}
            variant="outlined"
            className="hover-lift"
          >
            View All
          </Button>
        </Box>

        {loading ? (
          <EnhancedLoading type="movie" message={`Loading ${title.toLowerCase()}...`} />
        ) : (
          <ResponsiveGrid>
            {movies.slice(0, 8).map((movie, index) => (
              <Zoom in timeout={600 + index * 100} key={movie.id}>
                <Box>
                  <MovieCard movie={movie} />
                </Box>
              </Zoom>
            ))}
          </ResponsiveGrid>
        )}
      </Container>
    </Box>
  );
}

interface FeaturesSectionProps {
  onGetStarted: () => void;
}

function FeaturesSection({ onGetStarted }: FeaturesSectionProps) {
  const features = [
    {
      title: 'Advanced Search',
      description: 'Find movies and TV shows with powerful filters and search options',
      icon: <SearchIcon />,
      color: 'primary',
    },
    {
      title: 'Personalized Recommendations',
      description: 'Get movie suggestions based on your viewing history and preferences',
      icon: <StarIcon />,
      color: 'secondary',
    },
    {
      title: 'Watchlist & Favorites',
      description: 'Save movies and shows you want to watch or have already enjoyed',
      icon: <BookmarkIcon />,
      color: 'success',
    },
    {
      title: 'Community Reviews',
      description: 'Read reviews from other movie enthusiasts and share your own',
      icon: <PersonIcon />,
      color: 'warning',
    },
  ];

  return (
    <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Why Choose MovieSearch?
        </Typography>
        <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
          Discover the features that make us the best movie discovery platform
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={feature.title}>
              <Fade in timeout={800 + index * 200}>
                <Card
                  sx={{
                    height: '100%',
                    p: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: `${feature.color}.main`,
                        width: 48,
                        height: 48,
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h5" component="h3" gutterBottom>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="contained"
            size="large"
            onClick={onGetStarted}
            sx={{
              background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2, #1CB5E0)',
              },
              px: 4,
              py: 1.5,
            }}
            className="button-glow"
          >
            Get Started Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default function EnhancedHomePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [popular, topRated, nowPlaying] = await Promise.all([
        tmdbApi.getPopularMovies(1),
        tmdbApi.getTopRatedMovies(1),
        tmdbApi.getNowPlayingMovies(1),
      ]);

      setPopularMovies(popular.results || []);
      setTopRatedMovies(topRated.results || []);
      setNowPlayingMovies(nowPlaying.results || []);
    } catch (err) {
      setError('Failed to load movies. Please try again later.');
      console.error('Error loading movies:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      loadMovies();
    }
  }, [isLoaded, loadMovies]);

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleViewAll = (type: string) => {
    router.push(`/${type}`);
  };

  const handleGetStarted = () => {
    if (user) {
      router.push('/profile');
    } else {
      router.push('/sign-up');
    }
  };

  const mockStats = {
    totalMovies: 500000,
    totalTVShows: 100000,
    totalActors: 200000,
    totalUsers: 1000000,
  };

  if (!isLoaded) {
    return <EnhancedLoading message="Loading MovieSearch..." fullScreen />;
  }

  return (
    <>
      <SEO
        title="MovieSearch 2025 - Discover Your Next Favorite Movie"
        description="Explore thousands of movies, TV shows, and actors with our advanced search and recommendation engine. Find your next favorite film today!"
        keywords={['movies', 'movie search', 'film database', 'movie recommendations', 'TV shows']}
      />

      <Box>
        <HeroSection onSearch={handleSearch} />
        
        <QuickStats stats={mockStats} />
        
        <FeaturedSection
          title="Popular Movies"
          movies={popularMovies}
          loading={loading}
          onViewAll={() => handleViewAll('popular')}
          icon={<TrendingUpIcon color="primary" sx={{ fontSize: 32 }} />}
        />
        
        <FeaturedSection
          title="Top Rated Movies"
          movies={topRatedMovies}
          loading={loading}
          onViewAll={() => handleViewAll('top-rated')}
          icon={<StarIcon color="warning" sx={{ fontSize: 32 }} />}
        />
        
        <FeaturedSection
          title="Now Playing"
          movies={nowPlayingMovies}
          loading={loading}
          onViewAll={() => handleViewAll('now-playing')}
          icon={<TheatersIcon color="secondary" sx={{ fontSize: 32 }} />}
        />
        
        <FeaturesSection onGetStarted={handleGetStarted} />

        {error && (
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Alert severity="error" action={
              <Button color="inherit" size="small" onClick={loadMovies}>
                Retry
              </Button>
            }>
              {error}
            </Alert>
          </Container>
        )}
      </Box>
    </>
  );
}
