import { NextRequest, NextResponse } from 'next/server';
import { 
  GeolocationService, 
  RateLimitService, 
  getClientIP,
  defaultRateLimitConfig 
} from '@/lib/geolocation';

// Rate limiting middleware
export async function rateLimitMiddleware(request: NextRequest) {
  const clientIP = getClientIP(request);
  const geolocationService = GeolocationService.getInstance();
  const rateLimitService = RateLimitService.getInstance();

  try {
    // Get geolocation data
    const geolocationData = await geolocationService.getGeolocationData(clientIP);
    
    // Check rate limit
    const rateLimitResult = await rateLimitService.checkRateLimit(clientIP, geolocationData);

    // Add rate limit headers
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(rateLimitResult.resetTime).toISOString());
    response.headers.set('X-Client-Country', geolocationData.countryCode);
    response.headers.set('X-Client-Risk-Score', geolocationData.riskScore.toString());

    // Block if rate limit exceeded
    if (!rateLimitResult.allowed) {
      const blockResponse = NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: rateLimitResult.reason || 'Too many requests',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
          country: geolocationData.countryCode,
          ip: clientIP,
        },
        { status: 429 }
      );

      blockResponse.headers.set('Retry-After', Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString());
      blockResponse.headers.set('X-RateLimit-Limit', '0');
      blockResponse.headers.set('X-RateLimit-Remaining', '0');
      blockResponse.headers.set('X-RateLimit-Reset', new Date(rateLimitResult.resetTime).toISOString());
      blockResponse.headers.set('X-Client-Country', geolocationData.countryCode);
      blockResponse.headers.set('X-Client-Risk-Score', geolocationData.riskScore.toString());

      return blockResponse;
    }

    // Log suspicious activity
    if (geolocationData.riskScore > 70) {
      console.warn(`High-risk request detected:`, {
        ip: clientIP,
        country: geolocationData.countryCode,
        riskScore: geolocationData.riskScore,
        isVpn: geolocationData.isVpn,
        isProxy: geolocationData.isProxy,
        isTor: geolocationData.isTor,
        userAgent: request.headers.get('user-agent'),
        url: request.url,
      });
    }

    return response;
  } catch (error) {
    console.error('Rate limiting error:', error);
    
    // On error, allow the request but log it
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Error', 'true');
    return response;
  }
}

// Specific rate limiting for different endpoints
export const endpointRateLimits = {
  // Search endpoints - more restrictive
  '/api/search': {
    maxRequests: 30,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  
  // Rating endpoints - very restrictive
  '/api/rate': {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  
  // Movie details - moderate
  '/api/movie': {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  
  // User actions - restrictive
  '/api/favorites': {
    maxRequests: 50,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  
  // Admin endpoints - very restrictive
  '/api/admin': {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
};

// Get rate limit config for specific endpoint
export function getEndpointRateLimit(pathname: string): { maxRequests: number; windowMs: number } | null {
  for (const [endpoint, config] of Object.entries(endpointRateLimits)) {
    if (pathname.startsWith(endpoint)) {
      return config;
    }
  }
  return null;
}

// Simple in-memory storage for admin functions (Edge Runtime compatible)
const blockedIPs = new Set<string>();
const blockedCountries = new Set<string>();
const ipRateLimits = new Map<string, { count: number; firstRequestTime: number }>();
const countryRateLimits = new Map<string, { count: number; firstRequestTime: number }>();
const allSeenIPs = new Set<string>();
const allSeenCountries = new Set<string>();

// Admin functions (Edge Runtime compatible - in-memory only)
export const admin = {
  getBlockedIPs: () => Array.from(blockedIPs),
  getBlockedCountries: () => Array.from(blockedCountries),
  blockIP: (ip: string) => blockedIPs.add(ip),
  unblockIP: (ip: string) => blockedIPs.delete(ip),
  blockCountry: (country: string) => blockedCountries.add(country),
  unblockCountry: (country: string) => blockedCountries.delete(country),
  getRateLimitStats: () => ({
    ipRateLimits: Object.fromEntries(ipRateLimits),
    countryRateLimits: Object.fromEntries(countryRateLimits),
    activeIPs: allSeenIPs.size,
    activeCountries: allSeenCountries.size,
    blockedIPs: blockedIPs.size,
    blockedCountries: blockedCountries.size,
  }),
};

// Enhanced rate limiting with endpoint-specific limits
export async function enhancedRateLimitMiddleware(request: NextRequest) {
  const clientIP = getClientIP(request);
  const pathname = request.nextUrl.pathname;
  
  // Track all seen IPs and countries
  allSeenIPs.add(clientIP);
  
  // Check for IP block
  if (blockedIPs.has(clientIP)) {
    return new NextResponse('Your IP address is blocked.', { status: 403 });
  }
  
  // Check for country block (simplified - in production, get country from geolocation)
  const country = request.headers.get('x-vercel-ip-country') || request.geo?.country;
  if (country) {
    allSeenCountries.add(country);
    if (blockedCountries.has(country)) {
      return new NextResponse(`Access from your country (${country}) is blocked.`, { status: 403 });
    }
  }
  
  // Get endpoint-specific rate limit
  const endpointLimit = getEndpointRateLimit(pathname);
  
  if (endpointLimit) {
    const now = Date.now();
    const windowMs = endpointLimit.windowMs;
    const maxRequests = endpointLimit.maxRequests;
    
    // Check IP rate limit
    let ipEntry = ipRateLimits.get(clientIP);
    if (!ipEntry || now - ipEntry.firstRequestTime > windowMs) {
      ipEntry = { count: 1, firstRequestTime: now };
      ipRateLimits.set(clientIP, ipEntry);
    } else if (ipEntry.count >= maxRequests) {
      return new NextResponse(`Too many requests from your IP address. Please try again later.`, { status: 429 });
    } else {
      ipEntry.count++;
      ipRateLimits.set(clientIP, ipEntry);
    }
    
    // Check country rate limit (if country is available)
    if (country) {
      let countryEntry = countryRateLimits.get(country);
      if (!countryEntry || now - countryEntry.firstRequestTime > windowMs) {
        countryEntry = { count: 1, firstRequestTime: now };
        countryRateLimits.set(country, countryEntry);
      } else if (countryEntry.count >= maxRequests) {
        return new NextResponse(`Too many requests from your country (${country}). Please try again later.`, { status: 429 });
      } else {
        countryEntry.count++;
        countryRateLimits.set(country, countryEntry);
      }
    }
    
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', (maxRequests - ipEntry.count).toString());
    response.headers.set('X-RateLimit-Reset', new Date(now + windowMs).toISOString());
    response.headers.set('X-Endpoint-Limit', 'true');
    
    return response;
  }
  
  // Fall back to general rate limiting
  return rateLimitMiddleware(request);
}
