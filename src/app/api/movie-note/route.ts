import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import MovieNote from '@/models/MovieNote';

export const dynamic = 'force-dynamic';

// GET - Fetch notes
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get('movieId');

    await connectDB();

    const query: any = { userId };
    if (movieId) query.movieId = Number(movieId);

    const notes = await MovieNote.find(query).sort({ isPinned: -1, createdAt: -1 });

    return NextResponse.json({ success: true, notes });
  } catch (error) {
    console.error('Movie note fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

// POST - Create note
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { movieId, movieTitle, note, category, tags, isPinned } = body;

    if (!movieId || !movieTitle || !note) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const newNote = await MovieNote.create({
      userId,
      movieId,
      movieTitle,
      note,
      category,
      tags,
      isPinned: isPinned || false,
    });

    return NextResponse.json({ success: true, note: newNote });
  } catch (error) {
    console.error('Movie note create error:', error);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}

// PUT - Update note
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, note, category, tags, isPinned } = body;

    if (!id) {
      return NextResponse.json({ error: 'Note ID required' }, { status: 400 });
    }

    await connectDB();

    const updatedNote = await MovieNote.findOneAndUpdate(
      { _id: id, userId },
      { note, category, tags, isPinned },
      { new: true }
    );

    if (!updatedNote) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, note: updatedNote });
  } catch (error) {
    console.error('Movie note update error:', error);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

// DELETE - Delete note
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Note ID required' }, { status: 400 });
    }

    await connectDB();
    await MovieNote.findOneAndDelete({ _id: id, userId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Movie note delete error:', error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}

