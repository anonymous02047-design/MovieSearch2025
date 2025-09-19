'use client';

import React, { useState, useCallback, ReactNode } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Alert,
  Typography,
  Paper,
  Stack,
  Chip,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useRecaptchaForm } from '@/hooks/useRecaptcha';

interface RecaptchaFormProps {
  children: ReactNode;
  onSubmit: (token: string) => Promise<any>;
  action?: string;
  threshold?: number;
  disabled?: boolean;
  loading?: boolean;
  showScore?: boolean;
  showStatus?: boolean;
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
  submitButtonText?: string;
  submitButtonProps?: any;
  className?: string;
  sx?: any;
}

export default function RecaptchaForm({
  children,
  onSubmit,
  action = 'submit',
  threshold = 0.5,
  disabled = false,
  loading = false,
  showScore = true,
  showStatus = true,
  onSuccess,
  onError,
  submitButtonText = 'Submit',
  submitButtonProps = {},
  className,
  sx,
}: RecaptchaFormProps) {
  const [submitResult, setSubmitResult] = useState<any>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    execute,
    verify,
    isLoading: recaptchaLoading,
    error: recaptchaError,
    isConfigured,
    lastToken,
    lastResponse,
    submitWithRecaptcha,
    isSubmitting,
  } = useRecaptchaForm({
    action,
    threshold,
    onSuccess: (response) => {
      if (showStatus) {
        console.log('reCAPTCHA verification successful:', response);
      }
    },
    onError: (error) => {
      console.error('reCAPTCHA error:', error);
      onError?.(error);
    },
  });

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (disabled || loading || isSubmitting || !isConfigured) {
      return;
    }

    setSubmitError(null);
    setSubmitResult(null);

    try {
      const result = await submitWithRecaptcha(onSubmit, action);
      setSubmitResult(result);
      onSuccess?.(result);
    } catch (error: any) {
      const errorMessage = error.message || 'Submission failed';
      setSubmitError(errorMessage);
      onError?.(error);
    }
  }, [
    disabled,
    loading,
    isSubmitting,
    isConfigured,
    submitWithRecaptcha,
    onSubmit,
    action,
    onSuccess,
    onError,
  ]);

  const handleRetry = useCallback(async () => {
    try {
      await execute();
      setSubmitError(null);
    } catch (error) {
      // Error is handled by the hook
    }
  }, [execute]);

  const getStatusColor = () => {
    if (recaptchaError || submitError) return 'error';
    if (lastResponse?.success && lastResponse.score >= threshold) return 'success';
    if (lastResponse?.success && lastResponse.score < threshold) return 'warning';
    return 'default';
  };

  const getStatusText = () => {
    if (recaptchaError) return 'reCAPTCHA Error';
    if (submitError) return 'Submission Error';
    if (lastResponse?.success && lastResponse.score >= threshold) return 'Verified';
    if (lastResponse?.success && lastResponse.score < threshold) return 'Low Score';
    if (lastToken) return 'Token Generated';
    return 'Ready';
  };

  const getStatusIcon = () => {
    if (recaptchaError || submitError) return <ErrorIcon />;
    if (lastResponse?.success && lastResponse.score >= threshold) return <CheckCircleIcon />;
    return <SecurityIcon />;
  };

  if (!isConfigured) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        reCAPTCHA is not configured. Please check your environment variables.
      </Alert>
    );
  }

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      className={className}
      sx={{
        p: 3,
        position: 'relative',
        ...sx,
      }}
    >
      {/* reCAPTCHA Status */}
      {showStatus && (
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title="reCAPTCHA Status">
                <IconButton size="small" onClick={handleRetry} disabled={recaptchaLoading}>
                  {recaptchaLoading ? <CircularProgress size={16} /> : getStatusIcon()}
                </IconButton>
              </Tooltip>
              <Typography variant="body2" color="text.secondary">
                {getStatusText()}
              </Typography>
            </Box>
            
            {showScore && lastResponse && (
              <Chip
                label={`Score: ${lastResponse.score.toFixed(2)}`}
                size="small"
                color={getStatusColor() as any}
                variant="outlined"
              />
            )}
          </Stack>
        </Box>
      )}

      {/* Error Messages */}
      {recaptchaError && (
        <Alert severity="error" sx={{ mb: 2 }} action={
          <Button size="small" onClick={handleRetry}>
            Retry
          </Button>
        }>
          {recaptchaError}
        </Alert>
      )}

      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      {/* Success Message */}
      {submitResult && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Form submitted successfully!
        </Alert>
      )}

      {/* Form Content */}
      {children}

      {/* Submit Button */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          disabled={disabled || loading || isSubmitting || recaptchaLoading}
          startIcon={
            (loading || isSubmitting || recaptchaLoading) ? (
              <CircularProgress size={16} />
            ) : (
              <SecurityIcon />
            )
          }
          {...submitButtonProps}
        >
          {loading || isSubmitting || recaptchaLoading
            ? 'Processing...'
            : submitButtonText}
        </Button>
      </Box>

      {/* reCAPTCHA Info */}
      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <InfoIcon fontSize="small" color="action" />
        <Typography variant="caption" color="text.secondary">
          This site is protected by reCAPTCHA and the Google{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>{' '}
          and{' '}
          <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">
            Terms of Service
          </a>{' '}
          apply.
        </Typography>
      </Box>
    </Paper>
  );
}
