# 🤖 OPENAI INTEGRATION GUIDE
## Complete Guide for AI-Powered Features

**Last Updated**: October 22, 2025  
**Version**: 1.0.0  

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Features Included](#features-included)
3. [OpenAI API Setup](#openai-api-setup)
4. [Configuration](#configuration)
5. [Using AI Features](#using-ai-features)
6. [API Routes](#api-routes)
7. [Components](#components)
8. [Cost Optimization](#cost-optimization)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 OVERVIEW

MovieSearch 2025 now includes **6 powerful AI features** powered by OpenAI's GPT models:

1. **AI Movie Recommendations** - Personalized suggestions based on preferences
2. **AI Chat Assistant** - Natural language movie queries and information
3. **Sentiment Analysis** - Analyze movie reviews automatically
4. **Movie Summaries** - AI-generated movie descriptions
5. **Movie Comparison** - Compare two movies with AI insights
6. **Watch Suggestions** - Time and mood-based recommendations

---

## ✨ FEATURES INCLUDED

### 1. AI Movie Recommendations
- Based on favorite genres
- Considers watch history
- Mood-based suggestions
- Personalized preferences
- Returns 5+ movie recommendations

### 2. AI Chat Assistant
- Natural language processing
- Movie-related questions
- Actor and director information
- Genre recommendations
- Real-time conversational interface

### 3. Sentiment Analysis
- Analyze review sentiment (positive/negative/neutral)
- Confidence score (0-1)
- Summary generation
- Keyword extraction
- Visual sentiment indicators

### 4. Movie Summaries
- Short, medium, or long summaries
- Spoiler-free descriptions
- Professional writing style
- Based on plot, cast, director

### 5. Movie Comparison
- Compare two movies
- Highlight similarities and differences
- Theme analysis
- Audience recommendations

### 6. Watch Suggestions
- Based on available time
- Mood consideration
- Multiple alternatives
- Reasoning provided

---

## 🔑 OPENAI API SETUP

### Step 1: Create OpenAI Account

1. **Go to OpenAI Platform**
   - Visit: https://platform.openai.com
   - Click **"Sign Up"** (or Sign In if you have an account)

2. **Complete Registration**
   - Use email or Google/Microsoft account
   - Verify your email
   - Add payment method (required for API access)

### Step 2: Generate API Key

1. **Navigate to API Keys**
   - Go to: https://platform.openai.com/api-keys
   - Or: Dashboard → API Keys

2. **Create New Key**
   - Click **"+ Create new secret key"**
   - Name: `MovieSearch 2025` (or any name)
   - Permissions: **All** (or specific permissions)
   - Click **"Create secret key"**

3. **Copy and Save Key**
   ```
   sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   
   **⚠️ CRITICAL**: 
   - Copy the key **IMMEDIATELY**
   - You won't be able to see it again!
   - Store it securely (password manager recommended)

### Step 3: Add Credits (Optional)

OpenAI offers:
- **$5 free credits** for new accounts (limited time)
- Pay-as-you-go pricing after free credits

**Estimated Costs**:
- GPT-4o-mini: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- Typical conversation: $0.002 - $0.01
- 100 AI interactions: ~$0.20 - $1.00

---

## ⚙️ CONFIGURATION

### Local Development Setup

1. **Create/Update `.env.local`**
   ```bash
   # Copy env.example if you haven't already
   cp env.example .env.local
   ```

2. **Add OpenAI API Key**
   ```env
   # ==============================================
   # 🤖 OPENAI API (Optional - for AI features)
   # ==============================================
   OPENAI_API_KEY=sk-proj-your-actual-api-key-here
   ```

3. **Restart Development Server**
   ```bash
   npm run dev
   ```

### Production Setup (Netlify)

1. **Go to Netlify Dashboard**
   - Site Settings → Environment Variables

2. **Add New Variable**
   ```
   Key:   OPENAI_API_KEY
   Value: sk-proj-your-actual-api-key-here
   ```

3. **Scopes**: 
   - All deploy contexts (or customize)

4. **Redeploy Site**
   - Trigger new deploy
   - Or wait for next git push

### Verify Configuration

Create a test file: `scripts/test-openai.js`

```javascript
async function testOpenAI() {
  try {
    const response = await fetch('http://localhost:3000/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: 'What is a good action movie?'
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ OpenAI is working!');
      console.log('Answer:', data.answer);
    } else {
      console.log('❌ OpenAI error:', data.error);
    }
  } catch (error) {
    console.log('❌ Request failed:', error.message);
  }
}

testOpenAI();
```

Run test:
```bash
node scripts/test-openai.js
```

---

## 🎨 USING AI FEATURES

### 1. AI Recommendations Component

```tsx
import AIRecommendations from '@/components/AIRecommendations';

function MyPage() {
  return (
    <AIRecommendations
      open={true}
      onClose={() => {}}
      onMovieSelect={(title) => console.log('Selected:', title)}
    />
  );
}
```

**Features**:
- Genre selection
- Mood picker
- Favorite movies input
- Additional preferences text area
- Returns 5 movie recommendations

### 2. AI Chat Assistant

```tsx
import AIChatAssistant from '@/components/AIChatAssistant';

function MyLayout() {
  return (
    <>
      {/* Your page content */}
      <AIChatAssistant />
    </>
  );
}
```

**Features**:
- Floating action button
- Drawer-style chat interface
- Suggested questions
- Chat history
- Real-time responses

### 3. Sentiment Analysis

```tsx
import AISentimentAnalysis from '@/components/AISentimentAnalysis';

function ReviewPage() {
  return (
    <AISentimentAnalysis
      initialReview="This movie was amazing!"
      onAnalysisComplete={(result) => {
        console.log('Sentiment:', result.sentiment);
        console.log('Score:', result.score);
      }}
    />
  );
}
```

**Features**:
- Text input for review
- Sentiment classification (positive/negative/neutral)
- Confidence score
- Summary generation
- Keyword extraction

---

## 🔌 API ROUTES

### POST /api/ai/recommendations

**Request**:
```json
{
  "favoriteGenres": ["Action", "Sci-Fi"],
  "favoriteMovies": ["Inception", "The Matrix"],
  "watchHistory": ["Interstellar"],
  "mood": "Excited",
  "preferences": "I love mind-bending plots",
  "count": 5
}
```

**Response**:
```json
{
  "success": true,
  "recommendations": [
    "Tenet",
    "Arrival",
    "Blade Runner 2049",
    "Ex Machina",
    "Primer"
  ],
  "count": 5
}
```

### POST /api/ai/chat

**Request**:
```json
{
  "question": "What are good movies like Inception?",
  "context": {
    "movieTitle": "Inception",
    "moviePlot": "A thief who steals corporate secrets...",
    "movieGenre": "Sci-Fi"
  }
}
```

**Response**:
```json
{
  "success": true,
  "answer": "If you enjoyed Inception, you'll love...",
  "question": "What are good movies like Inception?"
}
```

### POST /api/ai/sentiment

**Request**:
```json
{
  "review": "This movie was absolutely fantastic! The acting was superb and the plot kept me on the edge of my seat."
}
```

**Response**:
```json
{
  "success": true,
  "analysis": {
    "sentiment": "positive",
    "score": 0.92,
    "summary": "Highly positive review praising acting and plot",
    "keywords": ["fantastic", "superb", "edge of seat"]
  }
}
```

### POST /api/ai/summary

**Request**:
```json
{
  "movieData": {
    "title": "The Dark Knight",
    "plot": "When the menace known as the Joker...",
    "genre": ["Action", "Crime", "Drama"],
    "cast": ["Christian Bale", "Heath Ledger"],
    "director": "Christopher Nolan",
    "year": 2008
  },
  "length": "medium"
}
```

**Response**:
```json
{
  "success": true,
  "summary": "Christopher Nolan's masterpiece...",
  "length": "medium"
}
```

### POST /api/ai/compare

**Request**:
```json
{
  "movie1": {
    "title": "Inception",
    "plot": "A thief who steals corporate secrets...",
    "genre": ["Action", "Sci-Fi", "Thriller"]
  },
  "movie2": {
    "title": "Interstellar",
    "plot": "A team of explorers travel through a wormhole...",
    "genre": ["Adventure", "Drama", "Sci-Fi"]
  }
}
```

**Response**:
```json
{
  "success": true,
  "comparison": "Both films are directed by Christopher Nolan...",
  "movies": ["Inception", "Interstellar"]
}
```

### POST /api/ai/watch-suggestion

**Request**:
```json
{
  "availableTime": 120,
  "mood": "Relaxed",
  "preferences": ["Comedy", "Romance"]
}
```

**Response**:
```json
{
  "success": true,
  "suggestion": {
    "suggestion": "The Grand Budapest Hotel",
    "reason": "Perfect blend of comedy and charm...",
    "alternatives": ["Amélie", "Little Miss Sunshine"]
  }
}
```

---

## 📦 COMPONENTS

### AIRecommendations.tsx
- **Purpose**: Get personalized movie recommendations
- **Location**: `src/components/AIRecommendations.tsx`
- **Props**:
  - `open`: boolean - Dialog open state
  - `onClose`: function - Close handler
  - `onMovieSelect`: function - Movie selection callback

### AIChatAssistant.tsx
- **Purpose**: Interactive chat for movie queries
- **Location**: `src/components/AIChatAssistant.tsx`
- **Props**: None (standalone FAB component)

### AISentimentAnalysis.tsx
- **Purpose**: Analyze review sentiment
- **Location**: `src/components/AISentimentAnalysis.tsx`
- **Props**:
  - `initialReview`: string - Pre-filled review text
  - `onAnalysisComplete`: function - Analysis result callback

---

## 💰 COST OPTIMIZATION

### Model Selection
We use **GPT-4o-mini** for cost-effectiveness:
- **96% cheaper** than GPT-4
- **Still highly capable** for our use cases
- **Fast responses** (< 2 seconds typical)

### Token Optimization
1. **System Prompts**: Concise and specific
2. **Response Format**: JSON for structured data
3. **Max Tokens**: Limited based on feature (100-600)
4. **Temperature**: Adjusted per use case (0.3-0.8)

### Caching Strategy
Consider implementing caching for:
- Common questions
- Movie summaries
- Sentiment analysis results

**Example** (add to API routes):
```typescript
const cache = new Map();
const cacheKey = `sentiment:${review}`;

if (cache.has(cacheKey)) {
  return cache.get(cacheKey);
}
```

### Budget Control
Set usage limits in OpenAI dashboard:
- **Hard Limit**: $10/month (recommended for small apps)
- **Soft Limit**: $5/month (get notified)

---

## 🐛 TROUBLESHOOTING

### Error: "OpenAI API key is not configured"

**Solution**:
1. Check `.env.local` has `OPENAI_API_KEY`
2. Restart dev server
3. Verify key starts with `sk-proj-` or `sk-`

### Error: "Failed to fetch from OpenAI"

**Possible Causes**:
1. **Invalid API key** - Regenerate key
2. **No credits** - Add payment method
3. **Rate limit exceeded** - Wait or upgrade plan
4. **Network issue** - Check internet connection

### Error: "Incorrect API key provided"

**Solution**:
1. Copy API key again from OpenAI dashboard
2. Ensure no extra spaces in `.env.local`
3. Check key hasn't been revoked

### AI Responses are Poor Quality

**Solutions**:
1. **Adjust temperature**: Lower (0.3-0.5) for factual, higher (0.7-0.9) for creative
2. **Improve prompts**: Be more specific in system/user prompts
3. **Add context**: Provide more movie details
4. **Use better model**: Switch to GPT-4 (more expensive)

### Slow Response Times

**Solutions**:
1. **Check max_tokens**: Lower if possible
2. **Network latency**: Use CDN/edge functions
3. **Concurrent requests**: Implement request queuing
4. **Model choice**: GPT-4o-mini is fastest

---

## 📊 FEATURE AVAILABILITY

| Feature | Free Tier | With API Key | Auth Required |
|---------|-----------|--------------|---------------|
| AI Recommendations | ❌ | ✅ | ✅ |
| AI Chat | ❌ | ✅ | ❌ |
| Sentiment Analysis | ❌ | ✅ | ❌ |
| Movie Summaries | ❌ | ✅ | ❌ |
| Movie Comparison | ❌ | ✅ | ❌ |
| Watch Suggestions | ❌ | ✅ | ✅ |

**Notes**:
- All features gracefully handle missing API key
- Error messages guide users to setup
- App remains functional without OpenAI

---

## 🎉 SUMMARY

You've successfully integrated OpenAI into MovieSearch 2025!

**What You Get**:
- ✅ 6 powerful AI features
- ✅ Cost-optimized implementation
- ✅ Production-ready code
- ✅ Comprehensive error handling
- ✅ User-friendly interfaces

**Next Steps**:
1. ✅ Get OpenAI API key
2. ✅ Add to environment variables
3. ✅ Test features locally
4. ✅ Deploy to production
5. ✅ Monitor usage and costs

---

## 📞 SUPPORT

### Resources
- [OpenAI Documentation](https://platform.openai.com/docs)
- [API Reference](https://platform.openai.com/docs/api-reference)
- [Pricing](https://openai.com/pricing)
- [Usage Dashboard](https://platform.openai.com/usage)

### Need Help?
- Check error messages carefully
- Review this guide
- Check OpenAI status: https://status.openai.com
- Review component code in `src/components/AI*.tsx`

---

**Last Updated**: October 22, 2025  
**Version**: 1.0.0  
**Status**: ✅ Production Ready

