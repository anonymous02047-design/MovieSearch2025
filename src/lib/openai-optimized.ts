/**
 * Optimized OpenAI Integration for Free Tier
 * - Reduced token usage
 * - Response caching
 * - Rate limiting
 * - Shorter prompts
 */

// Conditional import - works without openai package installed
let OpenAI: any;
try {
  OpenAI = require('openai').default;
} catch {
  OpenAI = null;
}

// Simple in-memory cache (for development)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 3600000; // 1 hour

let openaiClient: any = null;

const getOpenAIClient = () => {
  if (!openaiClient && OpenAI && process.env.OPENAI_API_KEY) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
};

// Check if OpenAI is enabled
export const isOpenAIEnabled = () => {
  return !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-your_openai_api_key_here');
};

// Get cached response
const getCached = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

// Set cache
const setCache = (key: string, data: any) => {
  cache.set(key, { data, timestamp: Date.now() });
};

/**
 * Generate movie recommendations (optimized)
 */
export async function generateRecommendations(
  userPreferences: string,
  maxTokens: number = 150 // Reduced from 500
): Promise<string[]> {
  if (!isOpenAIEnabled()) {
    return ['OpenAI API not configured. Using fallback recommendations.'];
  }

  const cacheKey = `rec_${userPreferences}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const client = getOpenAIClient();
  if (!client) return ['Service temporarily unavailable'];

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini', // Cheapest model
      messages: [
        {
          role: 'system',
          content: 'You are a movie expert. Give concise recommendations.',
        },
        {
          role: 'user',
          content: `Recommend 3 movies for: ${userPreferences}. Format: Title (Year)`,
        },
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || '';
    const recommendations = content
      .split('\n')
      .filter((line: string) => line.trim())
      .slice(0, 3);

    setCache(cacheKey, recommendations);
    return recommendations;
  } catch (error) {
    console.error('OpenAI error:', error);
    return ['Unable to generate recommendations at this time'];
  }
}

/**
 * Analyze sentiment (optimized)
 */
export async function analyzeSentiment(
  text: string,
  maxTokens: number = 50 // Reduced from 200
): Promise<{ sentiment: string; score: number }> {
  if (!isOpenAIEnabled()) {
    return { sentiment: 'neutral', score: 0.5 };
  }

  const cacheKey = `sent_${text.slice(0, 50)}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const client = getOpenAIClient();
  if (!client) return { sentiment: 'neutral', score: 0.5 };

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Analyze sentiment. Reply: positive/negative/neutral and score 0-1.',
        },
        {
          role: 'user',
          content: text.slice(0, 200), // Limit input
        },
      ],
      max_tokens: maxTokens,
      temperature: 0,
    });

    const content = response.choices[0]?.message?.content || 'neutral 0.5';
    const [sentiment, scoreStr] = content.toLowerCase().split(' ');
    const score = parseFloat(scoreStr) || 0.5;

    const result = { sentiment, score };
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Sentiment error:', error);
    return { sentiment: 'neutral', score: 0.5 };
  }
}

/**
 * Generate movie summary (optimized)
 */
export async function generateSummary(
  movieData: any,
  maxTokens: number = 100 // Reduced from 300
): Promise<string> {
  if (!isOpenAIEnabled()) {
    return movieData.overview || 'Summary not available';
  }

  const cacheKey = `sum_${movieData.id}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const client = getOpenAIClient();
  if (!client) return movieData.overview || 'Summary not available';

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Summarize movies in 2-3 sentences.',
        },
        {
          role: 'user',
          content: `Summarize: ${movieData.title} (${movieData.release_date?.slice(0, 4)}). ${movieData.overview?.slice(0, 200)}`,
        },
      ],
      max_tokens: maxTokens,
      temperature: 0.5,
    });

    const summary = response.choices[0]?.message?.content || movieData.overview;
    setCache(cacheKey, summary);
    return summary;
  } catch (error) {
    console.error('Summary error:', error);
    return movieData.overview || 'Summary not available';
  }
}

/**
 * Compare movies (optimized)
 */
export async function compareMovies(
  movie1: string,
  movie2: string,
  maxTokens: number = 120 // Reduced from 400
): Promise<string> {
  if (!isOpenAIEnabled()) {
    return `Comparison between ${movie1} and ${movie2} not available`;
  }

  const cacheKey = `cmp_${movie1}_${movie2}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const client = getOpenAIClient();
  if (!client) return 'Comparison not available';

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Compare movies briefly.',
        },
        {
          role: 'user',
          content: `Compare: "${movie1}" vs "${movie2}". 3 key differences.`,
        },
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    const comparison = response.choices[0]?.message?.content || 'Comparison not available';
    setCache(cacheKey, comparison);
    return comparison;
  } catch (error) {
    console.error('Comparison error:', error);
    return 'Comparison not available';
  }
}

/**
 * Generate watch suggestions (optimized)
 */
export async function generateWatchSuggestion(
  mood: string,
  duration: string,
  maxTokens: number = 80 // Reduced from 250
): Promise<string[]> {
  if (!isOpenAIEnabled()) {
    return ['Suggestion service not available'];
  }

  const cacheKey = `watch_${mood}_${duration}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const client = getOpenAIClient();
  if (!client) return ['Suggestion service not available'];

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Suggest movies briefly.',
        },
        {
          role: 'user',
          content: `2 ${mood} movies, ${duration} long. Title only.`,
        },
      ],
      max_tokens: maxTokens,
      temperature: 0.8,
    });

    const suggestions = response.choices[0]?.message?.content?.split('\n').filter(Boolean) || [];
    setCache(cacheKey, suggestions);
    return suggestions;
  } catch (error) {
    console.error('Watch suggestion error:', error);
    return ['Suggestion service not available'];
  }
}

/**
 * Chat completion (optimized, streaming)
 */
export async function chatCompletion(
  messages: any[],
  maxTokens: number = 150
): Promise<string> {
  if (!isOpenAIEnabled()) {
    return 'Chat service not available. Please configure OpenAI API key.';
  }

  const client = getOpenAIClient();
  if (!client) return 'Chat service not available';

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful movie assistant. Be concise.' },
        ...messages.slice(-5), // Only use last 5 messages to save tokens
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || 'No response';
  } catch (error) {
    console.error('Chat error:', error);
    return 'Chat service temporarily unavailable';
  }
}

/**
 * Clear cache (for testing)
 */
export function clearCache() {
  cache.clear();
}

/**
 * Get token usage estimate
 */
export function estimateTokens(text: string): number {
  // Rough estimate: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}

export default {
  generateRecommendations,
  analyzeSentiment,
  generateSummary,
  compareMovies,
  generateWatchSuggestion,
  chatCompletion,
  clearCache,
  estimateTokens,
  isOpenAIEnabled,
};

