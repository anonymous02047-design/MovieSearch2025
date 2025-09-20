import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { profileService, ProfileData } from '@/lib/profileService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await auth();
    const { userId: paramUserId } = await params;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (userId !== paramUserId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get profile data (in a real app, this would come from a database)
    const profile = await getProfileFromStorage(userId);
    
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await auth();
    const { userId: paramUserId } = await params;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (userId !== paramUserId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updateData = await request.json();
    
    // Validate the update data
    const validation = profileService.validateProfileData(updateData);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Invalid data', details: validation.errors },
        { status: 400 }
      );
    }

    // Update profile data (in a real app, this would update a database)
    const updatedProfile = await updateProfileInStorage(userId, updateData);
    
    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await auth();
    const { userId: paramUserId } = await params;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (userId !== paramUserId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete profile data (in a real app, this would delete from database)
    await deleteProfileFromStorage(userId);
    
    return NextResponse.json({ 
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting profile:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete account',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Mock storage functions (replace with real database operations)
async function getProfileFromStorage(userId: string): Promise<ProfileData> {
  // In a real app, this would fetch from a database
  // For now, return default profile data
  return profileService.getDefaultProfileData(
    userId,
    'user@example.com', // This would come from Clerk user data
    'User',
    'Name'
  );
}

async function updateProfileInStorage(userId: string, updateData: any): Promise<ProfileData> {
  // In a real app, this would update a database
  // For now, return updated profile data
  const existingProfile = await getProfileFromStorage(userId);
  return {
    ...existingProfile,
    ...updateData,
    updatedAt: new Date().toISOString(),
  };
}

async function deleteProfileFromStorage(userId: string): Promise<void> {
  // In a real app, this would delete from a database
  console.log(`Deleting profile for user: ${userId}`);
}
