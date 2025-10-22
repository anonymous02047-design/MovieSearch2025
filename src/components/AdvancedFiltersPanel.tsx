'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button,
  Chip,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
} from '@mui/material';
import {
  ExpandMore as ExpandIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

interface AdvancedFiltersPanelProps {
  onFiltersChange: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
}

export interface FilterState {
  yearRange: [number, number];
  ratingRange: [number, number];
  genres: number[];
  languages: string[];
  sortBy: string;
  runtime: [number, number];
  certifications: string[];
  keywords: string[];
}

const GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ar', name: 'Arabic' },
  { code: 'ru', name: 'Russian' },
  { code: 'pt', name: 'Portuguese' },
];

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Popularity (High to Low)' },
  { value: 'popularity.asc', label: 'Popularity (Low to High)' },
  { value: 'vote_average.desc', label: 'Rating (High to Low)' },
  { value: 'vote_average.asc', label: 'Rating (Low to High)' },
  { value: 'release_date.desc', label: 'Release Date (Newest)' },
  { value: 'release_date.asc', label: 'Release Date (Oldest)' },
  { value: 'title.asc', label: 'Title (A-Z)' },
  { value: 'title.desc', label: 'Title (Z-A)' },
  { value: 'revenue.desc', label: 'Revenue (High to Low)' },
];

export default function AdvancedFiltersPanel({ onFiltersChange, initialFilters }: AdvancedFiltersPanelProps) {
  const currentYear = new Date().getFullYear();

  const [filters, setFilters] = useState<FilterState>({
    yearRange: initialFilters?.yearRange || [1900, currentYear],
    ratingRange: initialFilters?.ratingRange || [0, 10],
    genres: initialFilters?.genres || [],
    languages: initialFilters?.languages || [],
    sortBy: initialFilters?.sortBy || 'popularity.desc',
    runtime: initialFilters?.runtime || [0, 300],
    certifications: initialFilters?.certifications || [],
    keywords: initialFilters?.keywords || [],
  });

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearAll = () => {
    const defaultFilters: FilterState = {
      yearRange: [1900, currentYear],
      ratingRange: [0, 10],
      genres: [],
      languages: [],
      sortBy: 'popularity.desc',
      runtime: [0, 300],
      certifications: [],
      keywords: [],
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const activeFiltersCount = 
    (filters.genres.length > 0 ? 1 : 0) +
    (filters.languages.length > 0 ? 1 : 0) +
    (filters.yearRange[0] !== 1900 || filters.yearRange[1] !== currentYear ? 1 : 0) +
    (filters.ratingRange[0] !== 0 || filters.ratingRange[1] !== 10 ? 1 : 0) +
    (filters.runtime[0] !== 0 || filters.runtime[1] !== 300 ? 1 : 0);

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <FilterIcon color="primary" />
          <Typography variant="h6">Advanced Filters</Typography>
          {activeFiltersCount > 0 && (
            <Chip label={`${activeFiltersCount} active`} size="small" color="primary" />
          )}
        </Box>
        <Button
          startIcon={<ClearIcon />}
          onClick={handleClearAll}
          disabled={activeFiltersCount === 0}
          size="small"
        >
          Clear All
        </Button>
      </Box>

      <Stack spacing={2}>
        {/* Sort By */}
        <FormControl fullWidth size="small">
          <InputLabel>Sort By</InputLabel>
          <Select
            value={filters.sortBy}
            label="Sort By"
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Year Range */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandIcon />}>
            <Typography>
              Year Range: {filters.yearRange[0]} - {filters.yearRange[1]}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Slider
              value={filters.yearRange}
              onChange={(_, value) => handleFilterChange('yearRange', value)}
              min={1900}
              max={currentYear}
              marks={[
                { value: 1900, label: '1900' },
                { value: currentYear, label: String(currentYear) },
              ]}
              valueLabelDisplay="auto"
            />
          </AccordionDetails>
        </Accordion>

        {/* Rating Range */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandIcon />}>
            <Typography>
              Rating: {filters.ratingRange[0]} - {filters.ratingRange[1]}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Slider
              value={filters.ratingRange}
              onChange={(_, value) => handleFilterChange('ratingRange', value)}
              min={0}
              max={10}
              step={0.5}
              marks={[
                { value: 0, label: '0' },
                { value: 10, label: '10' },
              ]}
              valueLabelDisplay="auto"
            />
          </AccordionDetails>
        </Accordion>

        {/* Runtime */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandIcon />}>
            <Typography>
              Runtime: {filters.runtime[0]}min - {filters.runtime[1]}min
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Slider
              value={filters.runtime}
              onChange={(_, value) => handleFilterChange('runtime', value)}
              min={0}
              max={300}
              step={10}
              marks={[
                { value: 0, label: '0m' },
                { value: 300, label: '5h' },
              ]}
              valueLabelDisplay="auto"
            />
          </AccordionDetails>
        </Accordion>

        {/* Genres */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandIcon />}>
            <Typography>
              Genres {filters.genres.length > 0 && `(${filters.genres.length})`}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {GENRES.map((genre) => (
                  <Chip
                    key={genre.id}
                    label={genre.name}
                    onClick={() => {
                      const newGenres = filters.genres.includes(genre.id)
                        ? filters.genres.filter((g) => g !== genre.id)
                        : [...filters.genres, genre.id];
                      handleFilterChange('genres', newGenres);
                    }}
                    color={filters.genres.includes(genre.id) ? 'primary' : 'default'}
                    variant={filters.genres.includes(genre.id) ? 'filled' : 'outlined'}
                  />
                ))}
              </Stack>
            </FormGroup>
          </AccordionDetails>
        </Accordion>

        {/* Languages */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandIcon />}>
            <Typography>
              Languages {filters.languages.length > 0 && `(${filters.languages.length})`}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {LANGUAGES.map((lang) => (
                <Chip
                  key={lang.code}
                  label={lang.name}
                  onClick={() => {
                    const newLangs = filters.languages.includes(lang.code)
                      ? filters.languages.filter((l) => l !== lang.code)
                      : [...filters.languages, lang.code];
                    handleFilterChange('languages', newLangs);
                  }}
                  color={filters.languages.includes(lang.code) ? 'primary' : 'default'}
                  variant={filters.languages.includes(lang.code) ? 'filled' : 'outlined'}
                />
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Stack>
    </Paper>
  );
}

