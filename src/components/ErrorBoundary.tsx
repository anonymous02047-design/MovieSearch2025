'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  Alert,
  AlertTitle,
  Divider,
  IconButton,
  Collapse,
  Chip,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  BugReport as BugReportIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { errorHandler, AppError, ERROR_CODES } from '@/lib/errorHandler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  showRetry?: boolean;
  showHome?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  appError: AppError | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      appError: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const appError = errorHandler.handleError(error, 'ErrorBoundary');
    
    this.setState({
      error,
      errorInfo,
      appError,
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      appError: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleToggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails,
    }));
  };

  handleDismiss = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      appError: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo, appError, showDetails } = this.state;
      const { showDetails: showDetailsProp = true, showRetry = true, showHome = true } = this.props;

      return (
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Close button */}
            <IconButton
              onClick={this.handleDismiss}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Error Icon */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <ErrorIcon sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Oops! Something went wrong
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
                We're sorry, but something unexpected happened. Don't worry, we're on it!
              </Typography>
            </Box>

            {/* Error Details */}
            {appError && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  '& .MuiAlert-icon': {
                    color: 'white',
                  },
                }}
              >
                <AlertTitle sx={{ color: 'white' }}>Error Details</AlertTitle>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {appError.message}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={`Code: ${appError.code}`}
                    size="small"
                    sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
                  />
                  <Chip
                    label={`Time: ${new Date(appError.timestamp).toLocaleString()}`}
                    size="small"
                    sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
                  />
                </Box>
              </Alert>
            )}

            {/* Action Buttons */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 3 }}>
              {showRetry && (
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={this.handleRetry}
                  sx={{
                    backgroundColor: 'white',
                    color: '#ff6b6b',
                    fontWeight: 'bold',
                    px: 3,
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                >
                  Try Again
                </Button>
              )}
              {showHome && (
                <Button
                  variant="outlined"
                  startIcon={<HomeIcon />}
                  onClick={this.handleGoHome}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    fontWeight: 'bold',
                    px: 3,
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'white',
                    },
                  }}
                >
                  Go Home
                </Button>
              )}
            </Stack>

            {/* Technical Details (Development/Admin only) */}
            {showDetailsProp && (process.env.NODE_ENV === 'development' || appError?.code === ERROR_CODES.API_SERVER_ERROR) && (
              <>
                <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.3)' }} />
                <Button
                  startIcon={<BugReportIcon />}
                  endIcon={showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  onClick={this.handleToggleDetails}
                  sx={{
                    color: 'white',
                    textTransform: 'none',
                    mb: 2,
                  }}
                >
                  {showDetails ? 'Hide' : 'Show'} Technical Details
                </Button>

                <Collapse in={showDetails}>
                  <Paper
                    sx={{
                      p: 3,
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      color: 'white',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      overflow: 'auto',
                      maxHeight: 400,
                    }}
                  >
                    <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                      Error Stack Trace:
                    </Typography>
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {error?.stack}
                    </pre>

                    {errorInfo && (
                      <>
                        <Typography variant="h6" gutterBottom sx={{ color: 'white', mt: 2 }}>
                          Component Stack:
                        </Typography>
                        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                          {errorInfo.componentStack}
                        </pre>
                      </>
                    )}

                    {appError?.details && (
                      <>
                        <Typography variant="h6" gutterBottom sx={{ color: 'white', mt: 2 }}>
                          Additional Details:
                        </Typography>
                        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                          {JSON.stringify(appError.details, null, 2)}
                        </pre>
                      </>
                    )}
                  </Paper>
                </Collapse>
              </>
            )}

            {/* Help Text */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                If this problem persists, please contact our support team.
              </Typography>
            </Box>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// Hook for functional components
export function useErrorHandler() {
  const handleError = React.useCallback((error: Error, context?: string) => {
    const appError = errorHandler.handleError(error, context);
    return appError;
  }, []);

  return { handleError };
}