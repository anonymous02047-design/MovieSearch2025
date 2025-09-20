import { NextRequest, NextResponse } from 'next/server';
import { adminService } from '@/lib/adminService';
import { blockedStorage } from '@/lib/blockedStorage';
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
    
    const storageStats = blockedStorage.getStats();
    
    const stats = {
      ...storageStats,
      // Add rate limit data from adminService for middleware stats
      ipRateLimits: adminService.getRateLimitStats().ipRateLimits,
      countryRateLimits: adminService.getRateLimitStats().countryRateLimits,
    };
    
    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching rate limit stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
