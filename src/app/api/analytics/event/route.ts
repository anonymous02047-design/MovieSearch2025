import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log analytics event for debugging
    console.log('Analytics event received:', {
      event: body.event,
      properties: body.properties,
      timestamp: new Date().toISOString()
    });
    
    // Here you would typically send the event to your analytics service
    // For now, we'll just acknowledge receipt
    
    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully',
      eventId: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });
  } catch (error) {
    console.error('Analytics event error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to track event',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Analytics event endpoint is working',
    timestamp: new Date().toISOString()
  });
}
