'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Chip,
  Button,
  TextField,
  Autocomplete,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { tmdbApi, DiscoverParams } from '@/lib/tmdb';

interface AdvancedSearchProps {
  onSearch: (params: DiscoverParams) => void;
  onClear: () => void;
}

export default function AdvancedSearch({ onSearch, onClear }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<DiscoverParams>({});
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    try {
      const response = await tmdbApi.getGenres();
      setGenres(response.genres);
    } catch (error) {
      console.error('Error loading genres:', error);
    }
  };

  const handleFilterChange = (key: keyof DiscoverParams, value: string | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleGenreChange = (event: React.SyntheticEvent, newValue: { id: number; name: string }[]) => {
    const genreIds = newValue.map((genre) => genre.id).join(',');
    handleFilterChange('with_genres', genreIds || undefined);
  };

  const handleYearChange = (event: Event, newValue: number | number[]) => {
    const [minYear, maxYear] = newValue as number[];
    setFilters(prev => ({
      ...prev,
      primary_release_year_gte: minYear,
      primary_release_year_lte: maxYear,
    }));
  };

  const handleRatingChange = (event: Event, newValue: number | number[]) => {
    const [minRating, maxRating] = newValue as number[];
    setFilters(prev => ({
      ...prev,
      vote_average_gte: minRating,
      vote_average_lte: maxRating,
    }));
  };

  const handleRuntimeChange = (event: Event, newValue: number | number[]) => {
    const [minRuntime, maxRuntime] = newValue as number[];
    setFilters(prev => ({
      ...prev,
      with_runtime_gte: minRuntime,
      with_runtime_lte: maxRuntime,
    }));
  };


  const handleSearch = () => {
    setLoading(true);
    onSearch(filters);
    setLoading(false);
  };

  const handleClear = () => {
    setFilters({});
    onClear();
  };

  const getSelectedGenres = () => {
    if (!filters.with_genres) return [];
    const genreIds = filters.with_genres.split(',').map(Number);
    return genres.filter(genre => genreIds.includes(genre.id));
  };

  const currentYear = new Date().getFullYear();

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <FilterIcon sx={{ mr: 1 }} />
        <Typography variant="h6">Advanced Search</Typography>
      </Box>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Filters</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
            {/* Genres */}
            <Box>
              <Autocomplete
                multiple
                options={genres}
                getOptionLabel={(option) => option.name}
                value={getSelectedGenres()}
                onChange={handleGenreChange}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option.name}
                      {...getTagProps({ index })}
                      key={option.id}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Genres"
                    placeholder="Select genres"
                  />
                )}
              />
            </Box>

            {/* Sort By */}
            <Box>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={filters.sort_by || 'popularity.desc'}
                  label="Sort By"
                  onChange={(event) => handleFilterChange('sort_by', event.target.value)}
                >
                  <MenuItem value="popularity.desc">Popularity (High to Low)</MenuItem>
                  <MenuItem value="popularity.asc">Popularity (Low to High)</MenuItem>
                  <MenuItem value="vote_average.desc">Rating (High to Low)</MenuItem>
                  <MenuItem value="vote_average.asc">Rating (Low to High)</MenuItem>
                  <MenuItem value="release_date.desc">Release Date (Newest)</MenuItem>
                  <MenuItem value="release_date.asc">Release Date (Oldest)</MenuItem>
                  <MenuItem value="revenue.desc">Revenue (High to Low)</MenuItem>
                  <MenuItem value="revenue.asc">Revenue (Low to High)</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Year Range */}
            <Box>
              <Typography gutterBottom>Release Year</Typography>
              <Slider
                value={[
                  filters.primary_release_year || 1900,
                  currentYear
                ]}
                onChange={handleYearChange}
                valueLabelDisplay="auto"
                min={1900}
                max={currentYear + 2}
                marks={[
                  { value: 1900, label: '1900' },
                  { value: 2000, label: '2000' },
                  { value: currentYear, label: currentYear.toString() },
                ]}
              />
            </Box>

            {/* Rating Range */}
            <Box>
              <Typography gutterBottom>Rating</Typography>
              <Slider
                value={[
                  filters.vote_average_gte || 0,
                  filters.vote_average_lte || 10
                ]}
                onChange={handleRatingChange}
                valueLabelDisplay="auto"
                min={0}
                max={10}
                step={0.5}
                marks={[
                  { value: 0, label: '0' },
                  { value: 5, label: '5' },
                  { value: 10, label: '10' },
                ]}
              />
            </Box>

            {/* Runtime Range */}
            <Box>
              <Typography gutterBottom>Runtime (minutes)</Typography>
              <Slider
                value={[
                  filters.with_runtime_gte || 0,
                  filters.with_runtime_lte || 300
                ]}
                onChange={handleRuntimeChange}
                valueLabelDisplay="auto"
                min={0}
                max={300}
                step={15}
                marks={[
                  { value: 0, label: '0m' },
                  { value: 120, label: '2h' },
                  { value: 300, label: '5h' },
                ]}
              />
            </Box>

            {/* Language */}
            <Box>
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  value={filters.with_original_language || ''}
                  label="Language"
                  onChange={(e) => handleFilterChange('with_original_language', e.target.value || undefined)}
                >
                  <MenuItem value="">Any Language</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="es">Spanish</MenuItem>
                  <MenuItem value="fr">French</MenuItem>
                  <MenuItem value="de">German</MenuItem>
                  <MenuItem value="it">Italian</MenuItem>
                  <MenuItem value="pt">Portuguese</MenuItem>
                  <MenuItem value="ru">Russian</MenuItem>
                  <MenuItem value="ja">Japanese</MenuItem>
                  <MenuItem value="ko">Korean</MenuItem>
                  <MenuItem value="zh">Chinese</MenuItem>
                  <MenuItem value="hi">Hindi</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={loading}
              startIcon={<FilterIcon />}
            >
              Apply Filters
            </Button>
            <Button
              variant="outlined"
              onClick={handleClear}
              startIcon={<ClearIcon />}
            >
              Clear All
            </Button>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
}
