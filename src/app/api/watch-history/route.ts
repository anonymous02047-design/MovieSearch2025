import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import WatchHistory from '@/models/WatchHistory';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    await connectDB();

    const history = await WatchHistory.find({ userId })
      .sort({ watchedAt: -1 })
      .limit(limit);

    return NextResponse.json({ success: true, history });
  } catch (error) {
    console.error('Watch history fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { movieId, movieTitle, watchDuration, completed, platform } = body;

    if (!movieId || !movieTitle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const entry = await WatchHistory.create({
      userId,
      movieId,
      movieTitle,
      watchedAt: new Date(),
      watchDuration,
      completed: completed !== undefined ? completed : true,
      platform,
    });

    return NextResponse.json({ success: true, entry });
  } catch (error) {
    console.error('Watch history create error:', error);
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 });
  }
}

