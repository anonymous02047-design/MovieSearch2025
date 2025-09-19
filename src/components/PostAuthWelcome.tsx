'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
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
  CardActions,
  Chip,
  Divider,
  LinearProgress,
  Alert,
  IconButton,
} from '@mui/material';
import {
  Movie as MovieIcon,
  Star as StarIcon,
  Favorite as FavoriteIcon,
  History as HistoryIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  PlayArrow as PlayIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

interface PostAuthWelcomeProps {
  onComplete: () => void;
}

export default function PostAuthWelcome({ onComplete }: PostAuthWelcomeProps) {
  const { user } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps = [
    {
      title: 'Welcome to MovieSearch 2025!',
      description: `Hi ${user?.firstName || 'there'}! We're excited to have you on board. Let's get you started with a quick tour of your new movie discovery platform.`,
      icon: <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main' }} />,
      action: 'Get Started',
    },
    {
      title: 'Discover Movies',
      description: 'Browse thousands of movies, from the latest blockbusters to timeless classics. Use our powerful search to find exactly what you\'re looking for.',
      icon: <MovieIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      action: 'Explore Movies',
      buttonAction: () => router.push('/popular'),
    },
    {
      title: 'Rate & Review',
      description: 'Share your thoughts on movies you\'ve watched. Rate them with stars and write reviews to help other movie lovers discover great films.',
      icon: <StarIcon sx={{ fontSize: 48, color: 'warning.main' }} />,
      action: 'Start Rating',
      buttonAction: () => router.push('/top-rated'),
    },
    {
      title: 'Create Lists',
      description: 'Build your personal watchlist and favorites. Keep track of movies you want to watch and ones you\'ve loved.',
      icon: <FavoriteIcon sx={{ fontSize: 48, color: 'error.main' }} />,
      action: 'Create Lists',
      buttonAction: () => router.push('/favorites'),
    },
    {
      title: 'Track Your Journey',
      description: 'View your search history, ratings, and movie statistics. See how your taste in movies evolves over time.',
      icon: <HistoryIcon sx={{ fontSize: 48, color: 'info.main' }} />,
      action: 'View Profile',
      buttonAction: () => router.push('/profile'),
    },
    {
      title: 'You\'re All Set!',
      description: 'You now have access to all MovieSearch 2025 features. Start exploring and discover your next favorite movie!',
      icon: <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main' }} />,
      action: 'Start Exploring',
      buttonAction: () => router.push('/'),
    },
  ];

  const quickActions = [
    {
      title: 'Popular Movies',
      description: 'See what\'s trending right now',
      icon: <TrendingUpIcon />,
      action: () => router.push('/popular'),
    },
    {
      title: 'Top Rated',
      description: 'Discover critically acclaimed films',
      icon: <StarIcon />,
      action: () => router.push('/top-rated'),
    },
    {
      title: 'Search Movies',
      description: 'Find specific movies or actors',
      icon: <SearchIcon />,
      action: () => router.push('/'),
    },
    {
      title: 'Your Profile',
      description: 'Manage your account and preferences',
      icon: <PersonIcon />,
      action: () => router.push('/profile'),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  const handleQuickAction = (action: () => void) => {
    action();
    handleComplete();
  };

  if (!isVisible) {
    return null;
  }

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        p: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          maxWidth: 600,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          borderRadius: 3,
          position: 'relative',
        }}
      >
        {/* Header */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Welcome Tour
            </Typography>
            <IconButton onClick={handleSkip} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 6, borderRadius: 3 }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Step {currentStep + 1} of {steps.length}
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            {currentStepData.icon}
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
              {currentStepData.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {currentStepData.description}
            </Typography>
          </Box>

          {/* Quick Actions for final step */}
          {currentStep === steps.length - 1 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                {quickActions.map((action, index) => (
                  <Grid item xs={6} key={index}>
                    <Card
                      elevation={2}
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 4,
                        },
                      }}
                      onClick={() => handleQuickAction(action.action)}
                    >
                      <CardContent sx={{ p: 2, textAlign: 'center' }}>
                        <Box sx={{ mb: 1 }}>
                          {action.icon}
                        </Box>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                          {action.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {action.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} justifyContent="center">
            {currentStep < steps.length - 1 ? (
              <>
                <Button
                  variant="outlined"
                  onClick={handleSkip}
                  sx={{ minWidth: 120 }}
                >
                  Skip Tour
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<ArrowForwardIcon />}
                  sx={{ minWidth: 120 }}
                >
                  Next
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                size="large"
                onClick={handleComplete}
                endIcon={<PlayIcon />}
                sx={{ minWidth: 200 }}
              >
                Start Exploring
              </Button>
            )}
          </Stack>
        </Box>

        {/* Footer */}
        <Box sx={{ p: 3, bgcolor: 'grey.50', borderTop: 1, borderColor: 'divider' }}>
          <Alert severity="info" sx={{ mb: 0 }}>
            <Typography variant="body2">
              <strong>Tip:</strong> You can always access your profile, favorites, and watchlist from the navigation menu.
            </Typography>
          </Alert>
        </Box>
      </Paper>
    </Box>
  );
}
