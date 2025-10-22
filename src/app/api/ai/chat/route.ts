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
    const { question, context } = body;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    const answer = await openai.answerMovieQuestion(question, context);

    return NextResponse.json({
      success: true,
      answer,
      question,
    });
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to answer question',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

