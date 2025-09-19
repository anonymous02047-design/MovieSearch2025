'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Chip,
  Button,
  Alert,
  Divider,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

export default function DebugAuthPage() {
  const { user, isLoaded } = useUser();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    // Collect debug information
    const info = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      cookies: document.cookie,
      localStorage: Object.keys(localStorage),
      sessionStorage: Object.keys(sessionStorage),
      clerkLoaded: isLoaded,
      userExists: !!user,
      userId: user?.id || null,
      userEmail: user?.primaryEmailAddress?.emailAddress || null,
    };
    setDebugInfo(info);
  }, [user, isLoaded]);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleClearStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          🔍 Authentication Debug Page
        </Typography>
        
        <Stack spacing={3}>
          {/* Authentication Status */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Authentication Status:
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              {isLoaded ? (
                <>
                  {user ? (
                    <>
                      <CheckIcon color="success" />
                      <Chip 
                        label="✅ Authenticated" 
                        color="success" 
                        icon={<CheckIcon />}
                      />
                    </>
                  ) : (
                    <>
                      <CancelIcon color="error" />
                      <Chip 
                        label="❌ Not Authenticated" 
                        color="error" 
                        icon={<CancelIcon />}
                      />
                    </>
                  )}
                </>
              ) : (
                <Chip label="⏳ Loading..." color="default" />
              )}
            </Stack>
          </Box>

          {/* User Information */}
          {isLoaded && user && (
            <Box>
              <Typography variant="h6" gutterBottom>
                User Information:
              </Typography>
              <Stack spacing={1}>
                <Typography><strong>ID:</strong> {user.id}</Typography>
                <Typography><strong>Name:</strong> {user.fullName || 'Not set'}</Typography>
                <Typography><strong>Email:</strong> {user.primaryEmailAddress?.emailAddress || 'Not set'}</Typography>
                <Typography><strong>Created:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleString() : 'Not available'}</Typography>
                <Typography><strong>Last Sign In:</strong> {user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString() : 'Not available'}</Typography>
              </Stack>
            </Box>
          )}

          {/* Debug Information */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Debug Information:
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
              <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </Paper>
          </Box>

          {/* Actions */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Test Actions:
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Button
                variant="contained"
                onClick={handleRefresh}
                startIcon={<RefreshIcon />}
              >
                Refresh Page
              </Button>
              <Button
                variant="outlined"
                onClick={handleClearStorage}
                color="warning"
              >
                Clear Storage & Refresh
              </Button>
              <Button
                variant="outlined"
                onClick={() => window.location.href = '/'}
                startIcon={<PersonIcon />}
              >
                Go to Home
              </Button>
              <Button
                variant="outlined"
                onClick={() => window.location.href = '/sign-in'}
              >
                Go to Sign In
              </Button>
              <Button
                variant="outlined"
                onClick={() => window.location.href = '/welcome'}
              >
                Go to Welcome
              </Button>
            </Stack>
          </Box>

          {/* Instructions */}
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Instructions:</strong><br/>
              1. If you see "Not Authenticated", try signing in<br/>
              2. If you're still not authenticated after signing in, clear storage and try again<br/>
              3. Check the debug information for any clues<br/>
              4. If the issue persists, the Clerk configuration might need adjustment
            </Typography>
          </Alert>
        </Stack>
      </Paper>
    </Container>
  );
}
