'use client';

import React, { useEffect, useState } from 'react';
import { SignUp } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  Divider,
  Chip,
  Alert,
} from '@mui/material';
import RecaptchaProtection from '@/components/RecaptchaProtection';
import RouteGuard from '@/components/RouteGuard';
import {
  ArrowBack as ArrowBackIcon,
  Movie as MovieIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import SignUpSuccessHandler from '@/components/SignUpSuccessHandler';

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showDeletedMessage, setShowDeletedMessage] = useState(false);

  useEffect(() => {
    // Check for deletion success message
    if (searchParams.get('deleted') === 'true') {
      setShowDeletedMessage(true);
      // Clear the URL parameter
      router.replace('/sign-up', undefined);
    }
  }, [searchParams, router]);

  const benefits = [
    'Access to thousands of movies',
    'Personal watchlists and favorites',
    'Movie ratings and reviews',
    'Search history tracking',
    'Personalized recommendations',
    'Secure and private account',
  ];

  return (
    <RouteGuard requireAuth={false}>
      <SignUpSuccessHandler />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          py: 4,
        }}
      >
      <Container maxWidth="sm">
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/')}
          sx={{
            color: 'white',
            mb: 2,
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          Back to Home
        </Button>

        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 3,
            bgcolor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Account Deleted Message */}
          {showDeletedMessage && (
            <Alert 
              severity="info" 
              icon={<InfoIcon />}
              sx={{ mb: 3 }}
              onClose={() => setShowDeletedMessage(false)}
            >
              <Typography variant="subtitle2" gutterBottom>
                Create a New Account
              </Typography>
              <Typography variant="body2">
                Your previous account has been deleted. You can create a new account with the same or different email address.
              </Typography>
            </Alert>
          )}
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
              <MovieIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              <StarIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            </Stack>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Join MovieSearch 2025
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create your free account and start discovering amazing movies
            </Typography>
          </Box>

          {/* Benefits */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 2 }}>
              What you'll get:
            </Typography>
            <Stack spacing={1}>
              {benefits.map((benefit, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ fontSize: 20, color: 'success.main' }} />
                  <Typography variant="body2" color="text.secondary">
                    {benefit}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <Divider sx={{ mb: 4, borderColor: 'rgba(0,0,0,0.1)' }} />

          {/* reCAPTCHA Protection */}
          <RecaptchaProtection action="signup" showStatus={true}>
            {/* Clerk Sign Up */}
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              '& .cl-card': {
                boxShadow: 'none',
                border: 'none',
                backgroundColor: 'transparent',
                width: '100%',
                maxWidth: 'none',
              },
              '& .cl-main': {
                width: '100%',
                maxWidth: 'none',
              },
              '& .cl-form': {
                width: '100%',
              },
              '& .cl-headerTitle': {
                display: 'none',
              },
              '& .cl-headerSubtitle': {
                display: 'none',
              },
              '& .cl-formButtonPrimary': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important',
                borderRadius: '12px !important',
                padding: '14px 24px !important',
                fontSize: '16px !important',
                fontWeight: '600 !important',
                textTransform: 'none !important',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3) !important',
                transition: 'all 0.3s ease !important',
                width: '100% !important',
                marginTop: '16px !important',
                '&:hover': {
                  transform: 'translateY(-2px) !important',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4) !important',
                },
              },
              '& .cl-socialButtonsBlockButton': {
                border: '2px solid #e5e7eb !important',
                borderRadius: '12px !important',
                padding: '12px 16px !important',
                fontSize: '14px !important',
                fontWeight: '500 !important',
                transition: 'all 0.3s ease !important',
                width: '100% !important',
                marginBottom: '12px !important',
                '&:hover': {
                  borderColor: '#667eea !important',
                  backgroundColor: 'rgba(102, 126, 234, 0.05) !important',
                  transform: 'translateY(-1px) !important',
                },
              },
              '& .cl-formFieldInput': {
                border: '2px solid #e5e7eb !important',
                borderRadius: '12px !important',
                padding: '14px 16px !important',
                fontSize: '16px !important',
                transition: 'all 0.3s ease !important',
                width: '100% !important',
                '&:focus': {
                  borderColor: '#667eea !important',
                  boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1) !important',
                },
              },
              '& .cl-formFieldLabel': {
                fontSize: '14px !important',
                fontWeight: '600 !important',
                color: '#374151 !important',
                marginBottom: '8px !important',
                display: 'block !important',
              },
              '& .cl-formField': {
                marginBottom: '20px !important',
                width: '100% !important',
              },
              '& .cl-footerActionLink': {
                color: '#667eea !important',
                fontWeight: '600 !important',
                textDecoration: 'none !important',
                '&:hover': {
                  color: '#764ba2 !important',
                  textDecoration: 'underline !important',
                },
              },
            }}>
              <SignUp 
                appearance={{
                  elements: {
                    card: 'shadow-none border-none bg-transparent w-full',
                    headerTitle: 'hidden',
                    headerSubtitle: 'hidden',
                    main: 'w-full',
                    form: 'w-full',
                    formButtonPrimary: 'w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5',
                    socialButtonsBlockButton: 'w-full border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:-translate-y-0.5',
                    formFieldInput: 'w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 py-3 px-4 rounded-xl text-base transition-all duration-300',
                    footerActionLink: 'text-blue-600 hover:text-purple-600 font-semibold transition-colors duration-300',
                    formFieldLabel: 'font-semibold text-gray-700 text-sm mb-2',
                    formField: 'w-full mb-5',
                    identityPreviewText: 'text-gray-600',
                    formResendCodeLink: 'text-blue-600 hover:text-purple-700 font-medium transition-colors duration-300',
                  },
                }}
                path="/sign-up"
                routing="path"
                signInUrl="/sign-in"
                redirectUrl="/"
                afterSignUpUrl="/"
                forceRedirectUrl="/"
              />
            </Box>
          </RecaptchaProtection>

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Button
                variant="text"
                onClick={() => router.push('/sign-in')}
                sx={{
                  color: 'primary.main',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  p: 0,
                  minWidth: 'auto',
                }}
              >
                Sign in here
              </Button>
            </Typography>
          </Box>

          {/* Free Badge */}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Chip
              label="100% Free Forever"
              color="success"
              variant="outlined"
              icon={<CheckCircleIcon />}
            />
          </Box>
        </Paper>
      </Container>
      </Box>
    </RouteGuard>
  );
}