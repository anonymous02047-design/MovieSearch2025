import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log session end event
    console.log('Session end event:', {
      sessionId: body.sessionId,
      duration: body.duration,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({
      success: true,
      message: 'Session ended successfully',
      sessionId: body.sessionId
    });
  } catch (error) {
    console.error('Session end error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to end session',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Session end endpoint is working',
    timestamp: new Date().toISOString()
  });
}
