import { NextRequest, NextResponse } from 'next/server';
import { tmdbApi } from '@/lib/tmdb';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required to search movies' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const includeAdult = searchParams.get('include_adult') === 'true';
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined;

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Search movies from TMDB
    const searchParams_obj = {
      query,
      page,
      include_adult: includeAdult,
      year
    };

    const response = await tmdbApi.searchMovies(searchParams_obj);
    
    if (!response) {
      return NextResponse.json(
        { error: 'Failed to search movies' },
        { status: 500 }
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error searching movies:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
