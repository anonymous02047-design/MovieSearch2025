'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Select,
  MenuItem,
  Slider,
  Chip,
  FormControl,
  InputLabel,
  Button,
  Collapse,
  IconButton,
  Grid,
  useTheme,
  alpha
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon
} from '@mui/icons-material';
import { FilterOptions, SortBy } from '@/hooks/useContentFilter';

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  onReset: () => void;
  availableGenres?: Array<{ id: number; name: string }>;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

const sortOptions: Array<{ value: SortBy; label: string }> = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'popularity.asc', label: 'Least Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'vote_average.asc', label: 'Lowest Rated' },
  { value: 'release_date.desc', label: 'Newest First' },
  { value: 'release_date.asc', label: 'Oldest First' },
];

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ar', name: 'Arabic' },
  { code: 'ru', name: 'Russian' },
];

export default function FilterPanel({ filters, onFilterChange, onReset, availableGenres = [] }: FilterPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  const handleRatingChange = (_event: Event, newValue: number | number[]) => {
    const [min, max] = newValue as number[];
    onFilterChange({ minRating: min, maxRating: max });
  };

  const toggleGenre = (genreId: number) => {
    const genres = filters.genres.includes(genreId)
      ? filters.genres.filter(id => id !== genreId)
      : [...filters.genres, genreId];
    onFilterChange({ genres });
  };

  const hasActiveFilters = 
    filters.genres.length > 0 ||
    filters.year !== undefined ||
    filters.minRating !== undefined ||
    filters.language !== undefined;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mb: 3,
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(50, 50, 50, 0.95) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 240, 240, 0.95) 100%)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Filters
          </Typography>
          {hasActiveFilters && (
            <Chip
              label={`${filters.genres.length + (filters.year ? 1 : 0) + (filters.language ? 1 : 0)} active`}
              size="small"
              color="primary"
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {hasActiveFilters && (
            <Button
              size="small"
              startIcon={<ClearIcon />}
              onClick={onReset}
            >
              Clear All
            </Button>
          )}
          <IconButton size="small" onClick={() => setExpanded(!expanded)}>
            {expanded ? <CollapseIcon /> : <ExpandIcon />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Grid container spacing={3}>
          {/* Sort By */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={filters.sortBy}
                label="Sort By"
                onChange={(e) => onFilterChange({ sortBy: e.target.value as SortBy })}
              >
                {sortOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Year */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Year</InputLabel>
              <Select
                value={filters.year || ''}
                label="Year"
                onChange={(e) => onFilterChange({ year: e.target.value ? Number(e.target.value) : undefined })}
              >
                <MenuItem value="">All Years</MenuItem>
                {years.map(year => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Language */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Language</InputLabel>
              <Select
                value={filters.language || ''}
                label="Language"
                onChange={(e) => onFilterChange({ language: e.target.value || undefined })}
              >
                <MenuItem value="">All Languages</MenuItem>
                {languages.map(lang => (
                  <MenuItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Rating */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Rating: {filters.minRating || 0} - {filters.maxRating || 10}
            </Typography>
            <Slider
              value={[filters.minRating || 0, filters.maxRating || 10]}
              onChange={handleRatingChange}
              valueLabelDisplay="auto"
              min={0}
              max={10}
              step={0.5}
              marks={[
                { value: 0, label: '0' },
                { value: 5, label: '5' },
                { value: 10, label: '10' }
              ]}
            />
          </Grid>

          {/* Genres */}
          {availableGenres.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Genres
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {availableGenres.map(genre => (
                  <Chip
                    key={genre.id}
                    label={genre.name}
                    onClick={() => toggleGenre(genre.id)}
                    color={filters.genres.includes(genre.id) ? 'primary' : 'default'}
                    variant={filters.genres.includes(genre.id) ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Grid>
          )}
        </Grid>
      </Collapse>
    </Paper>
  );
}

