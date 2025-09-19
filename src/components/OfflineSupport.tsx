'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Snackbar,
  Alert,
  Stack,
  IconButton,
  Collapse,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  CloudOff as CloudOffIcon,
  CloudDone as CloudDoneIcon,
  Refresh as RefreshIcon,
  WifiOff as WifiOffIcon,
  Wifi as WifiIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';
import { useNetworkStatus } from '@/hooks/useErrorHandler';

interface OfflineSupportProps {
  showStatus?: boolean;
  showQueue?: boolean;
  onRetry?: () => void;
}

interface QueuedAction {
  id: string;
  action: string;
  timestamp: Date;
  data?: any;
  retries: number;
  maxRetries: number;
}

export default function OfflineSupport({ 
  showStatus = true, 
  showQueue = true,
  onRetry 
}: OfflineSupportProps) {
  const { isOnline, wasOffline } = useNetworkStatus();
  const [showDetails, setShowDetails] = useState(false);
  const [queuedActions, setQueuedActions] = useState<QueuedAction[]>([]);
  const [syncProgress, setSyncProgress] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load queued actions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('offlineQueue');
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((action: any) => ({
          ...action,
          timestamp: new Date(action.timestamp),
        }));
        setQueuedActions(parsed);
      } catch (error) {
        console.error('Failed to load offline queue:', error);
      }
    }
  }, []);

  // Save queued actions to localStorage
  const saveQueue = useCallback((actions: QueuedAction[]) => {
    localStorage.setItem('offlineQueue', JSON.stringify(actions));
  }, []);

  // Add action to queue when offline
  const queueAction = useCallback((action: string, data?: any) => {
    if (!isOnline) {
      const newAction: QueuedAction = {
        id: Date.now().toString(),
        action,
        timestamp: new Date(),
        data,
        retries: 0,
        maxRetries: 3,
      };
      
      const updated = [...queuedActions, newAction];
      setQueuedActions(updated);
      saveQueue(updated);
    }
  }, [isOnline, queuedActions, saveQueue]);

  // Process queued actions when back online
  const processQueue = useCallback(async () => {
    if (!isOnline || queuedActions.length === 0) return;

    setIsSyncing(true);
    setSyncProgress(0);

    const total = queuedActions.length;
    let processed = 0;
    const successful: string[] = [];
    const failed: QueuedAction[] = [];

    for (const action of queuedActions) {
      try {
        // Simulate processing the action
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Here you would actually process the action
        // For now, we'll just simulate success
        successful.push(action.id);
        processed++;
        setSyncProgress((processed / total) * 100);
      } catch (error) {
        if (action.retries < action.maxRetries) {
          action.retries++;
          failed.push(action);
        } else {
          // Max retries reached, remove from queue
          console.error('Action failed after max retries:', action);
        }
        processed++;
        setSyncProgress((processed / total) * 100);
      }
    }

    // Update queue
    const updated = failed;
    setQueuedActions(updated);
    saveQueue(updated);
    setIsSyncing(false);

    // Show completion message
    if (successful.length > 0) {
      console.log(`Synced ${successful.length} actions`);
    }
  }, [isOnline, queuedActions, saveQueue]);

  // Auto-process queue when back online
  useEffect(() => {
    if (isOnline && wasOffline && queuedActions.length > 0) {
      processQueue();
    }
  }, [isOnline, wasOffline, queuedActions.length, processQueue]);

  // Clear queue
  const clearQueue = useCallback(() => {
    setQueuedActions([]);
    saveQueue([]);
  }, [saveQueue]);

  // Retry failed actions
  const retryFailed = useCallback(() => {
    const failed = queuedActions.filter(action => action.retries > 0);
    if (failed.length > 0) {
      processQueue();
    }
  }, [queuedActions, processQueue]);

  if (!showStatus) return null;

  return (
    <>
      {/* Offline Indicator */}
      {!isOnline && (
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
            maxWidth: 300,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <WifiOffIcon />
            <Typography variant="body2" sx={{ flex: 1 }}>
              You're offline
            </Typography>
            {showQueue && queuedActions.length > 0 && (
              <Chip
                label={queuedActions.length}
                size="small"
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                  color: 'white',
                  fontSize: '0.75rem',
                }}
              />
            )}
            {onRetry && (
              <IconButton
                size="small"
                onClick={onRetry}
                sx={{ color: 'white' }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
        </Paper>
      )}

      {/* Online Indicator */}
      {isOnline && wasOffline && (
        <Snackbar
          open={true}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            severity="success"
            icon={<WifiIcon />}
            action={
              <IconButton
                size="small"
                onClick={() => setShowDetails(!showDetails)}
                sx={{ color: 'inherit' }}
              >
                {showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            }
          >
            Connection restored
          </Alert>
        </Snackbar>
      )}

      {/* Sync Progress */}
      {isSyncing && (
        <Paper
          elevation={3}
          sx={{
            position: 'fixed',
            top: 80,
            right: 16,
            p: 2,
            backgroundColor: '#4caf50',
            color: 'white',
            zIndex: 9999,
            minWidth: 200,
          }}
        >
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <UploadIcon fontSize="small" />
              <Typography variant="body2">
                Syncing offline actions...
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={syncProgress}
              sx={{
                height: 4,
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'white',
                },
              }}
            />
            <Typography variant="caption" sx={{ textAlign: 'center' }}>
              {Math.round(syncProgress)}% complete
            </Typography>
          </Stack>
        </Paper>
      )}

      {/* Queue Details */}
      {showQueue && showDetails && queuedActions.length > 0 && (
        <Paper
          elevation={3}
          sx={{
            position: 'fixed',
            top: isSyncing ? 200 : 80,
            right: 16,
            p: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            zIndex: 9999,
            minWidth: 300,
            maxHeight: 400,
            overflow: 'auto',
          }}
        >
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h6" sx={{ color: 'white' }}>
                Offline Queue ({queuedActions.length})
              </Typography>
              <Stack direction="row" spacing={1}>
                {isOnline && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={processQueue}
                    disabled={isSyncing}
                    sx={{ color: 'white', borderColor: 'white' }}
                  >
                    Sync Now
                  </Button>
                )}
                <Button
                  size="small"
                  variant="outlined"
                  onClick={clearQueue}
                  sx={{ color: 'white', borderColor: 'white' }}
                >
                  Clear
                </Button>
              </Stack>
            </Stack>

            <Collapse in={showDetails}>
              <Stack spacing={1}>
                {queuedActions.map((action) => (
                  <Box
                    key={action.id}
                    sx={{
                      p: 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 1,
                      border: action.retries > 0 ? '1px solid #ff9800' : 'none',
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                          {action.action}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {action.timestamp.toLocaleString()}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {action.retries > 0 && (
                          <Chip
                            label={`${action.retries}/${action.maxRetries}`}
                            size="small"
                            color="warning"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                        <StorageIcon fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                      </Stack>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Collapse>
          </Stack>
        </Paper>
      )}
    </>
  );
}

// Hook for offline functionality
export function useOfflineQueue() {
  const { isOnline } = useNetworkStatus();
  const [queuedActions, setQueuedActions] = useState<QueuedAction[]>([]);

  const queueAction = useCallback((action: string, data?: any) => {
    if (!isOnline) {
      const newAction: QueuedAction = {
        id: Date.now().toString(),
        action,
        timestamp: new Date(),
        data,
        retries: 0,
        maxRetries: 3,
      };
      
      setQueuedActions(prev => {
        const updated = [...prev, newAction];
        localStorage.setItem('offlineQueue', JSON.stringify(updated));
        return updated;
      });
    }
  }, [isOnline]);

  const processQueue = useCallback(async (processor: (action: QueuedAction) => Promise<boolean>) => {
    if (!isOnline || queuedActions.length === 0) return;

    const successful: string[] = [];
    const failed: QueuedAction[] = [];

    for (const action of queuedActions) {
      try {
        const success = await processor(action);
        if (success) {
          successful.push(action.id);
        } else {
          if (action.retries < action.maxRetries) {
            action.retries++;
            failed.push(action);
          }
        }
      } catch (error) {
        if (action.retries < action.maxRetries) {
          action.retries++;
          failed.push(action);
        }
      }
    }

    setQueuedActions(failed);
    localStorage.setItem('offlineQueue', JSON.stringify(failed));
    
    return { successful, failed };
  }, [isOnline, queuedActions]);

  return {
    queueAction,
    processQueue,
    queuedActions,
    isOnline,
  };
}
