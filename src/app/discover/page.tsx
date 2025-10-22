'use client';

import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import { Explore as ExploreIcon } from '@mui/icons-material';
import ContentTypeSwitcher from '@/components/ContentTypeSwitcher';
import FilterPanel from '@/components/FilterPanel';
import TrendingSection from '@/components/TrendingSection';
import NewReleasesSection from '@/components/NewReleasesSection';
import PopularByCountrySection from '@/components/PopularByCountrySection';
import SEO from '@/components/SEO';
import PageHeader from '@/components/PageHeader';
import PageContainer from '@/components/PageContainer';
import { useContentFilter } from '@/hooks/useContentFilter';

export default function DiscoverPage() {
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

      <PageHeader
        icon={<ExploreIcon />}
        title="Discover"
        subtitle="Find your next favorite movie or TV show"
      />

      <PageContainer>

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
      </PageContainer>
    </>
  );
}

