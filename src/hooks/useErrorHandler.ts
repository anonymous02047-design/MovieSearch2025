'use client';

import { useCallback, useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { errorHandler, AppError, ERROR_CODES, shouldRetry, withRetry } from '@/lib/errorHandler';

interface UseErrorHandlerOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

interface UseErrorHandlerReturn {
  error: AppError | null;
  loading: boolean;
  retryCount: number;
  handleError: (error: Error | AppError | string, context?: string) => AppError;
  handleAsyncError: <T>(
    asyncFn: () => Promise<T>,
    context?: string,
    options?: { retry?: boolean; maxRetries?: number }
  ) => Promise<T | null>;
  clearError: () => void;
  retry: () => void;
  isRetryable: boolean;
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}): UseErrorHandlerReturn {
  const {
    showToast = true,
    logToConsole = true,
    maxRetries = 3,
    retryDelay = 1000,
  } = options;

  const { user } = useUser();
  const [error, setError] = useState<AppError | null>(null);
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastAsyncFn, setLastAsyncFn] = useState<(() => Promise<any>) | null>(null);

  const handleError = useCallback((error: Error | AppError | string, context?: string): AppError => {
    const appError = errorHandler.handleError(
      error instanceof Error ? error : new Error(error),
      context,
      user?.id
    );

    setError(appError);
    setRetryCount(0);

    if (logToConsole) {
      console.error('Error handled:', appError);
    }

    return appError;
  }, [user?.id, logToConsole]);

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    context?: string,
    options: { retry?: boolean; maxRetries?: number } = {}
  ): Promise<T | null> => {
    const { retry = false, maxRetries: customMaxRetries = maxRetries } = options;
    
    setLoading(true);
    setLastAsyncFn(() => asyncFn);

    try {
      if (retry) {
        const result = await withRetry(asyncFn, customMaxRetries, retryDelay);
        setError(null);
        setRetryCount(0);
        return result;
      } else {
        const result = await asyncFn();
        setError(null);
        setRetryCount(0);
        return result;
      }
    } catch (err) {
      const appError = handleError(err as Error, context);
      setRetryCount(prev => prev + 1);
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError, maxRetries, retryDelay]);

  const clearError = useCallback(() => {
    setError(null);
    setRetryCount(0);
  }, []);

  const retry = useCallback(async () => {
    if (lastAsyncFn && error && shouldRetry(error)) {
      await handleAsyncError(lastAsyncFn, 'retry', { retry: true });
    }
  }, [lastAsyncFn, error, handleAsyncError]);

  const isRetryable = error ? shouldRetry(error) : false;

  // Auto-clear error after 10 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    error,
    loading,
    retryCount,
    handleError,
    handleAsyncError,
    clearError,
    retry,
    isRetryable,
  };
}

// Specialized hooks for common use cases
export function useApiErrorHandler() {
  return useErrorHandler({
    showToast: true,
    logToConsole: true,
    maxRetries: 3,
    retryDelay: 1000,
  });
}

export function useFormErrorHandler() {
  return useErrorHandler({
    showToast: false,
    logToConsole: false,
    maxRetries: 0,
  });
}

export function useSearchErrorHandler() {
  return useErrorHandler({
    showToast: false,
    logToConsole: true,
    maxRetries: 2,
    retryDelay: 500,
  });
}

// Hook for managing multiple async operations
export function useMultipleAsyncOperations() {
  const [operations, setOperations] = useState<Map<string, { loading: boolean; error: AppError | null }>>(new Map());
  const { user } = useUser();

  const executeOperation = useCallback(async <T>(
    operationId: string,
    asyncFn: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    // Set loading state
    setOperations(prev => new Map(prev.set(operationId, { loading: true, error: null })));

    try {
      const result = await asyncFn();
      // Clear error state on success
      setOperations(prev => new Map(prev.set(operationId, { loading: false, error: null })));
      return result;
    } catch (error) {
      const appError = errorHandler.handleError(error as Error, context, user?.id);
      // Set error state
      setOperations(prev => new Map(prev.set(operationId, { loading: false, error: appError })));
      return null;
    }
  }, [user?.id]);

  const getOperationState = useCallback((operationId: string) => {
    return operations.get(operationId) || { loading: false, error: null };
  }, [operations]);

  const clearOperationError = useCallback((operationId: string) => {
    setOperations(prev => {
      const newMap = new Map(prev);
      const current = newMap.get(operationId);
      if (current) {
        newMap.set(operationId, { ...current, error: null });
      }
      return newMap;
    });
  }, []);

  const clearAllOperations = useCallback(() => {
    setOperations(new Map());
  }, []);

  return {
    executeOperation,
    getOperationState,
    clearOperationError,
    clearAllOperations,
    operations: Array.from(operations.entries()).map(([id, state]) => ({ id, ...state })),
  };
}

// Hook for handling network status
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        // Show reconnection message
        console.log('Connection restored');
        setWasOffline(false);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      console.log('Connection lost');
    };

    // Set initial state
    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  return { isOnline, wasOffline };
}

// Hook for handling storage errors
export function useStorageErrorHandler() {
  const { handleError } = useErrorHandler({ showToast: true });

  const handleStorageOperation = useCallback(async <T>(
    operation: () => T,
    operationName: string
  ): Promise<T | null> => {
    try {
      return operation();
    } catch (error) {
      if (error instanceof Error) {
        const appError = errorHandler.handleStorageError(error, operationName);
        handleError(appError);
        return null;
      }
      return null;
    }
  }, [handleError]);

  return { handleStorageOperation };
}