import { authMiddleware } from '@clerk/nextjs';

// Public routes that don't require authentication
export const publicRoutes = [
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/about',
  '/contact',
  '/movie/:id',
  '/tv/:id',
  '/person/:id',
  '/genres',
  '/actors',
  '/browse',
  '/discover',
  '/trending',
  '/api/contact',
  '/api/og',
];

// Routes that should be protected
export const protectedRoutes = [
  '/profile',
  '/profile/manage',
  '/favorites',
  '/watchlist',
  '/history',
  '/settings',
  '/stats',
  '/collections',
  '/advanced-search',
];

// Admin routes
export const adminRoutes = [
  '/admin',
  '/admin/dashboard',
  '/admin/analytics',
  '/admin/login',
];

export default authMiddleware({
  publicRoutes: publicRoutes,
  ignoredRoutes: [
    '/api/recaptcha',
    '/api/media/(.*)',
    '/_next/(.*)',
    '/static/(.*)',
    '/favicon.ico',
    '/manifest.webmanifest',
    '/robots.txt',
    '/sitemap.xml',
  ],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};

