import { NextRequest, NextResponse } from 'next/server';

interface RecaptchaMiddlewareOptions {
  skipRoutes?: string[];
  requiredActions?: string[];
  minScore?: number;
}

export function createRecaptchaMiddleware(options: RecaptchaMiddlewareOptions = {}) {
  const {
    skipRoutes = ['/api/analytics', '/api/webhooks', '/api/admin/auth'],
    requiredActions = ['general', 'search', 'contact', 'signup', 'signin'],
    minScore = 0.5,
  } = options;

  return async function recaptchaMiddleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip reCAPTCHA for certain routes
    if (skipRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.next();
    }

    // Only apply to POST, PUT, DELETE requests
    if (!['POST', 'PUT', 'DELETE'].includes(request.method)) {
      return NextResponse.next();
    }

    try {
      // Extract reCAPTCHA token from headers or body
      const recaptchaToken = 
        request.headers.get('x-recaptcha-token') ||
        request.headers.get('recaptcha-token');

      if (!recaptchaToken) {
        console.warn('reCAPTCHA token not provided, skipping verification');
        return NextResponse.next();
      }

      // Verify the token with Google's reCAPTCHA API
      const secretKey = process.env.RECAPTCHA_SECRET_KEY;
      if (!secretKey) {
        console.warn('reCAPTCHA secret key not configured, skipping verification');
        return NextResponse.next();
      }

      const verificationResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          secret: secretKey,
          response: recaptchaToken,
          remoteip: request.ip || request.headers.get('x-forwarded-for') || '',
        }),
      });

      const verification = await verificationResponse.json();
      
      if (!verification.success) {
        return NextResponse.json(
          { error: 'reCAPTCHA verification failed', details: verification['error-codes'] },
          { status: 400 }
        );
      }

      // Check action if specified
      if (verification.action && !requiredActions.includes(verification.action)) {
        return NextResponse.json(
          { error: 'Invalid reCAPTCHA action' },
          { status: 400 }
        );
      }

      // Check score if available
      if (verification.score !== undefined && verification.score < minScore) {
        return NextResponse.json(
          { error: 'reCAPTCHA score too low' },
          { status: 400 }
        );
      }

      // Add verification info to headers for the API route
      const response = NextResponse.next();
      response.headers.set('x-recaptcha-verified', 'true');
      response.headers.set('x-recaptcha-score', verification.score?.toString() || '');
      response.headers.set('x-recaptcha-action', verification.action || '');

      return response;
    } catch (error) {
      console.error('reCAPTCHA middleware error:', error);
      return NextResponse.json(
        { error: 'reCAPTCHA verification error' },
        { status: 500 }
      );
    }
  };
}

// Default middleware instance
export const recaptchaMiddleware = createRecaptchaMiddleware();

