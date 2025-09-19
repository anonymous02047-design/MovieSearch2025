'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

// Dynamic route configuration
import SEO from '@/components/SEO';
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  Rating,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  Stack,
  Tabs,
  Tab,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  PlayArrow as PlayIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  BookmarkAdd as BookmarkAddIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon,
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { tmdbApi, Movie, MovieDetails, Credits, Review, Video, Images, getImageUrl, getBackdropUrl, formatRuntime, formatCurrency, formatDate } from '@/lib/tmdb';
import { getGenreNames } from '@/lib/genres';
import Navigation from '@/components/Navigation';
import CastMemberDialog from '@/components/CastMemberDialog';

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

export default function MovieDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const movieId = parseInt(params.id as string);

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [images, setImages] = useState<Images | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [trailerDialog, setTrailerDialog] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchlist, setIsWatchlist] = useState(false);
  const [castDialogOpen, setCastDialogOpen] = useState(false);
  const [selectedCastMember, setSelectedCastMember] = useState<{ id: number; name: string } | null>(null);

  const loadMovieData = useCallback(async () => {
    if (isNaN(movieId)) return;
    
    try {
      setLoading(true);
      setError(null);

      const [movieData, creditsData, reviewsData, similarData, videosData, imagesData] = await Promise.allSettled([
        tmdbApi.getMovieDetails(movieId),
        tmdbApi.getMovieCredits(movieId),
        tmdbApi.getMovieReviews(movieId),
        tmdbApi.getSimilarMovies(movieId),
        tmdbApi.getMovieVideos(movieId),
        tmdbApi.getMovieImages(movieId),
      ]);

      // Handle each API response
      if (movieData.status === 'fulfilled') {
        setMovie(movieData.value);
      } else {
        console.error('Failed to load movie details:', movieData.reason);
        setError('Failed to load movie details. Please try again.');
        return;
      }

      if (creditsData.status === 'fulfilled') {
        setCredits(creditsData.value);
      }

      if (reviewsData.status === 'fulfilled') {
        setReviews(reviewsData.value.results || []);
      }

      if (similarData.status === 'fulfilled') {
        setSimilarMovies(similarData.value.results || []);
      }

      if (videosData.status === 'fulfilled') {
        setVideos(videosData.value.results || []);
      }

      if (imagesData.status === 'fulfilled') {
        setImages(imagesData.value);
      }
    } catch (err) {
      setError('Failed to load movie details. Please try again.');
      console.error('Error loading movie data:', err);
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  const loadUserData = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    try {
      // Load favorites and watchlist from localStorage
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');

      setIsFavorite(favorites.includes(movieId));
      setIsWatchlist(watchlist.includes(movieId));
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, [movieId]);

  useEffect(() => {
    if (movieId && !isNaN(movieId)) {
      loadMovieData();
      loadUserData();
    }
  }, [movieId, loadMovieData, loadUserData]);

  // Redirect if invalid movie ID
  if (isNaN(movieId)) {
    router.push('/');
    return null;
  }

  const handleToggleFavorite = () => {
    if (typeof window === 'undefined') return;
    
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const newFavorites = isFavorite
        ? favorites.filter((id: number) => id !== movieId)
        : [...favorites, movieId];

      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleToggleWatchlist = () => {
    if (typeof window === 'undefined') return;
    
    try {
      const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
      const newWatchlist = isWatchlist
        ? watchlist.filter((id: number) => id !== movieId)
        : [...watchlist, movieId];

      localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
      setIsWatchlist(!isWatchlist);
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: movie?.title,
          text: movie?.overview,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCastMemberClick = (personId: number, personName: string) => {
    setSelectedCastMember({ id: personId, name: personName });
    setCastDialogOpen(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !movie) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Movie not found'}
        </Alert>
        <Button variant="contained" onClick={() => router.push('/')}>
          Back to Home
        </Button>
      </Box>
    );
  }

  const mainCast = credits?.cast.slice(0, 6) || [];
  const mainCrew = credits?.crew.filter(person => 
    ['Director', 'Producer', 'Writer', 'Screenplay'].includes(person.job)
  ).slice(0, 4) || [];

  return (
    <>
      {movie && (
        <SEO
          title={`${movie.title} (${new Date(movie.release_date).getFullYear()})`}
          description={movie.overview || `Watch ${movie.title}, a ${movie.genre_ids && getGenreNames(movie.genre_ids).join(', ')} movie released in ${new Date(movie.release_date).getFullYear()}.`}
          keywords={[
            movie.title,
            ...(movie.genre_ids ? getGenreNames(movie.genre_ids) : []),
            new Date(movie.release_date).getFullYear().toString(),
            'movie',
            'film',
            'cinema',
          ]}
          type="movie"
          movie={{
            title: movie.title,
            year: new Date(movie.release_date).getFullYear(),
            rating: movie.vote_average,
            genre: movie.genre_ids ? getGenreNames(movie.genre_ids) : [],
            director: credits?.crew?.find(person => person.job === 'Director')?.name || 'Unknown',
            cast: credits?.cast?.slice(0, 10).map(actor => actor.name) || [],
            duration: movie.runtime ? formatRuntime(movie.runtime) : 'Unknown',
            description: movie.overview || '',
            poster: getImageUrl(movie.poster_path, 'w500'),
          }}
        />
      )}
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Navigation />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - 240px)` },
          ml: { md: '240px' },
          mt: '64px',
        }}
      >
        {/* Hero Section */}
        <Box
          sx={{
            position: 'relative',
            height: '60vh',
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url(${getBackdropUrl(movie.backdrop_path, 'w1280')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'flex-end',
            p: 4,
          }}
        >
          <Container maxWidth="lg">
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => router.back()}
              sx={{ mb: 2, color: 'white' }}
            >
              Back
            </Button>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: { md: 'flex-end' } }}>
              <Box sx={{ flex: { xs: '1', md: '0 0 300px' }, maxWidth: { xs: '100%', md: '300px' } }}>
                <Card
                  sx={{
                    maxWidth: 300,
                    mx: 'auto',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                  }}
                >
                  <CardMedia
                    component="img"
                    image={getImageUrl(movie.poster_path, 'w500')}
                    alt={movie.title}
                    sx={{ aspectRatio: '2/3' }}
                  />
                </Card>
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Box sx={{ color: 'white' }}>
                  <Typography variant="h3" component="h1" gutterBottom>
                    {movie.title}
                  </Typography>
                  
                  {movie.tagline && (
                    <Typography variant="h6" sx={{ fontStyle: 'italic', mb: 2, opacity: 0.8 }}>
                      &ldquo;{movie.tagline}&rdquo;
                    </Typography>
                  )}

                  <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
                    {movie.genre_ids && getGenreNames(movie.genre_ids).map((genre, index) => (
                      <Chip
                        key={index}
                        label={genre}
                        variant="outlined"
                        sx={{ color: 'white', borderColor: 'white' }}
                      />
                    ))}
                  </Stack>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={movie.vote_average / 2} precision={0.1} readOnly size="small" />
                      <Typography variant="body1">
                        {movie.vote_average.toFixed(1)} ({movie.vote_count} votes)
                      </Typography>
                    </Box>
                    
                    {movie.release_date && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CalendarIcon fontSize="small" />
                        <Typography variant="body2">
                          {formatDate(movie.release_date)}
                        </Typography>
                      </Box>
                    )}
                    
                    {movie.runtime && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TimeIcon fontSize="small" />
                        <Typography variant="body2">
                          {formatRuntime(movie.runtime)}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                    {videos.length > 0 && (
                      <Button
                        variant="contained"
                        startIcon={<PlayIcon />}
                        onClick={() => {
                          const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube');
                          if (trailer) {
                            setSelectedVideo(trailer);
                            setTrailerDialog(true);
                          }
                        }}
                        sx={{ mr: 1 }}
                      >
                        Watch Trailer
                      </Button>
                    )}
                    
                    <IconButton
                      onClick={handleToggleFavorite}
                      sx={{ color: isFavorite ? 'error.main' : 'white' }}
                    >
                      {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                    
                    <IconButton
                      onClick={handleToggleWatchlist}
                      sx={{ color: isWatchlist ? 'primary.main' : 'white' }}
                    >
                      {isWatchlist ? <BookmarkAddIcon /> : <BookmarkBorderIcon />}
                    </IconButton>
                    
                    <IconButton onClick={handleShare} sx={{ color: 'white' }}>
                      <ShareIcon />
                    </IconButton>
                  </Box>

                  <Typography variant="body1" sx={{ maxWidth: 800, lineHeight: 1.6 }}>
                    {movie.overview}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Content Section */}
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Overview" />
              <Tab label="Cast & Crew" />
              <Tab label="Reviews" />
              <Tab label="Videos" />
              <Tab label="Photos" />
              <Tab label="Similar Movies" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
              <Box sx={{ flex: { xs: '1', md: '2' } }}>
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Movie Information
                  </Typography>
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                    {movie.status && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Status
                        </Typography>
                        <Typography variant="body1">
                          {movie.status}
                        </Typography>
                      </Box>
                    )}
                    
                    {movie.original_language && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Language
                        </Typography>
                        <Typography variant="body1">
                          {movie.original_language.toUpperCase()}
                        </Typography>
                      </Box>
                    )}
                    
                    {movie.budget > 0 && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Budget
                        </Typography>
                        <Typography variant="body1">
                          {formatCurrency(movie.budget)}
                        </Typography>
                      </Box>
                    )}
                    
                    {movie.revenue > 0 && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Revenue
                        </Typography>
                        <Typography variant="body1">
                          {formatCurrency(movie.revenue)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>

                {movie.production_companies.length > 0 && (
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Production Companies
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {movie.production_companies && movie.production_companies.map((company, index) => (
                        <Chip
                          key={index}
                          label={company.name}
                          variant="outlined"
                          size="small"
                        />
                      ))}
                    </Stack>
                  </Paper>
                )}
              </Box>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Cast
                </Typography>
                <List>
                  {mainCast && mainCast.map((person) => (
                    <ListItem 
                      key={person.id} 
                      sx={{ px: 0, cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                      onClick={() => handleCastMemberClick(person.id, person.name)}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={getImageUrl(person.profile_path, 'w185')}
                          alt={person.name}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={person.name}
                        secondary={person.character}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Crew
                </Typography>
                <List>
                  {mainCrew && mainCrew.map((person) => (
                    <ListItem 
                      key={person.id} 
                      sx={{ px: 0, cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                      onClick={() => handleCastMemberClick(person.id, person.name)}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={getImageUrl(person.profile_path, 'w185')}
                          alt={person.name}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={person.name}
                        secondary={person.job}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              Reviews ({reviews.length})
            </Typography>
            
            {reviews.length === 0 ? (
              <Typography color="text.secondary">
                No reviews available for this movie.
              </Typography>
            ) : (
              <Stack spacing={3}>
                {reviews && reviews.map((review) => (
                  <Paper key={review.id} sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">
                        {review.author}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(review.created_at)}
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {review.content}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" gutterBottom>
              Videos ({videos.length})
            </Typography>
            
            {videos.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No videos available for this movie.
              </Typography>
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
                {videos && videos.map((video) => (
                  <Card key={video.id} sx={{ cursor: 'pointer' }}>
                    <Box
                      sx={{
                        position: 'relative',
                        pt: '56.25%', // 16:9 aspect ratio
                        backgroundImage: `url(https://img.youtube.com/vi/${video.key}/maxresdefault.jpg)`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        '&:hover': {
                          '& .play-overlay': {
                            opacity: 1,
                          },
                        },
                      }}
                      onClick={() => {
                        setSelectedVideo(video);
                        setTrailerDialog(true);
                      }}
                    >
                      <Box
                        className="play-overlay"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          opacity: 0.7,
                          transition: 'opacity 0.3s',
                        }}
                      >
                        <PlayIcon sx={{ fontSize: 60, color: 'white' }} />
                      </Box>
                    </Box>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        {video.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip label={video.type} size="small" variant="outlined" />
                        <Chip label={video.site} size="small" variant="outlined" />
                        {video.official && (
                          <Chip label="Official" size="small" color="primary" />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <Typography variant="h6" gutterBottom>
              Photos
            </Typography>
            
            {!images || (images.backdrops.length === 0 && images.posters.length === 0) ? (
              <Typography variant="body2" color="text.secondary">
                No photos available for this movie.
              </Typography>
            ) : (
              <Box>
                {images.backdrops.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Backdrops ({images.backdrops.length})
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
                      {images.backdrops && images.backdrops.slice(0, 8).map((backdrop, index) => (
                        <Card key={index} sx={{ cursor: 'pointer' }}>
                          <CardMedia
                            component="img"
                            image={getBackdropUrl(backdrop.file_path, 'w780')}
                            alt={`Backdrop ${index + 1}`}
                            sx={{ aspectRatio: '16/9' }}
                            onClick={() => window.open(getBackdropUrl(backdrop.file_path, 'original'), '_blank')}
                          />
                        </Card>
                      ))}
                    </Box>
                  </Box>
                )}
                
                {images.posters.length > 0 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Posters ({images.posters.length})
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                      {images.posters && images.posters.slice(0, 12).map((poster, index) => (
                        <Card key={index} sx={{ cursor: 'pointer' }}>
                          <CardMedia
                            component="img"
                            image={getImageUrl(poster.file_path, 'w500')}
                            alt={`Poster ${index + 1}`}
                            sx={{ aspectRatio: '2/3' }}
                            onClick={() => window.open(getImageUrl(poster.file_path, 'original'), '_blank')}
                          />
                        </Card>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={5}>
            <Typography variant="h6" gutterBottom>
              Similar Movies
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3 }}>
              {similarMovies && similarMovies.slice(0, 8).map((similarMovie) => (
                <Box key={similarMovie.id}>
                  <Card
                    sx={{ cursor: 'pointer' }}
                    onClick={() => router.push(`/movie/${similarMovie.id}`)}
                  >
                    <CardMedia
                      component="img"
                      image={getImageUrl(similarMovie.poster_path, 'w300')}
                      alt={similarMovie.title}
                      sx={{ aspectRatio: '2/3' }}
                    />
                    <CardContent>
                      <Typography variant="subtitle2" noWrap>
                        {similarMovie.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {similarMovie.release_date && formatDate(similarMovie.release_date)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          </TabPanel>
        </Container>

        {/* Trailer Dialog */}
        <Dialog
          open={trailerDialog}
          onClose={() => {
            setTrailerDialog(false);
            setSelectedVideo(null);
          }}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: 'black',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          <DialogTitle sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" color="white">
                {selectedVideo?.name || `${movie?.title} Trailer`}
              </Typography>
              <IconButton onClick={() => {
                setTrailerDialog(false);
                setSelectedVideo(null);
              }} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            {selectedVideo ? (
              <Box sx={{ position: 'relative', pt: '56.25%' /* 16:9 Aspect Ratio */ }}>
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.key}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                ></iframe>
              </Box>
            ) : (
              <Box sx={{ p: 4, textAlign: 'center', color: 'white' }}>
                <Typography>No trailer available for this movie.</Typography>
              </Box>
            )}
          </DialogContent>
        </Dialog>

        {/* Cast Member Dialog */}
        <CastMemberDialog
          open={castDialogOpen}
          onClose={() => {
            setCastDialogOpen(false);
            setSelectedCastMember(null);
          }}
          personId={selectedCastMember?.id || null}
          personName={selectedCastMember?.name || ''}
        />
      </Box>
    </Box>
    </>
  );
}
