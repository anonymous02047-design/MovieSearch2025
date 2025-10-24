import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import QuickList from '@/models/QuickList';

export const dynamic = 'force-dynamic';

// GET - Fetch all lists
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const lists = await QuickList.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, lists });
  } catch (error) {
    console.error('Quick list fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch lists' }, { status: 500 });
  }
}

// POST - Create new list or add movie to list
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, movieId, movieTitle, posterPath, isPublic, tags, listId } = body;

    await connectDB();

    if (listId && movieId) {
      // Add movie to existing list
      const list = await QuickList.findOneAndUpdate(
        { _id: listId, userId },
        {
          $push: {
            movies: {
              movieId,
              movieTitle,
              posterPath,
              addedAt: new Date(),
            },
          },
        },
        { new: true }
      );

      if (!list) {
        return NextResponse.json({ error: 'List not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, list });
    } else if (name) {
      // Create new list
      const newList = await QuickList.create({
        userId,
        name,
        description,
        movies: movieId
          ? [{ movieId, movieTitle, posterPath, addedAt: new Date() }]
          : [],
        isPublic: isPublic || false,
        tags,
      });

      return NextResponse.json({ success: true, list: newList });
    } else {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
  } catch (error) {
    console.error('Quick list create error:', error);
    return NextResponse.json({ error: 'Failed to create/update list' }, { status: 500 });
  }
}

// PUT - Update list details
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, description, isPublic, tags } = body;

    if (!id) {
      return NextResponse.json({ error: 'List ID required' }, { status: 400 });
    }

    await connectDB();

    const list = await QuickList.findOneAndUpdate(
      { _id: id, userId },
      { name, description, isPublic, tags },
      { new: true }
    );

    if (!list) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, list });
  } catch (error) {
    console.error('Quick list update error:', error);
    return NextResponse.json({ error: 'Failed to update list' }, { status: 500 });
  }
}

// DELETE - Delete list or remove movie from list
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const movieId = searchParams.get('movieId');

    if (!id) {
      return NextResponse.json({ error: 'List ID required' }, { status: 400 });
    }

    await connectDB();

    if (movieId) {
      // Remove movie from list
      await QuickList.findOneAndUpdate(
        { _id: id, userId },
        { $pull: { movies: { movieId: Number(movieId) } } }
      );
    } else {
      // Delete entire list
      await QuickList.findOneAndDelete({ _id: id, userId });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Quick list delete error:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}

