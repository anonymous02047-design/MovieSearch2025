import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { enhancedRateLimitMiddleware } from './middleware/rateLimit';
import { recaptchaMiddleware } from './middleware/recaptchaMiddleware';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/welcome',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/api/analytics(.*)', // Allow analytics API without Clerk auth
  '/api/admin/auth(.*)', // Allow admin auth APIs
]);

// Define routes that should skip rate limiting
const skipRateLimitRoutes = createRouteMatcher([
  '/api/webhooks(.*)',
  '/_next(.*)',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/admin/login',
  '/api/admin/auth(.*)',
  '/api/analytics(.*)',
]);

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // For admin routes, apply minimal tracking but skip authentication and rate limiting
  if (pathname.startsWith('/admin')) {
    // Apply minimal rate limiting just for tracking purposes
    const rateLimitResponse = await enhancedRateLimitMiddleware(req);
    if (rateLimitResponse.status === 429 || rateLimitResponse.status === 403) {
      // Allow admin routes even if rate limited
      return NextResponse.next();
    }
    return NextResponse.next();
  }

  // For admin API routes, apply minimal tracking but skip authentication and rate limiting
  if (pathname.startsWith('/api/admin')) {
    // Apply minimal rate limiting just for tracking purposes
    const rateLimitResponse = await enhancedRateLimitMiddleware(req);
    if (rateLimitResponse.status === 429 || rateLimitResponse.status === 403) {
      // Allow admin API routes even if rate limited
      return NextResponse.next();
    }
    return NextResponse.next();
  }

  // Skip ALL middleware for analytics API routes
  if (pathname.startsWith('/api/analytics')) {
    return NextResponse.next();
  }

  // Apply rate limiting first (except for certain routes)
  if (!skipRateLimitRoutes(req)) {
    const rateLimitResponse = await enhancedRateLimitMiddleware(req);
    if (rateLimitResponse.status === 429) {
      return rateLimitResponse;
    }
  }

  // Apply reCAPTCHA protection only for specific API routes that need it
  const recaptchaProtectedRoutes = [
    '/api/contact',
    '/api/profile',
    '/api/recaptcha/verify'
  ];
  
  if (pathname.startsWith('/api/') && recaptchaProtectedRoutes.some(route => pathname.startsWith(route))) {
    const recaptchaResponse = await recaptchaMiddleware(req);
    if (recaptchaResponse.status !== 200) {
      return recaptchaResponse;
    }
  }

  // Apply Clerk authentication with proper configuration
  return clerkMiddleware((auth, req) => {
    const { userId } = auth();
    
    // For API routes, let them handle their own authentication
    if (req.nextUrl.pathname.startsWith('/api/')) {
      // Skip middleware authentication for all API routes
      // Let the individual API routes handle their own auth
      return NextResponse.next();
    }
    
    // Handle redirects for specific pages
    // Redirect authenticated users from welcome page to home
    if (req.nextUrl.pathname === '/welcome' && userId) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    
    // Allow all page routes - let components handle authentication
    return NextResponse.next();
  })(req);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/analytics (analytics API routes)
     * - api/webhooks (webhook routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/analytics|api/webhooks).*)',
  ],
};
