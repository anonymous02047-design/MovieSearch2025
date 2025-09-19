'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Box,
  Stack,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { profileService } from '@/lib/profileService';

interface AccountDeletionHandlerProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function AccountDeletionHandler({
  open,
  onClose,
  onSuccess,
  onError,
}: AccountDeletionHandlerProps) {
  const { user } = useUser();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'confirm' | 'deleting' | 'success' | 'error'>('confirm');

  const handleDelete = async () => {
    if (!user) return;

    try {
      setIsDeleting(true);
      setError(null);
      setStep('deleting');

      // Delete account from our system
      await profileService.deleteAccount(user.id);
      
      // Sign out from Clerk
      await user.delete();
      
      setStep('success');
      
      // Redirect to sign-in page with success message after a short delay
      setTimeout(() => {
        router.push('/sign-in?deleted=true');
        onSuccess?.();
      }, 2000);
      
    } catch (err) {
      console.error('Account deletion error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete account. Please try again.';
      setError(errorMessage);
      setStep('error');
      onError?.(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (step === 'deleting') return; // Prevent closing during deletion
    setStep('confirm');
    setError(null);
    onClose();
  };

  const renderContent = () => {
    switch (step) {
      case 'confirm':
        return (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WarningIcon color="error" />
                <Typography variant="h6" color="error">
                  Delete Account
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ mb: 2 }}>
                Are you sure you want to delete your account? This action cannot be undone.
              </DialogContentText>
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  This will permanently delete:
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  <li>Your profile and personal information</li>
                  <li>All your favorite movies and watchlists</li>
                  <li>Your movie ratings and reviews</li>
                  <li>Your search history</li>
                  <li>All account preferences and settings</li>
                </Box>
              </Alert>
              <DialogContentText>
                If you're sure you want to proceed, click "Delete Account" below.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} disabled={isDeleting}>
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                color="error"
                variant="contained"
                startIcon={<DeleteIcon />}
                disabled={isDeleting}
              >
                Delete Account
              </Button>
            </DialogActions>
          </>
        );

      case 'deleting':
        return (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={24} />
                <Typography variant="h6">
                  Deleting Account
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please wait while we delete your account and all associated data...
              </DialogContentText>
            </DialogContent>
          </>
        );

      case 'success':
        return (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon color="success" />
                <Typography variant="h6" color="success.main">
                  Account Deleted
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Your account has been successfully deleted. You will be redirected to the sign-in page shortly.
              </DialogContentText>
            </DialogContent>
          </>
        );

      case 'error':
        return (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ErrorIcon color="error" />
                <Typography variant="h6" color="error">
                  Deletion Failed
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Alert severity="error" sx={{ mb: 2 }}>
                {error || 'An unexpected error occurred while deleting your account.'}
              </Alert>
              <DialogContentText>
                Please try again or contact support if the problem persists.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>
                Close
              </Button>
              <Button
                onClick={() => {
                  setStep('confirm');
                  setError(null);
                }}
                variant="contained"
                color="error"
              >
                Try Again
              </Button>
            </DialogActions>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={step === 'deleting'}
    >
      {renderContent()}
    </Dialog>
  );
}
