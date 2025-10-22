import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/mongodb';
import FeatureRequest from '@/models/FeatureRequest';
import { handleApiError, createError } from '@/utils/enhancedErrorHandling';

// GET - Fetch all feature requests
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const sort = searchParams.get('sort') || '-votes';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build query
    const query: any = {};
    if (status && status !== 'all') query.status = status;
    if (category && category !== 'all') query.category = category;

    // Fetch requests
    const requests = await FeatureRequest.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await FeatureRequest.countDocuments(query);

    return NextResponse.json({
      requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST - Create new feature request
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      throw createError.unauthorized('You must be signed in to submit feature requests');
    }

    await connectDB();

    const body = await request.json();
    const { title, description, category, priority } = body;

    // Validation
    if (!title || !description || !category) {
      throw createError.validationError('Title, description, and category are required');
    }

    // Get user info from Clerk
    const user = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }).then(res => res.json());

    // Create feature request
    const featureRequest = await FeatureRequest.create({
      userId,
      userEmail: user.email_addresses[0]?.email_address || 'unknown@example.com',
      userName: user.first_name || user.username || 'Anonymous',
      title,
      description,
      category,
      priority: priority || 'medium',
      status: 'submitted',
      votes: 1, // Auto-vote for creator
      votedBy: [userId],
    });

    return NextResponse.json({ 
      success: true, 
      request: featureRequest 
    }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

