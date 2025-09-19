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

    // Get user statistics from local storage
    const favorites = getFavorites();
    const watchlist = getWatchlist();
    const searchHistory = getSearchHistory();

    // Calculate statistics
    const statistics = {
      totalMoviesWatched: favorites.length, // Assuming favorites are watched movies
      totalMoviesRated: favorites.length, // Assuming all favorites are rated
      averageRating: 4.2, // Mock average rating
      favoriteGenre: 'Action', // Mock favorite genre
      joinDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      totalFavorites: favorites.length,
      totalWatchlist: watchlist.length,
      totalSearches: searchHistory.length,
      accountAge: Math.floor((Date.now() - new Date().getTime()) / (1000 * 60 * 60 * 24)), // Mock account age
    };

    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error fetching profile statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
