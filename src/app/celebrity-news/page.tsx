'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  TextField,
  InputAdornment,
  Pagination,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  TrendingUp as TrendingIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { tmdbClient } from '@/lib/enhancedTmdb';
import { DisplayAd } from '@/components/GoogleAds';

interface NewsArticle {
  id: number;
  title: string;
  overview: string;
  media_type: string;
  release_date?: string;
  first_air_date?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  popularity: number;
}

export default function CelebrityNewsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrendingContent();
  }, [currentPage]);

  const fetchTrendingContent = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch trending content from TMDB (combines movies and TV shows)
      const trendingData = await tmdbClient.getTrending('all', 'week');
      
      if (trendingData && trendingData.results) {
        setArticles(trendingData.results);
        setTotalPages(trendingData.total_pages > 20 ? 20 : trendingData.total_pages); // Limit to 20 pages
      }
    } catch (err: any) {
      console.error('Error fetching trending content:', err);
      setError('Failed to load celebrity news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter((article) =>
    article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (article as any).name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.overview?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getImageUrl = (path: string | null, size: string = 'w500') => {
    if (!path) return '/placeholder-movie.svg';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  };

  const formatDate = (date: string) => {
    if (!date) return 'Date not available';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleArticleClick = (article: NewsArticle) => {
    // Navigate to appropriate detail page based on media type
    if (article.media_type === 'movie') {
      router.push(`/movie/${article.id}`);
    } else if (article.media_type === 'tv') {
      router.push(`/tv/${article.id}`);
    } else if (article.media_type === 'person') {
      router.push(`/person/${article.id}`);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 12 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          <TrendingIcon sx={{ fontSize: 40, mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
          Trending Now - Celebrity News
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Discover what's trending in movies, TV shows, and celebrity news this week.
        </Typography>

        {/* Google Ad */}
        <Box sx={{ my: 3 }}>
          <DisplayAd />
        </Box>

        <TextField
          fullWidth
          placeholder="Search trending content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 4 }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {loading ? (
          [...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <Skeleton variant="rectangular" height={300} />
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" height={20} width="60%" />
                  <Skeleton variant="text" height={60} />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : filteredArticles.length === 0 ? (
          <Grid item xs={12}>
            <Alert severity="info">
              No trending content found{searchQuery ? ` for "${searchQuery}"` : ''}.
            </Alert>
          </Grid>
        ) : (
          filteredArticles.map((article) => (
            <Grid item xs={12} sm={6} md={4} key={article.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
                onClick={() => handleArticleClick(article)}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={getImageUrl(article.poster_path || article.backdrop_path)}
                  alt={(article as any).title || (article as any).name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={article.media_type?.toUpperCase() || 'UNKNOWN'}
                      size="small"
                      color="primary"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={`⭐ ${article.vote_average?.toFixed(1) || 'N/A'}`}
                      size="small"
                      color="warning"
                    />
                  </Box>

                  <Typography
                    gutterBottom
                    variant="h6"
                    component="h2"
                    sx={{
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      minHeight: '3em',
                    }}
                  >
                    {(article as any).title || (article as any).name || 'Untitled'}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(article.release_date || article.first_air_date || '')}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {article.overview || 'No description available.'}
                  </Typography>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Popularity: {article.popularity?.toFixed(0) || 'N/A'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Google Ad */}
      <Box sx={{ my: 4 }}>
        <DisplayAd />
      </Box>

      {!loading && totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
}
