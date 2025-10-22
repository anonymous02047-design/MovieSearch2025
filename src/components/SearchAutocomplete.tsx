'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  Avatar,
  CircularProgress,
  InputAdornment,
  alpha,
  useTheme
} from '@mui/material';
import { Search as SearchIcon, Movie as MovieIcon, Tv as TvIcon, Person as PersonIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { tmdbApi } from '@/lib/tmdb';
import { getImageUrl } from '@/lib/tmdb';
import { debounce } from '@mui/material/utils';

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  media_type: 'movie' | 'tv' | 'person';
  poster_path?: string | null;
  profile_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
}

export default function SearchAutocomplete() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<SearchResult[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const theme = useTheme();

  const searchContent = async (query: string) => {
    if (!query || query.length < 2) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const [movieResults, tvResults] = await Promise.all([
        tmdbApi.searchMovies({ query, page: 1 }),
        tmdbApi.getTrendingTV('week')
      ]);

      const results: SearchResult[] = [
        ...(movieResults?.results?.slice(0, 5).map((m: any) => ({ ...m, media_type: 'movie' as const })) || []),
        ...(tvResults?.results?.slice(0, 5).map((t: any) => ({ ...t, media_type: 'tv' as const })) || [])
      ];

      setOptions(results);
    } catch (error) {
      console.error('Search error:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      searchContent(query);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(inputValue);
  }, [inputValue, debouncedSearch]);

  const handleSelect = (_event: any, value: SearchResult | null) => {
    if (value) {
      const path = value.media_type === 'movie' 
        ? `/movie/${value.id}` 
        : value.media_type === 'tv'
        ? `/tv/${value.id}`
        : `/person/${value.id}`;
      router.push(path);
      setInputValue('');
      setOpen(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'movie':
        return <MovieIcon fontSize="small" />;
      case 'tv':
        return <TvIcon fontSize="small" />;
      case 'person':
        return <PersonIcon fontSize="small" />;
      default:
        return <SearchIcon fontSize="small" />;
    }
  };

  const getDisplayTitle = (result: SearchResult) => {
    return result.title || result.name || 'Unknown';
  };

  const getDisplayYear = (result: SearchResult) => {
    const date = result.release_date || result.first_air_date;
    return date ? new Date(date).getFullYear() : '';
  };

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={options}
      loading={loading}
      inputValue={inputValue}
      onInputChange={(_, value) => setInputValue(value)}
      onChange={handleSelect}
      getOptionLabel={(option) => getDisplayTitle(option)}
      filterOptions={(x) => x}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search movies, TV shows..."
          size="small"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? <CircularProgress size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(10px)',
            }
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box
          component="li"
          {...props}
          sx={{
            display: 'flex',
            gap: 2,
            p: 1.5,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            }
          }}
        >
          <Avatar
            src={getImageUrl(option.poster_path || option.profile_path, 'w200')}
            variant="rounded"
            sx={{ width: 50, height: 70 }}
          >
            {getIcon(option.media_type)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getIcon(option.media_type)}
              <Typography variant="body2" fontWeight={600}>
                {getDisplayTitle(option)}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {getDisplayYear(option)} • {option.media_type.toUpperCase()}
            </Typography>
            {option.vote_average && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                ⭐ {option.vote_average.toFixed(1)}
              </Typography>
            )}
          </Box>
        </Box>
      )}
      noOptionsText={
        inputValue.length < 2 
          ? "Type at least 2 characters to search" 
          : "No results found"
      }
      sx={{ width: '100%', maxWidth: 600 }}
    />
  );
}

