import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/adminAuth';

// Default rate limit configuration
const DEFAULT_CONFIG = {
  ipRateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    enabled: true,
  },
  countryRateLimit: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 1000,
    enabled: true,
  },
  tmdbRateLimit: {
    delayMs: 200, // 200ms between requests
    maxRequestsPerSecond: 4,
    enabled: true,
  },
  globalRateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 1000,
    enabled: true,
  },
};

// In-memory storage for rate limit configuration
let rateLimitConfig = { ...DEFAULT_CONFIG };

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json(
        { error: 'Admin authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({ config: rateLimitConfig });
  } catch (error) {
    console.error('Error fetching rate limit config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch configuration' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check admin authentication
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json(
        { error: 'Admin authentication required' },
        { status: 401 }
      );
    }
    
    const updates = await request.json();
    
    // Validate the configuration
    const validation = validateRateLimitConfig(updates);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Invalid configuration', details: validation.errors },
        { status: 400 }
      );
    }
    
    // Update configuration
    rateLimitConfig = { ...rateLimitConfig, ...updates };
    
    return NextResponse.json({ 
      success: true, 
      config: rateLimitConfig,
      message: 'Rate limit configuration updated successfully'
    });
  } catch (error) {
    console.error('Error updating rate limit config:', error);
    return NextResponse.json(
      { error: 'Failed to update configuration' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json(
        { error: 'Admin authentication required' },
        { status: 401 }
      );
    }
    
    const { action } = await request.json();
    
    if (action === 'reset') {
      rateLimitConfig = { ...DEFAULT_CONFIG };
      return NextResponse.json({ 
        success: true, 
        config: rateLimitConfig,
        message: 'Rate limit configuration reset to defaults'
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error processing rate limit config action:', error);
    return NextResponse.json(
      { error: 'Failed to process action' },
      { status: 500 }
    );
  }
}

function validateRateLimitConfig(config: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validate IP rate limit
  if (config.ipRateLimit) {
    if (config.ipRateLimit.windowMs && (config.ipRateLimit.windowMs < 1000 || config.ipRateLimit.windowMs > 3600000)) {
      errors.push('IP rate limit window must be between 1 second and 1 hour');
    }
    if (config.ipRateLimit.maxRequests && (config.ipRateLimit.maxRequests < 1 || config.ipRateLimit.maxRequests > 10000)) {
      errors.push('IP rate limit max requests must be between 1 and 10000');
    }
  }
  
  // Validate country rate limit
  if (config.countryRateLimit) {
    if (config.countryRateLimit.windowMs && (config.countryRateLimit.windowMs < 1000 || config.countryRateLimit.windowMs > 3600000)) {
      errors.push('Country rate limit window must be between 1 second and 1 hour');
    }
    if (config.countryRateLimit.maxRequests && (config.countryRateLimit.maxRequests < 1 || config.countryRateLimit.maxRequests > 100000)) {
      errors.push('Country rate limit max requests must be between 1 and 100000');
    }
  }
  
  // Validate TMDB rate limit
  if (config.tmdbRateLimit) {
    if (config.tmdbRateLimit.delayMs && (config.tmdbRateLimit.delayMs < 100 || config.tmdbRateLimit.delayMs > 5000)) {
      errors.push('TMDB rate limit delay must be between 100ms and 5000ms');
    }
    if (config.tmdbRateLimit.maxRequestsPerSecond && (config.tmdbRateLimit.maxRequestsPerSecond < 1 || config.tmdbRateLimit.maxRequestsPerSecond > 10)) {
      errors.push('TMDB rate limit max requests per second must be between 1 and 10');
    }
  }
  
  // Validate global rate limit
  if (config.globalRateLimit) {
    if (config.globalRateLimit.windowMs && (config.globalRateLimit.windowMs < 1000 || config.globalRateLimit.windowMs > 3600000)) {
      errors.push('Global rate limit window must be between 1 second and 1 hour');
    }
    if (config.globalRateLimit.maxRequests && (config.globalRateLimit.maxRequests < 1 || config.globalRateLimit.maxRequests > 100000)) {
      errors.push('Global rate limit max requests must be between 1 and 100000');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
