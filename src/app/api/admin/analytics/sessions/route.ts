import { NextRequest, NextResponse } from 'next/server';
import { analyticsService } from '@/lib/analytics';
import { isAdminAuthenticated } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json(
        { error: 'Admin authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const filters = {
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      country: searchParams.get('country') || undefined,
      deviceType: searchParams.get('deviceType') || undefined,
      browser: searchParams.get('browser') || undefined,
      userId: searchParams.get('userId') || undefined,
      ipAddress: searchParams.get('ipAddress') || undefined,
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0'),
    };

    const result = await analyticsService.getSessions(filters);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to get analytics sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}
