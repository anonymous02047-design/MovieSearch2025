import { NextRequest, NextResponse } from 'next/server';
import { analyticsService } from '@/lib/analytics';

export async function POST(request: NextRequest) {
  try {
    // Check if request has body
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }

    // Get request body with error handling
    let body;
    try {
      const text = await request.text();
      if (!text || text.trim() === '') {
        return NextResponse.json(
          { error: 'Request body is empty' },
          { status: 400 }
        );
      }
      body = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { page, userId, clientInfo } = body;

    // Create new session
    const sessionId = await analyticsService.createSession(request, userId);

    // Update session with client-side information
    if (clientInfo) {
      await analyticsService.updateSession(sessionId, {
        ...clientInfo,
        currentPage: page,
        loginStatus: !!userId,
      });
    }

    return NextResponse.json({ sessionId });
  } catch (error) {
    console.error('Failed to create analytics session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}
