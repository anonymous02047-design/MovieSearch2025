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
    const { title, plot, year, length } = body;

    if (!title) {
      throw createError.validationError('Movie title is required');
    }

    const result = await enhancedOpenAI.generatePlotSummary(
      userId,
      { title, plot, year },
      length || 'short'
    );

    return NextResponse.json({
      success: true,
      summary: result.summary,
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

