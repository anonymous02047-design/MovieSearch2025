'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  CircularProgress,
  Chip,
  IconButton,
  InputAdornment,
  Fade,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Movie as MovieIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { tmdbApi, Movie, getImageUrl } from '@/lib/tmdb';
import { addToSearchHistory } from '@/lib/storage';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useSearchErrorHandler } from '@/hooks/useErrorHandler';
import ErrorDisplay from './ErrorDisplay';
import { LoadingSpinner } from './LoadingStates';

interface GlobalSearchProps {
  placeholder?: string;
  onClose?: () => void;
}

export default function GlobalSearch({ placeholder = "Search movies...", onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { error, loading, handleAsyncError, clearError } = useSearchErrorHandler();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (query.trim().length > 2) {
      const timeoutId = setTimeout(() => {
        performSearch(query);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
      setShowResults(false);
      clearError();
    }
  }, [query, clearError]);

  const performSearch = async (searchQuery: string) => {
    // Check if user is authenticated
    if (!user) {
      // Clear any existing results and redirect without triggering error handler
      setResults([]);
      setShowResults(false);
      clearError(); // Clear any existing errors
      
      // Show a brief message and then redirect
      console.log('Authentication required: Redirecting to sign-in page');
      
      // Small delay to ensure user sees the action
      setTimeout(() => {
        router.push('/sign-in');
      }, 100);
      return;
    }

    const result = await handleAsyncError(
      async () => {
        const response = await tmdbApi.searchMovies({
          query: searchQuery,
          page: 1
        });
        
        if (response && response.results) {
          return response.results.slice(0, 8); // Limit to 8 results
        }
        return [];
      },
      'GlobalSearch.performSearch'
    );

    if (result) {
      setResults(result);
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      if (user) {
        addToSearchHistory(searchQuery);
      }
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
      onClose?.();
    }
  };

  const handleMovieClick = (movie: Movie) => {
    router.push(`/movie/${movie.id}`);
    setShowResults(false);
    onClose?.();
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  const getMovieYear = (releaseDate: string) => {
    return releaseDate ? new Date(releaseDate).getFullYear() : '';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'success';
    if (rating >= 6) return 'warning';
    return 'error';
  };

  return (
    <Box ref={searchRef} sx={{ position: 'relative', width: '100%', maxWidth: 600 }}>
      <TextField
        fullWidth
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSearch(query);
          }
        }}
        onFocus={() => {
          if (results.length > 0) {
            setShowResults(true);
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {loading && <CircularProgress size={20} />}
              {query && !loading && (
                <IconButton onClick={handleClear} size="small">
                  <ClearIcon />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
              boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
            },
          },
          '& .MuiInputBase-input': {
            color: 'white',
            fontSize: { xs: '14px', sm: '16px' },
            '&::placeholder': {
              color: 'rgba(255, 255, 255, 0.7)',
              opacity: 1,
            },
          },
        }}
      />

      {/* Search Results Dropdown */}
      <Fade in={showResults && (results.length > 0 || loading)}>
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            mt: 1,
            maxHeight: 400,
            overflow: 'auto',
            backgroundColor: 'rgba(26, 26, 26, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
          }}
        >
          {loading ? (
            <LoadingSpinner type="search" size="small" />
          ) : error ? (
            <Box sx={{ p: 2 }}>
              <ErrorDisplay 
                error={error} 
                severity="error" 
                showRetry={true}
                onRetry={() => performSearch(query)}
                dismissible={true}
                onDismiss={clearError}
              />
            </Box>
          ) : results.length > 0 ? (
            <>
              <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 'bold' }}>
                  Search Results ({results.length})
                </Typography>
              </Box>
              <List sx={{ p: 0 }}>
                {results.map((movie) => (
                  <ListItem
                    key={movie.id}
                    onClick={() => handleMovieClick(movie)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={getImageUrl(movie.poster_path, 'w92')}
                        alt={movie.title}
                        sx={{ width: 48, height: 72 }}
                        variant="rounded"
                      >
                        <MovieIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Box component="span" sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
                            {movie.title}
                          </Box>
                          {getMovieYear(movie.release_date) && (
                            <Box component="span" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                              ({getMovieYear(movie.release_date)})
                            </Box>
                          )}
                        </Box>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{
                              color: 'text.secondary',
                              fontSize: '0.875rem',
                              mb: 1,
                              display: 'block',
                            }}
                          >
                            {movie.overview}
                          </Typography>
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              icon={<StarIcon />}
                              label={movie.vote_average.toFixed(1)}
                              size="small"
                              color={getRatingColor(movie.vote_average)}
                              variant="outlined"
                              sx={{ fontSize: '0.75rem' }}
                            />
                            <Chip
                              icon={<TrendingUpIcon />}
                              label={`${movie.vote_count} votes`}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.75rem', color: 'text.secondary' }}
                            />
                          </Box>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                ))}
              </List>
              <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Box
                  component="span"
                  sx={{
                    color: 'primary.main',
                    textAlign: 'center',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    display: 'block',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                  onClick={() => handleSearch(query)}
                >
                  View all results for &quot;{query}&quot;
                </Box>
              </Box>
            </>
          ) : null}
        </Paper>
      </Fade>
    </Box>
  );
}
