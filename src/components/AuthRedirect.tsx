'use client';

import React, { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Stack,
  Alert,
  AlertTitle,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Lock as LockIcon,
  Login as LoginIcon,
  PersonAdd as SignUpIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

interface AuthRedirectProps {
  redirectTo?: string;
  showBackButton?: boolean;
  customMessage?: string;
}

export default function AuthRedirect({ 
  redirectTo, 
  showBackButton = true, 
  customMessage 
}: AuthRedirectProps) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRedirecting, setIsRedirecting] = React.useState(false);

  const currentPath = searchParams.get('redirect') || redirectTo || '/';
  const fromPage = searchParams.get('from') || 'this page';

  useEffect(() => {
    if (isLoaded && user) {
      setIsRedirecting(true);
      // Redirect to the intended page after authentication
      setTimeout(() => {
        router.push(currentPath);
      }, 1000);
    }
  }, [isLoaded, user, router, currentPath]);

  const handleSignIn = () => {
    const signInUrl = `/sign-in?redirect=${encodeURIComponent(currentPath)}&from=${encodeURIComponent(fromPage)}`;
    router.push(signInUrl);
  };

  const handleSignUp = () => {
    const signUpUrl = `/sign-up?redirect=${encodeURIComponent(currentPath)}&from=${encodeURIComponent(fromPage)}`;
    router.push(signUpUrl);
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  if (!isLoaded) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (isRedirecting && user) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={6} sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Welcome back, {user.firstName || 'User'}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Redirecting you to {fromPage}...
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper 
        elevation={6} 
        sx={{ 
          p: { xs: 4, md: 6 }, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <LockIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Authentication Required
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            {customMessage || `You need to sign in to access ${fromPage}`}
          </Typography>
        </Box>

        <Alert severity="info" sx={{ mb: 4, textAlign: 'left' }}>
          <AlertTitle sx={{ fontWeight: 'bold' }}>Why do I need to sign in?</AlertTitle>
          <Typography variant="body2" sx={{ mt: 1 }}>
            • Access personalized movie recommendations and watchlists<br/>
            • Save your favorite movies and create custom collections<br/>
            • Get advanced search filters and detailed movie information<br/>
            • Enjoy a seamless, personalized movie discovery experience
          </Typography>
        </Alert>

        <Stack spacing={3} sx={{ mb: 4 }}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={<LoginIcon />}
            onClick={handleSignIn}
            sx={{
              py: 2,
              background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6fd8 0%, #6a4190 100%)',
              }
            }}
          >
            Sign In to Continue
          </Button>

          <Button
            variant="outlined"
            size="large"
            fullWidth
            startIcon={<SignUpIcon />}
            onClick={handleSignUp}
            sx={{
              py: 2,
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                backgroundColor: 'primary.light',
              }
            }}
          >
            Create New Account
          </Button>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          justifyContent="center"
        >
          {showBackButton && (
            <Button
              variant="text"
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
              sx={{ color: 'text.secondary' }}
            >
              Go Back
            </Button>
          )}
          <Button
            variant="text"
            startIcon={<HomeIcon />}
            onClick={handleGoHome}
            sx={{ color: 'text.secondary' }}
          >
            Go to Home
          </Button>
        </Stack>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account? Signing up is free and takes less than a minute!
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
