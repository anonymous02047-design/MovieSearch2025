import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import MovieTag from '@/models/MovieTag';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const tags = await MovieTag.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, tags });
  } catch (error) {
    console.error('Movie tag fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { movieId, movieTitle, tags } = body;

    if (!movieId || !movieTitle || !tags || !Array.isArray(tags)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const movieTag = await MovieTag.findOneAndUpdate(
      { userId, movieId },
      { userId, movieId, movieTitle, tags },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, tag: movieTag });
  } catch (error) {
    console.error('Movie tag create error:', error);
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
  }
}

