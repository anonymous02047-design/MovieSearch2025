import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const page = searchParams.get('page') || '1';
    const mediaType = searchParams.get('media_type') || 'multi';

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'TMDB API key not configured' },
        { status: 500 }
      );
    }

    // Build the search URL based on media type
    let searchUrl = '';
    if (mediaType === 'multi') {
      searchUrl = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`;
    } else {
      searchUrl = `https://api.themoviedb.org/3/search/${mediaType}?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`;
    }

    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform the data to include media_type for multi search
    if (mediaType === 'multi' && data.results) {
      data.results = data.results.map((item: any) => ({
        ...item,
        media_type: item.media_type || (item.title ? 'movie' : item.name ? 'tv' : 'person')
      }));
    } else if (data.results) {
      data.results = data.results.map((item: any) => ({
        ...item,
        media_type: mediaType
      }));
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search' },
      { status: 500 }
    );
  }
}
