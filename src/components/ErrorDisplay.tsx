'use client';

import React, { useState } from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Collapse,
  IconButton,
  Paper,
  Stack,
  Typography,
  Chip,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
  BugReport as BugReportIcon,
  NetworkCheck as NetworkIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
  Api as ApiIcon,
} from '@mui/icons-material';
import { AppError, ERROR_CODES, shouldRetry } from '@/lib/errorHandler';

interface ErrorDisplayProps {
  error: AppError | Error | string;
  severity?: 'error' | 'warning' | 'info' | 'success';
  title?: string;
  showDetails?: boolean;
  showRetry?: boolean;
  onRetry?: () => void;
  onDismiss?: () => void;
  dismissible?: boolean;
  fullWidth?: boolean;
  variant?: 'standard' | 'filled' | 'outlined';
}

export default function ErrorDisplay({
  error,
  severity = 'error',
  title,
  showDetails = false,
  showRetry = false,
  onRetry,
  onDismiss,
  dismissible = false,
  fullWidth = false,
  variant = 'standard',
}: ErrorDisplayProps) {
  const [expanded, setExpanded] = useState(showDetails);

  // Normalize error to AppError format
  const normalizeError = (err: AppError | Error | string): AppError => {
    if (typeof err === 'string') {
      return {
        code: ERROR_CODES.UNKNOWN_ERROR,
        message: err,
        timestamp: new Date().toISOString(),
      };
    }
    
    if (err instanceof Error && !('code' in err)) {
      return {
        code: ERROR_CODES.UNKNOWN_ERROR,
        message: err.message,
        details: { stack: err.stack },
        timestamp: new Date().toISOString(),
      };
    }
    
    return err as AppError;
  };

  const appError = normalizeError(error);
  const isRetryable = shouldRetry(appError);
  const canRetry = showRetry && isRetryable && onRetry;

  // Get appropriate icon based on error code
  const getErrorIcon = () => {
    switch (appError.code) {
      case ERROR_CODES.API_NETWORK_ERROR:
      case ERROR_CODES.NETWORK_ERROR:
        return <NetworkIcon />;
      case ERROR_CODES.API_UNAUTHORIZED:
      case ERROR_CODES.AUTH_REQUIRED:
      case ERROR_CODES.AUTH_INVALID:
      case ERROR_CODES.AUTH_EXPIRED:
        return <SecurityIcon />;
      case ERROR_CODES.STORAGE_QUOTA_EXCEEDED:
      case ERROR_CODES.STORAGE_ACCESS_DENIED:
      case ERROR_CODES.STORAGE_CORRUPTED:
        return <StorageIcon />;
      case ERROR_CODES.API_KEY_MISSING:
      case ERROR_CODES.API_SERVER_ERROR:
      case ERROR_CODES.API_RATE_LIMIT:
        return <ApiIcon />;
      default:
        return severity === 'error' ? <ErrorIcon /> :
               severity === 'warning' ? <WarningIcon /> :
               severity === 'success' ? <SuccessIcon /> : <InfoIcon />;
    }
  };

  // Get user-friendly title
  const getTitle = () => {
    if (title) return title;
    
    switch (appError.code) {
      case ERROR_CODES.API_NETWORK_ERROR:
      case ERROR_CODES.NETWORK_ERROR:
        return 'Connection Problem';
      case ERROR_CODES.API_UNAUTHORIZED:
      case ERROR_CODES.AUTH_REQUIRED:
      case ERROR_CODES.AUTH_INVALID:
      case ERROR_CODES.AUTH_EXPIRED:
        return 'Authentication Required';
      case ERROR_CODES.API_RATE_LIMIT:
        return 'Rate Limit Exceeded';
      case ERROR_CODES.API_SERVER_ERROR:
        return 'Server Error';
      case ERROR_CODES.STORAGE_QUOTA_EXCEEDED:
        return 'Storage Full';
      case ERROR_CODES.STORAGE_ACCESS_DENIED:
        return 'Access Denied';
      case ERROR_CODES.VALIDATION_INVALID_INPUT:
        return 'Invalid Input';
      default:
        return severity === 'error' ? 'Error' :
               severity === 'warning' ? 'Warning' :
               severity === 'success' ? 'Success' : 'Information';
    }
  };

  // Get helpful suggestions based on error type
  const getSuggestions = () => {
    switch (appError.code) {
      case ERROR_CODES.API_NETWORK_ERROR:
      case ERROR_CODES.NETWORK_ERROR:
        return [
          'Check your internet connection',
          'Try refreshing the page',
          'Check if the service is available',
        ];
      case ERROR_CODES.API_RATE_LIMIT:
        return [
          'Wait a few minutes before trying again',
          'Reduce the frequency of your requests',
        ];
      case ERROR_CODES.AUTH_REQUIRED:
      case ERROR_CODES.AUTH_INVALID:
      case ERROR_CODES.AUTH_EXPIRED:
        return [
          'Please sign in to continue',
          'Your session may have expired',
        ];
      case ERROR_CODES.STORAGE_QUOTA_EXCEEDED:
        return [
          'Clear your browser cache',
          'Remove unnecessary data',
        ];
      case ERROR_CODES.VALIDATION_INVALID_INPUT:
        return [
          'Check your input for errors',
          'Make sure all required fields are filled',
        ];
      default:
        return ['Try refreshing the page', 'Contact support if the problem persists'];
    }
  };

  const suggestions = getSuggestions();

  return (
    <Alert
      severity={severity}
      variant={variant}
      icon={getErrorIcon()}
      sx={{
        width: fullWidth ? '100%' : 'auto',
        '& .MuiAlert-message': {
          width: '100%',
        },
      }}
      action={
        <Stack direction="row" spacing={1} alignItems="center">
          {canRetry && (
            <Tooltip title="Retry">
              <IconButton
                size="small"
                onClick={onRetry}
                sx={{ color: 'inherit' }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {dismissible && onDismiss && (
            <Tooltip title="Dismiss">
              <IconButton
                size="small"
                onClick={onDismiss}
                sx={{ color: 'inherit' }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      }
    >
      <AlertTitle sx={{ fontWeight: 'bold' }}>
        {getTitle()}
      </AlertTitle>
      
      <Typography variant="body2" sx={{ mb: 1 }}>
        {appError.message}
      </Typography>

      {/* Error metadata */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Chip
          label={`Code: ${appError.code}`}
          size="small"
          variant="outlined"
          sx={{ fontSize: '0.75rem' }}
        />
        <Chip
          label={new Date(appError.timestamp).toLocaleString()}
          size="small"
          variant="outlined"
          sx={{ fontSize: '0.75rem' }}
        />
        {appError.userId && (
          <Chip
            label={`User: ${appError.userId.slice(0, 8)}...`}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.75rem' }}
          />
        )}
      </Box>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
            Suggestions:
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2 }}>
            {suggestions.map((suggestion, index) => (
              <Typography key={index} component="li" variant="body2" sx={{ mb: 0.5 }}>
                {suggestion}
              </Typography>
            ))}
          </Box>
        </Box>
      )}

      {/* Technical details */}
      {appError.details && (
        <>
          <Divider sx={{ my: 1 }} />
          <Button
            size="small"
            startIcon={<BugReportIcon />}
            endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={() => setExpanded(!expanded)}
            sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
          >
            {expanded ? 'Hide' : 'Show'} Technical Details
          </Button>
          
          <Collapse in={expanded}>
            <Paper
              sx={{
                mt: 2,
                p: 2,
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                overflow: 'auto',
                maxHeight: 200,
              }}
            >
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
                {JSON.stringify(appError.details, null, 2)}
              </pre>
            </Paper>
          </Collapse>
        </>
      )}

      {/* Retry button */}
      {canRetry && (
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={onRetry}
            sx={{ textTransform: 'none' }}
          >
            Try Again
          </Button>
        </Box>
      )}
    </Alert>
  );
}

// Specialized error displays for common scenarios
export function NetworkErrorDisplay({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorDisplay
      error={{
        code: ERROR_CODES.NETWORK_ERROR,
        message: 'Unable to connect to the server. Please check your internet connection.',
        timestamp: new Date().toISOString(),
      }}
      severity="error"
      title="Connection Problem"
      showRetry={true}
      onRetry={onRetry}
    />
  );
}

export function AuthErrorDisplay({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorDisplay
      error={{
        code: ERROR_CODES.AUTH_REQUIRED,
        message: 'Please sign in to access this feature.',
        timestamp: new Date().toISOString(),
      }}
      severity="warning"
      title="Authentication Required"
      showRetry={true}
      onRetry={onRetry}
    />
  );
}

export function ServerErrorDisplay({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorDisplay
      error={{
        code: ERROR_CODES.API_SERVER_ERROR,
        message: 'The server is experiencing issues. Please try again later.',
        timestamp: new Date().toISOString(),
      }}
      severity="error"
      title="Server Error"
      showRetry={true}
      onRetry={onRetry}
    />
  );
}

export function RateLimitErrorDisplay({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorDisplay
      error={{
        code: ERROR_CODES.API_RATE_LIMIT,
        message: 'Too many requests. Please wait a moment before trying again.',
        timestamp: new Date().toISOString(),
      }}
      severity="warning"
      title="Rate Limit Exceeded"
      showRetry={true}
      onRetry={onRetry}
    />
  );
}