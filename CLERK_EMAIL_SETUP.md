# Clerk Email-Only Authentication Setup Guide

## Overview
This application uses **email-only authentication** - no phone numbers required! Users can sign up and sign in using:
- Email + Password
- Magic Links (email-based, no password needed)
- Google Sign-In (recommended)
- Facebook Sign-In (optional)

## Required Environment Variables

Create a `.env.local` file in your project root:

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

## Step 1: Get Your Clerk API Keys

1. **Go to Clerk Dashboard**: https://dashboard.clerk.com/
2. **Create/Select Application**: Create a new app or select existing one
3. **Get API Keys**: Go to "API Keys" section
4. **Copy Keys**: 
   - **Publishable Key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Secret Key** → `CLERK_SECRET_KEY`

## Step 2: Configure Authentication Methods

### Enable Email Authentication
1. **Go to**: User & Authentication → **Email, Magic Links**
2. **Enable**: "Email address" authentication
3. **Enable**: "Magic Links" (email-based, no password)
4. **Configure**: Email templates (optional)

### Disable Phone Authentication
1. **Go to**: User & Authentication → **Phone, SMS, and MFA**
2. **Disable**: "Phone number authentication"
3. **Disable**: Multi-factor authentication (optional)

### Enable Social Sign-In (Recommended)
1. **Go to**: User & Authentication → **Social Connections**
2. **Enable Google Sign-In**:
   - Click "Add Google"
   - Follow setup instructions
   - Get OAuth credentials
3. **Enable Facebook Sign-In** (optional):
   - Click "Add Facebook"
   - Follow setup instructions

## Step 3: Configure Redirect URLs

1. **Go to**: User & Authentication → **Paths**
2. **Set Sign-in URL**: `/sign-in`
3. **Set Sign-up URL**: `/sign-up`
4. **Set After Sign-in URL**: `/`
5. **Set After Sign-up URL**: `/`

## Step 4: Test the Application

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **Visit**: http://localhost:3000
   - You'll be redirected to sign-in page
   - All routes require authentication

3. **Test Sign-Up**:
   - Click "Sign Up"
   - Enter email address
   - Choose password or use magic link
   - Complete registration

4. **Test Sign-In**:
   - Enter email and password
   - Or use magic link
   - Or use Google/Facebook

## Authentication Flow

### New Users
1. Visit website → Redirected to sign-in
2. Click "Sign Up" → Create account
3. Verify email (if required)
4. Access full website

### Existing Users
1. Visit website → Redirected to sign-in
2. Enter credentials → Sign in
3. Access full website

### Protected Routes
All routes require authentication except:
- `/sign-in` - Sign in page
- `/sign-up` - Sign up page

## Features Available After Authentication

✅ **User-Specific Features**:
- Personal favorites and watchlist
- Search history tracking
- Movie ratings system
- User profile with statistics
- Personalized recommendations

✅ **All Original Features**:
- 14+ additional pages (trending, genres, collections, etc.)
- 47+ API endpoints
- Professional contact page with Google Maps
- WhatsApp integration
- Cookies consent management
- Comprehensive error handling
- Dark/light theme toggle
- Responsive design

## Troubleshooting

### Common Issues

1. **"Missing publishableKey" Error**:
   - Check your `.env.local` file
   - Ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set
   - Restart development server

2. **Redirect Loop**:
   - Check middleware configuration
   - Ensure sign-in/sign-up URLs are correct
   - Clear browser cache

3. **Email Not Received**:
   - Check spam folder
   - Verify email configuration in Clerk dashboard
   - Test with different email provider

4. **Social Sign-In Not Working**:
   - Check OAuth credentials
   - Verify redirect URLs in Google/Facebook console
   - Ensure social connections are enabled

### Support Resources

- **Clerk Documentation**: https://clerk.com/docs
- **Clerk Dashboard**: https://dashboard.clerk.com/
- **Clerk Status**: https://status.clerk.com
- **Support**: https://clerk.com/support

## Production Deployment

For production:

1. **Update Environment Variables**:
   - Use production Clerk keys
   - Set production redirect URLs

2. **Configure Production URLs**:
   - Update allowed origins in Clerk dashboard
   - Set production domain in environment variables

3. **Test Production**:
   - Verify all authentication methods work
   - Test email delivery
   - Test social sign-in

## Security Notes

- ✅ **Email-only authentication** (no phone numbers)
- ✅ **Magic links** for passwordless login
- ✅ **Social OAuth** for trusted providers
- ✅ **Protected routes** require authentication
- ✅ **Session management** with automatic expiration
- ✅ **Secure redirects** to prevent open redirects

## Quick Setup Checklist

- [ ] Get Clerk API keys
- [ ] Add keys to `.env.local`
- [ ] Enable email authentication
- [ ] Enable magic links
- [ ] Disable phone authentication
- [ ] Enable Google Sign-In (recommended)
- [ ] Test sign-up with email
- [ ] Test sign-in with email
- [ ] Test magic link authentication
- [ ] Test social sign-in
- [ ] Verify protected routes work
- [ ] Verify public routes (sign-in/sign-up) work

Your MovieSearch application is now ready with secure, email-only authentication! 🎉
