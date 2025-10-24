import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import MovieGoal from '@/models/MovieGoal';

export const dynamic = 'force-dynamic';

// GET - Fetch goals for user
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const goals = await MovieGoal.find({ userId }).sort({ year: -1 });

    return NextResponse.json({ success: true, goals });
  } catch (error) {
    console.error('Movie goal fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
  }
}

// POST - Create or update a goal
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { year, goalCount, watchedCount } = body;

    if (!year || !goalCount) {
      return NextResponse.json({ error: 'Year and goal count required' }, { status: 400 });
    }

    await connectDB();

    const updatedGoal = await MovieGoal.findOneAndUpdate(
      { userId, year },
      { userId, year, goalCount, watchedCount: watchedCount || 0, isActive: true },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, goal: updatedGoal });
  } catch (error) {
    console.error('Movie goal create error:', error);
    return NextResponse.json({ error: 'Failed to save goal' }, { status: 500 });
  }
}

// PUT - Update progress
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { year, increment } = body;

    if (!year) {
      return NextResponse.json({ error: 'Year required' }, { status: 400 });
    }

    await connectDB();

    const goal = await MovieGoal.findOneAndUpdate(
      { userId, year },
      { $inc: { watchedCount: increment || 1 } },
      { new: true }
    );

    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, goal });
  } catch (error) {
    console.error('Movie goal update error:', error);
    return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 });
  }
}

