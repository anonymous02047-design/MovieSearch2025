'use client';

import React, { useState, useEffect } from 'react';
import AuthGuard from '@/components/AuthGuard';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  useTheme,
  alpha,
  CircularProgress
} from '@mui/material';
import {
  Movie as MovieIcon,
  Tv as TvIcon,
  Favorite as FavoriteIcon,
  Bookmark as BookmarkIcon,
  Visibility as ViewIcon,
  TrendingUp as TrendingIcon,
  Star as StarIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import StatsCard from '@/components/StatsCard';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useContinueWatching } from '@/hooks/useContinueWatching';
import SEO from '@/components/SEO';

function StatsPageContent() {
  const theme = useTheme();
  const { watchlist, favorites } = useWatchlist();
  const { continueWatching } = useContinueWatching();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  const movieCount = watchlist.filter(item => item.type === 'movie').length + 
                     favorites.filter(item => item.type === 'movie').length;
  const tvCount = watchlist.filter(item => item.type === 'tv').length + 
                  favorites.filter(item => item.type === 'tv').length;

  const averageRating = [...watchlist, ...favorites].length > 0
    ? (
        [...watchlist, ...favorites].reduce((sum, item) => sum + item.vote_average, 0) /
        [...watchlist, ...favorites].length
      ).toFixed(1)
    : '0.0';

  const stats = [
    {
      title: 'Total in Watchlist',
      value: watchlist.length,
      icon: <BookmarkIcon />,
      color: 'primary' as const,
      subtitle: 'Items to watch'
    },
    {
      title: 'Total Favorites',
      value: favorites.length,
      icon: <FavoriteIcon />,
      color: 'error' as const,
      subtitle: 'Loved content'
    },
    {
      title: 'Continue Watching',
      value: continueWatching.length,
      icon: <ViewIcon />,
      color: 'secondary' as const,
      subtitle: 'In progress'
    },
    {
      title: 'Movies Saved',
      value: movieCount,
      icon: <MovieIcon />,
      color: 'info' as const,
      subtitle: 'Total movies'
    },
    {
      title: 'TV Shows Saved',
      value: tvCount,
      icon: <TvIcon />,
      color: 'success' as const,
      subtitle: 'Total TV shows'
    },
    {
      title: 'Average Rating',
      value: averageRating,
      icon: <StarIcon />,
      color: 'warning' as const,
      subtitle: 'Of saved content'
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <>
      <SEO
        title="My Stats - MovieSearch 2025"
        description="View your personalized movie and TV show statistics"
        keywords={['stats', 'analytics', 'watchlist', 'favorites']}
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
              <AnalyticsIcon sx={{ fontSize: 48, color: 'primary.main' }} />
              <Typography variant="h3" component="h1" fontWeight={700}>
                Your Statistics
              </Typography>
            </Box>
            <Typography variant="h6" color="text.secondary">
              Track your movie and TV show journey
            </Typography>
          </Box>

          {/* Stats Grid */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <StatsCard {...stat} />
              </Grid>
            ))}
          </Grid>

          {/* Recent Activity */}
          <Paper
            elevation={3}
            sx={{
              p: 4,
              background: theme.palette.mode === 'dark'
                ? alpha('#fff', 0.05)
                : alpha('#000', 0.02),
              mb: 4,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <TrendingIcon color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h5" fontWeight={700}>
                Recent Activity
              </Typography>
            </Box>

            {continueWatching.length > 0 ? (
              <Box>
                {continueWatching.slice(0, 5).map((item, index) => (
                  <Box
                    key={`${item.type}-${item.id}`}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 2,
                      borderBottom: index < 4 ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none',
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {item.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {Math.round(item.progress)}% complete
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(item.lastWatched).toLocaleDateString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
                No recent activity. Start watching to track your progress!
              </Typography>
            )}
          </Paper>

          {/* Insights */}
          <Paper
            elevation={3}
            sx={{
              p: 4,
              background: theme.palette.mode === 'dark'
                ? `linear-gradient(135deg, ${alpha('#9c27b0', 0.1)} 0%, ${alpha('#e91e63', 0.05)} 100%)`
                : `linear-gradient(135deg, ${alpha('#9c27b0', 0.05)} 0%, ${alpha('#e91e63', 0.02)} 100%)`,
            }}
          >
            <Typography variant="h5" fontWeight={700} gutterBottom>
              💡 Insights
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" paragraph>
                  • You have <strong>{watchlist.length}</strong> items in your watchlist waiting to be discovered!
                </Typography>
                <Typography variant="body1" paragraph>
                  • Your favorite content has an average rating of <strong>{averageRating}</strong> ⭐
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" paragraph>
                  • You're currently watching <strong>{continueWatching.length}</strong> titles
                </Typography>
                <Typography variant="body1" paragraph>
                  • Keep exploring to discover more amazing content! 🎬
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </>
  );
}

export default function StatsPage() {
  return (
    <AuthGuard>
      <StatsPageContent />
    </AuthGuard>
  );
}

