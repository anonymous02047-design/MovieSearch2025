import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import MovieMemory from '@/models/MovieMemory';

export const dynamic = 'force-dynamic';

// GET - Fetch all memories for user
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const memories = await MovieMemory.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, memories });
  } catch (error) {
    console.error('Movie memory fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch memories' }, { status: 500 });
  }
}

// POST - Create a new memory
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { movieId, movieTitle, memory, tags, isPublic } = body;

    if (!memory) {
      return NextResponse.json({ error: 'Memory text required' }, { status: 400 });
    }

    await connectDB();

    const newMemory = await MovieMemory.create({
      userId,
      movieId,
      movieTitle,
      memory,
      tags,
      isPublic: isPublic || false,
    });

    return NextResponse.json({ success: true, memory: newMemory });
  } catch (error) {
    console.error('Movie memory create error:', error);
    return NextResponse.json({ error: 'Failed to create memory' }, { status: 500 });
  }
}

// PUT - Update a memory
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, memory, tags, isPublic } = body;

    if (!id) {
      return NextResponse.json({ error: 'Memory ID required' }, { status: 400 });
    }

    await connectDB();

    const updatedMemory = await MovieMemory.findOneAndUpdate(
      { _id: id, userId },
      { memory, tags, isPublic },
      { new: true }
    );

    if (!updatedMemory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, memory: updatedMemory });
  } catch (error) {
    console.error('Movie memory update error:', error);
    return NextResponse.json({ error: 'Failed to update memory' }, { status: 500 });
  }
}

// DELETE - Delete a memory
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Memory ID required' }, { status: 400 });
    }

    await connectDB();
    await MovieMemory.findOneAndDelete({ _id: id, userId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Movie memory delete error:', error);
    return NextResponse.json({ error: 'Failed to delete memory' }, { status: 500 });
  }
}

