'use client';

import React, { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Paper,
  Stack,
  Divider,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Movie as MovieIcon,
  Star as StarIcon,
  Favorite as FavoriteIcon,
  History as HistoryIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Public routes that don't require authentication
  const publicRoutes = ['/sign-in', '/sign-up'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  useEffect(() => {
    if (isLoaded && !isSignedIn && !isPublicRoute) {
      // User is not signed in and trying to access protected route
      setIsRedirecting(true);
      router.push('/sign-in');
    } else if (isLoaded && isSignedIn && isPublicRoute) {
      // User is signed in but on auth pages, redirect to home
      setIsRedirecting(true);
      router.push('/');
    }
  }, [isLoaded, isSignedIn, isPublicRoute, router, pathname]);

  // Show loading while checking authentication
  if (!isLoaded || isRedirecting) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white', mb: 3 }} />
        <Typography variant="h5" gutterBottom>
          {isRedirecting ? 'Redirecting...' : 'Loading...'}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Please wait while we set up your experience
        </Typography>
      </Box>
    );
  }

  // Show welcome screen for unauthenticated users
  if (!isSignedIn && !isPublicRoute) {
    return <WelcomeScreen />;
  }

  // Show children for authenticated users or public routes
  return <>{children}</>;
}

function WelcomeScreen() {
  const router = useRouter();

  const features = [
    {
      icon: <MovieIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Discover Movies',
      description: 'Browse thousands of movies with detailed information, cast, crew, and reviews.',
    },
    {
      icon: <StarIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Rate & Review',
      description: 'Rate your favorite movies and share your thoughts with the community.',
    },
    {
      icon: <FavoriteIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Personal Lists',
      description: 'Create watchlists and favorites to keep track of movies you want to see.',
    },
    {
      icon: <HistoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Search History',
      description: 'Keep track of your searches and easily find movies you\'ve looked for before.',
    },
    {
      icon: <PersonIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'User Profile',
      description: 'Manage your account, preferences, and view your movie statistics.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security and privacy.',
    },
  ];

  const handleGetStarted = () => {
    router.push('/sign-up');
  };

  const handleSignIn = () => {
    router.push('/sign-in');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            mb: 2,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          MovieSearch 2025
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: 'rgba(255,255,255,0.9)',
            mb: 4,
            fontWeight: 300,
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
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ flex: 1, pb: 6 }}>
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 3,
            bgcolor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ mb: 4, color: 'text.primary' }}
          >
            Why Choose MovieSearch 2025?
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {features.map((feature, index) => (
              <Card
                key={index}
                elevation={2}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{ fontWeight: 'bold' }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Call to Action */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ color: 'text.primary', mb: 2 }}
            >
              Ready to Start Your Movie Journey?
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}
            >
              Join thousands of movie enthusiasts who are already discovering, rating, 
              and enjoying movies with MovieSearch 2025. It's completely free to get started!
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                size="large"
                onClick={handleGetStarted}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                }}
              >
                Create Free Account
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={handleSignIn}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                }}
              >
                Sign In to Existing Account
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          p: 3,
          textAlign: 'center',
          bgcolor: 'rgba(0,0,0,0.1)',
          color: 'rgba(255,255,255,0.8)',
        }}
      >
        <Typography variant="body2">
          © 2025 MovieSearch. All rights reserved. | 
          <Button
            variant="text"
            size="small"
            sx={{ color: 'rgba(255,255,255,0.8)', textTransform: 'none' }}
            onClick={() => router.push('/sign-in')}
          >
            Privacy Policy
          </Button>
          {' | '}
          <Button
            variant="text"
            size="small"
            sx={{ color: 'rgba(255,255,255,0.8)', textTransform: 'none' }}
            onClick={() => router.push('/sign-in')}
          >
            Terms of Service
          </Button>
        </Typography>
      </Box>
    </Box>
  );
}
