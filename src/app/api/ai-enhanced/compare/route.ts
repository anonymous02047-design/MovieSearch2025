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
    const { movie1, movie2 } = body;

    if (!movie1 || !movie2) {
      throw createError.validationError('Both movie titles are required');
    }

    const result = await enhancedOpenAI.compareMovies(userId, movie1, movie2);

    return NextResponse.json({
      success: true,
      comparison: result.comparison,
      winner: result.winner,
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

