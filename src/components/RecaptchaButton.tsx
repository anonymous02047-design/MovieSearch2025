'use client';

import React, { useState, useCallback } from 'react';
import {
  Button,
  CircularProgress,
  Tooltip,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useRecaptcha } from '@/hooks/useRecaptcha';

interface RecaptchaButtonProps {
  children: React.ReactNode;
  onClick: (token: string) => Promise<any> | void;
  action?: string;
  threshold?: number;
  disabled?: boolean;
  loading?: boolean;
  showScore?: boolean;
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
  buttonProps?: any;
  className?: string;
  sx?: any;
}

export default function RecaptchaButton({
  children,
  onClick,
  action = 'button_click',
  threshold = 0.5,
  disabled = false,
  loading = false,
  showScore = false,
  onSuccess,
  onError,
  buttonProps = {},
  className,
  sx,
}: RecaptchaButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const {
    execute,
    isLoading: recaptchaLoading,
    error: recaptchaError,
    isConfigured,
    lastResponse,
  } = useRecaptcha({
    action,
    threshold,
    onSuccess: (response) => {
      if (showScore) {
        setSnackbarMessage(`reCAPTCHA Score: ${response.score.toFixed(2)}`);
        setSnackbarSeverity('success');
        setShowSnackbar(true);
      }
    },
    onError: (error) => {
      setSnackbarMessage(`reCAPTCHA Error: ${error.message}`);
      setSnackbarSeverity('error');
      setShowSnackbar(true);
      onError?.(error);
    },
  });

  const handleClick = useCallback(async () => {
    if (disabled || loading || isProcessing || !isConfigured) {
      return;
    }

    setIsProcessing(true);

    try {
      // Execute reCAPTCHA
      const token = await execute();
      
      // Call the onClick handler with the token
      const result = await onClick(token.token);
      
      onSuccess?.(result);
    } catch (error: any) {
      const errorMessage = error.message || 'Action failed';
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setShowSnackbar(true);
      onError?.(error);
    } finally {
      setIsProcessing(false);
    }
  }, [
    disabled,
    loading,
    isProcessing,
    isConfigured,
    execute,
    onClick,
    onSuccess,
    onError,
  ]);

  const getButtonIcon = () => {
    if (loading || isProcessing || recaptchaLoading) {
      return <CircularProgress size={16} />;
    }
    
    if (recaptchaError) {
      return <ErrorIcon />;
    }
    
    if (lastResponse?.success && lastResponse.score >= threshold) {
      return <CheckCircleIcon />;
    }
    
    return <SecurityIcon />;
  };

  const getButtonText = () => {
    if (loading || isProcessing || recaptchaLoading) {
      return 'Processing...';
    }
    return children;
  };

  const getTooltipText = () => {
    if (!isConfigured) {
      return 'reCAPTCHA not configured';
    }
    
    if (recaptchaError) {
      return `reCAPTCHA Error: ${recaptchaError}`;
    }
    
    if (lastResponse?.success) {
      return `reCAPTCHA Score: ${lastResponse.score.toFixed(2)} (Threshold: ${threshold})`;
    }
    
    return 'Click to execute reCAPTCHA';
  };

  if (!isConfigured) {
    return (
      <Button
        {...buttonProps}
        disabled
        className={className}
        sx={sx}
      >
        {children}
      </Button>
    );
  }

  return (
    <>
      <Tooltip title={getTooltipText()}>
        <span>
          <Button
            {...buttonProps}
            onClick={handleClick}
            disabled={disabled || loading || isProcessing || recaptchaLoading}
            startIcon={getButtonIcon()}
            className={className}
            sx={sx}
          >
            {getButtonText()}
          </Button>
        </span>
      </Tooltip>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
