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
    const { review } = body;

    if (!review || typeof review !== 'string' || review.trim().length === 0) {
      return NextResponse.json(
        { error: 'Review text is required' },
        { status: 400 }
      );
    }

    const analysis = await openai.analyzeReviewSentiment(review);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error: any) {
    console.error('Sentiment Analysis Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze sentiment',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

