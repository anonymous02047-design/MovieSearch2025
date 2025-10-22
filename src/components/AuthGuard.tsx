'use client';

import React, { useEffect } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Container, Typography, Button, Paper } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export default function AuthGuard({ 
  children, 
  fallback,
  redirectTo = '/sign-in'
}: AuthGuardProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      // Store the current path to redirect back after sign-in
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      router.push(redirectTo);
    }
  }, [isLoaded, isSignedIn, router, redirectTo]);

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
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  // Not authenticated
  if (!isSignedIn) {
    return fallback || (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 6,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <LockIcon sx={{ fontSize: 80, mb: 3, opacity: 0.9 }} />
          
          <Typography variant="h4" gutterBottom fontWeight={700}>
            Authentication Required
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Please sign in to access this page
          </Typography>
          
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push(redirectTo)}
            sx={{
              bgcolor: 'white',
              color: '#667eea',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
              },
            }}
          >
            Sign In
          </Button>
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
