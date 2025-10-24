import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { generateRecommendations } from '@/lib/openai-optimized';

export const runtime = 'edge'; // Use edge runtime for faster responses
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { preferences, maxTokens = 150 } = body;

    if (!preferences) {
      return NextResponse.json({ error: 'Preferences required' }, { status: 400 });
    }

    const recommendations = await generateRecommendations(preferences, maxTokens);

    return NextResponse.json({
      success: true,
      recommendations,
      tokensUsed: maxTokens,
      cached: false,
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}

