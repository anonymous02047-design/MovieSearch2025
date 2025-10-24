import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import CinemaVisit from '@/models/CinemaVisit';

export const dynamic = 'force-dynamic';

// GET - Fetch cinema visits
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const visits = await CinemaVisit.find({ userId }).sort({ visitDate: -1 });

    return NextResponse.json({ success: true, visits });
  } catch (error) {
    console.error('Cinema visit fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch visits' }, { status: 500 });
  }
}

// POST - Create cinema visit
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { movieId, movieTitle, cinemaName, location, visitDate, screenType, companions, ticketPrice, rating, notes } = body;

    if (!movieId || !movieTitle || !cinemaName || !visitDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const visit = await CinemaVisit.create({
      userId,
      movieId,
      movieTitle,
      cinemaName,
      location,
      visitDate: new Date(visitDate),
      screenType,
      companions,
      ticketPrice,
      rating,
      notes,
    });

    return NextResponse.json({ success: true, visit });
  } catch (error) {
    console.error('Cinema visit create error:', error);
    return NextResponse.json({ error: 'Failed to create visit' }, { status: 500 });
  }
}

// PUT - Update cinema visit
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, cinemaName, location, screenType, companions, ticketPrice, rating, notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Visit ID required' }, { status: 400 });
    }

    await connectDB();

    const visit = await CinemaVisit.findOneAndUpdate(
      { _id: id, userId },
      { cinemaName, location, screenType, companions, ticketPrice, rating, notes },
      { new: true }
    );

    if (!visit) {
      return NextResponse.json({ error: 'Visit not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, visit });
  } catch (error) {
    console.error('Cinema visit update error:', error);
    return NextResponse.json({ error: 'Failed to update visit' }, { status: 500 });
  }
}

// DELETE - Delete cinema visit
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Visit ID required' }, { status: 400 });
    }

    await connectDB();
    await CinemaVisit.findOneAndDelete({ _id: id, userId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cinema visit delete error:', error);
    return NextResponse.json({ error: 'Failed to delete visit' }, { status: 500 });
  }
}

