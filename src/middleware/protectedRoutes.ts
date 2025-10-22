/**
 * Protected Routes Configuration
 * Defines which routes require authentication
 */

export const protectedRoutes = [
  // User-specific pages
  '/profile',
  '/profile/manage',
  '/favorites',
  '/watchlist',
  '/history',
  '/settings',
  '/collections',
  '/stats',
  '/notifications',
  
  // User data pages
  '/reviews',
  '/ratings',
  '/notes',
  
  // API routes that use user data
  '/api/profile',
  '/api/favorites',
  '/api/watchlist',
  '/api/history',
  '/api/reviews',
  '/api/ratings',
  '/api/notes',
  '/api/collections',
  '/api/user',
  
  // AI features that require authentication
  '/api/ai/recommendations',
  '/api/ai/watch-suggestion',
  
  // Admin routes
  '/admin',
  '/api/admin',
];

export const publicRoutes = [
  '/',
  '/sign-in',
  '/sign-up',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/help',
  '/faq',
  '/blog',
  
  // Public content pages
  '/movie',
  '/tv',
  '/person',
  '/search',
  '/discover',
  '/trending',
  '/popular',
  '/top-rated',
  '/now-playing',
  '/upcoming',
  '/genre',
  '/decades',
  '/awards',
  '/box-office',
  '/festivals',
  '/studios',
  '/directors',
  '/crew',
  '/celebrity-news',
  '/indie-films',
  '/classics',
  '/streaming',
  '/languages',
  
  // Public API routes
  '/api/tmdb',
  '/api/search',
  '/api/ai/chat',
  '/api/ai/sentiment',
  '/api/ai/summary',
  '/api/ai/compare',
  '/api/health',
  '/api/contact',
  
  // Static files
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/_next',
  '/api/og',
];

export function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => pathname.startsWith(route));
}

export function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => pathname.startsWith(route));
}

export function shouldRedirectToSignIn(pathname: string, isSignedIn: boolean): boolean {
  if (isSignedIn) return false;
  if (isPublicRoute(pathname)) return false;
  return isProtectedRoute(pathname);
}

