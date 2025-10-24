import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { enhancedRateLimitMiddleware } from './middleware/rateLimit';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/welcome',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/help',
  '/faq',
  '/blog(.*)',
  '/movie(.*)',
  '/tv(.*)',
  '/person(.*)',
  '/search(.*)',
  '/discover(.*)',
  '/trending(.*)',
  '/popular(.*)',
  '/top-rated(.*)',
  '/now-playing(.*)',
  '/upcoming(.*)',
  '/genre(.*)',
  '/decades(.*)',
  '/awards(.*)',
  '/box-office(.*)',
  '/festivals(.*)',
  '/studios(.*)',
  '/directors(.*)',
  '/crew(.*)',
  '/celebrity-news(.*)',
  '/indie-films(.*)',
  '/classics(.*)',
  '/streaming(.*)',
  '/languages(.*)',
  '/api/webhooks(.*)',
  '/api/analytics(.*)',
  '/api/admin/auth(.*)',
  '/api/tmdb(.*)',
  '/api/search(.*)',
  '/api/health(.*)',
  '/api/contact(.*)',
  '/api/og(.*)',
  '/api/ai/chat(.*)',
  '/api/ai/sentiment(.*)',
  '/api/ai/summary(.*)',
  '/api/ai/compare(.*)',
]);

// Define routes that require authentication
const isProtectedRoute = createRouteMatcher([
  // User profile and settings
  '/profile(.*)',
  '/settings(.*)',
  '/notifications(.*)',
  
  // User collections
  '/favorites(.*)',
  '/watchlist(.*)',
  '/history(.*)',
  '/collections(.*)',
  '/my-lists(.*)',
  
  // User activities
  '/reviews(.*)',
  '/ratings(.*)',
  '/notes(.*)',
  '/stats(.*)',
  '/recommendations(.*)',
  
  // Existing protected pages
  '/compare-movies(.*)',
  '/movie-quiz(.*)',
  '/movie-bingo(.*)',
  '/watch-party(.*)',
  '/achievement-badges(.*)',
  '/movie-journal(.*)',
  '/advanced-search(.*)',
  
  // NEW: User Profile & Personalization Features
  '/mood-board(.*)',
  '/viewing-timeline(.*)',
  '/movie-personality(.*)',
  '/custom-tags(.*)',
  '/movie-dna(.*)',
  '/viewing-streaks(.*)',
  '/profile-themes(.*)',
  '/bucket-list(.*)',
  
  // NEW: Social & Community Features
  '/movie-clubs(.*)',
  '/watch-together(.*)',
  '/movie-debates(.*)',
  '/fan-theories(.*)',
  '/challenges(.*)',
  '/user-rankings(.*)',
  '/movie-polls(.*)',
  '/friends-feed(.*)',
  
  // NEW: Gamification & Interactive Features
  '/trivia-tournaments(.*)',
  '/scene-recreation(.*)',
  '/quote-game(.*)',
  '/actor-connection(.*)',
  '/soundtrack-quiz(.*)',
  '/weekly-challenges(.*)',
  '/leaderboards(.*)',
  
  // NEW: Discovery & Recommendations Features
  '/mood-search(.*)',
  '/weather-recommendations(.*)',
  '/time-based-suggestions(.*)',
  '/occasion-finder(.*)',
  '/genre-mixer(.*)',
  '/hidden-gems(.*)',
  
  // NEW: Analytics & Insights Features
  '/viewing-analytics(.*)',
  '/prediction-tracker(.*)',
  '/release-calendar(.*)',
  '/franchise-tracker(.*)',
  '/rating-comparison(.*)',
  '/watch-time-calculator(.*)',
  
  // NEW: Creative & Content Features
  '/scripts-library(.*)',
  '/behind-scenes(.*)',
  '/movie-locations(.*)',
  '/costume-gallery(.*)',
  '/poster-generator(.*)',
  '/review-blog(.*)',
  '/video-reviews(.*)',
  '/mashups(.*)',
  
  // NEW: Notifications & Alerts
  '/alerts(.*)',
  
  // NEW: Lightweight Free-Tier Features
  '/quick-rate(.*)',
  '/movie-memory(.*)',
  '/movie-goals(.*)',
  '/movie-diary(.*)',
  '/personal-ratings(.*)',
  '/movie-notes(.*)',
  '/quick-lists(.*)',
  '/movie-calendar-view(.*)',
  '/binge-planner(.*)',
  '/quotes-collection(.*)',
  '/film-log(.*)',
  '/cinema-visits(.*)',
  '/director-explorer(.*)',
  '/decade-explorer(.*)',
  '/actor-filmography(.*)',
  '/genre-stats(.*)',
  '/runtime-analyzer(.*)',
  
  // Protected API routes
  '/api/profile(.*)',
  '/api/favorites(.*)',
  '/api/watchlist(.*)',
  '/api/history(.*)',
  '/api/reviews(.*)',
  '/api/ratings(.*)',
  '/api/notes(.*)',
  '/api/collections(.*)',
  '/api/user(.*)',
  '/api/ai/recommendations(.*)',
  '/api/ai/watch-suggestion(.*)',
  '/api/ai-enhanced(.*)',
  '/api/social(.*)',
  '/api/games(.*)',
  '/api/content(.*)',
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


  // Apply Clerk authentication with proper configuration
  return clerkMiddleware(async (auth, req) => {
    const { userId } = await auth();
    const { pathname } = req.nextUrl;
    
    // Protected routes require authentication
    if (isProtectedRoute(req) && !userId) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
    
    // Redirect authenticated users from welcome/sign-in/sign-up to home
    if ((pathname === '/welcome' || pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')) && userId) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    
    // Allow request to proceed
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
