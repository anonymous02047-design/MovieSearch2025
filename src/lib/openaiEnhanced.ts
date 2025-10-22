/**
 * Enhanced OpenAI API Client with Token Optimization & Rate Limiting
 * - 13+ Advanced AI features
 * - Token usage optimization
 * - Response caching
 * - Rate limiting per user
 * - Cost tracking
 */

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
}

interface RateLimitInfo {
  userId: string;
  requestCount: number;
  tokenCount: number;
  resetTime: number;
}

interface CacheEntry {
  response: any;
  timestamp: number;
  tokens: number;
}

class EnhancedOpenAIClient {
  private apiKey: string;
  private baseUrl: string = 'https://api.openai.com/v1';
  private cache: Map<string, CacheEntry> = new Map();
  private rateLimits: Map<string, RateLimitInfo> = new Map();
  
  // Rate limiting configuration
  private readonly MAX_REQUESTS_PER_HOUR = 50;
  private readonly MAX_TOKENS_PER_HOUR = 50000;
  private readonly CACHE_TTL = 3600000; // 1 hour
  
  // Token costs (per 1M tokens)
  private readonly TOKEN_COSTS = {
    'gpt-4o-mini': { input: 0.15, output: 0.60 },
    'gpt-3.5-turbo': { input: 0.50, output: 1.50 },
    'text-embedding-3-small': { input: 0.02, output: 0 },
  };

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
  }

  /**
   * Check rate limits for user
   */
  private checkRateLimit(userId: string): { allowed: boolean; reason?: string } {
    const now = Date.now();
    let userLimit = this.rateLimits.get(userId);

    // Reset if hour has passed
    if (userLimit && now > userLimit.resetTime) {
      userLimit = undefined;
      this.rateLimits.delete(userId);
    }

    if (!userLimit) {
      userLimit = {
        userId,
        requestCount: 0,
        tokenCount: 0,
        resetTime: now + 3600000, // 1 hour from now
      };
      this.rateLimits.set(userId, userLimit);
    }

    // Check limits
    if (userLimit.requestCount >= this.MAX_REQUESTS_PER_HOUR) {
      return { 
        allowed: false, 
        reason: `Rate limit exceeded: ${this.MAX_REQUESTS_PER_HOUR} requests per hour`
      };
    }

    if (userLimit.tokenCount >= this.MAX_TOKENS_PER_HOUR) {
      return { 
        allowed: false, 
        reason: `Token limit exceeded: ${this.MAX_TOKENS_PER_HOUR} tokens per hour`
      };
    }

    return { allowed: true };
  }

  /**
   * Update rate limit tracking
   */
  private updateRateLimit(userId: string, tokens: number) {
    const userLimit = this.rateLimits.get(userId);
    if (userLimit) {
      userLimit.requestCount++;
      userLimit.tokenCount += tokens;
    }
  }

  /**
   * Get cache key for request
   */
  private getCacheKey(method: string, params: any): string {
    return `${method}:${JSON.stringify(params)}`;
  }

  /**
   * Get from cache
   */
  private getFromCache(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > this.CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }

    return entry.response;
  }

  /**
   * Save to cache
   */
  private saveToCache(key: string, response: any, tokens: number) {
    this.cache.set(key, {
      response,
      timestamp: Date.now(),
      tokens,
    });

    // Cleanup old entries
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  /**
   * Calculate estimated cost
   */
  private calculateCost(model: string, usage: { prompt_tokens: number; completion_tokens: number }): number {
    const costs = this.TOKEN_COSTS[model as keyof typeof this.TOKEN_COSTS] || this.TOKEN_COSTS['gpt-4o-mini'];
    const inputCost = (usage.prompt_tokens / 1000000) * costs.input;
    const outputCost = (usage.completion_tokens / 1000000) * costs.output;
    return inputCost + outputCost;
  }

  /**
   * Optimized chat completion with caching and rate limiting
   */
  private async optimizedChatCompletion(
    userId: string,
    messages: ChatMessage[],
    options: {
      model?: string;
      temperature?: number;
      max_tokens?: number;
      useCache?: boolean;
    } = {}
  ): Promise<{ response: string; usage: TokenUsage }> {
    // Check rate limits
    const rateLimitCheck = this.checkRateLimit(userId);
    if (!rateLimitCheck.allowed) {
      throw new Error(rateLimitCheck.reason);
    }

    // Check cache
    const cacheKey = this.getCacheKey('chat', { messages, ...options });
    if (options.useCache !== false) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // Make API request
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: options.model || 'gpt-4o-mini',
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.max_tokens ?? 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI Error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const result = {
      response: data.choices[0]?.message?.content || '',
      usage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
        estimatedCost: this.calculateCost(options.model || 'gpt-4o-mini', data.usage),
      },
    };

    // Update rate limits
    this.updateRateLimit(userId, result.usage.totalTokens);

    // Cache result
    if (options.useCache !== false) {
      this.saveToCache(cacheKey, result, result.usage.totalTokens);
    }

    return result;
  }

  // ==========================================
  // 13+ ADVANCED AI FEATURES
  // ==========================================

  /**
   * 1. Smart Movie Recommendations (Optimized)
   */
  async getSmartRecommendations(
    userId: string,
    preferences: {
      genres?: string[];
      mood?: string;
      recentWatched?: string[];
    },
    count: number = 5
  ): Promise<{ movies: string[]; usage: TokenUsage }> {
    const prompt = `Recommend ${count} movies. Genres: ${preferences.genres?.join(',')||'any'}. Mood: ${preferences.mood||'any'}. Recent: ${preferences.recentWatched?.slice(0,3).join(',')||'none'}. Return JSON array: ["Title1","Title2",...]`;

    const result = await this.optimizedChatCompletion(userId, [
      { role: 'system', content: 'Movie expert. JSON only.' },
      { role: 'user', content: prompt },
    ], { max_tokens: 300, temperature: 0.8 });

    try {
      const movies = JSON.parse(result.response);
      return { movies: Array.isArray(movies) ? movies : [], usage: result.usage };
    } catch {
      return { movies: [], usage: result.usage };
    }
  }

  /**
   * 2. Quick Sentiment Analysis (Ultra-optimized)
   */
  async analyzeSentiment(
    userId: string,
    text: string
  ): Promise<{ sentiment: string; score: number; usage: TokenUsage }> {
    const prompt = `Sentiment of: "${text.slice(0, 500)}". JSON: {"sentiment":"positive/negative/neutral","score":0-1}`;

    const result = await this.optimizedChatCompletion(userId, [
      { role: 'system', content: 'Sentiment analyzer. JSON only.' },
      { role: 'user', content: prompt },
    ], { max_tokens: 50, temperature: 0.3 });

    try {
      const data = JSON.parse(result.response);
      return { sentiment: data.sentiment, score: data.score, usage: result.usage };
    } catch {
      return { sentiment: 'neutral', score: 0.5, usage: result.usage };
    }
  }

  /**
   * 3. Movie Trivia Generator
   */
  async generateTrivia(
    userId: string,
    movieTitle: string,
    difficulty: 'easy' | 'medium' | 'hard' = 'medium'
  ): Promise<{ question: string; options: string[]; answer: string; usage: TokenUsage }> {
    const prompt = `Generate ${difficulty} trivia for "${movieTitle}". JSON: {"q":"question","opts":["A","B","C","D"],"ans":"correct"}`;

    const result = await this.optimizedChatCompletion(userId, [
      { role: 'system', content: 'Movie trivia expert. JSON only.' },
      { role: 'user', content: prompt },
    ], { max_tokens: 200 });

    try {
      const data = JSON.parse(result.response);
      return { question: data.q, options: data.opts, answer: data.ans, usage: result.usage };
    } catch {
      return { question: '', options: [], answer: '', usage: result.usage };
    }
  }

  /**
   * 4. Plot Summary Generator (Token-optimized)
   */
  async generatePlotSummary(
    userId: string,
    movieData: { title: string; plot?: string; year?: number },
    length: 'short' | 'medium' = 'short'
  ): Promise<{ summary: string; usage: TokenUsage }> {
    const maxTokens = length === 'short' ? 100 : 200;
    const prompt = `${length} summary of "${movieData.title}"${movieData.year ? ` (${movieData.year})` : ''}${movieData.plot ? `. Plot: ${movieData.plot.slice(0, 200)}` : ''}`;

    const result = await this.optimizedChatCompletion(userId, [
      { role: 'system', content: 'Movie summarizer.' },
      { role: 'user', content: prompt },
    ], { max_tokens: maxTokens });

    return { summary: result.response, usage: result.usage };
  }

  /**
   * 5. Cast Chemistry Analysis
   */
  async analyzeCastChemistry(
    userId: string,
    actors: string[],
    movieTitle: string
  ): Promise<{ analysis: string; rating: number; usage: TokenUsage }> {
    const prompt = `Analyze chemistry of ${actors.slice(0, 3).join(', ')} in "${movieTitle}". JSON: {"analysis":"brief","rating":0-10}`;

    const result = await this.optimizedChatCompletion(userId, [
      { role: 'system', content: 'Film critic. JSON only.' },
      { role: 'user', content: prompt },
    ], { max_tokens: 150 });

    try {
      const data = JSON.parse(result.response);
      return { analysis: data.analysis, rating: data.rating, usage: result.usage };
    } catch {
      return { analysis: '', rating: 0, usage: result.usage };
    }
  }

  /**
   * 6. Movie vs Movie Battle
   */
  async compareMovies(
    userId: string,
    movie1: string,
    movie2: string
  ): Promise<{ comparison: string; winner: string; usage: TokenUsage }> {
    const prompt = `Compare "${movie1}" vs "${movie2}". Which is better? JSON: {"comp":"brief","winner":"movie1/movie2/tie"}`;

    const result = await this.optimizedChatCompletion(userId, [
      { role: 'system', content: 'Movie comparator. JSON only.' },
      { role: 'user', content: prompt },
    ], { max_tokens: 250 });

    try {
      const data = JSON.parse(result.response);
      return { comparison: data.comp, winner: data.winner, usage: result.usage };
    } catch {
      return { comparison: '', winner: 'tie', usage: result.usage };
    }
  }

  /**
   * 7. Genre Mood Matcher
   */
  async matchGenreToMood(
    userId: string,
    mood: string
  ): Promise<{ genres: string[]; reasoning: string; usage: TokenUsage }> {
    const prompt = `Best genres for mood: "${mood}". JSON: {"genres":["genre1","genre2"],"why":"brief"}`;

    const result = await this.optimizedChatCompletion(userId, [
      { role: 'system', content: 'Genre expert. JSON only.' },
      { role: 'user', content: prompt },
    ], { max_tokens: 150 });

    try {
      const data = JSON.parse(result.response);
      return { genres: data.genres, reasoning: data.why, usage: result.usage };
    } catch {
      return { genres: [], reasoning: '', usage: result.usage };
    }
  }

  /**
   * 8. Watch Time Suggester
   */
  async suggestByTime(
    userId: string,
    availableMinutes: number,
    preferences?: string
  ): Promise<{ movies: string[]; reason: string; usage: TokenUsage }> {
    const prompt = `Movies for ${availableMinutes}min${preferences ? `, likes: ${preferences}` : ''}. JSON: {"movies":["m1","m2"],"why":"brief"}`;

    const result = await this.optimizedChatCompletion(userId, [
      { role: 'system', content: 'Time-based curator. JSON only.' },
      { role: 'user', content: prompt },
    ], { max_tokens: 200 });

    try {
      const data = JSON.parse(result.response);
      return { movies: data.movies, reason: data.why, usage: result.usage };
    } catch {
      return { movies: [], reason: '', usage: result.usage };
    }
  }

  /**
   * 9. Hidden Gem Finder
   */
  async findHiddenGems(
    userId: string,
    genre: string,
    minYear?: number
  ): Promise<{ gems: string[]; why: string[]; usage: TokenUsage }> {
    const prompt = `5 underrated ${genre} movies${minYear ? ` after ${minYear}` : ''}. JSON: {"gems":["m1","m2"],"why":["reason1","reason2"]}`;

    const result = await this.optimizedChatCompletion(userId, [
      { role: 'system', content: 'Hidden gem finder. JSON only.' },
      { role: 'user', content: prompt },
    ], { max_tokens: 350 });

    try {
      const data = JSON.parse(result.response);
      return { gems: data.gems, why: data.why, usage: result.usage };
    } catch {
      return { gems: [], why: [], usage: result.usage };
    }
  }

  /**
   * 10. Director Style Analyzer
   */
  async analyzeDirectorStyle(
    userId: string,
    directorName: string
  ): Promise<{ style: string; signature: string[]; usage: TokenUsage }> {
    const prompt = `Analyze ${directorName}'s directing style. JSON: {"style":"brief","sig":["trait1","trait2"]}`;

    const result = await this.optimizedChatCompletion(userId, [
      { role: 'system', content: 'Film analyst. JSON only.' },
      { role: 'user', content: prompt },
    ], { max_tokens: 200 });

    try {
      const data = JSON.parse(result.response);
      return { style: data.style, signature: data.sig, usage: result.usage };
    } catch {
      return { style: '', signature: [], usage: result.usage };
    }
  }

  /**
   * 11. Movie Quote Generator
   */
  async generateMovieQuote(
    userId: string,
    movieTitle: string
  ): Promise<{ quote: string; character: string; context: string; usage: TokenUsage }> {
    const prompt = `Famous quote from "${movieTitle}". JSON: {"quote":"text","char":"name","ctx":"brief"}`;

    const result = await this.optimizedChatCompletion(userId, [
      { role: 'system', content: 'Quote master. JSON only.' },
      { role: 'user', content: prompt },
    ], { max_tokens: 150 });

    try {
      const data = JSON.parse(result.response);
      return { quote: data.quote, character: data.char, context: data.ctx, usage: result.usage };
    } catch {
      return { quote: '', character: '', context: '', usage: result.usage };
    }
  }

  /**
   * 12. Sequel Predictor
   */
  async predictSequel(
    userId: string,
    movieTitle: string
  ): Promise<{ likelihood: number; reasons: string[]; plotIdeas: string; usage: TokenUsage }> {
    const prompt = `Will "${movieTitle}" get a sequel? JSON: {"chance":0-100,"why":["r1","r2"],"plot":"brief"}`;

    const result = await this.optimizedChatCompletion(userId, [
      { role: 'system', content: 'Sequel predictor. JSON only.' },
      { role: 'user', content: prompt },
    ], { max_tokens: 250 });

    try {
      const data = JSON.parse(result.response);
      return { likelihood: data.chance, reasons: data.why, plotIdeas: data.plot, usage: result.usage };
    } catch {
      return { likelihood: 0, reasons: [], plotIdeas: '', usage: result.usage };
    }
  }

  /**
   * 13. Movie Night Planner
   */
  async planMovieNight(
    userId: string,
    groupSize: number,
    preferences: string[],
    duration: number
  ): Promise<{ plan: string[]; schedule: string; tips: string[]; usage: TokenUsage }> {
    const prompt = `Plan ${duration}min movie night for ${groupSize} people who like ${preferences.join(',')}. JSON: {"plan":["m1","m2"],"sched":"timeline","tips":["tip1","tip2"]}`;

    const result = await this.optimizedChatCompletion(userId, [
      { role: 'system', content: 'Movie night planner. JSON only.' },
      { role: 'user', content: prompt },
    ], { max_tokens: 400 });

    try {
      const data = JSON.parse(result.response);
      return { plan: data.plan, schedule: data.sched, tips: data.tips, usage: result.usage };
    } catch {
      return { plan: [], schedule: '', tips: [], usage: result.usage };
    }
  }

  /**
   * 14. Cinematic Universe Builder
   */
  async buildCinematicUniverse(
    userId: string,
    movies: string[]
  ): Promise<{ connections: string; timeline: string[]; crossover: string; usage: TokenUsage }> {
    const prompt = `Connect ${movies.slice(0, 3).join(',')} in cinematic universe. JSON: {"conn":"how","time":["event1","event2"],"cross":"idea"}`;

    const result = await this.optimizedChatCompletion(userId, [
      { role: 'system', content: 'Universe builder. JSON only.' },
      { role: 'user', content: prompt },
    ], { max_tokens: 350 });

    try {
      const data = JSON.parse(result.response);
      return { connections: data.conn, timeline: data.time, crossover: data.cross, usage: result.usage };
    } catch {
      return { connections: '', timeline: [], crossover: '', usage: result.usage };
    }
  }

  /**
   * Get user's rate limit status
   */
  getRateLimitStatus(userId: string): {
    requestsRemaining: number;
    tokensRemaining: number;
    resetTime: Date;
  } {
    const userLimit = this.rateLimits.get(userId);
    if (!userLimit) {
      return {
        requestsRemaining: this.MAX_REQUESTS_PER_HOUR,
        tokensRemaining: this.MAX_TOKENS_PER_HOUR,
        resetTime: new Date(Date.now() + 3600000),
      };
    }

    return {
      requestsRemaining: this.MAX_REQUESTS_PER_HOUR - userLimit.requestCount,
      tokensRemaining: this.MAX_TOKENS_PER_HOUR - userLimit.tokenCount,
      resetTime: new Date(userLimit.resetTime),
    };
  }

  /**
   * Clear cache (admin function)
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get cache stats
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    };
  }
}

// Export singleton instance
export const enhancedOpenAI = new EnhancedOpenAIClient();

// Export class
export { EnhancedOpenAIClient };

// Export types
export type { ChatMessage, TokenUsage, RateLimitInfo };

