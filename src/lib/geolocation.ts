import { NextRequest } from 'next/server';

export interface GeolocationData {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  timezone: string;
  isp: string;
  isVpn: boolean;
  isProxy: boolean;
  isTor: boolean;
  riskScore: number; // 0-100, higher = more risky
}

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // in milliseconds
  blockDuration: number; // in milliseconds
  countries: {
    [countryCode: string]: {
      maxRequests: number;
      windowMs: number;
      isBlocked: boolean;
      reason?: string;
    };
  };
  ipWhitelist: string[];
  ipBlacklist: string[];
}

// Default rate limit configuration
export const defaultRateLimitConfig: RateLimitConfig = {
  maxRequests: 100, // 100 requests per window
  windowMs: 15 * 60 * 1000, // 15 minutes
  blockDuration: 60 * 60 * 1000, // 1 hour block
  countries: {
    // High-risk countries with stricter limits
    'CN': { maxRequests: 50, windowMs: 15 * 60 * 1000, isBlocked: false },
    'RU': { maxRequests: 50, windowMs: 15 * 60 * 1000, isBlocked: false },
    'KP': { maxRequests: 10, windowMs: 60 * 60 * 1000, isBlocked: true, reason: 'Sanctions' },
    'IR': { maxRequests: 25, windowMs: 30 * 60 * 1000, isBlocked: false },
    'SY': { maxRequests: 25, windowMs: 30 * 60 * 1000, isBlocked: false },
    
    // Normal countries
    'US': { maxRequests: 200, windowMs: 15 * 60 * 1000, isBlocked: false },
    'GB': { maxRequests: 200, windowMs: 15 * 60 * 1000, isBlocked: false },
    'CA': { maxRequests: 200, windowMs: 15 * 60 * 1000, isBlocked: false },
    'AU': { maxRequests: 200, windowMs: 15 * 60 * 1000, isBlocked: false },
    'DE': { maxRequests: 200, windowMs: 15 * 60 * 1000, isBlocked: false },
    'FR': { maxRequests: 200, windowMs: 15 * 60 * 1000, isBlocked: false },
    'IN': { maxRequests: 10000, windowMs: 15 * 60 * 1000, isBlocked: false }, // India has unlimited access
  },
  ipWhitelist: [
    '127.0.0.1', // localhost
    '::1', // localhost IPv6
  ],
  ipBlacklist: [],
};

// In-memory storage for rate limiting (in production, use Redis)
const rateLimitStore = new Map<string, {
  count: number;
  resetTime: number;
  blockedUntil?: number;
  country: string;
  riskScore: number;
}>();

// IP Geolocation service
export class GeolocationService {
  private static instance: GeolocationService;
  private cache = new Map<string, GeolocationData>();

  static getInstance(): GeolocationService {
    if (!GeolocationService.instance) {
      GeolocationService.instance = new GeolocationService();
    }
    return GeolocationService.instance;
  }

  async getGeolocationData(ip: string): Promise<GeolocationData> {
    // Check cache first
    if (this.cache.has(ip)) {
      return this.cache.get(ip)!;
    }

    try {
      // Use multiple geolocation services for better accuracy
      const [ipapiData, ipinfoData] = await Promise.allSettled([
        this.fetchFromIpapi(ip),
        this.fetchFromIpinfo(ip),
      ]);

      let geolocationData: GeolocationData;

      if (ipapiData.status === 'fulfilled') {
        geolocationData = ipapiData.value;
      } else if (ipinfoData.status === 'fulfilled') {
        geolocationData = ipinfoData.value;
      } else {
        // Fallback to basic data
        geolocationData = this.getFallbackData(ip);
      }

      // Calculate risk score
      geolocationData.riskScore = this.calculateRiskScore(geolocationData);

      // Cache the result for 1 hour
      this.cache.set(ip, geolocationData);
      setTimeout(() => this.cache.delete(ip), 60 * 60 * 1000);

      return geolocationData;
    } catch (error) {
      console.error('Geolocation error:', error);
      return this.getFallbackData(ip);
    }
  }

  private async fetchFromIpapi(ip: string): Promise<GeolocationData> {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,city,timezone,isp,query,proxy,hosting`);
    const data = await response.json();

    if (data.status === 'fail') {
      throw new Error(data.message);
    }

    return {
      ip: data.query,
      country: data.country,
      countryCode: data.countryCode,
      region: data.region,
      city: data.city,
      timezone: data.timezone,
      isp: data.isp,
      isVpn: data.proxy || false,
      isProxy: data.proxy || false,
      isTor: false, // ip-api doesn't detect Tor
      riskScore: 0,
    };
  }

  private async fetchFromIpinfo(ip: string): Promise<GeolocationData> {
    // Note: ipinfo.io requires API key for production use
    const response = await fetch(`https://ipinfo.io/${ip}/json`);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return {
      ip: data.ip,
      country: data.country,
      countryCode: data.country,
      region: data.region,
      city: data.city,
      timezone: data.timezone,
      isp: data.org,
      isVpn: data.privacy?.vpn || false,
      isProxy: data.privacy?.proxy || false,
      isTor: data.privacy?.tor || false,
      riskScore: 0,
    };
  }

  private getFallbackData(ip: string): GeolocationData {
    return {
      ip,
      country: 'Unknown',
      countryCode: 'XX',
      region: 'Unknown',
      city: 'Unknown',
      timezone: 'UTC',
      isp: 'Unknown',
      isVpn: false,
      isProxy: false,
      isTor: false,
      riskScore: 50, // Medium risk for unknown
    };
  }

  private calculateRiskScore(data: GeolocationData): number {
    let score = 0;

    // VPN/Proxy/Tor detection
    if (data.isVpn) score += 30;
    if (data.isProxy) score += 25;
    if (data.isTor) score += 40;

    // High-risk countries
    const highRiskCountries = ['KP', 'IR', 'SY', 'AF', 'SO'];
    if (highRiskCountries.includes(data.countryCode)) {
      score += 20;
    }

    // Suspicious ISPs
    const suspiciousISPs = ['hosting', 'vpn', 'proxy', 'tor'];
    if (data.isp && suspiciousISPs.some(keyword => data.isp.toLowerCase().includes(keyword))) {
      score += 15;
    }

    // Private/Reserved IPs
    if (this.isPrivateIP(data.ip)) {
      score += 10;
    }

    return Math.min(score, 100);
  }

  private isPrivateIP(ip: string): boolean {
    const privateRanges = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^127\./,
      /^::1$/,
      /^fc00:/,
      /^fe80:/,
    ];
    return privateRanges.some(range => range.test(ip));
  }
}

// Rate limiting service
export class RateLimitService {
  private static instance: RateLimitService;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig = defaultRateLimitConfig) {
    this.config = config;
  }

  static getInstance(): RateLimitService {
    if (!RateLimitService.instance) {
      RateLimitService.instance = new RateLimitService();
    }
    return RateLimitService.instance;
  }

  async checkRateLimit(ip: string, geolocationData: GeolocationData): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
    reason?: string;
  }> {
    // Check IP whitelist
    if (this.config.ipWhitelist.includes(ip)) {
      return {
        allowed: true,
        remaining: Infinity,
        resetTime: Date.now() + this.config.windowMs,
      };
    }

    // Check IP blacklist
    if (this.config.ipBlacklist.includes(ip)) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + this.config.blockDuration,
        reason: 'IP address is blacklisted',
      };
    }

    // Check country blocking
    const countryConfig = this.config.countries[geolocationData.countryCode];
    if (countryConfig?.isBlocked) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + this.config.blockDuration,
        reason: `Country blocked: ${countryConfig.reason || 'Policy violation'}`,
      };
    }

    // Check if currently blocked
    const currentData = rateLimitStore.get(ip);
    if (currentData?.blockedUntil && Date.now() < currentData.blockedUntil) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: currentData.blockedUntil,
        reason: 'Temporarily blocked due to rate limit violation',
      };
    }

    // Get rate limit configuration for this IP/country
    const limitConfig = this.getLimitConfig(geolocationData);
    const now = Date.now();

    // Initialize or get current data
    if (!currentData || now >= currentData.resetTime) {
      // Reset or initialize
      rateLimitStore.set(ip, {
        count: 1,
        resetTime: now + limitConfig.windowMs,
        country: geolocationData.countryCode,
        riskScore: geolocationData.riskScore,
      });

      return {
        allowed: true,
        remaining: limitConfig.maxRequests - 1,
        resetTime: now + limitConfig.windowMs,
      };
    }

    // Check if limit exceeded
    if (currentData.count >= limitConfig.maxRequests) {
      // Block the IP
      currentData.blockedUntil = now + this.config.blockDuration;
      rateLimitStore.set(ip, currentData);

      return {
        allowed: false,
        remaining: 0,
        resetTime: currentData.blockedUntil,
        reason: 'Rate limit exceeded',
      };
    }

    // Increment counter
    currentData.count++;
    rateLimitStore.set(ip, currentData);

    return {
      allowed: true,
      remaining: limitConfig.maxRequests - currentData.count,
      resetTime: currentData.resetTime,
    };
  }

  private getLimitConfig(geolocationData: GeolocationData): {
    maxRequests: number;
    windowMs: number;
  } {
    const countryConfig = this.config.countries[geolocationData.countryCode];
    
    if (countryConfig) {
      return {
        maxRequests: countryConfig.maxRequests,
        windowMs: countryConfig.windowMs,
      };
    }

    // Default configuration with risk-based adjustments
    let maxRequests = this.config.maxRequests;
    let windowMs = this.config.windowMs;

    // Adjust based on risk score
    if (geolocationData.riskScore > 70) {
      maxRequests = Math.floor(maxRequests * 0.3); // 30% of normal limit
      windowMs = windowMs * 2; // Double the window
    } else if (geolocationData.riskScore > 40) {
      maxRequests = Math.floor(maxRequests * 0.6); // 60% of normal limit
      windowMs = Math.floor(windowMs * 1.5); // 1.5x the window
    }

    return { maxRequests, windowMs };
  }

  // Admin functions
  blockIP(ip: string, duration: number = this.config.blockDuration): void {
    this.config.ipBlacklist.push(ip);
    const currentData = rateLimitStore.get(ip);
    if (currentData) {
      currentData.blockedUntil = Date.now() + duration;
      rateLimitStore.set(ip, currentData);
    }
  }

  unblockIP(ip: string): void {
    this.config.ipBlacklist = this.config.ipBlacklist.filter(i => i !== ip);
    const currentData = rateLimitStore.get(ip);
    if (currentData) {
      delete currentData.blockedUntil;
      rateLimitStore.set(ip, currentData);
    }
  }

  blockCountry(countryCode: string, reason: string = 'Policy violation'): void {
    this.config.countries[countryCode] = {
      maxRequests: 0,
      windowMs: this.config.windowMs,
      isBlocked: true,
      reason,
    };
  }

  unblockCountry(countryCode: string): void {
    if (this.config.countries[countryCode]) {
      this.config.countries[countryCode].isBlocked = false;
      delete this.config.countries[countryCode].reason;
    }
  }

  getRateLimitStats(): {
    totalIPs: number;
    blockedIPs: number;
    topCountries: Array<{ country: string; count: number }>;
    topISPs: Array<{ isp: string; count: number }>;
  } {
    const stats = {
      totalIPs: rateLimitStore.size,
      blockedIPs: 0,
      topCountries: [] as Array<{ country: string; count: number }>,
      topISPs: [] as Array<{ isp: string; count: number }>,
    };

    const countryCounts = new Map<string, number>();
    const ispCounts = new Map<string, number>();

    for (const [ip, data] of rateLimitStore) {
      if (data.blockedUntil && Date.now() < data.blockedUntil) {
        stats.blockedIPs++;
      }

      countryCounts.set(data.country, (countryCounts.get(data.country) || 0) + 1);
    }

    stats.topCountries = Array.from(countryCounts.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return stats;
  }
}

// Utility function to get client IP from Next.js request
export function getClientIP(request: NextRequest): string {
  // Check various headers for the real IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  // Fallback to connection remote address
  return request.ip || '127.0.0.1';
}
