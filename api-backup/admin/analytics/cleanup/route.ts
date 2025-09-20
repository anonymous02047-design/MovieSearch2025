import { NextRequest, NextResponse } from 'next/server';
import { analyticsService } from '@/lib/analytics';
import { isAdminAuthenticated } from '@/lib/adminAuth';

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json(
        { error: 'Admin authentication required' },
        { status: 401 }
      );
    }

    await analyticsService.cleanupOldSessions();

    return NextResponse.json({ 
      success: true, 
      message: 'Old session files cleaned up successfully' 
    });
  } catch (error) {
    console.error('Failed to cleanup analytics data:', error);
    return NextResponse.json(
      { error: 'Failed to cleanup data' },
      { status: 500 }
    );
  }
}
