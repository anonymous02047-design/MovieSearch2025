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
    isLoaded,
    error,
    isConfigured,
    reset,
  } = useRecaptcha();

  const handleTestExecute = async () => {
    try {
      setTestError(null);
      setTestResult(null);
      const token = await execute('test_action');
      console.log('Token generated:', token);
      setTestResult(token);
    } catch (error: any) {
      setTestError(error.message);
    }
  };

  const handleTestVerify = async () => {
    if (!testResult || !testResult.token) {
      setTestError('No token available. Please execute reCAPTCHA first.');
      return;
    }

    try {
      setTestError(null);
      const response = await fetch('/api/recaptcha/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: testResult.token,
          action: 'test_action'
        }),
      });

      const verification = await response.json();
      console.log('Verification result:', verification);
      
      if (response.ok) {
        setTestResult({ ...testResult, verification });
      } else {
        setTestError(verification.error || 'Verification failed');
      }
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
            startIcon={<SecurityIcon />}
            onClick={handleTestExecute}
            disabled={!isConfigured || !isLoaded}
          >
            Execute reCAPTCHA
          </Button>

          <Button
            variant="outlined"
            startIcon={<CheckCircleIcon />}
            onClick={handleTestVerify}
            disabled={!testResult || !testResult.token}
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

        {!isLoaded && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <CircularProgress size={16} />
            <Typography variant="body2">Loading reCAPTCHA...</Typography>
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
        
        {testResult && testResult.token ? (
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Token: {testResult.token.substring(0, 50)}...
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Action: {testResult.action || 'test_action'}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Generated: {new Date(testResult.timestamp || Date.now()).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Expires: {new Date(testResult.expiresAt || Date.now() + 120000).toLocaleString()}
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
        
        {testResult && testResult.verification ? (
          <Box>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Chip
                label={testResult.verification.success ? 'Success' : 'Failed'}
                color={testResult.verification.success ? 'success' : 'error'}
                variant="outlined"
              />
              <Chip
                label={`Score: ${testResult.verification.score?.toFixed(2) || 'N/A'}`}
                color={testResult.verification.score >= 0.5 ? 'success' : 'warning'}
                variant="outlined"
              />
            </Stack>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Action: {testResult.verification.action || 'N/A'}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Hostname: {testResult.verification.hostname || 'N/A'}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Timestamp: {testResult.verification.challenge_ts || 'N/A'}
            </Typography>
            
            {testResult.verification.error_codes && testResult.verification.error_codes.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="error" gutterBottom>
                  Error Codes:
                </Typography>
                {testResult.verification.error_codes.map((code, index) => (
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
