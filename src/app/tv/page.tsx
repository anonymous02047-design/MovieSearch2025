'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  useTheme,
  Grid,
  alpha
} from '@mui/material';
import { Tv as TvIcon } from '@mui/icons-material';
import SEO from '@/components/SEO';
import TVShowCard, { TVShow } from '@/components/TVShowCard';
import { LoadingSkeleton } from '@/components/LoadingStates';
import { useApiErrorHandler } from '@/hooks/useErrorHandler';
import ErrorDisplay from '@/components/ErrorDisplay';
import tmdbApi from '@/lib/tmdb';
import ResponsiveGrid from '@/components/ResponsiveGrid';

export default function TVShowsPage() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const { error, loading, handleAsyncError } = useApiErrorHandler();

  useEffect(() => {
    loadTVShows();
  }, [activeTab]);

  const loadTVShows = async () => {
    const result = await handleAsyncError(
      async () => {
        let response;
        switch (activeTab) {
          case 0: // Popular
            response = await tmdbApi.getTrendingTV('week');
            break;
          case 1: // Top Rated
            response = await tmdbApi.getTopRatedTV();
            break;
          case 2: // Airing Today
            response = await tmdbApi.getAiringTodayTV();
            break;
          case 3: // On The Air
            response = await tmdbApi.getOnTheAirTV();
            break;
          default:
            response = await tmdbApi.getTrendingTV('week');
        }
        return response?.results || [];
      },
      'TVShowsPage.loadTVShows'
    );

    if (result) {
      setTvShows(result);
    }
  };

  return (
    <>
      <SEO
        title="TV Shows & Web Series - MovieSearch 2025"
        description="Discover popular TV shows, top-rated series, and what's airing today"
        keywords={['tv shows', 'web series', 'television', 'streaming']}
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
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
              <TvIcon sx={{ fontSize: 48, color: 'primary.main' }} />
              <Typography variant="h3" component="h1" fontWeight={700}>
                TV Shows & Series
              </Typography>
            </Box>
            <Typography variant="h6" color="text.secondary">
              Discover your next binge-worthy series
            </Typography>
          </Box>

          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            centered
            sx={{ mb: 4 }}
          >
            <Tab label="Popular" />
            <Tab label="Top Rated" />
            <Tab label="Airing Today" />
            <Tab label="On The Air" />
          </Tabs>

          {error && (
            <Box sx={{ mb: 3 }}>
              <ErrorDisplay error={error} severity="error" dismissible />
            </Box>
          )}

          {loading ? (
            <ResponsiveGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={3}>
              {Array.from({ length: 8 }).map((_, index) => (
                <Box key={index} sx={{ aspectRatio: '2/3' }}>
                  <LoadingSkeleton type="card" count={1} />
                </Box>
              ))}
            </ResponsiveGrid>
          ) : (
            <ResponsiveGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={3}>
              {tvShows.map((show) => (
                <TVShowCard key={show.id} show={show} />
              ))}
            </ResponsiveGrid>
          )}

          {!loading && tvShows.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <TvIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
              <Typography variant="h5" color="text.secondary" gutterBottom>
                No TV shows found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try selecting a different category
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}
