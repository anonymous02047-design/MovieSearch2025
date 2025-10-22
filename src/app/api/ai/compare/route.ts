import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI is configured
    if (!openai.isConfigured()) {
      return NextResponse.json(
        { 
          error: 'AI features are not configured', 
          message: 'OpenAI API key is missing. Please add OPENAI_API_KEY to your environment variables.' 
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { movie1, movie2 } = body;

    if (!movie1 || !movie1.title || !movie2 || !movie2.title) {
      return NextResponse.json(
        { error: 'Both movies with titles are required' },
        { status: 400 }
      );
    }

    const comparison = await openai.compareMovies(movie1, movie2);

    return NextResponse.json({
      success: true,
      comparison,
      movies: [movie1.title, movie2.title],
    });
  } catch (error: any) {
    console.error('AI Compare Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to compare movies',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

