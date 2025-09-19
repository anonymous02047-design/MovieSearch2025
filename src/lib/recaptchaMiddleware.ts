import { NextRequest, NextResponse } from 'next/server';
import { errorHandler } from './errorHandler';

export interface RecaptchaMiddlewareOptions {
  threshold?: number;
  action?: string;
  skipPaths?: string[];
  skipMethods?: string[];
  headerName?: string;
  errorMessage?: string;
}

export class RecaptchaMiddleware {
  private options: Required<RecaptchaMiddlewareOptions>;

  constructor(options: RecaptchaMiddlewareOptions = {}) {
    this.options = {
      threshold: options.threshold || 0.5,
      action: options.action || 'api_request',
      skipPaths: options.skipPaths || ['/api/health', '/api/recaptcha/verify'],
      skipMethods: options.skipMethods || ['GET', 'HEAD', 'OPTIONS'],
      headerName: options.headerName || 'x-recaptcha-token',
      errorMessage: options.errorMessage || 'reCAPTCHA verification failed',
    };
  }

  async verifyToken(token: string, action?: string): Promise<{
    success: boolean;
    score: number;
    action: string;
    error_codes?: string[];
  }> {
    try {
      const secretKey = process.env.RECAPTCHA_SECRET_KEY;
      if (!secretKey) {
        throw new Error('reCAPTCHA secret key not configured');
      }

      const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
        }),
      });

      if (!response.ok) {
        throw new Error(`reCAPTCHA verification failed: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        return {
          success: false,
          score: 0,
          action: action || this.options.action,
          error_codes: result['error-codes'],
        };
      }

      // Check action if provided
      if (action && result.action !== action) {
        return {
          success: false,
          score: result.score,
          action: result.action,
          error_codes: ['action-mismatch'],
        };
      }

      return {
        success: true,
        score: result.score,
        action: result.action,
      };
    } catch (error) {
      throw errorHandler.handleApiError(error, 'verifyRecaptchaToken');
    }
  }

  shouldSkip(request: NextRequest): boolean {
    const { pathname, method } = request;

    // Skip if method is in skip list
    if (this.options.skipMethods.includes(method)) {
      return true;
    }

    // Skip if path is in skip list
    if (this.options.skipPaths.some(path => pathname.startsWith(path))) {
      return true;
    }

    return false;
  }

  async middleware(request: NextRequest): Promise<NextResponse | null> {
    // Skip if should be skipped
    if (this.shouldSkip(request)) {
      return null;
    }

    try {
      // Get token from header
      const token = request.headers.get(this.options.headerName);
      
      if (!token) {
        return NextResponse.json(
          { 
            error: this.options.errorMessage,
            code: 'MISSING_RECAPTCHA_TOKEN',
            message: 'reCAPTCHA token is required in request headers',
          },
          { status: 400 }
        );
      }

      // Verify token
      const verification = await this.verifyToken(token, this.options.action);

      if (!verification.success) {
        return NextResponse.json(
          { 
            error: this.options.errorMessage,
            code: 'RECAPTCHA_VERIFICATION_FAILED',
            message: 'reCAPTCHA verification failed',
            details: verification.error_codes,
          },
          { status: 400 }
        );
      }

      if (verification.score < this.options.threshold) {
        return NextResponse.json(
          { 
            error: this.options.errorMessage,
            code: 'RECAPTCHA_SCORE_TOO_LOW',
            message: `reCAPTCHA score ${verification.score} is below threshold ${this.options.threshold}`,
            score: verification.score,
            threshold: this.options.threshold,
          },
          { status: 400 }
        );
      }

      // Add verification info to request headers for downstream use
      const response = NextResponse.next();
      response.headers.set('x-recaptcha-score', verification.score.toString());
      response.headers.set('x-recaptcha-action', verification.action);
      response.headers.set('x-recaptcha-verified', 'true');

      return response;
    } catch (error) {
      console.error('reCAPTCHA middleware error:', error);
      return NextResponse.json(
        { 
          error: 'Internal server error',
          code: 'RECAPTCHA_MIDDLEWARE_ERROR',
          message: 'An error occurred during reCAPTCHA verification',
        },
        { status: 500 }
      );
    }
  }

  // Helper function to create middleware for specific routes
  static createRouteMiddleware(options: RecaptchaMiddlewareOptions = {}) {
    const middleware = new RecaptchaMiddleware(options);
    return middleware.middleware.bind(middleware);
  }

  // Helper function to protect a specific API route
  static async protectRoute(
    request: NextRequest,
    options: RecaptchaMiddlewareOptions = {}
  ): Promise<{ success: boolean; response?: NextResponse; score?: number }> {
    const middleware = new RecaptchaMiddleware(options);
    
    if (middleware.shouldSkip(request)) {
      return { success: true };
    }

    const response = await middleware.middleware(request);
    
    if (response) {
      return { success: false, response };
    }

    const score = parseFloat(request.headers.get('x-recaptcha-score') || '0');
    return { success: true, score };
  }
}

// Export a default instance
export const recaptchaMiddleware = new RecaptchaMiddleware();

// Export helper functions
export const createRecaptchaMiddleware = RecaptchaMiddleware.createRouteMiddleware;
export const protectRoute = RecaptchaMiddleware.protectRoute;
