import { NextRequest, NextResponse } from 'next/server';
import { adminService } from '@/lib/adminService';
import { blockedStorage } from '@/lib/blockedStorage';
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

    // Parse request body with error handling
    let requestBody;
    try {
      const text = await request.text();
      if (!text) {
        return NextResponse.json(
          { error: 'Request body is required' },
          { status: 400 }
        );
      }
      requestBody = JSON.parse(text);
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { ip } = requestBody;
    
    if (!ip || ip.trim() === '') {
      return NextResponse.json(
        { error: 'IP address is required and cannot be empty' },
        { status: 400 }
      );
    }
    
    // Use persistent storage for unblocking
    const result = blockedStorage.unblockIP(ip);
    
    // Also update in-memory storage for middleware
    adminService.unblockIP(ip);
    
    // Log the action
    console.log(`IP ${ip} unblocked. Result: ${result}`);
    
    return NextResponse.json({ 
      success: true, 
      message: `IP ${ip} unblocked successfully`
    });
  } catch (error) {
    console.error('Error unblocking IP:', error);
    return NextResponse.json(
      { error: 'Failed to unblock IP address' },
      { status: 500 }
    );
  }
}
