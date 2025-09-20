'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useRecaptcha } from '@/hooks/useRecaptcha';

interface RecaptchaStatusProps {
  compact?: boolean;
  showTestButton?: boolean;
}

export default function RecaptchaStatus({ compact = false, showTestButton = true }: RecaptchaStatusProps) {
  const { isLoaded, isConfigured, error, execute } = useRecaptcha();
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);

  const handleTest = async () => {
    if (!isConfigured || !isLoaded) return;
    
    try {
      setTesting(true);
      setTestError(null);
      const result = await execute('test_action');
      setTestResult(result);
      
      // Also test verification
      if (result && result.token) {
        const verifyResponse = await fetch('/api/recaptcha/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: result.token, action: 'test_action' }),
        });
        
        if (verifyResponse.ok) {
          const verification = await verifyResponse.json();
          setTestResult({ ...result, verification });
        }
      }
    } catch (err: any) {
      setTestError(err.message || 'Test failed');
    } finally {
      setTesting(false);
    }
  };

  const getStatusColor = () => {
    if (!isConfigured) return 'error';
    if (error) return 'warning';
    if (isLoaded) return 'success';
    return 'default';
  };

  const getStatusIcon = () => {
    if (!isConfigured) return <ErrorIcon />;
    if (error) return <WarningIcon />;
    if (isLoaded) return <CheckCircleIcon />;
    return <SecurityIcon />;
  };

  const getStatusText = () => {
    if (!isConfigured) return 'Not Configured';
    if (error) return 'Error';
    if (isLoaded) return 'Ready';
    return 'Loading...';
  };

  if (compact) {
    return (
      <Tooltip title={`reCAPTCHA: ${getStatusText()}`}>
        <Chip
          icon={getStatusIcon()}
          label="reCAPTCHA"
          color={getStatusColor() as any}
          size="small"
          variant="outlined"
        />
      </Tooltip>
    );
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="h3">
            reCAPTCHA Status
          </Typography>
          <Chip
            icon={getStatusIcon()}
            label={getStatusText()}
            color={getStatusColor() as any}
            variant="outlined"
          />
        </Box>

        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Configuration: {isConfigured ? '✓ Configured' : '✗ Missing Keys'}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Script: {isLoaded ? '✓ Loaded' : '⏳ Loading...'}
            </Typography>
            {error && (
              <Typography variant="body2" color="error">
                Error: {error}
              </Typography>
            )}
          </Box>

          {!isConfigured && (
            <Alert severity="error" size="small">
              reCAPTCHA keys not configured. Check environment variables.
            </Alert>
          )}

          {isConfigured && showTestButton && (
            <Box>
              <Button
                variant="outlined"
                size="small"
                startIcon={testing ? <CircularProgress size={16} /> : <RefreshIcon />}
                onClick={handleTest}
                disabled={!isLoaded || testing}
              >
                Test reCAPTCHA
              </Button>
            </Box>
          )}

          {testResult && (
            <Alert severity="success" size="small">
              Test successful! Score: {testResult.score || 'N/A'}
            </Alert>
          )}

          {testError && (
            <Alert severity="error" size="small">
              Test failed: {testError}
            </Alert>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
