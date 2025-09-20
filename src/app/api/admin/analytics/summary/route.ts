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
    const dateFrom = searchParams.get('dateFrom') || undefined;
    const dateTo = searchParams.get('dateTo') || undefined;

    const summary = await analyticsService.getAnalyticsSummary(dateFrom, dateTo);

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Failed to get analytics summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics summary' },
      { status: 500 }
    );
  }
}