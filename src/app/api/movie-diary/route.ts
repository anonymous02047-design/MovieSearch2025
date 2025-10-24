import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import MovieDiary from '@/models/MovieDiary';

export const dynamic = 'force-dynamic';

// GET - Fetch diary entries
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get('movieId');
    const limit = parseInt(searchParams.get('limit') || '50');

    await connectDB();

    const query: any = { userId };
    if (movieId) query.movieId = Number(movieId);

    const entries = await MovieDiary.find(query)
      .sort({ watchedDate: -1 })
      .limit(limit);

    return NextResponse.json({ success: true, entries });
  } catch (error) {
    console.error('Movie diary fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch diary' }, { status: 500 });
  }
}

// POST - Create diary entry
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { movieId, movieTitle, watchedDate, rating, review, mood, location, companions, rewatch } = body;

    if (!movieId || !movieTitle || !watchedDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const entry = await MovieDiary.create({
      userId,
      movieId,
      movieTitle,
      watchedDate: new Date(watchedDate),
      rating,
      review,
      mood,
      location,
      companions,
      rewatch: rewatch || false,
    });

    return NextResponse.json({ success: true, entry });
  } catch (error) {
    console.error('Movie diary create error:', error);
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 });
  }
}

// PUT - Update diary entry
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, rating, review, mood, location, companions } = body;

    if (!id) {
      return NextResponse.json({ error: 'Entry ID required' }, { status: 400 });
    }

    await connectDB();

    const entry = await MovieDiary.findOneAndUpdate(
      { _id: id, userId },
      { rating, review, mood, location, companions },
      { new: true }
    );

    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, entry });
  } catch (error) {
    console.error('Movie diary update error:', error);
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 });
  }
}

// DELETE - Delete diary entry
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Entry ID required' }, { status: 400 });
    }

    await connectDB();
    await MovieDiary.findOneAndDelete({ _id: id, userId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Movie diary delete error:', error);
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 });
  }
}

