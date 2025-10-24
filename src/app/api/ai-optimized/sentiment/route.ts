import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { analyzeSentiment } from '@/lib/openai-optimized';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { text, maxTokens = 50 } = body;

    if (!text) {
      return NextResponse.json({ error: 'Text required' }, { status: 400 });
    }

    const result = await analyzeSentiment(text, maxTokens);

    return NextResponse.json({
      success: true,
      ...result,
      tokensUsed: maxTokens,
    });
  } catch (error) {
    console.error('Sentiment error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze sentiment' },
      { status: 500 }
    );
  }
}

