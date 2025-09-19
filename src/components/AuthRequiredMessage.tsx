'use client';

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Alert,
} from '@mui/material';
import {
  Lock as LockIcon,
  Login as LoginIcon,
  PersonAdd as SignUpIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface AuthRequiredMessageProps {
  title?: string;
  message?: string;
  showSignUp?: boolean;
}

export default function AuthRequiredMessage({ 
  title = "Authentication Required",
  message = "Please sign in to access this feature.",
  showSignUp = true 
}: AuthRequiredMessageProps) {
  const router = useRouter();

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '50vh',
      p: 2 
    }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          maxWidth: 500, 
          textAlign: 'center',
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}
      >
        <Box sx={{ mb: 3 }}>
          <LockIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {message}
          </Typography>
        </Box>

        <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
          <Typography variant="body2">
            <strong>Why do I need to sign in?</strong><br />
            We require authentication to provide personalized movie recommendations, 
            save your favorites, and ensure a secure browsing experience.
          </Typography>
        </Alert>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            size="large"
            startIcon={<LoginIcon />}
            onClick={() => router.push('/sign-in')}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'bold',
            }}
          >
            Sign In
          </Button>
          
          {showSignUp && (
            <Button
              variant="outlined"
              size="large"
              startIcon={<SignUpIcon />}
              onClick={() => router.push('/sign-up')}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
              }}
            >
              Sign Up
            </Button>
          )}
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block' }}>
          Don't have an account? Sign up is free and takes less than a minute!
        </Typography>
      </Paper>
    </Box>
  );
}
