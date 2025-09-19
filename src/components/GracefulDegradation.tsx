'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  AlertTitle,
  Stack,
  Chip,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Settings as SettingsIcon,
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  NetworkCheck as NetworkIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

interface FeatureStatus {
  name: string;
  available: boolean;
  fallback?: string;
  priority: 'critical' | 'important' | 'nice-to-have';
  category: 'api' | 'storage' | 'network' | 'security' | 'ui';
}

interface GracefulDegradationProps {
  showStatus?: boolean;
  onFeatureCheck?: (features: FeatureStatus[]) => void;
}

export default function GracefulDegradation({ 
  showStatus = true, 
  onFeatureCheck 
}: GracefulDegradationProps) {
  const [features, setFeatures] = useState<FeatureStatus[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const checkFeatures = useCallback(async () => {
    setIsChecking(true);
    
    const featureChecks: FeatureStatus[] = [
      // API Features
      {
        name: 'TMDB API',
        available: await checkApiAvailability('https://api.themoviedb.org/3'),
        fallback: 'Use cached data or placeholder content',
        priority: 'critical',
        category: 'api',
      },
      {
        name: 'Movie Search',
        available: await checkFeature('search'),
        fallback: 'Basic text search only',
        priority: 'critical',
        category: 'api',
      },
      {
        name: 'Movie Details',
        available: await checkFeature('details'),
        fallback: 'Show basic information only',
        priority: 'important',
        category: 'api',
      },
      
      // Storage Features
      {
        name: 'Local Storage',
        available: await checkLocalStorage(),
        fallback: 'No persistent preferences',
        priority: 'important',
        category: 'storage',
      },
      {
        name: 'Search History',
        available: await checkSearchHistory(),
        fallback: 'No search history tracking',
        priority: 'nice-to-have',
        category: 'storage',
      },
      {
        name: 'User Preferences',
        available: await checkUserPreferences(),
        fallback: 'Use default settings',
        priority: 'important',
        category: 'storage',
      },
      
      // Network Features
      {
        name: 'Online Status',
        available: navigator.onLine,
        fallback: 'Offline mode with cached data',
        priority: 'critical',
        category: 'network',
      },
      {
        name: 'Image Loading',
        available: await checkImageLoading(),
        fallback: 'Use placeholder images',
        priority: 'important',
        category: 'network',
      },
      
      // Security Features
      {
        name: 'reCAPTCHA',
        available: await checkRecaptcha(),
        fallback: 'Reduced security measures',
        priority: 'important',
        category: 'security',
      },
      {
        name: 'Authentication',
        available: await checkAuthentication(),
        fallback: 'Guest mode only',
        priority: 'critical',
        category: 'security',
      },
      
      // UI Features
      {
        name: 'Modern CSS',
        available: await checkModernCSS(),
        fallback: 'Basic styling only',
        priority: 'nice-to-have',
        category: 'ui',
      },
      {
        name: 'Animations',
        available: await checkAnimations(),
        fallback: 'Static UI elements',
        priority: 'nice-to-have',
        category: 'ui',
      },
    ];

    setFeatures(featureChecks);
    onFeatureCheck?.(featureChecks);
    setIsChecking(false);
  }, [onFeatureCheck]);

  // Feature check functions
  const checkApiAvailability = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache'
      });
      return true;
    } catch {
      return false;
    }
  };

  const checkFeature = async (feature: string): Promise<boolean> => {
    // Simulate feature checks
    return Math.random() > 0.1; // 90% success rate for demo
  };

  const checkLocalStorage = async (): Promise<boolean> => {
    try {
      const testKey = '__test_storage__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  };

  const checkSearchHistory = async (): Promise<boolean> => {
    try {
      const history = localStorage.getItem('searchHistory');
      return true;
    } catch {
      return false;
    }
  };

  const checkUserPreferences = async (): Promise<boolean> => {
    try {
      const prefs = localStorage.getItem('userPreferences');
      return true;
    } catch {
      return false;
    }
  };

  const checkImageLoading = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    });
  };

  const checkRecaptcha = async (): Promise<boolean> => {
    return typeof window !== 'undefined' && 
           typeof window.grecaptcha !== 'undefined';
  };

  const checkAuthentication = async (): Promise<boolean> => {
    return typeof window !== 'undefined' && 
           typeof window.Clerk !== 'undefined';
  };

  const checkModernCSS = async (): Promise<boolean> => {
    return CSS.supports('display', 'grid') && 
           CSS.supports('backdrop-filter', 'blur(10px)');
  };

  const checkAnimations = async (): Promise<boolean> => {
    return CSS.supports('animation', 'fadeIn 1s ease-in-out');
  };

  useEffect(() => {
    checkFeatures();
  }, [checkFeatures]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'api': return <NetworkIcon />;
      case 'storage': return <StorageIcon />;
      case 'network': return <NetworkIcon />;
      case 'security': return <SecurityIcon />;
      case 'ui': return <SettingsIcon />;
      default: return <InfoIcon />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'error';
      case 'important': return 'warning';
      case 'nice-to-have': return 'info';
      default: return 'default';
    }
  };

  const criticalIssues = features.filter(f => !f.available && f.priority === 'critical');
  const importantIssues = features.filter(f => !f.available && f.priority === 'important');
  const totalIssues = criticalIssues.length + importantIssues.length;

  if (!showStatus || features.length === 0) return null;

  return (
    <Paper
      elevation={2}
      sx={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        maxWidth: 400,
        zIndex: 1000,
        backgroundColor: totalIssues > 0 ? '#fff3cd' : '#d4edda',
        border: `1px solid ${totalIssues > 0 ? '#ffeaa7' : '#c3e6cb'}`,
      }}
    >
      <Box sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            {totalIssues > 0 ? (
              <WarningIcon color="warning" />
            ) : (
              <CheckCircleIcon color="success" />
            )}
            <Typography variant="subtitle2" fontWeight="bold">
              System Status
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <IconButton
              size="small"
              onClick={checkFeatures}
              disabled={isChecking}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Stack>
        </Stack>

        {totalIssues > 0 ? (
          <Alert severity={criticalIssues.length > 0 ? 'error' : 'warning'} sx={{ mb: 1 }}>
            <AlertTitle>
              {criticalIssues.length > 0 ? 'Critical Issues' : 'Performance Issues'}
            </AlertTitle>
            {criticalIssues.length > 0 && (
              <Typography variant="body2">
                {criticalIssues.length} critical feature(s) unavailable
              </Typography>
            )}
            {importantIssues.length > 0 && (
              <Typography variant="body2">
                {importantIssues.length} important feature(s) degraded
              </Typography>
            )}
          </Alert>
        ) : (
          <Alert severity="success" sx={{ mb: 1 }}>
            <AlertTitle>All Systems Operational</AlertTitle>
            <Typography variant="body2">
              All features are working normally
            </Typography>
          </Alert>
        )}

        <Collapse in={showDetails}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Feature Status:
            </Typography>
            <List dense>
              {features.map((feature, index) => (
                <React.Fragment key={feature.name}>
                  <ListItem sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      {feature.available ? (
                        <CheckCircleIcon color="success" fontSize="small" />
                      ) : (
                        <CancelIcon color="error" fontSize="small" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="body2">
                            {feature.name}
                          </Typography>
                          <Chip
                            label={feature.priority}
                            size="small"
                            color={getPriorityColor(feature.priority)}
                            sx={{ fontSize: '0.7rem', height: 20 }}
                          />
                          {getCategoryIcon(feature.category)}
                        </Stack>
                      }
                      secondary={
                        !feature.available && feature.fallback && (
                          <Typography variant="caption" color="text.secondary">
                            Fallback: {feature.fallback}
                          </Typography>
                        )
                      }
                    />
                  </ListItem>
                  {index < features.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        </Collapse>
      </Box>
    </Paper>
  );
}

// Hook for graceful degradation
export function useGracefulDegradation() {
  const [features, setFeatures] = useState<FeatureStatus[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const checkFeature = useCallback(async (featureName: string): Promise<boolean> => {
    // Implement specific feature checks
    switch (featureName) {
      case 'localStorage':
        try {
          localStorage.setItem('__test__', 'test');
          localStorage.removeItem('__test__');
          return true;
        } catch {
          return false;
        }
      case 'sessionStorage':
        try {
          sessionStorage.setItem('__test__', 'test');
          sessionStorage.removeItem('__test__');
          return true;
        } catch {
          return false;
        }
      case 'indexedDB':
        return 'indexedDB' in window;
      case 'webWorkers':
        return typeof Worker !== 'undefined';
      case 'serviceWorker':
        return 'serviceWorker' in navigator;
      case 'pushNotifications':
        return 'Notification' in window && 'serviceWorker' in navigator;
      default:
        return true;
    }
  }, []);

  const getFallback = useCallback((featureName: string): string => {
    const fallbacks: Record<string, string> = {
      localStorage: 'Use session storage or cookies',
      sessionStorage: 'Use cookies or memory storage',
      indexedDB: 'Use localStorage or server storage',
      webWorkers: 'Use main thread processing',
      serviceWorker: 'Use standard caching',
      pushNotifications: 'Use email or in-app notifications',
    };
    return fallbacks[featureName] || 'Feature unavailable';
  }, []);

  const isFeatureAvailable = useCallback((featureName: string): boolean => {
    const feature = features.find(f => f.name === featureName);
    return feature?.available ?? true;
  }, [features]);

  return {
    features,
    isChecking,
    checkFeature,
    getFallback,
    isFeatureAvailable,
  };
}
