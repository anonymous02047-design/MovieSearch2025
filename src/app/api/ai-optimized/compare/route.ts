import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { compareMovies } from '@/lib/openai-optimized';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { movie1, movie2, maxTokens = 120 } = body;

    if (!movie1 || !movie2) {
      return NextResponse.json({ error: 'Two movies required' }, { status: 400 });
    }

    const comparison = await compareMovies(movie1, movie2, maxTokens);

    return NextResponse.json({
      success: true,
      comparison,
      tokensUsed: maxTokens,
    });
  } catch (error) {
    console.error('Compare error:', error);
    return NextResponse.json(
      { error: 'Failed to compare movies' },
      { status: 500 }
    );
  }
}

