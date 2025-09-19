'use client';

import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Skeleton,
  LinearProgress,
  Paper,
  Stack,
  Fade,
} from '@mui/material';
import {
  Movie as MovieIcon,
  Search as SearchIcon,
  CloudOff as CloudOffIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

interface LoadingStatesProps {
  type?: 'page' | 'component' | 'search' | 'movie' | 'skeleton';
  message?: string;
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
  fullScreen?: boolean;
}

export function LoadingSpinner({ 
  type = 'component', 
  message, 
  size = 'medium',
  showIcon = true,
  fullScreen = false 
}: LoadingStatesProps) {
  const getSize = () => {
    switch (size) {
      case 'small': return 24;
      case 'large': return 60;
      default: return 40;
    }
  };

  const getMessage = () => {
    if (message) return message;
    
    switch (type) {
      case 'page': return 'Loading page...';
      case 'search': return 'Searching movies...';
      case 'movie': return 'Loading movie details...';
      default: return 'Loading...';
    }
  };

  const getIcon = () => {
    if (!showIcon) return null;
    
    switch (type) {
      case 'search': return <SearchIcon sx={{ fontSize: getSize(), mr: 1 }} />;
      case 'movie': return <MovieIcon sx={{ fontSize: getSize(), mr: 1 }} />;
      default: return null;
    }
  };

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {getIcon()}
        <CircularProgress size={getSize()} />
      </Box>
      <Typography variant="body1" color="text.secondary" textAlign="center">
        {getMessage()}
      </Typography>
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          zIndex: 9999,
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
}

export function LoadingSkeleton({ type = 'movie', count = 6 }: { type?: 'movie' | 'text' | 'card'; count?: number }) {
  const renderSkeleton = () => {
    switch (type) {
      case 'movie':
        return (
          <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
            <Skeleton variant="rectangular" width={120} height={180} sx={{ borderRadius: 1 }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="80%" height={32} />
              <Skeleton variant="text" width="60%" height={24} sx={{ mt: 1 }} />
              <Skeleton variant="text" width="100%" height={20} sx={{ mt: 1 }} />
              <Skeleton variant="text" width="90%" height={20} sx={{ mt: 0.5 }} />
              <Skeleton variant="text" width="70%" height={20} sx={{ mt: 0.5 }} />
            </Box>
          </Box>
        );
      
      case 'card':
        return (
          <Paper sx={{ p: 2 }}>
            <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 1, mb: 2 }} />
            <Skeleton variant="text" width="80%" height={24} />
            <Skeleton variant="text" width="60%" height={20} sx={{ mt: 1 }} />
            <Skeleton variant="text" width="100%" height={16} sx={{ mt: 1 }} />
            <Skeleton variant="text" width="90%" height={16} sx={{ mt: 0.5 }} />
          </Paper>
        );
      
      default:
        return (
          <Box>
            <Skeleton variant="text" width="100%" height={24} />
            <Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }} />
            <Skeleton variant="text" width="90%" height={20} sx={{ mt: 0.5 }} />
            <Skeleton variant="text" width="70%" height={20} sx={{ mt: 0.5 }} />
          </Box>
        );
    }
  };

  return (
    <Box>
      {Array.from({ length: count }).map((_, index) => (
        <Fade key={index} in timeout={300 + index * 100}>
          <Box sx={{ mb: type === 'movie' ? 0 : 2 }}>
            {renderSkeleton()}
          </Box>
        </Fade>
      ))}
    </Box>
  );
}

export function LoadingProgress({ 
  progress, 
  message = 'Loading...',
  showPercentage = true 
}: { 
  progress: number; 
  message?: string; 
  showPercentage?: boolean;
}) {
  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
        {showPercentage && (
          <Typography variant="body2" color="text.secondary">
            {Math.round(progress)}%
          </Typography>
        )}
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{ 
          height: 8, 
          borderRadius: 4,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
          },
        }} 
      />
    </Box>
  );
}

export function OfflineIndicator({ 
  isOnline, 
  onRetry 
}: { 
  isOnline: boolean; 
  onRetry?: () => void;
}) {
  if (isOnline) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        p: 2,
        backgroundColor: '#ff6b6b',
        color: 'white',
        zIndex: 9999,
        minWidth: 200,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <CloudOffIcon />
        <Typography variant="body2" sx={{ flex: 1 }}>
          You're offline
        </Typography>
        {onRetry && (
          <RefreshIcon 
            sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
            onClick={onRetry}
          />
        )}
      </Stack>
    </Paper>
  );
}

export function RetryButton({ 
  onClick, 
  loading = false,
  isRetryable = true,
  onRetry,
  buttonText = 'Try Again',
  error 
}: { 
  onClick?: () => void; 
  loading?: boolean;
  isRetryable?: boolean;
  onRetry?: () => void;
  buttonText?: string;
  error?: string;
}) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (onRetry) {
      onRetry();
    }
  };

  if (!isRetryable && !onClick) {
    return null;
  }

  return (
    <Box sx={{ textAlign: 'center', p: 3 }}>
      {error && (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Box
        onClick={handleClick}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          cursor: loading ? 'not-allowed' : 'pointer',
          p: 2,
          borderRadius: 2,
          backgroundColor: 'primary.main',
          color: 'white',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: loading ? 'primary.main' : 'primary.dark',
            transform: loading ? 'none' : 'translateY(-2px)',
            boxShadow: loading ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
          opacity: loading ? 0.7 : 1,
          pointerEvents: loading ? 'none' : 'auto',
        }}
      >
        {loading ? (
          <CircularProgress size={16} color="inherit" />
        ) : (
          <RefreshIcon />
        )}
        <Typography variant="body2" fontWeight="bold">
          {loading ? 'Retrying...' : buttonText}
        </Typography>
      </Box>
    </Box>
  );
}

// Hook for managing loading states
export function useLoadingState(initialState = false) {
  const [loading, setLoading] = React.useState(initialState);
  const [error, setError] = React.useState<string | null>(null);

  const startLoading = React.useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  const stopLoading = React.useCallback(() => {
    setLoading(false);
  }, []);

  const setErrorState = React.useCallback((errorMessage: string) => {
    setError(errorMessage);
    setLoading(false);
  }, []);

  const reset = React.useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    loading,
    error,
    startLoading,
    stopLoading,
    setErrorState,
    reset,
  };
}
