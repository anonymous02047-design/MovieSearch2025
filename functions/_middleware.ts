/**
 * Cloudflare Pages Functions Middleware
 * Global middleware for all functions
 */

interface Env {
  ASSETS: any;
  [key: string]: any;
}

interface Context {
  request: Request;
  env: Env;
  params: Record<string, string>;
  next: () => Promise<Response>;
  waitUntil: (promise: Promise<any>) => void;
  passThroughOnException: () => void;
}

/**
 * Main middleware handler
 */
export async function onRequest(context: Context): Promise<Response> {
  const { request, next } = context;
  
  // Add security headers
  const response = await next();
  
  const newHeaders = new Headers(response.headers);
  newHeaders.set('X-Frame-Options', 'SAMEORIGIN');
  newHeaders.set('X-Content-Type-Options', 'nosniff');
  newHeaders.set('X-XSS-Protection', '1; mode=block');
  newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Add CORS headers if needed
  if (request.method === 'OPTIONS') {
    newHeaders.set('Access-Control-Allow-Origin', '*');
    newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    newHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

