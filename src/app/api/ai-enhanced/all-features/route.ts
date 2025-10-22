/**
 * Unified AI Features API
 * Handles all 14 AI features through a single endpoint
 */

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
    const { feature, ...params } = body;

    let result: any;

    // Route to appropriate feature
    switch (feature) {
      case 'recommendations':
        result = await enhancedOpenAI.getSmartRecommendations(
          userId,
          { genres: params.genres, mood: params.mood, recentWatched: params.recentWatched },
          params.count
        );
        break;

      case 'sentiment':
        result = await enhancedOpenAI.analyzeSentiment(userId, params.text);
        break;

      case 'trivia':
        result = await enhancedOpenAI.generateTrivia(userId, params.movieTitle, params.difficulty);
        break;

      case 'summary':
        result = await enhancedOpenAI.generatePlotSummary(
          userId,
          { title: params.title, plot: params.plot, year: params.year },
          params.length
        );
        break;

      case 'chemistry':
        result = await enhancedOpenAI.analyzeCastChemistry(userId, params.actors, params.movieTitle);
        break;

      case 'compare':
        result = await enhancedOpenAI.compareMovies(userId, params.movie1, params.movie2);
        break;

      case 'genreMood':
        result = await enhancedOpenAI.matchGenreToMood(userId, params.mood);
        break;

      case 'timeMatch':
        result = await enhancedOpenAI.suggestByTime(userId, params.availableMinutes, params.preferences);
        break;

      case 'hiddenGems':
        result = await enhancedOpenAI.findHiddenGems(userId, params.genre, params.minYear);
        break;

      case 'directorStyle':
        result = await enhancedOpenAI.analyzeDirectorStyle(userId, params.directorName);
        break;

      case 'quote':
        result = await enhancedOpenAI.generateMovieQuote(userId, params.movieTitle);
        break;

      case 'sequel':
        result = await enhancedOpenAI.predictSequel(userId, params.movieTitle);
        break;

      case 'movieNight':
        result = await enhancedOpenAI.planMovieNight(
          userId,
          params.groupSize,
          params.preferences,
          params.duration
        );
        break;

      case 'universe':
        result = await enhancedOpenAI.buildCinematicUniverse(userId, params.movies);
        break;

      default:
        throw createError.validationError(`Unknown feature: ${feature}`);
    }

    return NextResponse.json({
      success: true,
      feature,
      ...result,
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

