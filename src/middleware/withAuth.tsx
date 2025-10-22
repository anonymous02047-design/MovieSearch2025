'use client';

import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography, Alert, Button } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';

interface WithAuthOptions {
  redirectTo?: string;
  loadingComponent?: React.ReactNode;
  unauthorizedComponent?: React.ReactNode;
  requireEmailVerification?: boolean;
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  return function AuthenticatedComponent(props: P) {
    const { isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();
    const router = useRouter();

    const {
      redirectTo = '/sign-in',
      loadingComponent,
      unauthorizedComponent,
      requireEmailVerification = false,
    } = options;

    useEffect(() => {
      if (isLoaded && !isSignedIn) {
        // Store current path for redirect after sign in
        const currentPath = window.location.pathname + window.location.search;
        sessionStorage.setItem('redirectAfterSignIn', currentPath);
        router.push(redirectTo);
      }
    }, [isLoaded, isSignedIn, router, redirectTo]);

    // Loading state
    if (!isLoaded) {
      return loadingComponent || (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="60vh"
          gap={2}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Authenticating...
          </Typography>
        </Box>
      );
    }

    // Not signed in
    if (!isSignedIn) {
      return unauthorizedComponent || (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="60vh"
          gap={3}
          p={3}
        >
          <LockIcon sx={{ fontSize: 80, color: 'text.secondary' }} />
          <Typography variant="h4" fontWeight="bold">
            Authentication Required
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" maxWidth={500}>
            You need to be signed in to access this page. Please sign in to continue.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push(redirectTo)}
          >
            Sign In
          </Button>
        </Box>
      );
    }

    // Email verification check
    if (requireEmailVerification && !user?.emailAddresses[0]?.verification?.status) {
      return (
        <Box p={3}>
          <Alert severity="warning">
            <Typography variant="h6" gutterBottom>
              Email Verification Required
            </Typography>
            <Typography variant="body2">
              Please verify your email address to access this feature. Check your inbox for a verification email.
            </Typography>
          </Alert>
        </Box>
      );
    }

    // Authenticated - render component
    return <Component {...props} />;
  };
}

// Hook version for use in components
export function useRequireAuth(options: WithAuthOptions = {}) {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const { redirectTo = '/sign-in', requireEmailVerification = false } = options;

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      const currentPath = window.location.pathname + window.location.search;
      sessionStorage.setItem('redirectAfterSignIn', currentPath);
      router.push(redirectTo);
    }
  }, [isLoaded, isSignedIn, router, redirectTo]);

  const isEmailVerified = requireEmailVerification
    ? user?.emailAddresses[0]?.verification?.status === 'verified'
    : true;

  return {
    isLoaded,
    isAuthenticated: isSignedIn,
    isEmailVerified,
    user,
    isAuthorized: isSignedIn && isEmailVerified,
  };
}

