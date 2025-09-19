'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

// Dynamic route configuration
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  IconButton,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Rating,
  Alert,
  CircularProgress,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Link,
  Badge,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Favorite as FavoriteIcon,
  Bookmark as BookmarkIcon,
  Share as ShareIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Language as LanguageIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  Public as PublicIcon,
  Movie as MovieIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  OpenInNew as OpenInNewIcon,
  YouTube as YouTubeIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { tmdbEnhanced, EnhancedMovieDetails } from '@/lib/tmdbEnhanced';
import { errorHandler } from '@/lib/errorHandler';

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
      id={`movie-tabpanel-${index}`}
      aria-labelledby={`movie-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function EnhancedMovieDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const movieId = parseInt(params.id as string);

  const [movie, setMovie] = useState<EnhancedMovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const movieData = await tmdbEnhanced.getEnhancedMovieDetails(movieId);
      setMovie(movieData);
    } catch (err: any) {
      setError(err.message || 'Failed to load movie details');
      console.error('Error fetching movie details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getImageUrl = (path: string | null, size: string = 'w500') => {
    if (!path) return '/placeholder-movie.svg';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading movie details...
        </Typography>
      </Container>
    );
  }

  if (error || !movie) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Movie not found'}
        </Alert>
        <Button variant="contained" onClick={() => router.back()}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                height="600"
                image={getImageUrl(movie.poster_path, 'w500')}
                alt={movie.title}
                sx={{ objectFit: 'cover' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  display: 'flex',
                  gap: 1,
                }}
              >
                <Tooltip title="Add to Favorites">
                  <IconButton
                    sx={{
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                    }}
                  >
                    <FavoriteIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Add to Watchlist">
                  <IconButton
                    sx={{
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                    }}
                  >
                    <BookmarkIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Share">
                  <IconButton
                    sx={{
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                    }}
                  >
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h3" component="h1" gutterBottom>
                {movie.title}
              </Typography>
              {movie.original_title !== movie.title && (
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  {movie.original_title}
                </Typography>
              )}
              {movie.tagline && (
                <Typography variant="h6" color="primary" sx={{ fontStyle: 'italic', mb: 2 }}>
                  "{movie.tagline}"
                </Typography>
              )}
            </Box>

            {/* Key Stats */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Rating value={movie.vote_average / 2} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary">
                    {movie.vote_average.toFixed(1)}/10
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {movie.vote_count.toLocaleString()} votes
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <TrendingUpIcon color="primary" />
                  <Typography variant="body2" color="text.secondary">
                    Popularity
                  </Typography>
                  <Typography variant="h6">
                    {movie.popularity.toFixed(0)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <TimeIcon color="primary" />
                  <Typography variant="body2" color="text.secondary">
                    Runtime
                  </Typography>
                  <Typography variant="h6">
                    {formatRuntime(movie.runtime)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <CalendarIcon color="primary" />
                  <Typography variant="body2" color="text.secondary">
                    Release Date
                  </Typography>
                  <Typography variant="h6">
                    {new Date(movie.release_date).getFullYear()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Genres */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Genres
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {movie.genres.map((genre) => (
                  <Chip key={genre.id} label={genre.name} variant="outlined" />
                ))}
              </Box>
            </Box>

            {/* Overview */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Overview
              </Typography>
              <Typography variant="body1" paragraph>
                {movie.overview}
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                startIcon={<PlayIcon />}
                size="large"
                sx={{ minWidth: 150 }}
              >
                Watch Trailer
              </Button>
              <Button
                variant="outlined"
                startIcon={<FavoriteIcon />}
                size="large"
              >
                Add to Favorites
              </Button>
              <Button
                variant="outlined"
                startIcon={<BookmarkIcon />}
                size="large"
              >
                Add to Watchlist
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Tabs Section */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Details" />
          <Tab label="Cast & Crew" />
          <Tab label="Media" />
          <Tab label="Reviews" />
          <Tab label="Similar Movies" />
          <Tab label="Additional Info" />
        </Tabs>

        {/* Details Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Production Details
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Status"
                    secondary={movie.status}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Original Language"
                    secondary={movie.original_language.toUpperCase()}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Budget"
                    secondary={movie.budget > 0 ? formatCurrency(movie.budget) : 'Not available'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Revenue"
                    secondary={movie.revenue > 0 ? formatCurrency(movie.revenue) : 'Not available'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Runtime"
                    secondary={formatRuntime(movie.runtime)}
                  />
                </ListItem>
              </List>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Production Companies
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {movie.production_companies.map((company) => (
                  <Chip
                    key={company.id}
                    label={company.name}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Production Countries
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {movie.production_countries.map((country) => (
                  <Chip
                    key={country.iso_3166_1}
                    label={country.name}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Spoken Languages
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                {movie.spoken_languages.map((language) => (
                  <Chip
                    key={language.iso_639_1}
                    label={language.english_name}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>

              {movie.belongs_to_collection && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Collection
                  </Typography>
                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6">
                        {movie.belongs_to_collection.name}
                      </Typography>
                      {movie.belongs_to_collection.overview && (
                        <Typography variant="body2" color="text.secondary">
                          {movie.belongs_to_collection.overview}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}

              <Typography variant="h6" gutterBottom>
                External Links
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {movie.homepage && (
                  <Button
                    variant="outlined"
                    startIcon={<LinkIcon />}
                    href={movie.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                  >
                    Official Website
                  </Button>
                )}
                {movie.imdb_id && (
                  <Button
                    variant="outlined"
                    startIcon={<MovieIcon />}
                    href={`https://www.imdb.com/title/${movie.imdb_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                  >
                    IMDb
                  </Button>
                )}
                {movie.social_media.facebook_id && (
                  <Button
                    variant="outlined"
                    startIcon={<FacebookIcon />}
                    href={`https://facebook.com/${movie.social_media.facebook_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                  >
                    Facebook
                  </Button>
                )}
                {movie.social_media.twitter_id && (
                  <Button
                    variant="outlined"
                    startIcon={<TwitterIcon />}
                    href={`https://twitter.com/${movie.social_media.twitter_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                  >
                    Twitter
                  </Button>
                )}
                {movie.social_media.instagram_id && (
                  <Button
                    variant="outlined"
                    startIcon={<InstagramIcon />}
                    href={`https://instagram.com/${movie.social_media.instagram_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                  >
                    Instagram
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Cast & Crew Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Cast
              </Typography>
              <List>
                {movie.credits.cast.slice(0, 10).map((actor) => (
                  <ListItem key={actor.id} divider>
                    <ListItemAvatar>
                      <Avatar
                        src={getImageUrl(actor.profile_path, 'w185')}
                        alt={actor.name}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={actor.name}
                      secondary={actor.character}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Crew
              </Typography>
              <List>
                {movie.credits.crew.slice(0, 10).map((member) => (
                  <ListItem key={member.id} divider>
                    <ListItemAvatar>
                      <Avatar
                        src={getImageUrl(member.profile_path, 'w185')}
                        alt={member.name}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={member.name}
                      secondary={`${member.job} - ${member.department}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Media Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Videos
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {movie.videos.slice(0, 6).map((video) => (
              <Grid item xs={12} sm={6} md={4} key={video.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                    alt={video.name}
                  />
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      {video.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {video.type} • {video.site}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography variant="h6" gutterBottom>
            Images
          </Typography>
          <Grid container spacing={2}>
            {movie.images.backdrops.slice(0, 12).map((image, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={getImageUrl(image.file_path, 'w500')}
                    alt={`Backdrop ${index + 1}`}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Reviews Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Reviews
          </Typography>
          {movie.reviews.length > 0 ? (
            <List>
              {movie.reviews.map((review) => (
                <ListItem key={review.id} divider>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1">
                          {review.author}
                        </Typography>
                        {review.rating && (
                          <Rating value={review.rating / 2} precision={0.1} readOnly size="small" />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {review.content}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(review.created_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary">
              No reviews available for this movie.
            </Typography>
          )}
        </TabPanel>

        {/* Similar Movies Tab */}
        <TabPanel value={tabValue} index={4}>
          <Typography variant="h6" gutterBottom>
            Similar Movies
          </Typography>
          <Grid container spacing={2}>
            {movie.similar_movies.slice(0, 12).map((similarMovie) => (
              <Grid item xs={6} sm={4} md={3} key={similarMovie.id}>
                <Card
                  sx={{ cursor: 'pointer' }}
                  onClick={() => router.push(`/movie/${similarMovie.id}/enhanced`)}
                >
                  <CardMedia
                    component="img"
                    height="300"
                    image={getImageUrl(similarMovie.poster_path, 'w300')}
                    alt={similarMovie.title}
                  />
                  <CardContent>
                    <Typography variant="subtitle2" noWrap>
                      {similarMovie.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(similarMovie.release_date).getFullYear()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Additional Info Tab */}
        <TabPanel value={tabValue} index={5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Alternative Titles</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    {movie.alternative_titles.map((title, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={title.title}
                          secondary={`${title.iso_3166_1} - ${title.type}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Keywords</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {movie.keywords.map((keyword) => (
                      <Chip
                        key={keyword.id}
                        label={keyword.name}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Grid>

            <Grid item xs={12} md={6}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Watch Providers</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">
                    Watch provider information will be displayed here when available.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Box Office Performance</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Worldwide Total"
                        secondary={formatCurrency(movie.box_office_performance.worldwide_total)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Domestic Total"
                        secondary={formatCurrency(movie.box_office_performance.domestic_total)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Opening Weekend"
                        secondary={formatCurrency(movie.box_office_performance.opening_weekend)}
                      />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Container>
  );
}
