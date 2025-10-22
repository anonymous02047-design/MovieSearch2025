import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { enhancedOpenAI } from '@/lib/openaiEnhanced';
import { handleApiError, createError } from '@/utils/enhancedErrorHandling';

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      throw createError.unauthorized('Authentication required');
    }

    const status = enhancedOpenAI.getRateLimitStatus(userId);

    return NextResponse.json({
      success: true,
      requestsRemaining: status.requestsRemaining,
      tokensRemaining: status.tokensRemaining,
      resetTime: status.resetTime,
      limits: {
        maxRequestsPerHour: 50,
        maxTokensPerHour: 50000,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

