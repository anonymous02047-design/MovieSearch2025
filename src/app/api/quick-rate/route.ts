import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import QuickRating from '@/models/QuickRating';

export const dynamic = 'force-dynamic';

// GET - Fetch all quick ratings for user
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const ratings = await QuickRating.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, ratings });
  } catch (error) {
    console.error('Quick rating fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch ratings' }, { status: 500 });
  }
}

// POST - Create or update a quick rating
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { movieId, movieTitle, rating } = body;

    if (!movieId || !movieTitle || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    // Upsert rating
    const updatedRating = await QuickRating.findOneAndUpdate(
      { userId, movieId },
      { userId, movieId, movieTitle, rating },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, rating: updatedRating });
  } catch (error) {
    console.error('Quick rating create error:', error);
    return NextResponse.json({ error: 'Failed to save rating' }, { status: 500 });
  }
}

// DELETE - Delete a rating
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get('movieId');

    if (!movieId) {
      return NextResponse.json({ error: 'Movie ID required' }, { status: 400 });
    }

    await connectDB();
    await QuickRating.findOneAndDelete({ userId, movieId: Number(movieId) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Quick rating delete error:', error);
    return NextResponse.json({ error: 'Failed to delete rating' }, { status: 500 });
  }
}

