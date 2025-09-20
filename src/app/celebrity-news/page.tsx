'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
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
  Avatar,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Article as ArticleIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import EnhancedLoading from '@/components/EnhancedLoading';
import SEO from '@/components/SEO';

export const dynamic = 'force-dynamic';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishedAt: string;
  imageUrl?: string;
  category: string;
  tags: string[];
  readTime: number;
}

export default function CelebrityNewsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Mock data for demonstration
  const mockArticles: NewsArticle[] = [
    {
      id: '1',
      title: 'New Movie Releases This Week',
      summary: 'Check out the latest blockbuster movies hitting theaters this week.',
      content: 'This week brings several exciting new releases...',
      author: 'Movie News Team',
      publishedAt: new Date().toISOString(),
      imageUrl: '/placeholder-movie.jpg',
      category: 'Movies',
      tags: ['movies', 'releases', 'cinema'],
      readTime: 5,
    },
    {
      id: '2',
      title: 'Award Season Highlights',
      summary: 'The biggest winners and memorable moments from this year\'s award shows.',
      content: 'This year\'s award season has been full of surprises...',
      author: 'Entertainment Reporter',
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      imageUrl: '/placeholder-movie.jpg',
      category: 'Awards',
      tags: ['awards', 'celebrities', 'entertainment'],
      readTime: 7,
    },
    {
      id: '3',
      title: 'Behind the Scenes: Movie Production',
      summary: 'An exclusive look at how your favorite movies are made.',
      content: 'Movie production is a complex process involving hundreds of people...',
      author: 'Film Industry Insider',
      publishedAt: new Date(Date.now() - 172800000).toISOString(),
      imageUrl: '/placeholder-movie.jpg',
      category: 'Production',
      tags: ['production', 'behind-the-scenes', 'filmmaking'],
      readTime: 6,
    },
  ];

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!user) {
      router.push('/sign-in');
      return;
    }

    loadArticles();
  }, [isLoaded, user, router, currentPage]);

  const loadArticles = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setArticles(mockArticles);
      setTotalPages(1);
      setLoading(false);
    }, 1000);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!isLoaded) {
    return <EnhancedLoading message="Loading..." fullScreen />;
  }

  if (!user) {
    return null; // Will redirect to sign-in
  }

  return (
    <>
      <SEO
        title="Celebrity News - MovieSearch 2025"
        description="Stay updated with the latest celebrity news, movie releases, and entertainment industry updates."
        keywords={['celebrity news', 'entertainment news', 'movie news', 'celebrity gossip', 'film industry']}
      />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom className="fade-in">
            Celebrity News
          </Typography>
          <Typography variant="h6" color="text.secondary" className="fade-in stagger-1">
            Stay updated with the latest entertainment news and celebrity updates
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search news articles..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 600, mx: 'auto' }}
            className="fade-in stagger-2"
          />
        </Box>

        {loading ? (
          <EnhancedLoading type="default" message="Loading news articles..." />
        ) : (
          <>
            <Grid container spacing={3}>
              {filteredArticles.map((article, index) => (
                <Grid item xs={12} md={6} lg={4} key={article.id}>
                  <Card
                    className="card-hover fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                  >
                    {article.imageUrl && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={article.imageUrl}
                        alt={article.title}
                      />
                    )}
                    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ mb: 2 }}>
                        <Chip
                          label={article.category}
                          size="small"
                          color="primary"
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="h6" component="h3" gutterBottom>
                          {article.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {article.summary}
                        </Typography>
                      </Box>

                      <Box sx={{ mt: 'auto' }}>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <PersonIcon fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {article.author}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CalendarIcon fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(article.publishedAt)}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {article.readTime} min read
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {totalPages > 1 && (
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
          </>
        )}
      </Container>
    </>
  );
}
