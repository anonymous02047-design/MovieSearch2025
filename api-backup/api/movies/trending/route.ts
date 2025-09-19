import { NextRequest, NextResponse } from 'next/server';
import { tmdbApi } from '@/lib/tmdb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const timeWindow = searchParams.get('time_window') || 'day'; // 'day' or 'week'
    const language = searchParams.get('language') || 'en-US';

    // Get trending movies from TMDB
    const response = await tmdbApi.getTrendingMovies(timeWindow, page, language);
    
    if (!response) {
      return NextResponse.json(
        { error: 'Failed to fetch trending movies' },
        { status: 500 }
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
