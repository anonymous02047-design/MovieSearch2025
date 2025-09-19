'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Rating,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  BookmarkAdd as BookmarkAddIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon,
  Language as LanguageIcon,
  Public as PublicIcon,
} from '@mui/icons-material';
import { Movie, getImageUrl, formatDate } from '@/lib/tmdb';
import { addToFavorites, removeFromFavorites, addToWatchlist, removeFromWatchlist, isFavorite, isInWatchlist } from '@/lib/storage';
import SEO from './SEO';

interface MovieDetailsProps {
  movie: Movie;
}

export default function MovieDetails({ movie }: MovieDetailsProps) {
  const [favoriteState, setFavoriteState] = useState(false);
  const [watchlistState, setWatchlistState] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setFavoriteState(isFavorite(movie.id));
    setWatchlistState(isInWatchlist(movie.id));
  }, [movie.id]);

  const handleToggleFavorite = () => {
    if (favoriteState) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie.id);
    }
    setFavoriteState(!favoriteState);
  };

  const handleToggleWatchlist = () => {
    if (watchlistState) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie.id);
    }
    setWatchlistState(!watchlistState);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: movie.title,
          text: movie.overview,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'success';
    if (rating >= 6) return 'warning';
    return 'error';
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <>
      <SEO
        title={`${movie.title} (${new Date(movie.release_date).getFullYear()})`}
        description={movie.overview || `Watch ${movie.title}, a ${movie.genres?.map(g => g.name).join(', ')} movie released in ${new Date(movie.release_date).getFullYear()}.`}
        keywords={[
          movie.title,
          ...(movie.genres?.map(g => g.name) || []),
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
          genre: movie.genres?.map(g => g.name) || [],
          director: movie.credits?.crew?.find(person => person.job === 'Director')?.name || 'Unknown',
          cast: movie.credits?.cast?.slice(0, 10).map(actor => actor.name) || [],
          duration: formatRuntime(movie.runtime || 0),
          description: movie.overview || '',
          poster: getImageUrl(movie.poster_path, 'w500'),
        }}
      />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
          <Grid container spacing={4}>
            {/* Movie Poster */}
            <Grid item xs={12} md={4}>
              <Box sx={{ position: 'relative' }}>
                {imageLoading && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'grey.100',
                      borderRadius: 2,
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )}
                <Box
                  component="img"
                  src={getImageUrl(movie.poster_path, 'w500')}
                  alt={movie.title}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 2,
                    display: imageLoading ? 'none' : 'block',
                  }}
                  onLoad={() => setImageLoading(false)}
                  onError={() => {
                    setImageLoading(false);
                    setImageError(true);
                  }}
                />
                {imageError && (
                  <Box
                    sx={{
                      width: '100%',
                      height: 400,
                      bgcolor: 'grey.200',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 2,
                    }}
                  >
                    <Typography color="text.secondary">Image not available</Typography>
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Movie Information */}
            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {movie.title}
                </Typography>
                
                {movie.tagline && (
                  <Typography variant="h6" color="text.secondary" sx={{ fontStyle: 'italic', mb: 2 }}>
                    "{movie.tagline}"
                  </Typography>
                )}

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {movie.genres?.map((genre) => (
                    <Chip key={genre.id} label={genre.name} color="primary" variant="outlined" />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Rating
                    value={movie.vote_average / 2}
                    precision={0.1}
                    readOnly
                    size="large"
                  />
                  <Typography variant="h6" color="text.secondary">
                    {movie.vote_average.toFixed(1)}/10
                  </Typography>
                  <Chip
                    icon={<StarIcon />}
                    label={`${movie.vote_count} votes`}
                    color={getRatingColor(movie.vote_average)}
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                  {movie.release_date && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarIcon color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(movie.release_date)}
                      </Typography>
                    </Box>
                  )}
                  {movie.runtime && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TimeIcon color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {formatRuntime(movie.runtime)}
                      </Typography>
                    </Box>
                  )}
                  {movie.original_language && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LanguageIcon color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {movie.original_language.toUpperCase()}
                      </Typography>
                    </Box>
                  )}
                  {movie.status && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PublicIcon color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {movie.status}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={<PlayIcon />}
                    size="large"
                    sx={{
                      background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #5a6fd8 0%, #6a4190 100%)',
                      }
                    }}
                  >
                    Watch Now
                  </Button>
                  
                  <Tooltip title={favoriteState ? "Remove from favorites" : "Add to favorites"}>
                    <IconButton
                      onClick={handleToggleFavorite}
                      color={favoriteState ? "error" : "default"}
                      size="large"
                    >
                      {favoriteState ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title={watchlistState ? "Remove from watchlist" : "Add to watchlist"}>
                    <IconButton
                      onClick={handleToggleWatchlist}
                      color={watchlistState ? "primary" : "default"}
                      size="large"
                    >
                      {watchlistState ? <BookmarkAddIcon /> : <BookmarkBorderIcon />}
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Share">
                    <IconButton onClick={handleShare} size="large">
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Overview */}
          {movie.overview && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Overview
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                {movie.overview}
              </Typography>
            </Box>
          )}

          {/* Cast */}
          {movie.credits?.cast && movie.credits.cast.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Cast
              </Typography>
              <Grid container spacing={2}>
                {movie.credits.cast.slice(0, 12).map((actor) => (
                  <Grid item xs={6} sm={4} md={3} key={actor.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={getImageUrl(actor.profile_path, 'w185')}
                        alt={actor.name}
                        sx={{ width: 48, height: 48 }}
                      />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {actor.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {actor.character}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Crew */}
          {movie.credits?.crew && movie.credits.crew.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Crew
              </Typography>
              <List>
                {movie.credits.crew
                  .filter(person => ['Director', 'Producer', 'Writer', 'Screenplay'].includes(person.job))
                  .slice(0, 10)
                  .map((person) => (
                    <ListItem key={person.id} sx={{ px: 0 }}>
                      <ListItemText
                        primary={person.name}
                        secondary={person.job}
                      />
                    </ListItem>
                  ))}
              </List>
            </Box>
          )}

          {/* Production Companies */}
          {movie.production_companies && movie.production_companies.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Production Companies
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {movie.production_companies.map((company) => (
                  <Chip
                    key={company.id}
                    label={company.name}
                    variant="outlined"
                    avatar={
                      company.logo_path ? (
                        <Avatar
                          src={getImageUrl(company.logo_path, 'w92')}
                          alt={company.name}
                          sx={{ width: 24, height: 24 }}
                        />
                      ) : undefined
                    }
                  />
                ))}
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </>
  );
}
