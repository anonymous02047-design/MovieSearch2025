/**
 * Comprehensive Error Handling Utilities
 * Provides consistent error handling across the application
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context?: Record<string, any>;

  constructor(message: string, statusCode = 500, isOperational = true, context?: Record<string, any>) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 400, true, context);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required', context?: Record<string, any>) {
    super(message, 401, true, context);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Access denied', context?: Record<string, any>) {
    super(message, 403, true, context);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', context?: Record<string, any>) {
    super(message, 404, true, context);
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests', context?: Record<string, any>) {
    super(message, 429, true, context);
    this.name = 'RateLimitError';
  }
}

export class APIError extends AppError {
  constructor(message = 'API request failed', statusCode = 500, context?: Record<string, any>) {
    super(message, statusCode, true, context);
    this.name = 'APIError';
  }
}

// Error handler for API routes
export function handleAPIError(error: unknown): { error: string; statusCode: number; details?: any } {
  console.error('API Error:', error);

  if (error instanceof AppError) {
    return {
      error: error.message,
      statusCode: error.statusCode,
      details: error.context,
    };
  }

  if (error instanceof Error) {
    return {
      error: error.message,
      statusCode: 500,
    };
  }

  return {
    error: 'An unknown error occurred',
    statusCode: 500,
  };
}

// Error handler for client-side
export function handleClientError(error: unknown): string {
  console.error('Client Error:', error);

  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

// Retry utility with exponential backoff
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries - 1) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error('Max retries exceeded');
}

// Safe async error wrapper
export function safeAsync<T extends any[], R>(
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R | null> {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error('Safe async error:', error);
      return null;
    }
  };
}

// Error boundary helper
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unknown error occurred';
}

// Network error handler
export function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return true;
  }
  if (error instanceof Error && error.message.includes('network')) {
    return true;
  }
  return false;
}

// Timeout error handler
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs = 30000,
  errorMessage = 'Request timeout'
): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
  });

  return Promise.race([promise, timeout]);
}

// Error reporting (can be extended to send to external service)
export function reportError(error: Error, context?: Record<string, any>): void {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Report:', {
      message: error.message,
      stack: error.stack,
      context,
    });
  }

  // In production, you could send to error tracking service
  // Example: Sentry, LogRocket, etc.
  if (process.env.NODE_ENV === 'production') {
    // sendToErrorTrackingService({ error, context });
  }
}

// User-friendly error messages
const ERROR_MESSAGES: Record<number, string> = {
  400: 'Invalid request. Please check your input and try again.',
  401: 'You need to sign in to access this feature.',
  403: 'You don\'t have permission to access this resource.',
  404: 'The requested resource was not found.',
  429: 'Too many requests. Please slow down and try again later.',
  500: 'Internal server error. Please try again later.',
  502: 'Service temporarily unavailable. Please try again later.',
  503: 'Service temporarily unavailable. Please try again later.',
  504: 'Request timeout. Please try again.',
};

export function getUserFriendlyErrorMessage(statusCode: number, defaultMessage?: string): string {
  return ERROR_MESSAGES[statusCode] || defaultMessage || 'An error occurred. Please try again.';
}

