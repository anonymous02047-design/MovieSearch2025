'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

// Dynamic route configuration
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Person as PersonIcon,
  Movie as MovieIcon,
  Star as StarIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { tmdbApi } from '@/lib/tmdb';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import SEO from '@/components/SEO';
import RecaptchaProtection from '@/components/RecaptchaProtection';

interface Person {
  id: number;
  name: string;
  biography: string;
  profile_path: string | null;
  birthday: string;
  deathday: string | null;
  place_of_birth: string;
  known_for_department: string;
  popularity: number;
  also_known_as: string[];
  gender: number;
  homepage: string | null;
  imdb_id: string | null;
}

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  job?: string;
  character?: string;
}

function PersonPageContent() {
  const params = useParams();
  const personId = params?.id as string;
  
  const [person, setPerson] = useState<Person | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (personId) {
      fetchPersonDetails();
    }
  }, [personId]);

  const fetchPersonDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const [personData, movieCredits] = await Promise.all([
        tmdbApi.getPersonDetails(parseInt(personId)),
        tmdbApi.getPersonMovieCredits(parseInt(personId))
      ]);

      setPerson(personData);
      setMovies(movieCredits.cast.slice(0, 20)); // Show first 20 movies
    } catch (err) {
      setError('Failed to fetch person details');
      console.error('Error fetching person details:', err);
    } finally {
      setLoading(false);
    }
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

  if (error || !person) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Person not found'}</Alert>
        <Box sx={{ mt: 2 }}>
          <Button
            component={Link}
            href="/actors"
            startIcon={<ArrowBackIcon />}
            variant="outlined"
          >
            Back to Actors
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <SEO
        title={`${person.name} - Actor Profile`}
        description={`Learn more about ${person.name}, ${person.known_for_department}. View biography, filmography, and more.`}
        keywords={[person.name, 'actor', 'biography', 'filmography', 'movies']}
      />
      <RecaptchaProtection action="person_view" showStatus={false}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Back Button */}
          <Box sx={{ mb: 3 }}>
            <Button
              component={Link}
              href="/actors"
              startIcon={<ArrowBackIcon />}
              variant="outlined"
            >
              Back to Actors
            </Button>
          </Box>

          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="body1" component="p" gutterBottom sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              fontSize: '14px',
            }}>
              👤 {person.name}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              {person.known_for_department} • {person.place_of_birth || 'Unknown Location'}
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Profile Image */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ mb: 3 }}>
                <CardMedia
                  component="img"
                  height="500"
                  image={person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : '/placeholder-movie.svg'}
                  alt={person.name}
                  sx={{ objectFit: 'cover' }}
                />
              </Card>
            </Grid>

            {/* Person Details */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Card sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
                  Personal Information
                </Typography>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Department
                    </Typography>
                    <Chip label={person.known_for_department} color="primary" size="large" />
                  </Box>

                  {person.birthday && (
                    <Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Birthday
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <CalendarIcon color="action" />
                        <Typography variant="body1">
                          {new Date(person.birthday).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                          {person.deathday && (
                            <Typography component="span" color="text.secondary" sx={{ ml: 1 }}>
                              - {new Date(person.deathday).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </Typography>
                          )}
                        </Typography>
                      </Stack>
                    </Box>
                  )}

                  {person.place_of_birth && (
                    <Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Place of Birth
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <LocationIcon color="action" />
                        <Typography variant="body1">{person.place_of_birth}</Typography>
                      </Stack>
                    </Box>
                  )}

                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Popularity Score
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <StarIcon color="warning" />
                      <Typography variant="body1">{person.popularity.toFixed(1)}</Typography>
                    </Stack>
                  </Box>

                  {person.also_known_as && person.also_known_as.length > 0 && (
                    <Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Also Known As
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {person.also_known_as.map((name, index) => (
                          <Chip key={index} label={name} variant="outlined" size="small" />
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {person.homepage && (
                    <Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Official Website
                      </Typography>
                      <Button
                        variant="outlined"
                        href={person.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                      >
                        Visit Website
                      </Button>
                    </Box>
                  )}
                </Stack>
              </Card>

              {/* Biography */}
              {person.biography && (
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Biography
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    {person.biography}
                  </Typography>
                </Card>
              )}
            </Grid>
          </Grid>

          {/* Filmography */}
          {movies.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3, color: 'primary.main' }}>
                🎬 Filmography ({movies.length} movies)
              </Typography>
              <Grid container spacing={3}>
                {movies.map((movie) => (
                  <Grid size={{ xs: 6, sm: 4, md: 3 }} key={movie.id}>
                    <Card sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                      }
                    }}>
                      <CardMedia
                        component="img"
                        height="250"
                        image={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : '/placeholder-movie.svg'}
                        alt={movie.title}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        <Typography variant="subtitle2" noWrap gutterBottom sx={{ fontWeight: 'bold' }}>
                          {movie.title}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                          {movie.release_date && (
                            <Typography variant="caption" color="text.secondary">
                              {new Date(movie.release_date).getFullYear()}
                            </Typography>
                          )}
                          {movie.vote_average > 0 && (
                            <>
                              <StarIcon sx={{ fontSize: 14, color: 'warning.main' }} />
                              <Typography variant="caption" color="text.secondary">
                                {movie.vote_average.toFixed(1)}
                              </Typography>
                            </>
                          )}
                        </Stack>
                        {movie.character && (
                          <Typography variant="caption" color="primary.main" sx={{ fontStyle: 'italic' }}>
                            as {movie.character}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Container>
      </RecaptchaProtection>
    </>
  );
}

export default function PersonPage() {
  return (
    <ProtectedRoute>
      <PersonPageContent />
    </ProtectedRoute>
  );
}
