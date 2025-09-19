'use client';

import React, { useEffect, useState } from 'react';
import { SignIn } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  Divider,
  Alert,
  Snackbar,
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

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showDeletedMessage, setShowDeletedMessage] = useState(false);
  const [showWelcomeBackMessage, setShowWelcomeBackMessage] = useState(false);

  useEffect(() => {
    // Check for deletion success message
    if (searchParams.get('deleted') === 'true') {
      setShowDeletedMessage(true);
      // Clear the URL parameter
      router.replace('/sign-in', undefined);
    }
    
    // Check for welcome back message (from sign-up after deletion)
    if (searchParams.get('welcome_back') === 'true') {
      setShowWelcomeBackMessage(true);
      // Clear the URL parameter
      router.replace('/sign-in', undefined);
    }
  }, [searchParams, router]);

  return (
    <RouteGuard requireAuth={false}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
          px: 2,
        }}
      >
      <Container maxWidth="sm" sx={{ width: '100%' }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/')}
          sx={{
            color: 'white',
            mb: 3,
            borderRadius: 2,
            px: 3,
            py: 1,
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.15)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Back to Home
        </Button>

        <Paper
          elevation={24}
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 4,
            bgcolor: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #667eea, #764ba2)',
            },
          }}
        >
          {/* Account Deleted Success Message */}
          {showDeletedMessage && (
            <Alert 
              severity="success" 
              icon={<CheckCircleIcon />}
              sx={{ mb: 3 }}
              onClose={() => setShowDeletedMessage(false)}
            >
              <Typography variant="subtitle2" gutterBottom>
                Account Successfully Deleted
              </Typography>
              <Typography variant="body2">
                Your account and all associated data have been permanently deleted. 
                You can create a new account anytime.
              </Typography>
            </Alert>
          )}

          {/* Welcome Back Message */}
          {showWelcomeBackMessage && (
            <Alert 
              severity="info" 
              icon={<InfoIcon />}
              sx={{ mb: 3 }}
              onClose={() => setShowWelcomeBackMessage(false)}
            >
              <Typography variant="subtitle2" gutterBottom>
                Welcome Back!
              </Typography>
              <Typography variant="body2">
                Your new account has been created successfully. You can now sign in with your new credentials.
              </Typography>
            </Alert>
          )}
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4, position: 'relative', zIndex: 1 }}>
            <Box sx={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              mb: 3,
              boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)',
            }}>
              <Stack direction="row" spacing={0.5} justifyContent="center">
                <MovieIcon sx={{ fontSize: 28, color: 'white' }} />
                <StarIcon sx={{ fontSize: 28, color: 'white' }} />
              </Stack>
            </Box>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              Welcome Back
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              Sign in to your MovieSearch account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Continue your movie discovery journey
            </Typography>
          </Box>

          <Divider sx={{ mb: 4, borderColor: 'rgba(0,0,0,0.1)' }} />

          {/* reCAPTCHA Protection */}
          <RecaptchaProtection action="signin" showStatus={true}>
            {/* Clerk Sign In */}
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
              <SignIn 
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
                    formResendCodeLink: 'text-blue-600 hover:text-purple-600 font-medium transition-colors duration-300',
                  },
                }}
                path="/sign-in"
                routing="path"
                signUpUrl="/sign-up"
                redirectUrl="/"
                afterSignInUrl="/"
                forceRedirectUrl="/"
              />
            </Box>
          </RecaptchaProtection>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Button
                variant="text"
                onClick={() => router.push('/sign-up')}
                sx={{
                  color: 'primary.main',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  p: 0,
                  minWidth: 'auto',
                }}
              >
                Sign up here
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
      </Box>
    </RouteGuard>
  );
}