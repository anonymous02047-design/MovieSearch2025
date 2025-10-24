import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import MovieRecommendation from '@/models/MovieRecommendation';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const recommendations = await MovieRecommendation.find({ userId, watched: false })
      .sort({ score: -1, createdAt: -1 })
      .limit(50);

    return NextResponse.json({ success: true, recommendations });
  } catch (error) {
    console.error('Recommendation fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { movieId, movieTitle, source, reason, score } = body;

    if (!movieId || !movieTitle || !source) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const recommendation = await MovieRecommendation.create({
      userId,
      movieId,
      movieTitle,
      source,
      reason,
      score,
      watched: false,
      saved: false,
    });

    return NextResponse.json({ success: true, recommendation });
  } catch (error) {
    console.error('Recommendation create error:', error);
    return NextResponse.json({ error: 'Failed to create recommendation' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, watched, saved } = body;

    await connectDB();

    const recommendation = await MovieRecommendation.findOneAndUpdate(
      { _id: id, userId },
      { watched, saved },
      { new: true }
    );

    return NextResponse.json({ success: true, recommendation });
  } catch (error) {
    console.error('Recommendation update error:', error);
    return NextResponse.json({ error: 'Failed to update recommendation' }, { status: 500 });
  }
}

