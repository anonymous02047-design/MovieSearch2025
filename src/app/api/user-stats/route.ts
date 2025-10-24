import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import UserStats from '@/models/UserStats';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    let stats = await UserStats.findOne({ userId });

    if (!stats) {
      stats = await UserStats.create({ userId });
    }

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error('User stats fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    await connectDB();

    const stats = await UserStats.findOneAndUpdate(
      { userId },
      { ...body, lastUpdated: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error('User stats update error:', error);
    return NextResponse.json({ error: 'Failed to update stats' }, { status: 500 });
  }
}

