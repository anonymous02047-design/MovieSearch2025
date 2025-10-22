'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  alpha,
  useTheme,
  Chip,
  Tabs,
  Tab,
  CircularProgress
} from '@mui/material';
import { useRouter } from 'next/navigation';
import {
  Movie as MovieIcon,
  Tv as TvIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { tmdbApi } from '@/lib/tmdb';
import SEO from '@/components/SEO';

interface Genre {
  id: number;
  name: string;
}

const genreBackgrounds: Record<string, string> = {
  'Action': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'Adventure': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'Animation': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'Comedy': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'Crime': 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  'Documentary': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'Drama': 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'Family': 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'Fantasy': 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
  'History': 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
  'Horror': 'linear-gradient(135deg, #434343 0%, #000000 100%)',
  'Music': 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'Mystery': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'Romance': 'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
  'Science Fiction': 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
  'Thriller': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'War': 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'Western': 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
};

const getGenreIcon = (genre: string) => {
  return genre;
};

export default function BrowsePage() {
  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [tvGenres, setTvGenres] = useState<Genre[]>([]);
  const [contentType, setContentType] = useState<'movie' | 'tv'>('movie');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    try {
      setLoading(true);
      const movieGenresData = await tmdbApi.getGenres();
      setMovieGenres(movieGenresData.genres || []);
      // TV genres would be similar, using movie genres for now
      setTvGenres(movieGenresData.genres || []);
    } catch (error) {
      console.error('Error loading genres:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreClick = (genreId: number, genreName: string) => {
    router.push(`/genre/${genreId}?name=${encodeURIComponent(genreName)}&type=${contentType}`);
  };

  const displayGenres = contentType === 'movie' ? movieGenres : tvGenres;

  return (
    <>
      <SEO
        title="Browse by Genre - MovieSearch 2025"
        description="Explore movies and TV shows by genre. Find action, comedy, drama, horror, sci-fi and more."
        keywords={['browse genres', 'movie genres', 'tv genres', 'film categories']}
      />

      <Box
        sx={{
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)'
            : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
          minHeight: '100vh',
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
              <CategoryIcon sx={{ fontSize: 48, color: 'primary.main' }} />
              <Typography variant="h3" component="h1" fontWeight={700}>
                Browse by Genre
              </Typography>
            </Box>
            <Typography variant="h6" color="text.secondary">
              Discover content by your favorite genres
            </Typography>
          </Box>

          {/* Content Type Tabs */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <Tabs
              value={contentType}
              onChange={(_, value) => setContentType(value)}
              sx={{
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                borderRadius: 2,
                '& .MuiTab-root': {
                  minWidth: 120,
                }
              }}
            >
              <Tab
                icon={<MovieIcon />}
                iconPosition="start"
                label="Movies"
                value="movie"
              />
              <Tab
                icon={<TvIcon />}
                iconPosition="start"
                label="TV Shows"
                value="tv"
              />
            </Tabs>
          </Box>

          {/* Genre Grid */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {displayGenres.map((genre) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={genre.id}>
                  <Card
                    onClick={() => handleGenreClick(genre.id, genre.name)}
                    sx={{
                      cursor: 'pointer',
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.3)}`,
                        '& .genre-overlay': {
                          opacity: 0.95,
                        }
                      }
                    }}
                  >
                    <Box
                      sx={{
                        height: 200,
                        background: genreBackgrounds[genre.name] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      <Box
                        className="genre-overlay"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'rgba(0, 0, 0, 0.3)',
                          opacity: 0.7,
                          transition: 'opacity 0.3s ease',
                        }}
                      />
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        color="white"
                        sx={{
                          position: 'relative',
                          zIndex: 1,
                          textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
                          textAlign: 'center',
                          px: 2,
                        }}
                      >
                        {genre.name}
                      </Typography>
                    </Box>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Explore {contentType === 'movie' ? 'Movies' : 'TV Shows'}
                        </Typography>
                        <Chip
                          label="Browse"
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Fun Fact Section */}
          <Box
            sx={{
              mt: 6,
              p: 4,
              background: alpha(theme.palette.primary.main, 0.1),
              borderRadius: 3,
              textAlign: 'center',
            }}
          >
            <Typography variant="h5" gutterBottom fontWeight={600}>
              💡 Did You Know?
            </Typography>
            <Typography variant="body1" color="text.secondary">
              The most popular movie genres worldwide are Action, Comedy, and Drama. 
              TV shows tend to favor Drama, Crime, and Sci-Fi genres.
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
}

