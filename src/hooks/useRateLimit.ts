'use client';

import { useState, useEffect, useCallback } from 'react';

interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: number;
  country: string;
  riskScore: number;
  isBlocked: boolean;
  retryAfter?: number;
}

interface RateLimitError {
  error: string;
  message: string;
  retryAfter: number;
  country: string;
  ip: string;
}

export function useRateLimit() {
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkRateLimit = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Make a test request to get rate limit headers
      const response = await fetch('/api/test-rate-limit', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const headers = response.headers;
      const limit = parseInt(headers.get('X-RateLimit-Limit') || '0');
      const remaining = parseInt(headers.get('X-RateLimit-Remaining') || '0');
      const resetTime = parseInt(headers.get('X-RateLimit-Reset') || '0');
      const country = headers.get('X-Client-Country') || 'Unknown';
      const riskScore = parseInt(headers.get('X-Client-Risk-Score') || '0');

      setRateLimitInfo({
        limit,
        remaining,
        resetTime,
        country,
        riskScore,
        isBlocked: response.status === 429,
        retryAfter: response.status === 429 ? parseInt(headers.get('Retry-After') || '0') : undefined,
      });

      if (response.status === 429) {
        const errorData: RateLimitError = await response.json();
        setError(errorData.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check rate limit');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const makeRequest = useCallback(async (
    url: string, 
    options: RequestInit = {}
  ): Promise<Response> => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      // Update rate limit info from response headers
      const headers = response.headers;
      const limit = parseInt(headers.get('X-RateLimit-Limit') || '0');
      const remaining = parseInt(headers.get('X-RateLimit-Remaining') || '0');
      const resetTime = parseInt(headers.get('X-RateLimit-Reset') || '0');
      const country = headers.get('X-Client-Country') || 'Unknown';
      const riskScore = parseInt(headers.get('X-Client-Risk-Score') || '0');

      setRateLimitInfo({
        limit,
        remaining,
        resetTime,
        country,
        riskScore,
        isBlocked: response.status === 429,
        retryAfter: response.status === 429 ? parseInt(headers.get('Retry-After') || '0') : undefined,
      });

      if (response.status === 429) {
        const errorData: RateLimitError = await response.json();
        setError(errorData.message);
        throw new Error(errorData.message);
      }

      return response;
    } catch (err) {
      if (err instanceof Error && err.message.includes('Rate limit')) {
        throw err;
      }
      setError(err instanceof Error ? err.message : 'Request failed');
      throw err;
    }
  }, []);

  const getTimeUntilReset = useCallback(() => {
    if (!rateLimitInfo?.resetTime) return 0;
    return Math.max(0, rateLimitInfo.resetTime - Date.now());
  }, [rateLimitInfo]);

  const getFormattedTimeUntilReset = useCallback(() => {
    const timeUntilReset = getTimeUntilReset();
    if (timeUntilReset <= 0) return 'Reset now';
    
    const minutes = Math.floor(timeUntilReset / (1000 * 60));
    const seconds = Math.floor((timeUntilReset % (1000 * 60)) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  }, [getTimeUntilReset]);

  const getRiskLevel = useCallback(() => {
    if (!rateLimitInfo?.riskScore) return 'unknown';
    
    if (rateLimitInfo.riskScore >= 70) return 'high';
    if (rateLimitInfo.riskScore >= 40) return 'medium';
    return 'low';
  }, [rateLimitInfo]);

  const getRiskColor = useCallback(() => {
    const level = getRiskLevel();
    switch (level) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  }, [getRiskLevel]);

  useEffect(() => {
    // Check rate limit on mount
    checkRateLimit();
  }, [checkRateLimit]);

  return {
    rateLimitInfo,
    isLoading,
    error,
    checkRateLimit,
    makeRequest,
    getTimeUntilReset,
    getFormattedTimeUntilReset,
    getRiskLevel,
    getRiskColor,
    isBlocked: rateLimitInfo?.isBlocked || false,
    remaining: rateLimitInfo?.remaining || 0,
    limit: rateLimitInfo?.limit || 0,
    country: rateLimitInfo?.country || 'Unknown',
    riskScore: rateLimitInfo?.riskScore || 0,
  };
}
