'use client';

import React, { useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Container, Typography, Button, Paper, Alert } from '@mui/material';
import { Lock as LockIcon, Error as ErrorIcon } from '@mui/icons-material';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
  requiresAuth?: boolean;
  loadingMessage?: string;
}

export default function AuthGuard({ 
  children, 
  fallback,
  redirectTo = '/sign-in',
  requiresAuth = true,
  loadingMessage = 'Verifying authentication...'
}: AuthGuardProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!requiresAuth) return;
    
    if (isLoaded && !isSignedIn) {
      try {
        // Store the current path to redirect back after sign-in
        const currentPath = window.location.pathname + window.location.search;
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('redirectAfterLogin', currentPath);
          localStorage.setItem('lastAttemptedUrl', currentPath);
        }
        setRedirecting(true);
        setTimeout(() => {
          router.push(redirectTo);
        }, 500);
      } catch (error) {
        console.error('AuthGuard: Error during redirect:', error);
        setAuthError('Failed to redirect to sign-in page. Please try again.');
      }
    }
  }, [isLoaded, isSignedIn, router, redirectTo, requiresAuth]);

  // Error state
  if (authError) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 6, textAlign: 'center' }}>
          <ErrorIcon sx={{ fontSize: 80, mb: 3, color: 'error.main' }} />
          <Alert severity="error" sx={{ mb: 3 }}>
            {authError}
          </Alert>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => {
              setAuthError(null);
              router.push(redirectTo);
            }}
          >
            Try Again
          </Button>
        </Paper>
      </Container>
    );
  }

  // Loading state
  if (!isLoaded) {
    return fallback || (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
          gap: 2,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
        }}
      >
        <CircularProgress size={60} thickness={4} sx={{ color: 'primary.main' }} />
        <Typography variant="h6" color="text.secondary" fontWeight={500}>
          {loadingMessage}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          This will only take a moment...
        </Typography>
      </Box>
    );
  }

  // Not authenticated or redirecting
  if (!isSignedIn || redirecting) {
    return fallback || (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper
          elevation={8}
          sx={{
            p: 6,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)',
          }}
        >
          <LockIcon sx={{ fontSize: 80, mb: 3, opacity: 0.9, animation: 'pulse 2s infinite' }} />
          
          <Typography variant="h4" gutterBottom fontWeight={700} sx={{ mb: 2 }}>
            {redirecting ? 'Redirecting...' : 'Authentication Required'}
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            {redirecting 
              ? 'Taking you to the sign-in page...' 
              : 'Please sign in to access this page'}
          </Typography>
          
          {redirecting ? (
            <CircularProgress sx={{ color: 'white' }} />
          ) : (
            <Button
              variant="contained"
              size="large"
              onClick={() => {
                setRedirecting(true);
                router.push(redirectTo);
              }}
              sx={{
                bgcolor: 'white',
                color: '#667eea',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Sign In Now
            </Button>
          )}
          
          {!redirecting && (
            <Typography variant="body2" sx={{ mt: 3, opacity: 0.8 }}>
              Don't have an account? Sign up to get started!
            </Typography>
          )}
        </Paper>
      </Container>
    );
  }

  // Authenticated - render children
  return <>{children}</>;
}

// Higher-order component version for easier use
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options?: { redirectTo?: string }
) {
  return function AuthGuardedComponent(props: P) {
    return (
      <AuthGuard redirectTo={options?.redirectTo}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}
