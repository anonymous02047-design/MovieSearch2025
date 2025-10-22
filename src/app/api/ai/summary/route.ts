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
    const { movieData, length = 'medium' } = body;

    if (!movieData || !movieData.title) {
      return NextResponse.json(
        { error: 'Movie data with title is required' },
        { status: 400 }
      );
    }

    const summary = await openai.generateMovieSummary(movieData, length);

    return NextResponse.json({
      success: true,
      summary,
      length,
    });
  } catch (error: any) {
    console.error('AI Summary Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate summary',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

