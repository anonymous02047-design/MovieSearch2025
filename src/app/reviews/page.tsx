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
  Avatar,
  Rating,
  Chip,
  TextField,
  InputAdornment,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Divider,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  Star as StarIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Comment as CommentIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import EnhancedLoading from '@/components/EnhancedLoading';
import SEO from '@/components/SEO';

export const dynamic = 'force-dynamic';

interface Review {
  id: string;
  movieId: number;
  movieTitle: string;
  moviePoster: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  title: string;
  content: string;
  helpful: number;
  notHelpful: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
  verified: boolean;
}

export default function ReviewsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('newest');

  // Mock data for demonstration
  const mockReviews: Review[] = [
    {
      id: '1',
      movieId: 550,
      movieTitle: 'Fight Club',
      moviePoster: '/placeholder-movie.jpg',
      userId: 'user1',
      userName: 'MovieCritic123',
      userAvatar: '/placeholder-person.jpg',
      rating: 5,
      title: 'Mind-bending masterpiece',
      content: 'This movie completely changed my perspective on modern society. The plot twists are incredible and the performances are outstanding. David Fincher\'s direction is flawless.',
      helpful: 24,
      notHelpful: 2,
      comments: 8,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      verified: true,
    },
    {
      id: '2',
      movieId: 13,
      movieTitle: 'Forrest Gump',
      moviePoster: '/placeholder-movie.jpg',
      userId: 'user2',
      userName: 'CinemaLover',
      userAvatar: '/placeholder-person.jpg',
      rating: 4,
      title: 'Heartwarming and nostalgic',
      content: 'Tom Hanks delivers an incredible performance as Forrest Gump. The movie beautifully captures American history through the eyes of a simple man. Very emotional and well-crafted.',
      helpful: 18,
      notHelpful: 1,
      comments: 5,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      verified: false,
    },
    {
      id: '3',
      movieId: 238,
      movieTitle: 'The Godfather',
      moviePoster: '/placeholder-movie.jpg',
      userId: 'user3',
      userName: 'FilmBuff',
      userAvatar: '/placeholder-person.jpg',
      rating: 5,
      title: 'The definition of a perfect film',
      content: 'Marlon Brando and Al Pacino deliver legendary performances. The cinematography, score, and direction are all masterful. This is cinema at its finest.',
      helpful: 32,
      notHelpful: 0,
      comments: 12,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 172800000).toISOString(),
      verified: true,
    },
  ];

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!user) {
      router.push('/sign-in');
      return;
    }

    loadReviews();
  }, [isLoaded, user, router, currentPage, sortBy]);

  const loadReviews = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setReviews(mockReviews);
      setTotalPages(1);
      setLoading(false);
    }, 1000);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredReviews = reviews.filter(review =>
    review.movieTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleHelpful = (reviewId: string) => {
    setReviews(prev =>
      prev.map(review =>
        review.id === reviewId
          ? { ...review, helpful: review.helpful + 1 }
          : review
      )
    );
  };

  const handleNotHelpful = (reviewId: string) => {
    setReviews(prev =>
      prev.map(review =>
        review.id === reviewId
          ? { ...review, notHelpful: review.notHelpful + 1 }
          : review
      )
    );
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
        title="Movie Reviews - MovieSearch 2025"
        description="Read and discover movie reviews from our community. Find honest opinions and ratings for your favorite films."
        keywords={['movie reviews', 'film reviews', 'movie ratings', 'cinema reviews', 'film criticism']}
      />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom className="fade-in">
            Movie Reviews
          </Typography>
          <Typography variant="h6" color="text.secondary" className="fade-in stagger-1">
            Discover what our community thinks about the latest movies
          </Typography>
        </Box>

        {/* Search and Filters */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Search reviews by movie, user, or content..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                className="fade-in stagger-2"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="newest">Newest First</MenuItem>
                  <MenuItem value="oldest">Oldest First</MenuItem>
                  <MenuItem value="highest-rated">Highest Rated</MenuItem>
                  <MenuItem value="most-helpful">Most Helpful</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {loading ? (
          <EnhancedLoading type="default" message="Loading reviews..." />
        ) : (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {filteredReviews.length} reviews found
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {filteredReviews.map((review, index) => (
                <Grid item xs={12} key={review.id}>
                  <Card
                    className="card-hover fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={3} md={2}>
                          <CardMedia
                            component="img"
                            height="200"
                            image={review.moviePoster}
                            alt={review.movieTitle}
                            sx={{ borderRadius: 1 }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={9} md={10}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                            <Box>
                              <Typography variant="h6" component="h3" gutterBottom>
                                {review.movieTitle}
                              </Typography>
                              <Typography variant="h5" component="h4" gutterBottom>
                                {review.title}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Rating value={review.rating} readOnly size="small" />
                              <Typography variant="body2" color="text.secondary">
                                {review.rating}/5
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar
                                src={review.userAvatar}
                                sx={{ width: 32, height: 32 }}
                              />
                              <Typography variant="body2">
                                {review.userName}
                              </Typography>
                              {review.verified && (
                                <Chip label="Verified" size="small" color="primary" />
                              )}
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(review.createdAt)}
                            </Typography>
                          </Box>

                          <Typography variant="body1" sx={{ mb: 3 }}>
                            {review.content}
                          </Typography>

                          <Divider sx={{ mb: 2 }} />

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Button
                              size="small"
                              startIcon={<ThumbUpIcon />}
                              onClick={() => handleHelpful(review.id)}
                            >
                              Helpful ({review.helpful})
                            </Button>
                            <Button
                              size="small"
                              startIcon={<ThumbDownIcon />}
                              onClick={() => handleNotHelpful(review.id)}
                            >
                              Not Helpful ({review.notHelpful})
                            </Button>
                            <Button
                              size="small"
                              startIcon={<CommentIcon />}
                            >
                              Comments ({review.comments})
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
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
