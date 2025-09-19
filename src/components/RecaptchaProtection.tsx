'use client';

import React, { useEffect, useState } from 'react';
import { useRecaptcha } from '@/hooks/useRecaptcha';
import { Box, Alert, CircularProgress } from '@mui/material';

interface RecaptchaProtectionProps {
  children: React.ReactNode;
  action?: string;
  onVerified?: (token: string) => void;
  onError?: (error: string) => void;
  autoExecute?: boolean;
  showStatus?: boolean;
}

export default function RecaptchaProtection({
  children,
  action = 'general',
  onVerified,
  onError,
  autoExecute = false,
  showStatus = false,
}: RecaptchaProtectionProps) {
  const { execute, isLoaded, error } = useRecaptcha();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (autoExecute && isLoaded) {
      handleVerification();
    }
  }, [autoExecute, isLoaded]);

  const handleVerification = async () => {
    if (!isLoaded) return;

    try {
      setIsVerifying(true);
      setVerificationStatus('idle');
      
      const token = await execute(action);
      
      if (token && token.token) {
        setVerificationStatus('success');
        onVerified?.(token.token);
      } else {
        throw new Error('Failed to get reCAPTCHA token');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'reCAPTCHA verification failed';
      setVerificationStatus('error');
      console.warn('reCAPTCHA verification failed:', errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const renderStatus = () => {
    if (!showStatus) return null;

    if (isVerifying) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CircularProgress size={16} />
          <Alert severity="info" sx={{ flex: 1 }}>
            Verifying security...
          </Alert>
        </Box>
      );
    }

    if (verificationStatus === 'success') {
      return (
        <Alert severity="success" sx={{ mb: 2 }}>
          Security verification completed
        </Alert>
      );
    }

    if (verificationStatus === 'error') {
      return (
        <Alert severity="error" sx={{ mb: 2 }}>
          Security verification failed. Please try again.
        </Alert>
      );
    }

    if (error) {
      return (
        <Alert severity="warning" sx={{ mb: 2 }}>
          reCAPTCHA not available: {error}
        </Alert>
      );
    }

    return null;
  };

  return (
    <Box>
      {renderStatus()}
      {children}
    </Box>
  );
}

