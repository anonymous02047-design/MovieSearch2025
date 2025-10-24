import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import MovieAchievement from '@/models/MovieAchievement';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const achievements = await MovieAchievement.find({ userId }).sort({ completed: 1, createdAt: -1 });

    return NextResponse.json({ success: true, achievements });
  } catch (error) {
    console.error('Achievement fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { achievementType, title, description, target } = body;

    if (!achievementType || !title || !target) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const achievement = await MovieAchievement.create({
      userId,
      achievementType,
      title,
      description,
      target,
      progress: 0,
      completed: false,
    });

    return NextResponse.json({ success: true, achievement });
  } catch (error) {
    console.error('Achievement create error:', error);
    return NextResponse.json({ error: 'Failed to create achievement' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, progress } = body;

    if (!id) {
      return NextResponse.json({ error: 'Achievement ID required' }, { status: 400 });
    }

    await connectDB();

    const achievement = await MovieAchievement.findOne({ _id: id, userId });
    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }

    achievement.progress = progress !== undefined ? progress : achievement.progress + 1;
    achievement.completed = achievement.progress >= achievement.target;
    if (achievement.completed && !achievement.completedAt) {
      achievement.completedAt = new Date();
    }
    await achievement.save();

    return NextResponse.json({ success: true, achievement });
  } catch (error) {
    console.error('Achievement update error:', error);
    return NextResponse.json({ error: 'Failed to update achievement' }, { status: 500 });
  }
}

