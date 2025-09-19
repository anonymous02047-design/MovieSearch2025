'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Stack,
  Chip,
  Divider,
} from '@mui/material';
import {
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useRecaptcha } from '@/hooks/useRecaptcha';
import { isRecaptchaConfigured } from '@/lib/recaptchaConfig';

export default function TestRecaptchaPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [testError, setTestError] = useState<string | null>(null);

  const {
    execute,
    verify,
    isLoading,
    error,
    isConfigured,
    lastToken,
    lastResponse,
    reset,
  } = useRecaptcha({
    action: 'test_action',
    threshold: 0.5,
    onSuccess: (response) => {
      console.log('reCAPTCHA Success:', response);
      setTestResult(response);
      setTestError(null);
    },
    onError: (error) => {
      console.error('reCAPTCHA Error:', error);
      setTestError(error.message);
      setTestResult(null);
    },
  });

  const handleTestExecute = async () => {
    try {
      setTestError(null);
      setTestResult(null);
      const token = await execute();
      console.log('Token generated:', token);
    } catch (error: any) {
      setTestError(error.message);
    }
  };

  const handleTestVerify = async () => {
    if (!lastToken) {
      setTestError('No token available. Please execute reCAPTCHA first.');
      return;
    }

    try {
      setTestError(null);
      const response = await verify(lastToken.token);
      console.log('Verification result:', response);
    } catch (error: any) {
      setTestError(error.message);
    }
  };

  const handleReset = () => {
    reset();
    setTestResult(null);
    setTestError(null);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        reCAPTCHA v3 Test Page
      </Typography>

      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Test your reCAPTCHA configuration and see the results.
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Configuration Status
        </Typography>
        
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Chip
            icon={isConfigured ? <CheckCircleIcon /> : <ErrorIcon />}
            label={isConfigured ? 'Configured' : 'Not Configured'}
            color={isConfigured ? 'success' : 'error'}
            variant="outlined"
          />
          <Chip
            icon={isConfigured ? <CheckCircleIcon /> : <ErrorIcon />}
            label={isConfigured ? 'Ready' : 'Missing Keys'}
            color={isConfigured ? 'success' : 'error'}
            variant="outlined"
          />
        </Stack>

        {!isConfigured && (
          <Alert severity="error" sx={{ mb: 2 }}>
            reCAPTCHA is not properly configured. Please check your environment variables:
            <br />
            • NEXT_PUBLIC_RECAPTCHA_SITE_KEY
            <br />
            • RECAPTCHA_SECRET_KEY
          </Alert>
        )}
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Test Actions
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={isLoading ? <CircularProgress size={16} /> : <SecurityIcon />}
            onClick={handleTestExecute}
            disabled={!isConfigured || isLoading}
          >
            Execute reCAPTCHA
          </Button>

          <Button
            variant="outlined"
            startIcon={<CheckCircleIcon />}
            onClick={handleTestVerify}
            disabled={!lastToken || isLoading}
          >
            Verify Token
          </Button>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleReset}
            color="secondary"
          >
            Reset
          </Button>
        </Stack>

        {isLoading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <CircularProgress size={16} />
            <Typography variant="body2">Processing...</Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {testError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {testError}
          </Alert>
        )}
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Last Token
        </Typography>
        
        {lastToken ? (
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Token: {lastToken.token.substring(0, 50)}...
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Action: {lastToken.action}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Generated: {new Date(lastToken.timestamp).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Expires: {new Date(lastToken.expiresAt).toLocaleString()}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No token generated yet
          </Typography>
        )}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Last Verification Result
        </Typography>
        
        {lastResponse ? (
          <Box>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Chip
                label={lastResponse.success ? 'Success' : 'Failed'}
                color={lastResponse.success ? 'success' : 'error'}
                variant="outlined"
              />
              <Chip
                label={`Score: ${lastResponse.score.toFixed(2)}`}
                color={lastResponse.score >= 0.5 ? 'success' : 'warning'}
                variant="outlined"
              />
            </Stack>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Action: {lastResponse.action}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Hostname: {lastResponse.hostname}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Timestamp: {lastResponse.challenge_ts}
            </Typography>
            
            {lastResponse.error_codes && lastResponse.error_codes.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="error" gutterBottom>
                  Error Codes:
                </Typography>
                {lastResponse.error_codes.map((code, index) => (
                  <Chip key={index} label={code} size="small" color="error" sx={{ mr: 1, mb: 1 }} />
                ))}
              </Box>
            )}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No verification performed yet
          </Typography>
        )}
      </Paper>

      <Divider sx={{ my: 3 }} />

      <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom>
          Environment Variables Check
        </Typography>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Make sure these are set in your .env.local file:
        </Typography>
        
        <Box component="pre" sx={{ 
          bgcolor: 'grey.100', 
          p: 2, 
          borderRadius: 1, 
          fontSize: '0.875rem',
          overflow: 'auto'
        }}>
{`NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key-here
RECAPTCHA_SECRET_KEY=your-secret-key-here
RECAPTCHA_THRESHOLD=0.5
RECAPTCHA_ACTION=submit
RECAPTCHA_TIMEOUT=30000`}
        </Box>
      </Paper>
    </Container>
  );
}
