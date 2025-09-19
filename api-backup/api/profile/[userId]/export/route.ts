import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getFavorites, getWatchlist, getSearchHistory } from '@/lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (userId !== params.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all user data
    const favorites = getFavorites();
    const watchlist = getWatchlist();
    const searchHistory = getSearchHistory();

    // Create export data
    const exportData = {
      exportDate: new Date().toISOString(),
      userId: userId,
      userData: {
        favorites: favorites,
        watchlist: watchlist,
        searchHistory: searchHistory,
        statistics: {
          totalFavorites: favorites.length,
          totalWatchlist: watchlist.length,
          totalSearches: searchHistory.length,
        },
      },
      metadata: {
        version: '1.0',
        format: 'json',
        generatedBy: 'MovieSearch 2025',
      },
    };

    // Convert to JSON string
    const jsonData = JSON.stringify(exportData, null, 2);
    
    // Create response with JSON file
    return new NextResponse(jsonData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="moviesearch-export-${userId}-${Date.now()}.json"`,
      },
    });
  } catch (error) {
    console.error('Error exporting user data:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}
