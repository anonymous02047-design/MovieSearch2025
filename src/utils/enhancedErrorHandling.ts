/**
 * Enhanced Error Handling System
 * - Centralized error handling
 * - Error logging and reporting
 * - User-friendly error messages
 * - Error recovery strategies
 */

import { NextResponse } from 'next/server';

export enum ErrorCode {
  // Authentication & Authorization
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  
  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_REQUEST = 'INVALID_REQUEST',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // Database
  DATABASE_ERROR = 'DATABASE_ERROR',
  DATABASE_CONNECTION_ERROR = 'DATABASE_CONNECTION_ERROR',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  NOT_FOUND = 'NOT_FOUND',
  
  // External APIs
  EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR',
  TMDB_API_ERROR = 'TMDB_API_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  API_KEY_MISSING = 'API_KEY_MISSING',
  API_KEY_INVALID = 'API_KEY_INVALID',
  
  // Server
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  
  // Client
  BAD_REQUEST = 'BAD_REQUEST',
  NETWORK_ERROR = 'NETWORK_ERROR',
  
  // Business Logic
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
  OPERATION_NOT_ALLOWED = 'OPERATION_NOT_ALLOWED',
  
  // Unknown
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface CustomError extends Error {
  code: ErrorCode;
  statusCode: number;
  severity: ErrorSeverity;
  details?: any;
  isOperational: boolean;
  timestamp: string;
  requestId?: string;
}

export class AppError extends Error implements CustomError {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly severity: ErrorSeverity;
  public readonly details?: any;
  public readonly isOperational: boolean;
  public readonly timestamp: string;
  public readonly requestId?: string;

  constructor(
    code: ErrorCode,
    message: string,
    statusCode: number = 500,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    details?: any,
    isOperational: boolean = true
  ) {
    super(message);
    
    this.code = code;
    this.statusCode = statusCode;
    this.severity = severity;
    this.details = details;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error factory functions
export const createError = {
  unauthorized: (message: string = 'Unauthorized access', details?: any) =>
    new AppError(ErrorCode.UNAUTHORIZED, message, 401, ErrorSeverity.MEDIUM, details),

  forbidden: (message: string = 'Access forbidden', details?: any) =>
    new AppError(ErrorCode.FORBIDDEN, message, 403, ErrorSeverity.MEDIUM, details),

  notFound: (message: string = 'Resource not found', details?: any) =>
    new AppError(ErrorCode.NOT_FOUND, message, 404, ErrorSeverity.LOW, details),

  validationError: (message: string, details?: any) =>
    new AppError(ErrorCode.VALIDATION_ERROR, message, 400, ErrorSeverity.LOW, details),

  databaseError: (message: string, details?: any) =>
    new AppError(ErrorCode.DATABASE_ERROR, message, 500, ErrorSeverity.HIGH, details),

  externalApiError: (message: string, details?: any) =>
    new AppError(ErrorCode.EXTERNAL_API_ERROR, message, 502, ErrorSeverity.MEDIUM, details),

  rateLimitExceeded: (message: string = 'Rate limit exceeded', details?: any) =>
    new AppError(ErrorCode.RATE_LIMIT_EXCEEDED, message, 429, ErrorSeverity.LOW, details),

  internalError: (message: string = 'Internal server error', details?: any) =>
    new AppError(ErrorCode.INTERNAL_SERVER_ERROR, message, 500, ErrorSeverity.CRITICAL, details),
};

// Error handler for API routes
export const handleApiError = (error: any): NextResponse => {
  console.error('API Error:', error);

  let statusCode = 500;
  let code = ErrorCode.INTERNAL_SERVER_ERROR;
  let message = 'An unexpected error occurred';
  let severity = ErrorSeverity.MEDIUM;
  let details: any = undefined;

  // Handle AppError
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    code = error.code;
    message = error.message;
    severity = error.severity;
    details = error.details;
  }
  // Handle Axios errors
  else if (error.isAxiosError) {
    statusCode = error.response?.status || 502;
    code = ErrorCode.EXTERNAL_API_ERROR;
    message = error.response?.data?.status_message || error.message;
    details = {
      url: error.config?.url,
      method: error.config?.method,
      response: error.response?.data,
    };
  }
  // Handle MongoDB errors
  else if (error.name === 'MongoError' || error.name === 'MongooseError') {
    statusCode = 500;
    code = ErrorCode.DATABASE_ERROR;
    message = 'Database operation failed';
    severity = ErrorSeverity.HIGH;
    
    if (error.code === 11000) {
      statusCode = 409;
      code = ErrorCode.DUPLICATE_ENTRY;
      message = 'Duplicate entry found';
      severity = ErrorSeverity.LOW;
    }
  }
  // Handle validation errors (Zod, Joi, etc.)
  else if (error.name === 'ZodError' || error.name === 'ValidationError') {
    statusCode = 400;
    code = ErrorCode.VALIDATION_ERROR;
    message = 'Validation failed';
    severity = ErrorSeverity.LOW;
    details = error.errors || error.details;
  }
  // Handle timeout errors
  else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    statusCode = 504;
    code = ErrorCode.TIMEOUT_ERROR;
    message = 'Request timeout';
    severity = ErrorSeverity.MEDIUM;
  }
  // Handle rate limiting
  else if (error.message?.includes('rate limit') || error.status === 429) {
    statusCode = 429;
    code = ErrorCode.RATE_LIMIT_EXCEEDED;
    message = 'Too many requests. Please try again later';
    severity = ErrorSeverity.LOW;
  }

  // Log error based on severity
  logError(error, severity);

  // Send error response
  return NextResponse.json(
    {
      error: {
        code,
        message,
        severity,
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === 'development' && { 
          details,
          stack: error.stack 
        }),
      },
    },
    { status: statusCode }
  );
};

// Error logger
export const logError = (error: any, severity: ErrorSeverity = ErrorSeverity.MEDIUM, context?: string) => {
  const logData = {
    timestamp: new Date().toISOString(),
    severity,
    context: context || 'Unknown',
    message: error.message,
    code: error.code || 'UNKNOWN',
    stack: error.stack,
    ...(error.details && { details: error.details }),
  };

  // Console logging with colors (development)
  if (process.env.NODE_ENV === 'development') {
    const colors = {
      [ErrorSeverity.LOW]: '\x1b[33m', // Yellow
      [ErrorSeverity.MEDIUM]: '\x1b[35m', // Magenta
      [ErrorSeverity.HIGH]: '\x1b[31m', // Red
      [ErrorSeverity.CRITICAL]: '\x1b[41m\x1b[37m', // Red background, white text
    };
    
    console.error(
      `${colors[severity]}[${severity}]${'\x1b[0m'}`,
      `[${context || 'Error'}]`,
      error.message,
      '\n',
      error.stack
    );
  } else {
    // Production: Send to external logging service
    console.error(JSON.stringify(logData));
    
    // TODO: Send to logging service (Sentry, DataDog, LogRocket, etc.)
    // sendToLoggingService(logData);
  }
};

// Error recovery strategies
export const errorRecovery = {
  // Retry with exponential backoff
  async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    initialDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        if (i < maxRetries - 1) {
          const delay = initialDelay * Math.pow(2, i);
          console.warn(`Retry attempt ${i + 1}/${maxRetries} after ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError!;
  },

  // Fallback to default value
  async withFallback<T>(
    fn: () => Promise<T>,
    fallbackValue: T
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      logError(error, ErrorSeverity.LOW, 'Fallback used');
      return fallbackValue;
    }
  },

  // Circuit breaker pattern
  createCircuitBreaker<T>(
    fn: () => Promise<T>,
    options: {
      threshold: number;
      timeout: number;
      resetTimeout: number;
    }
  ) {
    let failures = 0;
    let lastFailureTime: number | null = null;
    let state: 'closed' | 'open' | 'half-open' = 'closed';

    return async (): Promise<T> => {
      // Check if circuit should reset
      if (state === 'open' && lastFailureTime) {
        if (Date.now() - lastFailureTime > options.resetTimeout) {
          state = 'half-open';
          failures = 0;
        } else {
          throw new AppError(
            ErrorCode.SERVICE_UNAVAILABLE,
            'Service temporarily unavailable',
            503,
            ErrorSeverity.HIGH
          );
        }
      }

      try {
        const result = await fn();
        
        if (state === 'half-open') {
          state = 'closed';
          failures = 0;
        }
        
        return result;
      } catch (error) {
        failures++;
        lastFailureTime = Date.now();
        
        if (failures >= options.threshold) {
          state = 'open';
        }
        
        throw error;
      }
    };
  },
};

// User-friendly error messages
export const getUserFriendlyMessage = (error: any): string => {
  if (error instanceof AppError) {
    return error.message;
  }

  const errorMap: Record<string, string> = {
    [ErrorCode.UNAUTHORIZED]: 'Please sign in to continue',
    [ErrorCode.FORBIDDEN]: 'You do not have permission to perform this action',
    [ErrorCode.NOT_FOUND]: 'The requested resource was not found',
    [ErrorCode.VALIDATION_ERROR]: 'Please check your input and try again',
    [ErrorCode.DATABASE_ERROR]: 'We are experiencing technical difficulties. Please try again later',
    [ErrorCode.EXTERNAL_API_ERROR]: 'Unable to fetch data. Please try again later',
    [ErrorCode.RATE_LIMIT_EXCEEDED]: 'Too many requests. Please wait a moment and try again',
    [ErrorCode.INTERNAL_SERVER_ERROR]: 'Something went wrong. Our team has been notified',
    [ErrorCode.NETWORK_ERROR]: 'Network error. Please check your internet connection',
    [ErrorCode.TIMEOUT_ERROR]: 'Request timed out. Please try again',
  };

  return errorMap[error.code] || 'An unexpected error occurred. Please try again';
};

// Hook for client-side error handling
export const useErrorHandler = () => {
  const handleError = (error: any) => {
    const friendlyMessage = getUserFriendlyMessage(error);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error:', error);
    }

    // Track error in analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message || 'Unknown error',
        fatal: error.severity === ErrorSeverity.CRITICAL,
      });
    }

    return friendlyMessage;
  };

  return { handleError, getUserFriendlyMessage };
};

export default {
  AppError,
  createError,
  handleApiError,
  logError,
  errorRecovery,
  getUserFriendlyMessage,
  useErrorHandler,
};

