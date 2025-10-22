'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  SelectChangeEvent,
  Button,
  TextField,
  Autocomplete,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ExpandMore as ExpandIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

interface TVGenre {
  id: number;
  name: string;
}

interface Network {
  id: number;
  name: string;
  logo_path: string | null;
}

interface AdvancedTVSearchFiltersProps {
  onFilterChange: (filters: TVFilters) => void;
  onReset: () => void;
}

export interface TVFilters {
  genres: number[];
  yearRange: [number, number];
  ratingRange: [number, number];
  status: string;
  type: string;
  networks: number[];
  language: string;
  sortBy: string;
  airingToday: boolean;
  minSeasons: number;
  maxSeasons: number;
}

const TV_GENRES: TVGenre[] = [
  { id: 10759, name: 'Action & Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 10762, name: 'Kids' },
  { id: 9648, name: 'Mystery' },
  { id: 10763, name: 'News' },
  { id: 10764, name: 'Reality' },
  { id: 10765, name: 'Sci-Fi & Fantasy' },
  { id: 10766, name: 'Soap' },
  { id: 10767, name: 'Talk' },
  { id: 10768, name: 'War & Politics' },
  { id: 37, name: 'Western' },
];

const POPULAR_NETWORKS: Network[] = [
  { id: 213, name: 'Netflix', logo_path: null },
  { id: 1024, name: 'Amazon', logo_path: null },
  { id: 2739, name: 'Disney+', logo_path: null },
  { id: 453, name: 'Hulu', logo_path: null },
  { id: 2552, name: 'Apple TV+', logo_path: null },
  { id: 49, name: 'HBO', logo_path: null },
  { id: 174, name: 'AMC', logo_path: null },
  { id: 56, name: 'Cartoon Network', logo_path: null },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'Returning Series', label: 'Returning Series' },
  { value: 'Planned', label: 'Planned' },
  { value: 'In Production', label: 'In Production' },
  { value: 'Ended', label: 'Ended' },
  { value: 'Canceled', label: 'Canceled' },
  { value: 'Pilot', label: 'Pilot' },
];

const TYPE_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'Scripted', label: 'Scripted' },
  { value: 'Reality', label: 'Reality' },
  { value: 'Documentary', label: 'Documentary' },
  { value: 'News', label: 'News' },
  { value: 'Miniseries', label: 'Miniseries' },
  { value: 'Talk Show', label: 'Talk Show' },
  { value: 'Video', label: 'Video' },
];

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Popularity ↓' },
  { value: 'popularity.asc', label: 'Popularity ↑' },
  { value: 'vote_average.desc', label: 'Rating ↓' },
  { value: 'vote_average.asc', label: 'Rating ↑' },
  { value: 'first_air_date.desc', label: 'Newest First' },
  { value: 'first_air_date.asc', label: 'Oldest First' },
  { value: 'name.asc', label: 'Title A-Z' },
  { value: 'name.desc', label: 'Title Z-A' },
];

const LANGUAGES = [
  { value: '', label: 'All Languages' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
  { value: 'hi', label: 'Hindi' },
  { value: 'pt', label: 'Portuguese' },
];

export default function AdvancedTVSearchFilters({
  onFilterChange,
  onReset,
}: AdvancedTVSearchFiltersProps) {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const [filters, setFilters] = useState<TVFilters>({
    genres: [],
    yearRange: [1960, currentYear],
    ratingRange: [0, 10],
    status: '',
    type: '',
    networks: [],
    language: '',
    sortBy: 'popularity.desc',
    airingToday: false,
    minSeasons: 0,
    maxSeasons: 50,
  });

  useEffect(() => {
    onFilterChange(filters);
  }, [filters]);

  const handleGenreChange = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value;
    setFilters({
      ...filters,
      genres: typeof value === 'string' ? [] : value,
    });
  };

  const handleNetworkChange = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value;
    setFilters({
      ...filters,
      networks: typeof value === 'string' ? [] : value,
    });
  };

  const handleYearChange = (_event: Event, newValue: number | number[]) => {
    setFilters({
      ...filters,
      yearRange: newValue as [number, number],
    });
  };

  const handleRatingChange = (_event: Event, newValue: number | number[]) => {
    setFilters({
      ...filters,
      ratingRange: newValue as [number, number],
    });
  };

  const handleSeasonChange = (_event: Event, newValue: number | number[]) => {
    const [min, max] = newValue as [number, number];
    setFilters({
      ...filters,
      minSeasons: min,
      maxSeasons: max,
    });
  };

  const handleReset = () => {
    setFilters({
      genres: [],
      yearRange: [1960, currentYear],
      ratingRange: [0, 10],
      status: '',
      type: '',
      networks: [],
      language: '',
      sortBy: 'popularity.desc',
      airingToday: false,
      minSeasons: 0,
      maxSeasons: 50,
    });
    onReset();
  };

  const activeFiltersCount = 
    filters.genres.length +
    filters.networks.length +
    (filters.status ? 1 : 0) +
    (filters.type ? 1 : 0) +
    (filters.language ? 1 : 0) +
    (filters.airingToday ? 1 : 0);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Advanced Filters
          </Typography>
          {activeFiltersCount > 0 && (
            <Chip
              label={`${activeFiltersCount} active`}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
        <Button
          startIcon={<ClearIcon />}
          onClick={handleReset}
          variant="outlined"
          size="small"
        >
          Reset All
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Sort By */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={filters.sortBy}
          label="Sort By"
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
        >
          {SORT_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Genres */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandIcon />}>
          <Typography fontWeight="bold">Genres</Typography>
          {filters.genres.length > 0 && (
            <Chip
              label={filters.genres.length}
              size="small"
              color="primary"
              sx={{ ml: 1 }}
            />
          )}
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth>
            <InputLabel>Select Genres</InputLabel>
            <Select
              multiple
              value={filters.genres}
              onChange={handleGenreChange}
              input={<OutlinedInput label="Select Genres" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={TV_GENRES.find((g) => g.id === value)?.name}
                      size="small"
                    />
                  ))}
                </Box>
              )}
            >
              {TV_GENRES.map((genre) => (
                <MenuItem key={genre.id} value={genre.id}>
                  {genre.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* Networks */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandIcon />}>
          <Typography fontWeight="bold">Networks</Typography>
          {filters.networks.length > 0 && (
            <Chip
              label={filters.networks.length}
              size="small"
              color="primary"
              sx={{ ml: 1 }}
            />
          )}
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth>
            <InputLabel>Select Networks</InputLabel>
            <Select
              multiple
              value={filters.networks}
              onChange={handleNetworkChange}
              input={<OutlinedInput label="Select Networks" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={POPULAR_NETWORKS.find((n) => n.id === value)?.name}
                      size="small"
                    />
                  ))}
                </Box>
              )}
            >
              {POPULAR_NETWORKS.map((network) => (
                <MenuItem key={network.id} value={network.id}>
                  {network.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* Year Range */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandIcon />}>
          <Typography fontWeight="bold">First Air Date</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {filters.yearRange[0]} - {filters.yearRange[1]}
            </Typography>
            <Slider
              value={filters.yearRange}
              onChange={handleYearChange}
              valueLabelDisplay="auto"
              min={1960}
              max={currentYear}
              marks={[
                { value: 1960, label: '1960' },
                { value: currentYear, label: String(currentYear) },
              ]}
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Rating Range */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandIcon />}>
          <Typography fontWeight="bold">Rating</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {filters.ratingRange[0]} - {filters.ratingRange[1]} ⭐
            </Typography>
            <Slider
              value={filters.ratingRange}
              onChange={handleRatingChange}
              valueLabelDisplay="auto"
              min={0}
              max={10}
              step={0.5}
              marks={[
                { value: 0, label: '0' },
                { value: 10, label: '10' },
              ]}
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Number of Seasons */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandIcon />}>
          <Typography fontWeight="bold">Number of Seasons</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {filters.minSeasons} - {filters.maxSeasons === 50 ? '50+' : filters.maxSeasons} Seasons
            </Typography>
            <Slider
              value={[filters.minSeasons, filters.maxSeasons]}
              onChange={handleSeasonChange}
              valueLabelDisplay="auto"
              min={0}
              max={50}
              marks={[
                { value: 0, label: '0' },
                { value: 50, label: '50+' },
              ]}
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Status */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandIcon />}>
          <Typography fontWeight="bold">Status</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* Type */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandIcon />}>
          <Typography fontWeight="bold">Type</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={filters.type}
              label="Type"
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              {TYPE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* Language */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandIcon />}>
          <Typography fontWeight="bold">Language</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth>
            <InputLabel>Language</InputLabel>
            <Select
              value={filters.language}
              label="Language"
              onChange={(e) => setFilters({ ...filters, language: e.target.value })}
            >
              {LANGUAGES.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* Airing Today Toggle */}
      <Box sx={{ mt: 2 }}>
        <ToggleButtonGroup
          value={filters.airingToday ? 'yes' : 'no'}
          exclusive
          onChange={(_e, value) => {
            if (value !== null) {
              setFilters({ ...filters, airingToday: value === 'yes' });
            }
          }}
          fullWidth
        >
          <ToggleButton value="no">
            All Shows
          </ToggleButton>
          <ToggleButton value="yes">
            Airing Today Only
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Paper>
  );
}

