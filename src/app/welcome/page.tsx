'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
} from '@mui/material';

import RouteGuard from '@/components/RouteGuard';
import {
  Movie as MovieIcon,
  Star as StarIcon,
  Favorite as FavoriteIcon,
  History as HistoryIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Palette as PaletteIcon,
  TrendingUp as TrendingUpIcon,
  Search as SearchIcon,
  PlayArrow as PlayIcon,
  ArrowForward as ArrowForwardIcon,
  GitHub as GitHubIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
} from '@mui/icons-material';

export default function WelcomePage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  // Redirect authenticated users to home page
  useEffect(() => {
    if (isLoaded && user) {
      router.push('/');
    }
  }, [isLoaded, user, router]);

  // Show loading while checking authentication
  if (!isLoaded) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  // Don't render the welcome page if user is authenticated
  if (user) {
    return null;
  }

  const features = [
    {
      icon: <MovieIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Discover Movies',
      description: 'Browse thousands of movies with detailed information, cast, crew, and reviews.',
      color: 'primary',
    },
    {
      icon: <StarIcon sx={{ fontSize: 48, color: 'warning.main' }} />,
      title: 'Rate & Review',
      description: 'Rate your favorite movies and share your thoughts with the community.',
      color: 'warning',
    },
    {
      icon: <FavoriteIcon sx={{ fontSize: 48, color: 'error.main' }} />,
      title: 'Personal Lists',
      description: 'Create watchlists and favorites to keep track of movies you want to see.',
      color: 'error',
    },
    {
      icon: <HistoryIcon sx={{ fontSize: 48, color: 'info.main' }} />,
      title: 'Search History',
      description: 'Keep track of your searches and easily find movies you\'ve looked for before.',
      color: 'info',
    },
    {
      icon: <PersonIcon sx={{ fontSize: 48, color: 'success.main' }} />,
      title: 'User Profile',
      description: 'Manage your account, preferences, and view your movie statistics.',
      color: 'success',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 48, color: 'secondary.main' }} />,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security and privacy.',
      color: 'secondary',
    },
  ];

  const stats = [
    { label: 'Movies', value: '500K+', icon: <MovieIcon /> },
    { label: 'Users', value: '10K+', icon: <PersonIcon /> },
    { label: 'Reviews', value: '50K+', icon: <StarIcon /> },
    { label: 'Countries', value: '100+', icon: <SecurityIcon /> },
  ];

  const handleGetStarted = () => {
    router.push('/sign-up');
  };

  const handleSignIn = () => {
    router.push('/sign-in');
  };

  return (
    <RouteGuard requireAuth={false}>
      <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            zIndex: 0,
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
              <MovieIcon sx={{ fontSize: 64 }} />
              <StarIcon sx={{ fontSize: 64 }} />
            </Stack>
            
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                mb: 2,
              }}
            >
              MovieSearch 2025
            </Typography>
            
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                fontWeight: 300,
                opacity: 0.9,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Discover, Rate, and Enjoy Movies Like Never Before
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              sx={{ mb: 6 }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={handleGetStarted}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Get Started Free
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={handleSignIn}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Sign In
              </Button>
            </Stack>

            {/* Stats */}
            <Grid container spacing={4} justifyContent="center">
              {stats.map((stat, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ mb: 1 }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Why Choose MovieSearch 2025?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Experience the future of movie discovery with our cutting-edge platform
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                elevation={2}
                sx={{
                  height: '100%',
                  p: 3,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{ fontWeight: 'bold' }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={8}
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }}
          >
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Ready to Start Your Movie Journey?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of movie enthusiasts who are already discovering amazing films
            </Typography>
            
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              sx={{ mb: 3 }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={handleGetStarted}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Create Free Account
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={handleSignIn}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Sign In to Existing Account
              </Button>
            </Stack>

            <Chip
              label="100% Free Forever • No Credit Card Required"
              color="success"
              variant="outlined"
              sx={{
                color: 'white',
                borderColor: 'white',
                fontWeight: 'bold',
              }}
            />
          </Paper>
        </Container>
      </Box>

        </Box>
      </RouteGuard>
  );
}
