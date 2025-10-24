import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import MovieQuote from '@/models/MovieQuote';

export const dynamic = 'force-dynamic';

// GET - Fetch quotes
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get('movieId');
    const favorites = searchParams.get('favorites') === 'true';

    await connectDB();

    const query: any = { userId };
    if (movieId) query.movieId = Number(movieId);
    if (favorites) query.isFavorite = true;

    const quotes = await MovieQuote.find(query).sort({ isFavorite: -1, createdAt: -1 });

    return NextResponse.json({ success: true, quotes });
  } catch (error) {
    console.error('Movie quote fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}

// POST - Create quote
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { movieId, movieTitle, quote, character, actor, timestamp, isFavorite, tags } = body;

    if (!movieId || !movieTitle || !quote) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const newQuote = await MovieQuote.create({
      userId,
      movieId,
      movieTitle,
      quote,
      character,
      actor,
      timestamp,
      isFavorite: isFavorite || false,
      tags,
    });

    return NextResponse.json({ success: true, quote: newQuote });
  } catch (error) {
    console.error('Movie quote create error:', error);
    return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 });
  }
}

// PUT - Update quote
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, quote, character, actor, timestamp, isFavorite, tags } = body;

    if (!id) {
      return NextResponse.json({ error: 'Quote ID required' }, { status: 400 });
    }

    await connectDB();

    const updatedQuote = await MovieQuote.findOneAndUpdate(
      { _id: id, userId },
      { quote, character, actor, timestamp, isFavorite, tags },
      { new: true }
    );

    if (!updatedQuote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, quote: updatedQuote });
  } catch (error) {
    console.error('Movie quote update error:', error);
    return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 });
  }
}

// DELETE - Delete quote
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Quote ID required' }, { status: 400 });
    }

    await connectDB();
    await MovieQuote.findOneAndDelete({ _id: id, userId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Movie quote delete error:', error);
    return NextResponse.json({ error: 'Failed to delete quote' }, { status: 500 });
  }
}

