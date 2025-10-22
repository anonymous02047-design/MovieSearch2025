'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  useTheme,
} from '@mui/material';
import { Category as CategoryIcon } from '@mui/icons-material';
import { tmdbApi } from '@/lib/tmdb';
import SEO from '@/components/SEO';
import PageHeader from '@/components/PageHeader';
import PageContainer from '@/components/PageContainer';
import { useApiErrorHandler } from '@/hooks/useErrorHandler';
import ErrorDisplay from '@/components/ErrorDisplay';
import { LoadingSkeleton } from '@/components/LoadingStates';

interface Genre {
  id: number;
  name: string;
}

const genreGradients = {
  Action: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  Adventure: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  Animation: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  Comedy: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  Crime: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  Documentary: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  Drama: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  Family: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  Fantasy: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  History: 'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)',
  Horror: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  Music: 'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)',
  Mystery: 'linear-gradient(135deg, #9890e3 0%, #b1f4cf 100%)',
  Romance: 'linear-gradient(135deg, #ebc0fd 0%, #d9ded8 100%)',
  'Science Fiction': 'linear-gradient(135deg, #c2e9fb 0%, #a1c4fd 100%)',
  'TV Movie': 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
  Thriller: 'linear-gradient(135deg, #f77062 0%, #fe5196 100%)',
  War: 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)',
  Western: 'linear-gradient(135deg, #fc6076 0%, #ff9a44 100%)',
};

const getGradient = (genreName: string) => {
  return genreGradients[genreName as keyof typeof genreGradients] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
};

export default function GenresPage() {
  const router = useRouter();
  const theme = useTheme();
  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [tvGenres, setTvGenres] = useState<Genre[]>([]);
  const { error, loading, handleAsyncError } = useApiErrorHandler();

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    const result = await handleAsyncError(
      async () => {
        const [movieGenresData, tvGenresData] = await Promise.all([
          tmdbApi.getGenres(),
          tmdbApi.getTVGenres(),
        ]);
        return { movieGenresData, tvGenresData };
      },
      'GenresPage.loadGenres'
    );

    if (result) {
      setMovieGenres(result.movieGenresData.genres || []);
      setTvGenres(result.tvGenresData.genres || []);
    }
  };

  // Combine and deduplicate genres
  const allGenres = [...movieGenres, ...tvGenres].reduce((acc, genre) => {
    if (!acc.find(g => g.id === genre.id)) {
      acc.push(genre);
    }
    return acc;
  }, [] as Genre[]);

  return (
    <>
      <SEO
        title="Browse by Genre - MovieSearch 2025"
        description="Explore movies and TV shows by genre - Action, Comedy, Drama, Sci-Fi, and more"
        keywords={['genres', 'categories', 'movie genres', 'tv genres']}
      />

      <PageHeader
        icon={<CategoryIcon />}
        title="Browse by Genre"
        subtitle="Discover movies and TV shows by your favorite genre"
      />

      <PageContainer>

          {error && (
            <Box sx={{ mb: 3 }}>
              <ErrorDisplay error={error} onRetry={loadGenres} />
            </Box>
          )}

          {loading ? (
            <Grid container spacing={3}>
              {Array.from({ length: 12 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <LoadingSkeleton type="card" count={1} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={3}>
              {allGenres.map((genre) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={genre.id}>
                  <Card
                    sx={{
                      height: '100%',
                      background: getGradient(genre.name),
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: theme.shadows[10],
                      },
                    }}
                  >
                    <CardActionArea
                      onClick={() => router.push(`/genre/${genre.name.toLowerCase().replace(/\s+/g, '-')}`)}
                      sx={{ height: '100%' }}
                    >
                      <CardContent
                        sx={{
                          minHeight: 150,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          color: 'white',
                          textAlign: 'center',
                          p: 3,
                        }}
                      >
                        <Typography variant="h4" component="h2" fontWeight={700} gutterBottom>
                          {genre.name}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Explore {genre.name.toLowerCase()} content
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
      </PageContainer>
    </>
  );
}
