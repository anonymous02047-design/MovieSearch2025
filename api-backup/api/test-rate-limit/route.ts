import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // This endpoint is used to test rate limiting
  // The actual rate limiting is handled by the middleware
  
  return NextResponse.json({
    message: 'Rate limit test successful',
    timestamp: new Date().toISOString(),
    headers: {
      'X-RateLimit-Limit': request.headers.get('X-RateLimit-Limit'),
      'X-RateLimit-Remaining': request.headers.get('X-RateLimit-Remaining'),
      'X-RateLimit-Reset': request.headers.get('X-RateLimit-Reset'),
      'X-Client-Country': request.headers.get('X-Client-Country'),
      'X-Client-Risk-Score': request.headers.get('X-Client-Risk-Score'),
    }
  });
}
