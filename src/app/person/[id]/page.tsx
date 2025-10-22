'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Button,
  alpha,
  useTheme,
  Avatar,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Cake as CakeIcon,
  Place as PlaceIcon,
  Movie as MovieIcon,
  Tv as TvIcon,
} from '@mui/icons-material';
import { tmdbApi } from '@/lib/tmdb';
import { getImageUrl } from '@/lib/tmdb';
import SEO from '@/components/SEO';
import MovieCard from '@/components/MovieCard';
import ResponsiveGrid from '@/components/ResponsiveGrid';
import { useApiErrorHandler } from '@/hooks/useErrorHandler';
import ErrorDisplay from '@/components/ErrorDisplay';

interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
}

export default function PersonPage() {
  const params = useParams();
  const router = useRouter();
  const theme = useTheme();
  const personId = parseInt(params.id as string);
  
  const [person, setPerson] = useState<PersonDetails | null>(null);
  const [credits, setCredits] = useState<any>(null);
  const { error, loading, handleAsyncError } = useApiErrorHandler();

  useEffect(() => {
    loadPersonDetails();
  }, [personId]);

  const loadPersonDetails = async () => {
    const result = await handleAsyncError(
      async () => {
        const [personData, creditsData] = await Promise.all([
          tmdbApi.getPersonDetails(personId),
          tmdbApi.getPersonCredits(personId),
        ]);
        return { personData, creditsData };
      },
      'PersonPage.loadPersonDetails'
    );

    if (result) {
      setPerson(result.personData);
      setCredits(result.creditsData);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <ErrorDisplay error={error} onRetry={loadPersonDetails} />
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button onClick={() => router.push('/')} variant="contained">
            Go Home
          </Button>
        </Box>
      </Container>
    );
  }

  if (!person) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4">Person not found</Typography>
        <Button onClick={() => router.push('/')} sx={{ mt: 2 }}>
          Go Home
        </Button>
      </Container>
    );
  }

  const age = person.birthday
    ? Math.floor((new Date().getTime() - new Date(person.birthday).getTime()) / 31557600000)
    : null;

  return (
    <>
      <SEO
        title={`${person.name} - Person Details`}
        description={person.biography || `View ${person.name}'s filmography and biography`}
        keywords={[person.name, 'actor', 'actress', 'celebrity', 'filmography']}
        image={getImageUrl(person.profile_path)}
      />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => router.back()}
          sx={{ mb: 3 }}
        >
          Back
        </Button>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              {person.profile_path ? (
                <CardMedia
                  component="img"
                  image={getImageUrl(person.profile_path, 'w500')}
                  alt={person.name}
                  sx={{ aspectRatio: '2/3', objectFit: 'cover' }}
                />
              ) : (
                <Avatar
                  sx={{ width: '100%', height: 'auto', aspectRatio: '2/3', fontSize: 64 }}
                >
                  {person.name[0]}
                </Avatar>
              )}
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
              {person.name}
            </Typography>

            <Chip
              label={person.known_for_department}
              color="primary"
              sx={{ mb: 3 }}
            />

            {person.birthday && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CakeIcon color="action" />
                <Typography variant="body1">
                  Born: {new Date(person.birthday).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  {age && ` (${age} years old)`}
                </Typography>
              </Box>
            )}

            {person.place_of_birth && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <PlaceIcon color="action" />
                <Typography variant="body1">{person.place_of_birth}</Typography>
              </Box>
            )}

            {person.biography && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  Biography
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
                  {person.biography}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>

        {/* Filmography */}
        {credits && credits.cast && credits.cast.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h4" gutterBottom fontWeight={700}>
              Known For
            </Typography>
            <ResponsiveGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={3}>
              {credits.cast.slice(0, 12).map((movie: any) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ResponsiveGrid>
          </Box>
        )}
      </Container>
    </>
  );
}
