'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter, usePathname } from 'next/navigation';
import { Box, CircularProgress, Container, Typography, Button, Paper, Alert, LinearProgress } from '@mui/material';
import { 
  Lock as LockIcon, 
  Error as ErrorIcon,
  Security as SecurityIcon,
  VerifiedUser as VerifiedUserIcon 
} from '@mui/icons-material';

interface EnhancedAuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
  requiresAuth?: boolean;
  loadingMessage?: string;
  allowedRoles?: string[];
  requireEmailVerification?: boolean;
  requirePhoneVerification?: boolean;
  checkSessionValidity?: boolean;
  maxSessionAge?: number; // in minutes
}

export default function EnhancedAuthGuard({ 
  children, 
  fallback,
  redirectTo = '/sign-in',
  requiresAuth = true,
  loadingMessage = 'Verifying authentication...',
  allowedRoles = [],
  requireEmailVerification = false,
  requirePhoneVerification = false,
  checkSessionValidity = true,
  maxSessionAge = 480 // 8 hours
}: EnhancedAuthGuardProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const [authError, setAuthError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [securityChecks, setSecurityChecks] = useState({
    authentication: false,
    emailVerification: false,
    phoneVerification: false,
    roleAuthorization: false,
    sessionValidity: false,
  });
  const [checksCompleted, setChecksCompleted] = useState(0);
  const totalChecks = 5;

  // Enhanced security check
  const performSecurityChecks = useCallback(async () => {
    if (!requiresAuth) {
      setSecurityChecks({
        authentication: true,
        emailVerification: true,
        phoneVerification: true,
        roleAuthorization: true,
        sessionValidity: true,
      });
      setChecksCompleted(totalChecks);
      return true;
    }

    let checks = 0;
    const newChecks = { ...securityChecks };

    // Check 1: Authentication
    if (isLoaded && isSignedIn && user) {
      newChecks.authentication = true;
      checks++;
    } else if (isLoaded && !isSignedIn) {
      setAuthError('You must be signed in to access this page');
      return false;
    }
    setSecurityChecks({ ...newChecks });
    setChecksCompleted(checks);

    // Check 2: Email Verification
    if (requireEmailVerification && user) {
      const emailVerified = user.primaryEmailAddress?.verification?.status === 'verified';
      if (!emailVerified) {
        setAuthError('Please verify your email address to continue');
        return false;
      }
      newChecks.emailVerification = true;
      checks++;
    } else {
      newChecks.emailVerification = true;
      checks++;
    }
    setSecurityChecks({ ...newChecks });
    setChecksCompleted(checks);

    // Check 3: Phone Verification
    if (requirePhoneVerification && user) {
      const phoneVerified = user.primaryPhoneNumber?.verification?.status === 'verified';
      if (!phoneVerified) {
        setAuthError('Please verify your phone number to continue');
        return false;
      }
      newChecks.phoneVerification = true;
      checks++;
    } else {
      newChecks.phoneVerification = true;
      checks++;
    }
    setSecurityChecks({ ...newChecks });
    setChecksCompleted(checks);

    // Check 4: Role Authorization
    if (allowedRoles.length > 0 && user) {
      const userRole = user.publicMetadata?.role as string || 'user';
      if (!allowedRoles.includes(userRole)) {
        setAuthError('You do not have permission to access this page');
        return false;
      }
      newChecks.roleAuthorization = true;
      checks++;
    } else {
      newChecks.roleAuthorization = true;
      checks++;
    }
    setSecurityChecks({ ...newChecks });
    setChecksCompleted(checks);

    // Check 5: Session Validity
    if (checkSessionValidity && user) {
      try {
        const lastActivity = localStorage.getItem('lastActivity');
        if (lastActivity) {
          const minutesSinceActivity = (Date.now() - parseInt(lastActivity)) / 1000 / 60;
          if (minutesSinceActivity > maxSessionAge) {
            setAuthError('Your session has expired. Please sign in again');
            await signOut();
            return false;
          }
        }
        // Update last activity
        localStorage.setItem('lastActivity', Date.now().toString());
        newChecks.sessionValidity = true;
        checks++;
      } catch (error) {
        console.error('Session validation error:', error);
        newChecks.sessionValidity = true;
        checks++;
      }
    } else {
      newChecks.sessionValidity = true;
      checks++;
    }
    setSecurityChecks({ ...newChecks });
    setChecksCompleted(checks);

    return true;
  }, [
    requiresAuth,
    isLoaded,
    isSignedIn,
    user,
    requireEmailVerification,
    requirePhoneVerification,
    allowedRoles,
    checkSessionValidity,
    maxSessionAge,
    signOut
  ]);

  useEffect(() => {
    if (!requiresAuth) return;
    
    const runChecks = async () => {
      const passed = await performSecurityChecks();
      
      if (!passed && isLoaded && !isSignedIn) {
        try {
          // Store the current path to redirect back after sign-in
          const currentPath = pathname + (typeof window !== 'undefined' ? window.location.search : '');
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('redirectAfterLogin', currentPath);
            localStorage.setItem('lastAttemptedUrl', currentPath);
          }
          setRedirecting(true);
          setTimeout(() => {
            router.push(`${redirectTo}?redirect_url=${encodeURIComponent(currentPath)}`);
          }, 1000);
        } catch (error) {
          console.error('EnhancedAuthGuard: Error during redirect:', error);
          setAuthError('Failed to redirect to sign-in page. Please try again.');
        }
      }
    };

    runChecks();
  }, [isLoaded, isSignedIn, router, redirectTo, requiresAuth, pathname, performSecurityChecks]);

  // Track user activity
  useEffect(() => {
    if (!isSignedIn || !checkSessionValidity) return;

    const updateActivity = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
    };

    // Update on user interaction
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keypress', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('scroll', updateActivity);

    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keypress', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('scroll', updateActivity);
    };
  }, [isSignedIn, checkSessionValidity]);

  // Error state
  if (authError) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 6, textAlign: 'center' }}>
          <ErrorIcon sx={{ fontSize: 80, mb: 3, color: 'error.main' }} />
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>Security Check Failed</Typography>
            <Typography variant="body2">{authError}</Typography>
          </Alert>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => {
                setAuthError(null);
                router.push(redirectTo);
              }}
            >
              Sign In
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => router.push('/')}
            >
              Go Home
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  // Loading state with security checks
  if (!isLoaded || checksCompleted < totalChecks) {
    return fallback || (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
          gap: 3,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
          px: 2,
        }}
      >
        <SecurityIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        
        <Typography variant="h5" color="text.primary" fontWeight={600} textAlign="center">
          {loadingMessage}
        </Typography>
        
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <LinearProgress 
            variant="determinate" 
            value={(checksCompleted / totalChecks) * 100}
            sx={{ height: 8, borderRadius: 4, mb: 2 }}
          />
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Performing security checks... {checksCompleted}/{totalChecks}
          </Typography>
        </Box>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          {Object.entries(securityChecks).map(([check, passed]) => (
            <Typography 
              key={check} 
              variant="caption" 
              display="block" 
              color={passed ? 'success.main' : 'text.disabled'}
              sx={{ my: 0.5 }}
            >
              {passed ? '✓' : '○'} {check.replace(/([A-Z])/g, ' $1').trim()}
            </Typography>
          ))}
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
          Secured by Enhanced AuthGuard
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
          <LockIcon sx={{ 
            fontSize: 80, 
            mb: 3, 
            opacity: 0.9,
            animation: redirecting ? 'pulse 2s infinite' : 'none'
          }} />
          
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
            <>
              <Button
                variant="contained"
                size="large"
                onClick={() => {
                  setRedirecting(true);
                  const currentPath = pathname + (typeof window !== 'undefined' ? window.location.search : '');
                  router.push(`${redirectTo}?redirect_url=${encodeURIComponent(currentPath)}`);
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
              
              <Typography variant="body2" sx={{ mt: 3, opacity: 0.8 }}>
                Don't have an account? Sign up to get started!
              </Typography>
            </>
          )}
        </Paper>
      </Container>
    );
  }

  // All security checks passed - render children
  return (
    <>
      {children}
      {/* Optional: Security indicator */}
      {process.env.NODE_ENV === 'development' && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 16,
            left: 16,
            bgcolor: 'success.main',
            color: 'white',
            px: 2,
            py: 1,
            borderRadius: 2,
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            zIndex: 9999,
            opacity: 0.8,
          }}
        >
          <VerifiedUserIcon fontSize="small" />
          Secured
        </Box>
      )}
    </>
  );
}

// Higher-order component version for easier use
export function withEnhancedAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options?: Partial<EnhancedAuthGuardProps>
) {
  return function EnhancedAuthGuardedComponent(props: P) {
    return (
      <EnhancedAuthGuard {...options}>
        <Component {...props} />
      </EnhancedAuthGuard>
    );
  };
}

