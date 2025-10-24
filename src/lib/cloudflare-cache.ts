/**
 * Cloudflare Edge Caching Utilities
 * Optimized for Cloudflare Free Tier
 */

// Check if we're in Cloudflare Workers environment
const isCloudflareWorker = typeof caches !== 'undefined';

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  key?: string; // Custom cache key
  tags?: string[]; // Cache tags for purging
}

/**
 * Cache API response using Cloudflare's Cache API
 */
export async function cacheResponse(
  request: Request | string,
  response: Response,
  options: CacheOptions = {}
): Promise<Response> {
  if (!isCloudflareWorker) return response;

  const { ttl = 3600, key } = options;
  
  try {
    const cache = await caches.open('api-cache');
    const cacheKey = key || (typeof request === 'string' ? request : request.url);
    
    // Clone response and add cache headers
    const responseToCache = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: new Headers({
        ...Object.fromEntries(response.headers),
        'Cache-Control': `public, max-age=${ttl}`,
        'X-Cache': 'MISS',
        'X-Cache-Time': new Date().toISOString(),
      }),
    });

    await cache.put(cacheKey, responseToCache.clone());
    return responseToCache;
  } catch (error) {
    console.error('Cache error:', error);
    return response;
  }
}

/**
 * Get cached response
 */
export async function getCachedResponse(
  request: Request | string
): Promise<Response | undefined> {
  if (!isCloudflareWorker) return undefined;

  try {
    const cache = await caches.open('api-cache');
    const cached = await cache.match(request);
    
    if (cached) {
      // Add cache hit header
      const headers = new Headers(cached.headers);
      headers.set('X-Cache', 'HIT');
      
      return new Response(cached.body, {
        status: cached.status,
        statusText: cached.statusText,
        headers,
      });
    }
  } catch (error) {
    console.error('Cache retrieval error:', error);
  }
  
  return undefined;
}

/**
 * Purge cache by key or pattern
 */
export async function purgeCache(keyOrPattern: string): Promise<void> {
  if (!isCloudflareWorker) return;

  try {
    const cache = await caches.open('api-cache');
    await cache.delete(keyOrPattern);
  } catch (error) {
    console.error('Cache purge error:', error);
  }
}

/**
 * Cloudflare KV storage wrapper (requires Workers KV)
 */
export class CloudflareKV {
  private namespace: any;

  constructor(namespace?: any) {
    this.namespace = namespace;
  }

  async get(key: string): Promise<string | null> {
    if (!this.namespace) return null;
    try {
      return await this.namespace.get(key);
    } catch {
      return null;
    }
  }

  async put(key: string, value: string, expirationTtl?: number): Promise<void> {
    if (!this.namespace) return;
    try {
      await this.namespace.put(key, value, { expirationTtl });
    } catch (error) {
      console.error('KV put error:', error);
    }
  }

  async delete(key: string): Promise<void> {
    if (!this.namespace) return;
    try {
      await this.namespace.delete(key);
    } catch (error) {
      console.error('KV delete error:', error);
    }
  }
}

/**
 * Cloudflare Durable Objects wrapper (for real-time features)
 */
export class CloudflareDurableObject {
  private state: any;
  private env: any;

  constructor(state: any, env: any) {
    this.state = state;
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    // Handle WebSocket connections
    const upgradeHeader = request.headers.get('Upgrade');
    if (upgradeHeader === 'websocket') {
      return this.handleWebSocket(request);
    }

    return new Response('Not implemented', { status: 501 });
  }

  private async handleWebSocket(request: Request): Promise<Response> {
    // WebSocket handling logic
    // Note: WebSocketPair is only available in Cloudflare Workers
    // This is a placeholder for when deployed to Cloudflare
    
    return new Response('WebSocket upgrade not available in this environment', {
      status: 426,
    });
  }
}

/**
 * Edge function for Cloudflare Pages
 */
export async function onRequest(context: any): Promise<Response> {
  const { request, env, next } = context;
  
  // Try to get cached response
  const cached = await getCachedResponse(request);
  if (cached) {
    return cached;
  }

  // Get fresh response
  const response = await next();

  // Cache if successful
  if (response.ok) {
    return cacheResponse(request, response, { ttl: 3600 });
  }

  return response;
}

export default {
  cacheResponse,
  getCachedResponse,
  purgeCache,
  CloudflareKV,
  CloudflareDurableObject,
  onRequest,
};

