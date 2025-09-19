'use client';

import React, { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  Alert,
} from '@mui/material';
import AppLoading from './AppLoading';
import {
  Lock as LockIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
  showMessage?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  fallback,
  redirectTo = '/welcome',
  showMessage = true 
}: ProtectedRouteProps) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  // Handle redirect for unauthenticated users
  useEffect(() => {
    if (isLoaded && !user && !showMessage) {
      router.push(redirectTo);
    }
  }, [isLoaded, user, showMessage, router, redirectTo]);

  // Show loading while checking authentication
  if (!isLoaded) {
    return <AppLoading message="Checking authentication..." />;
  }

  // If user is not authenticated, show access denied message or redirect
  if (!user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (!showMessage) {
      return null; // Will redirect via useEffect
    }

    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            color: 'white',
          }}
        >
          <LockIcon sx={{ fontSize: 64, mb: 2, opacity: 0.9 }} />
          
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Access Restricted
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
            Please sign in to access this feature
          </Typography>
          
          <Alert 
            severity="info" 
            sx={{ 
              mb: 3, 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              '& .MuiAlert-icon': { color: 'white' }
            }}
          >
            You need to be logged in to use this feature. Sign up for a free account or sign in to continue.
          </Alert>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              startIcon={<LoginIcon />}
              onClick={() => router.push('/sign-in')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Sign In
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              startIcon={<PersonAddIcon />}
              onClick={() => router.push('/sign-up')}
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 1.5,
                fontWeight: 'bold',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Sign Up
            </Button>
          </Stack>
          
          <Typography variant="body2" sx={{ mt: 3, opacity: 0.8 }}>
            Don't have an account? Sign up is completely free!
          </Typography>
        </Paper>
      </Container>
    );
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}

// Higher-order component for easier usage
export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<ProtectedRouteProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ProtectedRoute {...options}>
      <Component {...props} />
    </ProtectedRoute>
  );

  WrappedComponent.displayName = `withProtectedRoute(${Component.displayName || Component.name})`;
  return WrappedComponent;
}