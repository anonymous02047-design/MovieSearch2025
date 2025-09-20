'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Divider,
  Badge,
} from '@mui/material';
import {
  Search as SearchIcon,
  Movie as MovieIcon,
  Person as PersonIcon,
  Tv as TvIcon,
  Company as CompanyIcon,
  Collections as CollectionIcon,
  Tag as TagIcon,
  Clear as ClearIcon,
  Star as StarIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { tmdbEnhanced } from '@/lib/tmdbEnhanced';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';


interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  profile_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  media_type: 'movie' | 'tv' | 'person' | 'company' | 'collection' | 'keyword';
  known_for_department?: string;
  gender?: number;
  adult?: boolean;
  original_language?: string;
  genre_ids?: number[];
  origin_country?: string[];
  logo_path?: string | null;
  origin_country?: string;
}

interface SearchResults {
  page: number;
  results: SearchResult[];
  total_pages: number;
  total_results: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`search-tabpanel-${index}`}
      aria-labelledby={`search-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export default function EnhancedSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const { executeRecaptcha, isLoaded: recaptchaLoaded } = useRecaptcha();

  const searchTypes = [
    { label: 'All', value: 'all', icon: <SearchIcon /> },
    { label: 'Movies', value: 'movie', icon: <MovieIcon /> },
    { label: 'TV Shows', value: 'tv', icon: <TvIcon /> },
    { label: 'People', value: 'person', icon: <PersonIcon /> },
    { label: 'Companies', value: 'company', icon: <CompanyIcon /> },
    { label: 'Collections', value: 'collection', icon: <CollectionIcon /> },
    { label: 'Keywords', value: 'keyword', icon: <TagIcon /> },
  ];

  const performSearch = useCallback(async (searchQuery: string, type: string = 'all') => {
    if (!searchQuery.trim()) {
      setResults(null);
      setShowResults(false);
      return;
    }

    // Check if user is authenticated
    if (!user) {
      setError('Please sign in to search movies');
      setResults(null);
      setShowResults(false);
      // Redirect to sign-in page
      router.push('/sign-in');
      return;
    }

    // Execute reCAPTCHA if available
    let recaptchaToken = null;
    if (recaptchaLoaded) {
      try {
        const recaptchaResult = await executeRecaptcha('enhanced_search');
        recaptchaToken = recaptchaResult.token;
      } catch (error) {
        console.warn('reCAPTCHA failed for enhanced search:', error);
        // Continue without reCAPTCHA if it fails
      }
    }

    setLoading(true);
    setError(null);

    try {
      let searchResults: SearchResults;

      if (type === 'all') {
        searchResults = await tmdbEnhanced.searchMulti(searchQuery);
      } else {
        // For specific types, we would need to implement individual search methods
        searchResults = await tmdbEnhanced.searchMulti(searchQuery);
        // Filter results by type
        searchResults.results = searchResults.results.filter(
          (result) => result.media_type === type
        );
      }

      setResults(searchResults);
      setShowResults(true);
    } catch (err: any) {
      setError(err.message || 'Search failed');
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, [user, recaptchaLoaded, executeRecaptcha]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        performSearch(query, searchTypes[activeTab].value);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, activeTab, performSearch]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleResultClick = (result: SearchResult) => {
    setShowResults(false);
    setQuery('');

    switch (result.media_type) {
      case 'movie':
        router.push(`/movie/${result.id}/enhanced`);
        break;
      case 'tv':
        router.push(`/tv/${result.id}/enhanced`);
        break;
      case 'person':
        router.push(`/person/${result.id}/enhanced`);
        break;
      case 'company':
        router.push(`/company/${result.id}`);
        break;
      case 'collection':
        router.push(`/collection/${result.id}`);
        break;
      case 'keyword':
        router.push(`/keyword/${result.id}`);
        break;
    }
  };

  const getImageUrl = (path: string | null, size: string = 'w185') => {
    if (!path) return '/placeholder-movie.svg';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  };

  const getMediaTypeIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'movie':
        return <MovieIcon />;
      case 'tv':
        return <TvIcon />;
      case 'person':
        return <PersonIcon />;
      case 'company':
        return <CompanyIcon />;
      case 'collection':
        return <CollectionIcon />;
      case 'keyword':
        return <TagIcon />;
      default:
        return <SearchIcon />;
    }
  };

  const getMediaTypeColor = (mediaType: string) => {
    switch (mediaType) {
      case 'movie':
        return 'primary';
      case 'tv':
        return 'secondary';
      case 'person':
        return 'success';
      case 'company':
        return 'warning';
      case 'collection':
        return 'info';
      case 'keyword':
        return 'default';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).getFullYear();
  };

  const renderSearchResult = (result: SearchResult) => {
    const title = result.title || result.name || 'Unknown';
    const imagePath = result.poster_path || result.profile_path || result.logo_path;
    const date = result.release_date || result.first_air_date;

    return (
      <ListItem
        key={`${result.media_type}-${result.id}`}
        button
        onClick={() => handleResultClick(result)}
        sx={{
          borderRadius: 1,
          mb: 1,
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <ListItemAvatar>
          <Badge
            badgeContent={getMediaTypeIcon(result.media_type)}
            color={getMediaTypeColor(result.media_type) as any}
          >
            <Avatar
              src={getImageUrl(imagePath)}
              alt={title}
              sx={{ width: 56, height: 56 }}
            >
              {getMediaTypeIcon(result.media_type)}
            </Avatar>
          </Badge>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle1" noWrap>
                {title}
              </Typography>
              <Chip
                label={result.media_type}
                size="small"
                color={getMediaTypeColor(result.media_type) as any}
                variant="outlined"
              />
            </Box>
          }
          secondary={
            <Box>
              {result.overview && (
                <Typography variant="body2" color="text.secondary" noWrap>
                  {result.overview}
                </Typography>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                {date && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarIcon fontSize="small" />
                    <Typography variant="caption">
                      {formatDate(date)}
                    </Typography>
                  </Box>
                )}
                {result.vote_average && result.vote_average > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <StarIcon fontSize="small" color="primary" />
                    <Typography variant="caption">
                      {result.vote_average.toFixed(1)}
                    </Typography>
                  </Box>
                )}
                {result.popularity && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TrendingUpIcon fontSize="small" />
                    <Typography variant="caption">
                      {result.popularity.toFixed(0)}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          }
        />
      </ListItem>
    );
  };

  const renderResultsByType = (mediaType: string) => {
    if (!results) return null;

    const filteredResults = results.results.filter(
      (result) => result.media_type === mediaType
    );

    if (filteredResults.length === 0) {
      return (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No {mediaType} results found
        </Typography>
      );
    }

    return (
      <List>
        {filteredResults.map(renderSearchResult)}
      </List>
    );
  };

  const renderAllResults = () => {
    if (!results) return null;

    if (results.results.length === 0) {
      return (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No results found
        </Typography>
      );
    }

    return (
      <List>
        {results.results.map(renderSearchResult)}
      </List>
    );
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <TextField
        fullWidth
        placeholder="Search movies, TV shows, people, companies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              <IconButton
                onClick={() => {
                  setQuery('');
                  setResults(null);
                  setShowResults(false);
                }}
                edge="end"
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          },
        }}
      />

      {showResults && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            mt: 1,
            maxHeight: '70vh',
            overflow: 'hidden',
            boxShadow: 3,
          }}
        >
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ m: 2 }}>
              {error}
            </Alert>
          )}

          {results && !loading && (
            <>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {searchTypes.map((type, index) => (
                    <Tab
                      key={type.value}
                      label={type.label}
                      icon={type.icon}
                      iconPosition="start"
                    />
                  ))}
                </Tabs>
              </Box>

              <Box sx={{ maxHeight: '50vh', overflow: 'auto' }}>
                {activeTab === 0 && renderAllResults()}
                {activeTab === 1 && renderResultsByType('movie')}
                {activeTab === 2 && renderResultsByType('tv')}
                {activeTab === 3 && renderResultsByType('person')}
                {activeTab === 4 && renderResultsByType('company')}
                {activeTab === 5 && renderResultsByType('collection')}
                {activeTab === 6 && renderResultsByType('keyword')}
              </Box>

              {results.total_results > 0 && (
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Typography variant="caption" color="text.secondary">
                    Showing {results.results.length} of {results.total_results} results
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Paper>
      )}
    </Box>
  );
}
