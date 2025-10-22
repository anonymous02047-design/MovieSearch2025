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
    const { availableTime, mood, preferences } = body;

    if (!availableTime || !mood) {
      return NextResponse.json(
        { error: 'Available time and mood are required' },
        { status: 400 }
      );
    }

    const suggestion = await openai.generateWatchSuggestion(
      availableTime,
      mood,
      preferences
    );

    return NextResponse.json({
      success: true,
      suggestion,
    });
  } catch (error: any) {
    console.error('AI Watch Suggestion Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate watch suggestion',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

