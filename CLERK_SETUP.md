# Clerk Authentication Setup Guide

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# TMDB API Configuration
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

## How to Get Your Clerk API Keys

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application or select an existing one
3. Go to "API Keys" section
4. Copy your:
   - **Publishable Key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Secret Key** → `CLERK_SECRET_KEY`

## Authentication Configuration

**IMPORTANT**: The application uses **email-only authentication** (no phone numbers required):

1. **Go to Clerk Dashboard** → **User & Authentication** → **Email, Magic Links**
2. **Enable Email Authentication** and **Magic Links**
3. **Disable Phone Number Authentication** (not needed)
4. **Enable Social Sign-In** (Google, Facebook) as alternatives

### Authentication Methods Available:
- ✅ **Email + Password** (primary method)
- ✅ **Magic Links** (email-based, no password needed)
- ✅ **Google Sign-In** (recommended alternative)
- ✅ **Facebook Sign-In** (optional)
- ❌ **Phone Number** (disabled)

## Features Included

✅ **User Authentication:**
- Sign-in/Sign-up pages with custom styling
- Protected routes (profile, favorites, watchlist, history)
- User profile management
- Authentication state management

✅ **User-Specific Features:**
- Personal favorites and watchlist
- Search history tracking per user
- Movie ratings system
- User profile with statistics

✅ **All Original Features Preserved:**
- 14+ additional pages (trending, genres, collections, etc.)
- 47+ API endpoints
- Professional contact page with Google Maps
- WhatsApp integration
- Cookies consent management
- Comprehensive error handling
- Dark/light theme toggle
- Responsive design

## Protected Routes

The following routes require authentication:
- `/profile` - User profile page
- `/favorites` - User's favorite movies
- `/watchlist` - User's watchlist
- `/history` - User's search history
- `/recommendations` - Personalized recommendations

## Public Routes

All other routes are publicly accessible:
- `/` - Home page
- `/popular`, `/top-rated`, `/now-playing`, `/upcoming`
- `/trending`, `/genres`, `/collections`, `/actors`, `/directors`
- `/awards`, `/studios`, `/decades`, `/languages`
- `/box-office`, `/streaming`, `/festivals`, `/indie`, `/classics`
- `/about`, `/help`, `/contact`, `/privacy`, `/terms`, `/api-docs`
- `/movie/[id]` - Movie details pages
- `/sign-in`, `/sign-up` - Authentication pages

## After Setup

1. Add your API keys to `.env.local`
2. Restart the development server: `npm run dev`
3. Visit `http://localhost:3000` to test the application
4. Try signing up/signing in to test authentication
5. Access protected routes like `/profile` to verify user-specific features
