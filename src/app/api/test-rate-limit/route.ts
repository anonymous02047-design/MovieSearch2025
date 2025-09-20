import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testType = searchParams.get('type') || 'basic';
    
    // Simulate different types of rate limit tests
    switch (testType) {
      case 'basic':
        return NextResponse.json({
          success: true,
          message: 'Basic rate limit test passed',
          timestamp: new Date().toISOString(),
          testType: 'basic'
        });
        
      case 'heavy':
        // Simulate a heavy operation
        await new Promise(resolve => setTimeout(resolve, 100));
        return NextResponse.json({
          success: true,
          message: 'Heavy rate limit test passed',
          timestamp: new Date().toISOString(),
          testType: 'heavy'
        });
        
      case 'error':
        return NextResponse.json({
          success: false,
          message: 'Simulated error for testing',
          timestamp: new Date().toISOString(),
          testType: 'error'
        }, { status: 500 });
        
      default:
        return NextResponse.json({
          success: true,
          message: 'Default rate limit test passed',
          timestamp: new Date().toISOString(),
          testType: 'default'
        });
    }
  } catch (error) {
    console.error('Rate limit test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    return NextResponse.json({
      success: true,
      message: 'POST rate limit test passed',
      timestamp: new Date().toISOString(),
      receivedData: body
    });
  } catch (error) {
    console.error('Rate limit test POST error:', error);
    return NextResponse.json({
      success: false,
      message: 'Invalid request body',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
}
