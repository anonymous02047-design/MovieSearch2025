import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { generateSummary } from '@/lib/openai-optimized';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { movieData, maxTokens = 100 } = body;

    if (!movieData) {
      return NextResponse.json({ error: 'Movie data required' }, { status: 400 });
    }

    const summary = await generateSummary(movieData, maxTokens);

    return NextResponse.json({
      success: true,
      summary,
      tokensUsed: maxTokens,
    });
  } catch (error) {
    console.error('Summary error:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}

