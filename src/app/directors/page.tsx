'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Pagination,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
} from '@mui/material';
import {
  Movie as MovieIcon,
  Search as SearchIcon,
  Star as StarIcon,
  FilterList as FilterIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  Visibility as ViewIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  PlayArrow as PlayIcon,
  Bookmark as BookmarkIcon,
  Share as ShareIcon,
  Info as InfoIcon,
  EmojiEvents as AwardIcon,
  Timeline as TimelineIcon,
  Theaters as TheaterIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  Compare as CompareIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Analytics as AnalyticsIcon,
  Group as GroupIcon,
  TrendingDown as TrendingDownIcon,
  FilterAlt as FilterAltIcon,
  Clear as ClearIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { tmdbApi } from '@/lib/tmdb';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import SEO from '@/components/SEO';
import RecaptchaProtection from '@/components/RecaptchaProtection';

interface Director {
  id: number;
  name: string;
  profile_path: string;
  known_for_department: string;
  known_for: Array<{
    id: number;
    title?: string;
    name?: string;
    poster_path: string;
    media_type: string;
    vote_average: number;
    release_date?: string;
    first_air_date?: string;
    genre_ids?: number[];
    overview?: string;
    vote_count?: number;
  }>;
  popularity: number;
  adult: boolean;
  biography?: string;
  birthday?: string;
  deathday?: string;
  place_of_birth?: string;
  also_known_as?: string[];
}

function DirectorsPageContent() {
  const [directors, setDirectors] = useState<Director[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDirectors, setFilteredDirectors] = useState<Director[]>([]);
  const [sortBy, setSortBy] = useState('popularity');
  const [selectedDirector, setSelectedDirector] = useState<Director | null>(null);
  const [filmographyDialogOpen, setFilmographyDialogOpen] = useState(false);
  const [expandedDirector, setExpandedDirector] = useState<number | null>(null);
  const [comparisonDirectors, setComparisonDirectors] = useState<Director[]>([]);
  const [comparisonDialogOpen, setComparisonDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterGenre, setFilterGenre] = useState<string>('all');
  const [filterDecade, setFilterDecade] = useState<string>('all');
  const [filterRating, setFilterRating] = useState<number>(0);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const sortOptions = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'rating', label: 'Average Rating' },
    { value: 'movies', label: 'Number of Movies' },
    { value: 'career', label: 'Career Span' },
  ];

  const fetchDirectors = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await tmdbApi.getPopularPeople(currentPage);
      
      // Filter for directors only - check known_for_department
      const directorsOnly = response.results.filter(
        person => person.known_for_department === 'Directing'
      );
      
      // If no directors found, show all people for now
      if (directorsOnly.length === 0) {
        setDirectors(response.results.slice(0, 20));
      } else {
        setDirectors(directorsOnly);
      }
      setTotalPages(Math.min(response.total_pages, 500));
    } catch (err) {
      setError('Failed to fetch directors');
      console.error('Error fetching directors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirectors();
  }, [currentPage]);

  useEffect(() => {
    let filtered = directors;

    // Filter by search query
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(director =>
        director.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by genre
    if (filterGenre !== 'all') {
      filtered = filtered.filter(director =>
        director.known_for.some(work => 
          work.genre_ids && work.genre_ids.includes(parseInt(filterGenre))
        )
      );
    }

    // Filter by decade
    if (filterDecade !== 'all') {
      const targetDecade = parseInt(filterDecade);
      filtered = filtered.filter(director =>
        director.known_for.some(work => {
          const year = work.release_date ? new Date(work.release_date).getFullYear() : 
                      work.first_air_date ? new Date(work.first_air_date).getFullYear() : null;
          return year && getDecadeFromYear(year) === targetDecade;
        })
      );
    }

    // Filter by minimum rating
    if (filterRating > 0) {
      filtered = filtered.filter(director => {
        const avgRating = getAverageRating(director);
        return avgRating >= filterRating;
      });
    }

    // Sort directors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          const aRating = getAverageRating(a);
          const bRating = getAverageRating(b);
          return bRating - aRating;
        case 'movies':
          return getDirectorStats(b).totalMovies - getDirectorStats(a).totalMovies;
        case 'career':
          return getDirectorStats(b).careerSpan - getDirectorStats(a).careerSpan;
        case 'popularity':
        default:
          return b.popularity - a.popularity;
      }
    });

    setFilteredDirectors(filtered);
  }, [searchQuery, sortBy, directors, filterGenre, filterDecade, filterRating]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
  };

  const getAverageRating = (director: Director) => {
    if (!director.known_for || director.known_for.length === 0) return 0;
    const sum = director.known_for.reduce((acc, work) => acc + work.vote_average, 0);
    return sum / director.known_for.length;
  };

  const getTopMovies = (director: Director) => {
    return director.known_for
      .filter(work => work.media_type === 'movie')
      .sort((a, b) => b.vote_average - a.vote_average)
      .slice(0, 3);
  };

  const getDirectorStats = (director: Director) => {
    const movies = director.known_for.filter(work => work.media_type === 'movie');
    const tvShows = director.known_for.filter(work => work.media_type === 'tv');
    
    const years = movies
      .map(movie => movie.release_date ? new Date(movie.release_date).getFullYear() : null)
      .filter(year => year !== null) as number[];
    
    const careerSpan = years.length > 0 ? Math.max(...years) - Math.min(...years) : 0;
    const totalVotes = movies.reduce((sum, movie) => sum + (movie.vote_count || 0), 0);
    
    return {
      totalMovies: movies.length,
      totalTVShows: tvShows.length,
      careerSpan,
      totalVotes,
      firstMovieYear: years.length > 0 ? Math.min(...years) : null,
      latestMovieYear: years.length > 0 ? Math.max(...years) : null,
    };
  };

  const getGenreDistribution = (director: Director) => {
    const genreCount: { [key: number]: number } = {};
    director.known_for.forEach(work => {
      if (work.genre_ids) {
        work.genre_ids.forEach(genreId => {
          genreCount[genreId] = (genreCount[genreId] || 0) + 1;
        });
      }
    });
    return Object.entries(genreCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).getFullYear().toString();
  };

  const handleViewFilmography = (director: Director) => {
    setSelectedDirector(director);
    setFilmographyDialogOpen(true);
  };

  const handleToggleExpanded = (directorId: number) => {
    setExpandedDirector(expandedDirector === directorId ? null : directorId);
  };

  const handleAddToComparison = (director: Director) => {
    if (comparisonDirectors.length < 3 && !comparisonDirectors.find(d => d.id === director.id)) {
      setComparisonDirectors([...comparisonDirectors, director]);
    }
  };

  const handleRemoveFromComparison = (directorId: number) => {
    setComparisonDirectors(comparisonDirectors.filter(d => d.id !== directorId));
  };

  const handleClearFilters = () => {
    setFilterGenre('all');
    setFilterDecade('all');
    setFilterRating(0);
    setSearchQuery('');
  };

  const getDecadeFromYear = (year: number) => {
    return Math.floor(year / 10) * 10;
  };

  const getAvailableDecades = () => {
    const decades = new Set<number>();
    directors.forEach(director => {
      director.known_for.forEach(work => {
        const year = work.release_date ? new Date(work.release_date).getFullYear() : 
                    work.first_air_date ? new Date(work.first_air_date).getFullYear() : null;
        if (year) {
          decades.add(getDecadeFromYear(year));
        }
      });
    });
    return Array.from(decades).sort((a, b) => b - a);
  };

  const getAvailableGenres = () => {
    const genres = new Set<number>();
    directors.forEach(director => {
      director.known_for.forEach(work => {
        if (work.genre_ids) {
          work.genre_ids.forEach(genreId => genres.add(genreId));
        }
      });
    });
    return Array.from(genres).sort();
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <>
      <SEO
        title="Movie Directors"
        description="Discover talented movie directors and their filmography. Explore the work of acclaimed filmmakers and rising directors."
        keywords={['movie directors', 'filmmakers', 'directors', 'filmography', 'movie makers', 'cinema directors']}
      />
      <RecaptchaProtection action="directors" showStatus={false}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <MovieIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="body1" component="p" sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            fontSize: '14px',
          }}>
            🎬 Directors
          </Typography>
        </Stack>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Discover talented directors and their acclaimed works
        </Typography>

        {/* Search and Controls */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search directors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sortBy}
              label="Sort by"
              onChange={handleSortChange}
              startAdornment={<FilterIcon sx={{ mr: 1 }} />}
            >
              {sortOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<FilterAltIcon />}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            Filters
          </Button>
          <Button
            variant="outlined"
            startIcon={viewMode === 'grid' ? <ListViewIcon /> : <GridViewIcon />}
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? 'List' : 'Grid'}
          </Button>
        </Stack>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <FilterAltIcon color="primary" />
              <Typography variant="h6">Advanced Filters</Typography>
              <Button
                size="small"
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
                sx={{ ml: 'auto' }}
              >
                Clear All
              </Button>
            </Stack>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Genre</InputLabel>
                  <Select
                    value={filterGenre}
                    label="Genre"
                    onChange={(e) => setFilterGenre(e.target.value)}
                  >
                    <MenuItem value="all">All Genres</MenuItem>
                    {getAvailableGenres().map(genreId => (
                      <MenuItem key={genreId} value={genreId.toString()}>
                        Genre {genreId}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Decade</InputLabel>
                  <Select
                    value={filterDecade}
                    label="Decade"
                    onChange={(e) => setFilterDecade(e.target.value)}
                  >
                    <MenuItem value="all">All Decades</MenuItem>
                    {getAvailableDecades().map(decade => (
                      <MenuItem key={decade} value={decade.toString()}>
                        {decade}s
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Minimum Rating: {filterRating.toFixed(1)}
                  </Typography>
                  <Rating
                    value={filterRating / 2}
                    precision={0.5}
                    onChange={(_, value) => setFilterRating((value || 0) * 2)}
                    size="large"
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button
                    variant="outlined"
                    startIcon={<CompareIcon />}
                    onClick={() => setComparisonDialogOpen(true)}
                    disabled={comparisonDirectors.length === 0}
                  >
                    Compare ({comparisonDirectors.length}/3)
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Comparison Bar */}
        {comparisonDirectors.length > 0 && (
          <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <CompareIcon />
              <Typography variant="subtitle1">
                Comparing {comparisonDirectors.length} directors
              </Typography>
              <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
                {comparisonDirectors.map(director => (
                  <Chip
                    key={director.id}
                    label={director.name}
                    onDelete={() => handleRemoveFromComparison(director.id)}
                    size="small"
                    sx={{ bgcolor: 'white', color: 'primary.main' }}
                  />
                ))}
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => setComparisonDialogOpen(true)}
                  sx={{ bgcolor: 'white', color: 'primary.main' }}
                >
                  Compare
                </Button>
              </Stack>
            </Stack>
          </Paper>
        )}
      </Box>

      {/* Directors Grid */}
      <Grid container spacing={3}>
        {filteredDirectors.map((director) => {
          const averageRating = getAverageRating(director);
          const topMovies = getTopMovies(director);
          const stats = getDirectorStats(director);
          const genreDistribution = getGenreDistribution(director);
          const isExpanded = expandedDirector === director.id;
          
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={director.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                {/* Director Image with Stats Badge */}
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={director.profile_path ? `https://image.tmdb.org/t/p/w500${director.profile_path}` : '/placeholder-movie.svg'}
                    alt={director.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <Badge
                    badgeContent={stats.totalMovies}
                    color="primary"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      '& .MuiBadge-badge': {
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                      },
                    }}
                  >
                    <Box />
                  </Badge>
                </Box>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom noWrap>
                    {director.name}
                  </Typography>
                  
                  {/* Director Info */}
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <Chip
                      label="Director"
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <StarIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {director.popularity.toFixed(1)}
                    </Typography>
                  </Stack>

                  {/* Rating */}
                  {averageRating > 0 && (
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                      <Rating
                        value={averageRating / 2}
                        precision={0.1}
                        size="small"
                        readOnly
                      />
                      <Typography variant="body2" color="text.secondary">
                        {averageRating.toFixed(1)} avg
                      </Typography>
                    </Stack>
                  )}

                  {/* Career Stats */}
                  <Box sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={2} justifyContent="space-between">
                      <Box textAlign="center">
                        <Typography variant="h6" color="primary.main">
                          {stats.totalMovies}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Movies
                        </Typography>
                      </Box>
                      <Box textAlign="center">
                        <Typography variant="h6" color="secondary.main">
                          {stats.careerSpan}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Years
                        </Typography>
                      </Box>
                      <Box textAlign="center">
                        <Typography variant="h6" color="success.main">
                          {stats.totalVotes.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Votes
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  {/* Top Movies */}
                  {topMovies.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Notable Films:
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {topMovies.map((movie) => (
                          <Chip
                            key={movie.id}
                            label={movie.title || movie.name}
                            size="small"
                            variant="outlined"
                            component={Link}
                            href={`/movie/${movie.id}`}
                            clickable
                            sx={{ mb: 0.5 }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {/* Expandable Details */}
                  {isExpanded && (
                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                      {/* Career Timeline */}
                      {stats.firstMovieYear && stats.latestMovieYear && (
                        <Box sx={{ mb: 2 }}>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                            <TimelineIcon fontSize="small" color="action" />
                            <Typography variant="subtitle2">Career Span</Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            {stats.firstMovieYear} - {stats.latestMovieYear}
                          </Typography>
                        </Box>
                      )}

                      {/* Genre Distribution */}
                      {genreDistribution.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                            <TheaterIcon fontSize="small" color="action" />
                            <Typography variant="subtitle2">Top Genres</Typography>
                          </Stack>
                          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                            {genreDistribution.slice(0, 3).map(([genreId, count]) => (
                              <Chip
                                key={genreId}
                                label={`Genre ${genreId} (${count})`}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem' }}
                              />
                            ))}
                          </Stack>
                        </Box>
                      )}
                    </Box>
                  )}
                </CardContent>

                <CardActions sx={{ flexDirection: 'column', gap: 1, p: 2 }}>
                  <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                    <Button
                      component={Link}
                      href={`/person/${director.id}`}
                      size="small"
                      variant="contained"
                      startIcon={<InfoIcon />}
                      sx={{ flex: 1 }}
                    >
                      Profile
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<MovieIcon />}
                      onClick={() => handleViewFilmography(director)}
                      sx={{ flex: 1 }}
                    >
                      Filmography
                    </Button>
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<CompareIcon />}
                      onClick={() => handleAddToComparison(director)}
                      disabled={comparisonDirectors.length >= 3 || comparisonDirectors.find(d => d.id === director.id) !== undefined}
                      sx={{ flex: 1 }}
                    >
                      Compare
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<FavoriteBorderIcon />}
                      sx={{ flex: 1 }}
                    >
                      Favorite
                    </Button>
                  </Stack>
                  <Button
                    size="small"
                    variant="text"
                    endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    onClick={() => handleToggleExpanded(director.id)}
                    sx={{ width: '100%' }}
                  >
                    {isExpanded ? 'Less Details' : 'More Details'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {/* No Results */}
      {filteredDirectors.length === 0 && searchQuery && (
        <Box textAlign="center" sx={{ py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No directors found for "{searchQuery}"
          </Typography>
        </Box>
      )}

      {/* Stats */}
      <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Stack direction="row" spacing={4} justifyContent="center">
          <Box textAlign="center">
            <Typography variant="h4" color="primary.main">
              {filteredDirectors.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Directors
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" color="secondary.main">
              {filteredDirectors.reduce((sum, dir) => sum + dir.known_for.length, 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Films
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" color="success.main">
              {filteredDirectors.length > 0 ? (filteredDirectors.reduce((sum, dir) => sum + getAverageRating(dir), 0) / filteredDirectors.length).toFixed(1) : '0.0'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Avg Rating
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Enhanced Filmography Dialog */}
      <Dialog
        open={filmographyDialogOpen}
        onClose={() => setFilmographyDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { minHeight: '70vh' }
        }}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              src={selectedDirector?.profile_path ? `https://image.tmdb.org/t/p/w500${selectedDirector.profile_path}` : undefined}
              sx={{ width: 48, height: 48 }}
            >
              <MovieIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">
                {selectedDirector?.name}'s Filmography
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complete list of movies and TV shows
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        
        <DialogContent dividers>
          {selectedDirector && (
            <Box>
              {/* Director Stats */}
              <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
                <Typography variant="h6" gutterBottom>
                  Career Statistics
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary.main">
                        {getDirectorStats(selectedDirector).totalMovies}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Movies Directed
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="secondary.main">
                        {getDirectorStats(selectedDirector).totalTVShows}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        TV Shows
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="success.main">
                        {getDirectorStats(selectedDirector).careerSpan}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Career Years
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="warning.main">
                        {getAverageRating(selectedDirector).toFixed(1)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Avg Rating
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              {/* Complete Filmography */}
              <Typography variant="h6" gutterBottom>
                Complete Filmography ({selectedDirector.known_for.length} works)
              </Typography>
              
              <List>
                {selectedDirector.known_for
                  .sort((a, b) => {
                    const dateA = a.release_date || a.first_air_date || '';
                    const dateB = b.release_date || b.first_air_date || '';
                    return dateB.localeCompare(dateA);
                  })
                  .map((work, index) => (
                    <ListItem
                      key={work.id}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        mb: 1,
                        bgcolor: 'background.paper',
                        alignItems: 'flex-start',
                        py: 2,
                      }}
                    >
                      <ListItemIcon sx={{ mt: 1 }}>
                        <Avatar
                          src={work.poster_path ? `https://image.tmdb.org/t/p/w200${work.poster_path}` : undefined}
                          sx={{ width: 60, height: 90 }}
                          variant="rounded"
                        >
                          <MovieIcon />
                        </Avatar>
                      </ListItemIcon>
                      
                      <Box sx={{ flex: 1, ml: 2 }}>
                        {/* Title and Type */}
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                          <Typography variant="h6" component="h3">
                            {work.title || work.name}
                          </Typography>
                          <Chip
                            label={work.media_type === 'movie' ? 'Movie' : 'TV'}
                            size="small"
                            color={work.media_type === 'movie' ? 'primary' : 'secondary'}
                            variant="outlined"
                          />
                        </Stack>

                        {/* Stats */}
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <StarIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              {work.vote_average.toFixed(1)}
                            </Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <CalendarIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              {formatDate(work.release_date || work.first_air_date)}
                            </Typography>
                          </Stack>
                          {work.vote_count && (
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <ViewIcon fontSize="small" color="action" />
                              <Typography variant="body2">
                                {work.vote_count.toLocaleString()} votes
                              </Typography>
                            </Stack>
                          )}
                        </Stack>

                        {/* Overview */}
                        {work.overview && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {work.overview.length > 150 
                              ? `${work.overview.substring(0, 150)}...` 
                              : work.overview
                            }
                          </Typography>
                        )}

                        {/* Rating */}
                        <Rating
                          value={work.vote_average / 2}
                          precision={0.1}
                          size="small"
                          readOnly
                          sx={{ mb: 1 }}
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 2 }}>
                        <Button
                          component={Link}
                          href={work.media_type === 'movie' ? `/movie/${work.id}` : `/tv/${work.id}`}
                          size="small"
                          variant="outlined"
                          startIcon={<InfoIcon />}
                        >
                          View Details
                        </Button>
                      </Box>
                    </ListItem>
                  ))}
              </List>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setFilmographyDialogOpen(false)}>
            Close
          </Button>
          <Button
            component={Link}
            href={`/person/${selectedDirector?.id}`}
            variant="contained"
            startIcon={<InfoIcon />}
          >
            View Full Profile
          </Button>
        </DialogActions>
      </Dialog>

      {/* Director Comparison Dialog */}
      <Dialog
        open={comparisonDialogOpen}
        onClose={() => setComparisonDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { minHeight: '80vh' }
        }}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            <CompareIcon color="primary" />
            <Typography variant="h6">
              Director Comparison
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Compare {comparisonDirectors.length} directors side by side
            </Typography>
          </Stack>
        </DialogTitle>
        
        <DialogContent dividers>
          {comparisonDirectors.length > 0 && (
            <Grid container spacing={3}>
              {comparisonDirectors.map((director) => {
                const stats = getDirectorStats(director);
                const avgRating = getAverageRating(director);
                const topMovies = getTopMovies(director);
                
                return (
                  <Grid item xs={12} md={12 / comparisonDirectors.length} key={director.id}>
                    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                        <Avatar
                          src={director.profile_path ? `https://image.tmdb.org/t/p/w500${director.profile_path}` : undefined}
                          sx={{ width: 60, height: 60 }}
                        >
                          <MovieIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6">{director.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Director
                          </Typography>
                        </Box>
                      </Stack>

                      {/* Comparison Stats */}
                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={6}>
                          <Box textAlign="center">
                            <Typography variant="h4" color="primary.main">
                              {stats.totalMovies}
                            </Typography>
                            <Typography variant="caption">Movies</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box textAlign="center">
                            <Typography variant="h4" color="secondary.main">
                              {stats.careerSpan}
                            </Typography>
                            <Typography variant="caption">Years</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box textAlign="center">
                            <Typography variant="h4" color="success.main">
                              {avgRating.toFixed(1)}
                            </Typography>
                            <Typography variant="caption">Avg Rating</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box textAlign="center">
                            <Typography variant="h4" color="warning.main">
                              {director.popularity.toFixed(1)}
                            </Typography>
                            <Typography variant="caption">Popularity</Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      {/* Top Movies */}
                      <Typography variant="subtitle2" gutterBottom>
                        Top Movies:
                      </Typography>
                      <Stack spacing={1}>
                        {topMovies.slice(0, 3).map((movie) => (
                          <Box key={movie.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar
                              src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : undefined}
                              sx={{ width: 30, height: 45 }}
                              variant="rounded"
                            >
                              <MovieIcon fontSize="small" />
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" noWrap>
                                {movie.title || movie.name}
                              </Typography>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <StarIcon fontSize="small" color="action" />
                                <Typography variant="caption">
                                  {movie.vote_average.toFixed(1)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  ({formatDate(movie.release_date || movie.first_air_date)})
                                </Typography>
                              </Stack>
                            </Box>
                          </Box>
                        ))}
                      </Stack>

                      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                        <Button
                          component={Link}
                          href={`/person/${director.id}`}
                          variant="outlined"
                          size="small"
                          fullWidth
                          startIcon={<InfoIcon />}
                        >
                          View Full Profile
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setComparisonDialogOpen(false)}>
            Close
          </Button>
          <Button
            onClick={() => setComparisonDirectors([])}
            color="error"
            startIcon={<ClearIcon />}
          >
            Clear Comparison
          </Button>
        </DialogActions>
      </Dialog>
        </Container>
      </RecaptchaProtection>
    </>
  );
}

export default function DirectorsPage() {
  return (
    <ProtectedRoute>
      <DirectorsPageContent />
    </ProtectedRoute>
  );
}