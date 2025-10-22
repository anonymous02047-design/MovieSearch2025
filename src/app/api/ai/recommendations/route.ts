import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { openai } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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
    const {
      favoriteGenres,
      favoriteMovies,
      watchHistory,
      mood,
      preferences,
      count = 5,
    } = body;

    const recommendations = await openai.generateMovieRecommendations(
      {
        favoriteGenres,
        favoriteMovies,
        watchHistory,
        mood,
        preferences,
      },
      count
    );

    return NextResponse.json({
      success: true,
      recommendations,
      count: recommendations.length,
    });
  } catch (error: any) {
    console.error('AI Recommendations Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate recommendations',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

