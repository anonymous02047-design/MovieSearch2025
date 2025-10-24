import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import MovieReview from '@/models/MovieReview';

export const dynamic = 'force-dynamic';

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

    const reviews = await MovieReview.find(query).sort({ createdAt: -1 }).limit(50);

    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error('Movie review fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { movieId, movieTitle, rating, review, pros, cons, spoilers } = body;

    if (!movieId || !movieTitle || !rating || !review) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const newReview = await MovieReview.create({
      userId,
      movieId,
      movieTitle,
      rating,
      review,
      pros,
      cons,
      spoilers: spoilers || false,
    });

    return NextResponse.json({ success: true, review: newReview });
  } catch (error) {
    console.error('Movie review create error:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Review ID required' }, { status: 400 });
    }

    await connectDB();
    await MovieReview.findOneAndDelete({ _id: id, userId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Movie review delete error:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}

