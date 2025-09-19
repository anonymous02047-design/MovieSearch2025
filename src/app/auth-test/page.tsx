'use client';

import React from 'react';
import { useUser } from '@clerk/nextjs';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Chip,
  Button,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

export default function AuthTestPage() {
  const { user, isLoaded } = useUser();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Authentication Test Page
        </Typography>
        
        <Stack spacing={3}>
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
                        label="Authenticated" 
                        color="success" 
                        icon={<CheckIcon />}
                      />
                    </>
                  ) : (
                    <>
                      <CancelIcon color="error" />
                      <Chip 
                        label="Not Authenticated" 
                        color="error" 
                        icon={<CancelIcon />}
                      />
                    </>
                  )}
                </>
              ) : (
                <Chip label="Loading..." color="default" />
              )}
            </Stack>
          </Box>

          {isLoaded && user && (
            <Box>
              <Typography variant="h6" gutterBottom>
                User Information:
              </Typography>
              <Stack spacing={1}>
                <Typography>
                  <strong>ID:</strong> {user.id}
                </Typography>
                <Typography>
                  <strong>Name:</strong> {user.fullName || 'Not set'}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {user.primaryEmailAddress?.emailAddress || 'Not set'}
                </Typography>
                <Typography>
                  <strong>Created:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleString() : 'Not available'}
                </Typography>
              </Stack>
            </Box>
          )}

          <Box>
            <Typography variant="h6" gutterBottom>
              Test Actions:
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={() => window.location.href = '/'}
                startIcon={<PersonIcon />}
              >
                Go to Home
              </Button>
              <Button
                variant="outlined"
                onClick={() => window.location.href = '/profile'}
              >
                Go to Profile
              </Button>
              <Button
                variant="outlined"
                onClick={() => window.location.href = '/sign-in'}
              >
                Go to Sign In
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}