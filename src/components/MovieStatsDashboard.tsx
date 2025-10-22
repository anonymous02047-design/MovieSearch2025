'use client';

import React, { useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Bookmark as BookmarkIcon,
  Visibility as ViewIcon,
  TrendingUp as TrendingIcon,
  Movie as MovieIcon,
  Tv as TvIcon,
} from '@mui/icons-material';
import { StoredMovie } from '@/lib/storage';
import { ViewingHistoryItem } from '@/hooks/useViewingHistory';
import { MovieNote } from '@/hooks/useMovieNotes';

interface MovieStatsDashboardProps {
  favorites?: StoredMovie[];
  watchlist?: StoredMovie[];
  viewingHistory?: ViewingHistoryItem[];
  notes?: Record<number, MovieNote>;
}

export default function MovieStatsDashboard({
  favorites = [],
  watchlist = [],
  viewingHistory = [],
  notes = {},
}: MovieStatsDashboardProps) {
  const stats = useMemo(() => {
    const notesArray = Object.values(notes);
    const completedViews = viewingHistory.filter(v => v.completed).length;
    const totalViewTime = viewingHistory.reduce((sum, v) => sum + (v.duration || 0), 0);

    // Calculate genre distribution (mock data for demonstration)
    const genreDistribution: Record<string, number> = {
      Action: 15,
      Drama: 22,
      Comedy: 18,
      Thriller: 12,
      'Sci-Fi': 10,
      Horror: 8,
      Romance: 7,
      Animation: 8,
    };

    const sortedGenres = Object.entries(genreDistribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return {
      totalFavorites: favorites.length,
      totalWatchlist: watchlist.length,
      totalViewed: viewingHistory.length,
      totalCompleted: completedViews,
      completionRate: viewingHistory.length > 0 ? (completedViews / viewingHistory.length) * 100 : 0,
      totalNotes: notesArray.length,
      totalViewTimeHours: Math.floor(totalViewTime / 3600),
      topGenres: sortedGenres,
      avgRating: notesArray.length > 0
        ? notesArray.reduce((sum, n) => sum + (n.rating || 0), 0) / notesArray.filter(n => n.rating).length
        : 0,
    };
  }, [favorites, watchlist, viewingHistory, notes]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TrendingIcon color="primary" />
        Your Movie Statistics
      </Typography>

      {/* Quick Stats Grid */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <FavoriteIcon color="error" />
                <Typography variant="h6" color="text.secondary">
                  Favorites
                </Typography>
              </Box>
              <Typography variant="h3" color="error.main">
                {stats.totalFavorites}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <BookmarkIcon color="primary" />
                <Typography variant="h6" color="text.secondary">
                  Watchlist
                </Typography>
              </Box>
              <Typography variant="h3" color="primary.main">
                {stats.totalWatchlist}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <ViewIcon color="success" />
                <Typography variant="h6" color="text.secondary">
                  Watched
                </Typography>
              </Box>
              <Typography variant="h3" color="success.main">
                {stats.totalViewed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <MovieIcon color="warning" />
                <Typography variant="h6" color="text.secondary">
                  Notes
                </Typography>
              </Box>
              <Typography variant="h3" color="warning.main">
                {stats.totalNotes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Stats */}
      <Grid container spacing={3}>
        {/* Completion Rate */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Completion Rate
              </Typography>
              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <LinearProgress
                  variant="determinate"
                  value={stats.completionRate}
                  sx={{ flex: 1, height: 10, borderRadius: 5 }}
                />
                <Typography variant="h6">{stats.completionRate.toFixed(0)}%</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {stats.totalCompleted} of {stats.totalViewed} movies completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* View Time */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Watch Time
              </Typography>
              <Typography variant="h3" color="primary">
                {stats.totalViewTimeHours}h
              </Typography>
              <Typography variant="body2" color="text.secondary">
                That's {(stats.totalViewTimeHours / 24).toFixed(1)} days of entertainment!
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Genres */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Favorite Genres
              </Typography>
              <Stack spacing={1.5}>
                {stats.topGenres.map(([genre, count]) => (
                  <Box key={genre}>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="body2">{genre}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {count} movies
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(count / stats.topGenres[0][1]) * 100}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Personal Ratings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Average Rating
              </Typography>
              <Typography variant="h2" color="warning.main" sx={{ mb: 1 }}>
                {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : 'N/A'}
                {stats.avgRating > 0 && <Typography component="span" variant="h4"> / 10</Typography>}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Based on {stats.totalNotes} rated movies
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Achievements */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Achievements
        </Typography>
        <Grid container spacing={2}>
          {stats.totalViewed >= 10 && (
            <Grid item>
              <Chip
                label="Movie Buff (10+ watched)"
                color="success"
                icon={<MovieIcon />}
              />
            </Grid>
          )}
          {stats.totalViewed >= 50 && (
            <Grid item>
              <Chip
                label="Cinephile (50+ watched)"
                color="warning"
                icon={<MovieIcon />}
              />
            </Grid>
          )}
          {stats.totalViewed >= 100 && (
            <Grid item>
              <Chip
                label="Movie Master (100+ watched)"
                color="error"
                icon={<TrendingIcon />}
              />
            </Grid>
          )}
          {stats.totalNotes >= 20 && (
            <Grid item>
              <Chip
                label="Critic (20+ notes)"
                color="primary"
                icon={<MovieIcon />}
              />
            </Grid>
          )}
          {stats.completionRate >= 90 && stats.totalViewed >= 10 && (
            <Grid item>
              <Chip
                label="Completionist (90%+ completion)"
                color="info"
                icon={<ViewIcon />}
              />
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
}

