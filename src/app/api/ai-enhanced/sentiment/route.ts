import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { enhancedOpenAI } from '@/lib/openaiEnhanced';
import { handleApiError, createError } from '@/utils/enhancedErrorHandling';

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      throw createError.unauthorized('Authentication required');
    }

    const body = await request.json();
    const { text } = body;

    if (!text || text.trim().length === 0) {
      throw createError.validationError('Text is required for sentiment analysis');
    }

    const result = await enhancedOpenAI.analyzeSentiment(userId, text);

    return NextResponse.json({
      success: true,
      sentiment: result.sentiment,
      score: result.score,
      usage: result.usage,
      rateLimitStatus: enhancedOpenAI.getRateLimitStatus(userId),
    });
  } catch (error: any) {
    if (error.message?.includes('Rate limit') || error.message?.includes('Token limit')) {
      return NextResponse.json(
        { error: error.message, rateLimited: true },
        { status: 429 }
      );
    }
    return handleApiError(error);
  }
}

