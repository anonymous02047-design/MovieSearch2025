/**
 * OpenAI API Client
 * Handles all interactions with OpenAI API for AI-powered features
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface EmbeddingResponse {
  object: string;
  data: {
    object: string;
    index: number;
    embedding: number[];
  }[];
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

class OpenAIClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || OPENAI_API_KEY || '';
    this.baseUrl = OPENAI_API_URL;
  }

  /**
   * Check if OpenAI API is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey && this.apiKey.length > 0;
  }

  /**
   * Create chat completion
   */
  async createChatCompletion(
    messages: ChatMessage[],
    options: {
      model?: string;
      temperature?: number;
      max_tokens?: number;
      stream?: boolean;
    } = {}
  ): Promise<ChatCompletionResponse> {
    if (!this.isConfigured()) {
      throw new Error('OpenAI API key is not configured');
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: options.model || 'gpt-4o-mini', // Use cost-effective model by default
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.max_tokens ?? 1000,
        stream: options.stream ?? false,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API Error: ${error.error?.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * Create embeddings for semantic search
   */
  async createEmbedding(text: string | string[]): Promise<EmbeddingResponse> {
    if (!this.isConfigured()) {
      throw new Error('OpenAI API key is not configured');
    }

    const input = Array.isArray(text) ? text : [text];

    const response = await fetch(`${this.baseUrl}/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small', // Cost-effective embedding model
        input,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API Error: ${error.error?.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * Generate movie recommendations based on user preferences
   */
  async generateMovieRecommendations(
    userPreferences: {
      favoriteGenres?: string[];
      favoriteMovies?: string[];
      watchHistory?: string[];
      mood?: string;
      preferences?: string;
    },
    count: number = 5
  ): Promise<string[]> {
    const systemPrompt = `You are an expert movie recommendation system. Based on user preferences, suggest movies that they would enjoy. Return ONLY a JSON array of movie titles, nothing else. Format: ["Movie Title 1", "Movie Title 2", ...]`;

    const userPrompt = `Based on these preferences, recommend ${count} movies:
${userPreferences.favoriteGenres ? `Favorite Genres: ${userPreferences.favoriteGenres.join(', ')}` : ''}
${userPreferences.favoriteMovies ? `Favorite Movies: ${userPreferences.favoriteMovies.join(', ')}` : ''}
${userPreferences.watchHistory ? `Recently Watched: ${userPreferences.watchHistory.slice(0, 5).join(', ')}` : ''}
${userPreferences.mood ? `Current Mood: ${userPreferences.mood}` : ''}
${userPreferences.preferences ? `Additional Preferences: ${userPreferences.preferences}` : ''}`;

    const response = await this.createChatCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], {
      temperature: 0.8, // Higher temperature for more creative recommendations
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content || '[]';
    try {
      const recommendations = JSON.parse(content);
      return Array.isArray(recommendations) ? recommendations : [];
    } catch (error) {
      console.error('Failed to parse OpenAI response:', content);
      return [];
    }
  }

  /**
   * Analyze movie review sentiment
   */
  async analyzeReviewSentiment(review: string): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
    summary: string;
    keywords: string[];
  }> {
    const systemPrompt = `You are a sentiment analysis expert. Analyze movie reviews and return a JSON object with: sentiment (positive/negative/neutral), score (0-1), summary (brief), and keywords (array). Format: {"sentiment": "positive", "score": 0.8, "summary": "...", "keywords": ["..."]}`;

    const response = await this.createChatCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Analyze this movie review: "${review}"` },
    ], {
      temperature: 0.3, // Lower temperature for more consistent analysis
      max_tokens: 300,
    });

    const content = response.choices[0]?.message?.content || '{}';
    try {
      return JSON.parse(content);
    } catch (error) {
      console.error('Failed to parse sentiment analysis:', content);
      return {
        sentiment: 'neutral',
        score: 0.5,
        summary: 'Unable to analyze',
        keywords: [],
      };
    }
  }

  /**
   * Answer movie-related questions
   */
  async answerMovieQuestion(
    question: string,
    context?: {
      movieTitle?: string;
      moviePlot?: string;
      movieGenre?: string;
      movieYear?: number;
    }
  ): Promise<string> {
    const systemPrompt = `You are a helpful movie assistant with extensive knowledge about films, actors, directors, and cinema. Provide accurate, engaging, and concise answers to movie-related questions.`;

    let userPrompt = question;
    if (context) {
      userPrompt = `Context: ${context.movieTitle ? `Movie: ${context.movieTitle}` : ''} ${context.moviePlot ? `Plot: ${context.moviePlot}` : ''} ${context.movieGenre ? `Genre: ${context.movieGenre}` : ''} ${context.movieYear ? `Year: ${context.movieYear}` : ''}

Question: ${question}`;
    }

    const response = await this.createChatCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], {
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || 'Sorry, I couldn\'t find an answer to your question.';
  }

  /**
   * Generate movie summary/description
   */
  async generateMovieSummary(
    movieData: {
      title: string;
      plot?: string;
      genre?: string[];
      cast?: string[];
      director?: string;
      year?: number;
    },
    length: 'short' | 'medium' | 'long' = 'medium'
  ): Promise<string> {
    const maxTokens = length === 'short' ? 100 : length === 'medium' ? 200 : 400;
    
    const systemPrompt = `You are a professional movie critic and writer. Generate engaging, spoiler-free movie summaries that capture the essence of the film.`;

    const userPrompt = `Generate a ${length} summary for this movie:
Title: ${movieData.title}
${movieData.plot ? `Plot: ${movieData.plot}` : ''}
${movieData.genre ? `Genre: ${movieData.genre.join(', ')}` : ''}
${movieData.cast ? `Cast: ${movieData.cast.slice(0, 3).join(', ')}` : ''}
${movieData.director ? `Director: ${movieData.director}` : ''}
${movieData.year ? `Year: ${movieData.year}` : ''}`;

    const response = await this.createChatCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], {
      temperature: 0.7,
      max_tokens: maxTokens,
    });

    return response.choices[0]?.message?.content || 'Summary unavailable.';
  }

  /**
   * Compare two movies and provide analysis
   */
  async compareMovies(
    movie1: { title: string; plot?: string; genre?: string[] },
    movie2: { title: string; plot?: string; genre?: string[] }
  ): Promise<string> {
    const systemPrompt = `You are a film analyst. Compare two movies, highlighting similarities, differences, themes, and which audiences might prefer each.`;

    const userPrompt = `Compare these two movies:

Movie 1: ${movie1.title}
${movie1.plot ? `Plot: ${movie1.plot}` : ''}
${movie1.genre ? `Genre: ${movie1.genre.join(', ')}` : ''}

Movie 2: ${movie2.title}
${movie2.plot ? `Plot: ${movie2.plot}` : ''}
${movie2.genre ? `Genre: ${movie2.genre.join(', ')}` : ''}`;

    const response = await this.createChatCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], {
      temperature: 0.7,
      max_tokens: 600,
    });

    return response.choices[0]?.message?.content || 'Comparison unavailable.';
  }

  /**
   * Generate personalized watch suggestions based on time and mood
   */
  async generateWatchSuggestion(
    availableTime: number, // in minutes
    mood: string,
    preferences?: string[]
  ): Promise<{
    suggestion: string;
    reason: string;
    alternatives: string[];
  }> {
    const systemPrompt = `You are a movie curator. Suggest movies based on available time and mood. Return JSON: {"suggestion": "Movie Title", "reason": "Why this movie", "alternatives": ["Movie 2", "Movie 3"]}`;

    const userPrompt = `Suggest a movie for someone with ${availableTime} minutes available, feeling ${mood}${preferences ? `, who likes ${preferences.join(', ')}` : ''}.`;

    const response = await this.createChatCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], {
      temperature: 0.8,
      max_tokens: 400,
    });

    const content = response.choices[0]?.message?.content || '{}';
    try {
      return JSON.parse(content);
    } catch (error) {
      console.error('Failed to parse watch suggestion:', content);
      return {
        suggestion: 'Unable to generate suggestion',
        reason: 'Please try again',
        alternatives: [],
      };
    }
  }
}

// Export singleton instance
export const openai = new OpenAIClient();

// Export class for custom instances
export { OpenAIClient };

// Export types
export type { ChatMessage, ChatCompletionResponse, EmbeddingResponse };

