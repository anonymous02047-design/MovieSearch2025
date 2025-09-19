/**
 * Centralized Error Handling System
 * 
 * This module provides a comprehensive error handling system for the MovieSearch application.
 * It includes error classification, user-friendly messages, retry logic, and logging.
 * 
 * Features:
 * - Standardized error codes and messages
 * - Automatic error classification
 * - Retry logic for transient errors
 * - User-friendly error messages
 * - Development and production logging
 * 
 * @author MovieSearch Team
 * @version 1.0.0
 */

// Core error interface
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: string;
  userId?: string;
}

export class MovieSearchError extends Error {
  public code: string;
  public details?: unknown;
  public timestamp: string;
  public userId?: string;

  constructor(code: string, message: string, details?: unknown, userId?: string) {
    super(message);
    this.name = 'MovieSearchError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.userId = userId;
  }
}

// Error codes
export const ERROR_CODES = {
  // API Errors
  API_KEY_MISSING: 'API_KEY_MISSING',
  API_RATE_LIMIT: 'API_RATE_LIMIT',
  API_SERVER_ERROR: 'API_SERVER_ERROR',
  API_NETWORK_ERROR: 'API_NETWORK_ERROR',
  API_NOT_FOUND: 'API_NOT_FOUND',
  API_UNAUTHORIZED: 'API_UNAUTHORIZED',
  
  // Authentication Errors
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  AUTH_INVALID: 'AUTH_INVALID',
  AUTH_EXPIRED: 'AUTH_EXPIRED',
  
  // Storage Errors
  STORAGE_QUOTA_EXCEEDED: 'STORAGE_QUOTA_EXCEEDED',
  STORAGE_ACCESS_DENIED: 'STORAGE_ACCESS_DENIED',
  STORAGE_CORRUPTED: 'STORAGE_CORRUPTED',
  
  // Validation Errors
  VALIDATION_INVALID_INPUT: 'VALIDATION_INVALID_INPUT',
  VALIDATION_MISSING_REQUIRED: 'VALIDATION_MISSING_REQUIRED',
  
  // General Errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  [ERROR_CODES.API_KEY_MISSING]: 'API key is missing or invalid. Please check your configuration.',
  [ERROR_CODES.API_RATE_LIMIT]: 'API rate limit exceeded. Please try again later.',
  [ERROR_CODES.API_SERVER_ERROR]: 'Server error occurred. Please try again later.',
  [ERROR_CODES.API_NETWORK_ERROR]: 'Network error. Please check your internet connection.',
  [ERROR_CODES.API_NOT_FOUND]: 'Requested resource not found.',
  [ERROR_CODES.API_UNAUTHORIZED]: 'Unauthorized access. Please check your credentials.',
  
  [ERROR_CODES.AUTH_REQUIRED]: 'Authentication required. Please sign in.',
  [ERROR_CODES.AUTH_INVALID]: 'Invalid authentication. Please sign in again.',
  [ERROR_CODES.AUTH_EXPIRED]: 'Authentication expired. Please sign in again.',
  
  [ERROR_CODES.STORAGE_QUOTA_EXCEEDED]: 'Storage quota exceeded. Please free up some space.',
  [ERROR_CODES.STORAGE_ACCESS_DENIED]: 'Storage access denied. Please check permissions.',
  [ERROR_CODES.STORAGE_CORRUPTED]: 'Storage data corrupted. Please clear your data.',
  
  [ERROR_CODES.VALIDATION_INVALID_INPUT]: 'Invalid input provided.',
  [ERROR_CODES.VALIDATION_MISSING_REQUIRED]: 'Required field is missing.',
  
  [ERROR_CODES.UNKNOWN_ERROR]: 'An unknown error occurred.',
  [ERROR_CODES.NETWORK_ERROR]: 'Network error. Please check your connection.',
  [ERROR_CODES.TIMEOUT_ERROR]: 'Request timed out. Please try again.',
} as const;

// Error handler class
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: AppError[] = [];
  private maxLogSize = 100;

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  public handleError(error: Error | MovieSearchError, context?: string, userId?: string): AppError {
    let appError: AppError;

    if (error instanceof MovieSearchError) {
      appError = {
        code: error.code,
        message: error.message,
        details: error.details,
        timestamp: error.timestamp,
        userId: error.userId || userId,
      };
    } else {
      appError = {
        code: ERROR_CODES.UNKNOWN_ERROR,
        message: error.message || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR],
        details: {
          originalError: error.name,
          stack: error.stack,
          context,
        },
        timestamp: new Date().toISOString(),
        userId,
      };
    }

    // Log error
    this.logError(appError);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error handled:', JSON.stringify(appError, null, 2));
    }

    return appError;
  }

  public createError(code: keyof typeof ERROR_CODES, message?: string, details?: unknown, userId?: string): MovieSearchError {
    const errorMessage = message || ERROR_MESSAGES[ERROR_CODES[code]];
    return new MovieSearchError(ERROR_CODES[code], errorMessage, details, userId);
  }

  public handleApiError(error: unknown, endpoint: string, userId?: string): AppError {
    let code: string;
    let message: string;

    // Type guard to check if error has response property
    const isAxiosError = (err: unknown): err is { response?: { status: number; data?: { message?: string } }; request?: unknown; message?: string } => {
      return typeof err === 'object' && err !== null;
    };

    if (isAxiosError(error) && error.response) {
      // Server responded with error status
      const status = error.response.status;
      switch (status) {
        case 401:
          code = ERROR_CODES.API_UNAUTHORIZED;
          break;
        case 404:
          code = ERROR_CODES.API_NOT_FOUND;
          break;
        case 429:
          code = ERROR_CODES.API_RATE_LIMIT;
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          code = ERROR_CODES.API_SERVER_ERROR;
          break;
        default:
          code = ERROR_CODES.API_SERVER_ERROR;
      }
      message = error.response.data?.message || ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES];
    } else if (isAxiosError(error) && error.request) {
      // Network error
      code = ERROR_CODES.API_NETWORK_ERROR;
      message = ERROR_MESSAGES[ERROR_CODES.API_NETWORK_ERROR];
    } else {
      // Other error
      code = ERROR_CODES.UNKNOWN_ERROR;
      message = (isAxiosError(error) && error.message) || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR];
    }

    const appError: AppError = {
      code,
      message,
      details: {
        endpoint,
        originalError: isAxiosError(error) ? error.message : 'Unknown error',
        status: isAxiosError(error) && error.response ? error.response.status : undefined,
      },
      timestamp: new Date().toISOString(),
      userId,
    };

    this.logError(appError);
    return appError;
  }

  public handleStorageError(error: Error, operation: string, userId?: string): AppError {
    let code: string;
    let message: string;

    if (error.name === 'QuotaExceededError') {
      code = ERROR_CODES.STORAGE_QUOTA_EXCEEDED;
      message = ERROR_MESSAGES[ERROR_CODES.STORAGE_QUOTA_EXCEEDED];
    } else if (error.name === 'SecurityError') {
      code = ERROR_CODES.STORAGE_ACCESS_DENIED;
      message = ERROR_MESSAGES[ERROR_CODES.STORAGE_ACCESS_DENIED];
    } else {
      code = ERROR_CODES.STORAGE_CORRUPTED;
      message = ERROR_MESSAGES[ERROR_CODES.STORAGE_CORRUPTED];
    }

    const appError: AppError = {
      code,
      message,
      details: {
        operation,
        originalError: error.name,
        stack: error.stack,
      },
      timestamp: new Date().toISOString(),
      userId,
    };

    this.logError(appError);
    return appError;
  }

  private logError(error: AppError): void {
    this.errorLog.unshift(error);
    
    // Keep only the most recent errors
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize);
    }

    // In a real app, you might want to send errors to a logging service
    // this.sendToLoggingService(error);
  }

  public getErrorLog(): AppError[] {
    return [...this.errorLog];
  }

  public clearErrorLog(): void {
    this.errorLog = [];
  }

  public getErrorCount(): number {
    return this.errorLog.length;
  }

  public getRecentErrors(count: number = 10): AppError[] {
    return this.errorLog.slice(0, count);
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Utility functions
export const isNetworkError = (error: unknown): boolean => {
  return typeof error === 'object' && error !== null && 'request' in error && !('response' in error);
};

export const isServerError = (error: unknown): boolean => {
  return typeof error === 'object' && error !== null && 'response' in error && 
    typeof (error as { response: { status: number } }).response.status >= 500;
};

export const isClientError = (error: unknown): boolean => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const status = (error as { response: { status: number } }).response.status;
    return status >= 400 && status < 500;
  }
  return false;
};

export const getErrorMessage = (error: AppError | Error): string => {
  if ('code' in error && error.code in ERROR_MESSAGES) {
    return ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES];
  }
  return error.message || 'An unexpected error occurred';
};

export const shouldRetry = (error: AppError): boolean => {
  const retryableCodes = [
    ERROR_CODES.API_SERVER_ERROR,
    ERROR_CODES.API_NETWORK_ERROR,
    ERROR_CODES.NETWORK_ERROR,
    ERROR_CODES.TIMEOUT_ERROR,
  ];
  return retryableCodes.includes(error.code);
};

// Retry utility
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }

      // Check if error is retryable
      const appError = errorHandler.handleError(lastError);
      if (!shouldRetry(appError)) {
        throw lastError;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
    }
  }

  throw lastError || new Error('Retry failed');
};
