'use client';

import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  useTheme,
  alpha
} from '@mui/material';
import { Explore as ExploreIcon } from '@mui/icons-material';
import ContentTypeSwitcher from '@/components/ContentTypeSwitcher';
import FilterPanel from '@/components/FilterPanel';
import TrendingSection from '@/components/TrendingSection';
import NewReleasesSection from '@/components/NewReleasesSection';
import PopularByCountrySection from '@/components/PopularByCountrySection';
import SEO from '@/components/SEO';
import { useContentFilter } from '@/hooks/useContentFilter';

export default function DiscoverPage() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const { filters, updateFilter, updateFilters, resetFilters } = useContentFilter();
  const [availableGenres, setAvailableGenres] = useState<Array<{ id: number; name: string }>>([]);

  return (
    <>
      <SEO
        title="Discover - MovieSearch 2025"
        description="Discover new movies and TV shows based on your preferences"
        keywords={['discover', 'explore', 'find movies', 'find tv shows']}
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
              <ExploreIcon sx={{ fontSize: 48, color: 'primary.main' }} />
              <Typography variant="h3" component="h1" fontWeight={700}>
                Discover
              </Typography>
            </Box>
            <Typography variant="h6" color="text.secondary">
              Find your next favorite movie or TV show
            </Typography>
          </Box>

          <ContentTypeSwitcher 
            value={filters.contentType}
            onChange={(value) => updateFilter('contentType', value)}
          />

          <FilterPanel
            filters={filters}
            onFilterChange={updateFilters}
            onReset={resetFilters}
            availableGenres={availableGenres}
          />

          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            centered
            sx={{ mb: 4 }}
          >
            <Tab label="Trending" />
            <Tab label="New Releases" />
            <Tab label="Popular in Your Country" />
          </Tabs>

          {activeTab === 0 && <TrendingSection />}
          {activeTab === 1 && <NewReleasesSection />}
          {activeTab === 2 && <PopularByCountrySection />}
        </Container>
      </Box>
    </>
  );
}

