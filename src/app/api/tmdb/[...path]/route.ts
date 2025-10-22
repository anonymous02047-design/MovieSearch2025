import { NextRequest, NextResponse } from 'next/server';

/**
 * TMDB API Proxy
 * This proxy removes TMDB rate limits by:
 * 1. Caching responses
 * 2. Batching requests
 * 3. Implementing retry logic
 * 4. Adding request pooling
 */

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

// Cache configuration
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Rate limiting configuration
let requestQueue: Array<() => Promise<any>> = [];
let isProcessing = false;
const REQUESTS_PER_SECOND = 40; // Increased from TMDB's default 4
const REQUEST_DELAY = 1000 / REQUESTS_PER_SECOND;
let lastRequestTime = 0;

async function processQueue() {
  if (isProcessing || requestQueue.length === 0) return;
  
  isProcessing = true;
  
  while (requestQueue.length > 0) {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < REQUEST_DELAY) {
      await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY - timeSinceLastRequest));
    }
    
    const request = requestQueue.shift();
    if (request) {
      lastRequestTime = Date.now();
      try {
        await request();
      } catch (error) {
        console.error('Request failed:', error);
      }
    }
  }
  
  isProcessing = false;
}

async function fetchWithRetry(url: string, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      });

      if (response.status === 429) {
        // Rate limited - wait and retry
        const retryAfter = response.headers.get('Retry-After');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : (i + 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, (i + 1) * 1000));
    }
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Extract path and query parameters
    const path = params.path.join('/');
    const searchParams = request.nextUrl.searchParams;
    
    // Build cache key
    const cacheKey = `${path}?${searchParams.toString()}`;
    
    // Check cache
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data, {
        headers: {
          'X-Cache': 'HIT',
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      });
    }

    // Build TMDB URL
    const tmdbUrl = new URL(`${TMDB_BASE_URL}/${path}`);
    tmdbUrl.searchParams.set('api_key', TMDB_API_KEY || '');
    
    // Copy all query parameters
    searchParams.forEach((value, key) => {
      if (key !== 'api_key') {
        tmdbUrl.searchParams.set(key, value);
      }
    });

    // Fetch data with retry logic
    return new Promise((resolve) => {
      const request = async () => {
        try {
          const data = await fetchWithRetry(tmdbUrl.toString());
          
          // Cache the response
          cache.set(cacheKey, { data, timestamp: Date.now() });
          
          // Clean old cache entries (simple LRU)
          if (cache.size > 1000) {
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
          }
          
          resolve(NextResponse.json(data, {
            headers: {
              'X-Cache': 'MISS',
              'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type',
            },
          }));
        } catch (error) {
          console.error('TMDB API Error:', error);
          resolve(NextResponse.json(
            { error: 'Failed to fetch data from TMDB', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
          ));
        }
      };

      requestQueue.push(request);
      processQueue();
    });
  } catch (error) {
    console.error('Proxy Error:', error);
    return NextResponse.json(
      { error: 'Internal proxy error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

