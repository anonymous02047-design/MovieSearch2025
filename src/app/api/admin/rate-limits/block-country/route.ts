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
  
  return NextResponse.json({ blockedCountries: blockedStorage.getBlockedCountries() });
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

    const { country, countryCode, reason } = await request.json();
    const countryToBlock = country || countryCode;
    
    if (!countryToBlock || countryToBlock.trim() === '') {
      return NextResponse.json(
        { error: 'Country code is required and cannot be empty' },
        { status: 400 }
      );
    }
    
    const countryToBlockUpper = countryToBlock.toUpperCase();
    
    // Use persistent storage for blocking
    blockedStorage.blockCountry(countryToBlockUpper);
    
    // Also update in-memory storage for middleware
    adminService.blockCountry(countryToBlockUpper);
    
    // Log the action
    console.log(`Country ${countryToBlockUpper} blocked. Reason: ${reason || 'Policy violation'}`);
    
    return NextResponse.json({ 
      success: true, 
      message: `Country ${countryToBlock.toUpperCase()} blocked successfully`
    });
  } catch (error) {
    console.error('Error blocking country:', error);
    return NextResponse.json(
      { error: 'Failed to block country' },
      { status: 500 }
    );
  }
}
