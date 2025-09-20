import { NextRequest, NextResponse } from 'next/server';
import { adminService } from '@/lib/adminService';
import { blockedStorage } from '@/lib/blockedStorage';
import { isAdminAuthenticated } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  // Check admin authentication
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json(
      { error: 'Admin authentication required' },
      { status: 401 }
    );
  }
  
  return NextResponse.json({ blockedIPs: blockedStorage.getBlockedIPs() });
}

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json(
        { error: 'Admin authentication required' },
        { status: 401 }
      );
    }

    const { ip, duration, reason } = await request.json();
    
    if (!ip || ip.trim() === '') {
      return NextResponse.json(
        { error: 'IP address is required and cannot be empty' },
        { status: 400 }
      );
    }
    
    // Use persistent storage for blocking
    blockedStorage.blockIP(ip);
    
    // Also update in-memory storage for middleware
    adminService.blockIP(ip);
    
    // Log the action
    console.log(`IP ${ip} blocked. Reason: ${reason || 'No reason provided'}`);
    
    return NextResponse.json({ 
      success: true, 
      message: `IP ${ip} blocked successfully`,
      blockedUntil: new Date(Date.now() + (duration || 3600000)).toISOString()
    });
  } catch (error) {
    console.error('Error blocking IP:', error);
    return NextResponse.json(
      { error: 'Failed to block IP address' },
      { status: 500 }
    );
  }
}
