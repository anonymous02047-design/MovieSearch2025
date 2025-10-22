# 🚀 Complete Enhanced Setup & Configuration Guide for MovieSearch 2025

## Table of Contents
1. [Overview](#overview)
2. [Enhanced Features](#enhanced-features)
3. [Environment Variables Setup](#environment-variables-setup)
4. [Service Integrations](#service-integrations)
5. [Local Development Setup](#local-development-setup)
6. [Production Deployment](#production-deployment)
7. [Testing Guide](#testing-guide)
8. [Troubleshooting](#troubleshooting)

---

## Overview

This guide covers the complete setup for the enhanced MovieSearch 2025 application with advanced security, performance optimizations, and multiple third-party integrations.

### What's New in This Update

✅ **Enhanced AuthGuard** with multi-layer security
✅ **Google Ads (AdSense)** integration
✅ **Google reCAPTCHA v3** protection
✅ **Enhanced Nginx** configuration
✅ **Enhanced MongoDB** with security & performance
✅ **Enhanced Google Analytics** with Web Vitals tracking
✅ **Enhanced TMDB API** client with caching & retry logic
✅ **Enhanced Tawk.to** chat integration
✅ **Advanced Error Handling** system

---

## Enhanced Features

### 1. Enhanced AuthGuard System
- ✅ Multi-layer security checks
- ✅ Session validity tracking
- ✅ Role-based authorization
- ✅ Email/phone verification requirements
- ✅ Automatic session timeout
- ✅ Real-time activity tracking

### 2. Security Enhancements
- ✅ Google reCAPTCHA v3 on all forms
- ✅ Rate limiting on API routes
- ✅ CSRF protection
- ✅ XSS prevention headers
- ✅ SQL injection protection
- ✅ DDoS mitigation with Nginx

### 3. Performance Optimizations
- ✅ Advanced caching layer
- ✅ Request deduplication
- ✅ Lazy loading components
- ✅ Image optimization
- ✅ Code splitting
- ✅ CDN integration ready

### 4. Analytics & Monitoring
- ✅ Enhanced Google Analytics with Web Vitals
- ✅ Error tracking
- ✅ User behavior analytics
- ✅ Performance monitoring
- ✅ Conversion tracking

---

## Environment Variables Setup

### Create `.env.local` File

Create a `.env.local` file in your project root with the following variables:

```bash
# ==========================================
# CLERK AUTHENTICATION
# ==========================================
# Get these from: https://dashboard.clerk.com/
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_YOUR_CLERK_PUBLISHABLE_KEY_HERE
CLERK_SECRET_KEY=sk_live_YOUR_CLERK_SECRET_KEY_HERE
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# ==========================================
# TMDB API
# ==========================================
# Get your API key from: https://www.themoviedb.org/settings/api
NEXT_PUBLIC_TMDB_API_KEY=your_32_character_tmdb_api_key_here
NEXT_PUBLIC_TMDB_API_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org

# ==========================================
# MONGODB DATABASE
# ==========================================
# MongoDB Atlas connection string
# Get it from: https://cloud.mongodb.com/
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/moviesearch2025?retryWrites=true&w=majority
MONGODB_DATABASE_NAME=moviesearch2025
MONGODB_MAX_POOL_SIZE=10
MONGODB_MIN_POOL_SIZE=2

# MongoDB Encryption (Optional but recommended for production)
MONGODB_ENCRYPTION_ENABLED=false
MONGODB_ENCRYPTION_KEY=your_32_byte_encryption_key_base64_encoded

# ==========================================
# GOOGLE ANALYTICS
# ==========================================
# Get your GA4 Measurement ID from: https://analytics.google.com/
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# ==========================================
# GOOGLE ADS (ADSENSE)
# ==========================================
# Get your AdSense Client ID from: https://www.google.com/adsense/
NEXT_PUBLIC_GOOGLE_ADS_CLIENT=ca-pub-XXXXXXXXXXXXXXXX

# ==========================================
# GOOGLE reCAPTCHA v3
# ==========================================
# Get keys from: https://www.google.com/recaptcha/admin/
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
RECAPTCHA_SECRET_KEY=6LeXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# ==========================================
# TAWK.TO LIVE CHAT
# ==========================================
# Get these from: https://dashboard.tawk.to/
NEXT_PUBLIC_TAWK_PROPERTY_ID=your_tawk_property_id
NEXT_PUBLIC_TAWK_WIDGET_ID=your_tawk_widget_id

# ==========================================
# OPENAI API (For AI Features)
# ==========================================
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# ==========================================
# STRAPI CMS (For Blog)
# ==========================================
# Your Strapi instance URL
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-instance.com
NEXT_PUBLIC_STRAPI_API_TOKEN=your_strapi_api_token

# ==========================================
# APPLICATION CONFIGURATION
# ==========================================
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development

# ==========================================
# RATE LIMITING
# ==========================================
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# ==========================================
# SESSION CONFIGURATION
# ==========================================
SESSION_MAX_AGE_MINUTES=480
SESSION_SECRET=your_random_32_character_session_secret_here

# ==========================================
# SECURITY
# ==========================================
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
CORS_ENABLED=true
```

---

## Service Integrations

### 1. Clerk Authentication Setup

#### Step 1: Create Clerk Account
1. Go to [https://clerk.com](https://clerk.com)
2. Sign up for a free account
3. Create a new application

#### Step 2: Get API Keys
1. Navigate to **API Keys** in your Clerk dashboard
2. Copy **Publishable Key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
3. Copy **Secret Key** → `CLERK_SECRET_KEY`

#### Step 3: Configure Authentication Methods
1. Go to **User & Authentication** → **Email, Phone, Username**
2. Enable your preferred authentication methods
3. Configure email templates (optional)

#### Step 4: Configure Webhooks (Optional)
```bash
Webhook URL: https://yourdomain.com/api/webhooks/clerk
Events: user.created, user.updated, user.deleted
```

---

### 2. TMDB API Setup

#### Step 1: Create TMDB Account
1. Go to [https://www.themoviedb.org/signup](https://www.themoviedb.org/signup)
2. Verify your email address

#### Step 2: Request API Key
1. Go to [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
2. Click **Create` → **Developer**
3. Accept the terms
4. Fill in the application details
5. Copy your **API Key (v3 auth)** → `NEXT_PUBLIC_TMDB_API_KEY`

#### Step 3: Test API Key
```bash
curl "https://api.themoviedb.org/3/movie/popular?api_key=YOUR_API_KEY"
```

---

### 3. MongoDB Atlas Setup

#### Step 1: Create MongoDB Atlas Account
1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account

#### Step 2: Create a Cluster
1. Click **Build a Database**
2. Choose **FREE** tier (M0)
3. Select your preferred cloud provider and region
4. Click **Create Cluster**

#### Step 3: Create Database User
1. Go to **Database Access**
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Set username and password
5. Set database permissions to **Read and write to any database**

#### Step 4: Configure Network Access
1. Go to **Network Access**
2. Click **Add IP Address**
3. For development: Click **Allow Access from Anywhere** (0.0.0.0/0)
4. For production: Add your server's IP address

#### Step 5: Get Connection String
1. Click **Connect** on your cluster
2. Choose **Connect your application**
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Add to `.env.local` as `MONGODB_URI`

---

### 4. Google Analytics (GA4) Setup

#### Step 1: Create GA4 Property
1. Go to [https://analytics.google.com/](https://analytics.google.com/)
2. Click **Admin** → **Create Property**
3. Enter property name: "MovieSearch 2025"
4. Configure property details
5. Create a **Web** data stream

#### Step 2: Get Measurement ID
1. Click on your web data stream
2. Copy **Measurement ID** (format: G-XXXXXXXXXX)
3. Add to `.env.local` as `NEXT_PUBLIC_GA_MEASUREMENT_ID`

#### Step 3: Configure Enhanced Measurement
1. In your data stream settings
2. Toggle ON **Enhanced measurement**
3. Enable:
   - Page views
   - Scrolls
   - Outbound clicks
   - Site search
   - File downloads

---

### 5. Google AdSense Setup

#### Step 1: Create AdSense Account
1. Go to [https://www.google.com/adsense/](https://www.google.com/adsense/)
2. Sign up with your Google account
3. Submit your site for review

#### Step 2: Get AdSense Client ID
1. Once approved, go to **Ads** → **Overview**
2. Find your **Publisher ID** (format: ca-pub-XXXXXXXXXXXXXXXX)
3. Add to `.env.local` as `NEXT_PUBLIC_GOOGLE_ADS_CLIENT`

#### Step 3: Create Ad Units
1. Go to **Ads** → **By ad unit**
2. Create ad units for different placements
3. Copy ad unit IDs for specific placements

---

### 6. Google reCAPTCHA v3 Setup

#### Step 1: Register Site
1. Go to [https://www.google.com/recaptcha/admin/create](https://www.google.com/recaptcha/admin/create)
2. Enter label: "MovieSearch 2025"
3. Select **reCAPTCHA v3**
4. Add your domains:
   - `localhost` (for development)
   - `yourdomain.com` (for production)

#### Step 2: Get Keys
1. Copy **Site Key** → `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
2. Copy **Secret Key** → `RECAPTCHA_SECRET_KEY`

#### Step 3: Adjust Score Threshold
- Default threshold: 0.5
- For stricter validation: 0.7-0.9
- For lenient validation: 0.3-0.5

---

### 7. Tawk.to Live Chat Setup

#### Step 1: Create Tawk.to Account
1. Go to [https://www.tawk.to/](https://www.tawk.to/)
2. Sign up for a free account

#### Step 2: Add Property
1. Click **Add Property**
2. Enter your website URL
3. Configure widget settings

#### Step 3: Get Widget Code
1. Go to **Administration** → **Channels** → **Chat Widget**
2. Find your widget code
3. Extract Property ID and Widget ID from the URL:
   ```
   https://embed.tawk.to/{PROPERTY_ID}/{WIDGET_ID}
   ```
4. Add to `.env.local`:
   - `NEXT_PUBLIC_TAWK_PROPERTY_ID`
   - `NEXT_PUBLIC_TAWK_WIDGET_ID`

---

### 8. OpenAI API Setup (Optional - for AI Features)

#### Step 1: Create OpenAI Account
1. Go to [https://platform.openai.com/signup](https://platform.openai.com/signup)
2. Sign up and verify your email

#### Step 2: Get API Key
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click **Create new secret key**
3. Name it "MovieSearch 2025"
4. Copy the key → `OPENAI_API_KEY`

#### Step 3: Set Usage Limits (Recommended)
1. Go to **Settings** → **Limits**
2. Set monthly budget limit
3. Enable usage notifications

---

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Set Up Environment Variables

```bash
# Copy example env file
cp env.example .env.local

# Edit .env.local with your actual credentials
nano .env.local  # or use your preferred editor
```

### 3. Initialize MongoDB Indexes

```bash
node scripts/init-mongodb.js
```

### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### 5. Access Application

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Deployment

### Option 1: Netlify Deployment

#### Step 1: Connect GitHub Repository
1. Go to [https://app.netlify.com/](https://app.netlify.com/)
2. Click **Add new site** → **Import an existing project**
3. Connect your GitHub account
4. Select your repository

#### Step 2: Configure Build Settings
```
Build command: npm run build
Publish directory: .next
```

#### Step 3: Add Environment Variables
1. Go to **Site settings** → **Environment variables**
2. Add all variables from your `.env.local` file
3. **Important:** Use production values (not localhost)

#### Step 4: Deploy
1. Click **Deploy site**
2. Wait for build to complete
3. Your site is live! 🎉

#### Step 5: Configure Custom Domain (Optional)
1. Go to **Domain settings**
2. Add your custom domain
3. Configure DNS settings

---

### Option 2: Vercel Deployment

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```

#### Step 3: Deploy
```bash
vercel --prod
```

#### Step 4: Add Environment Variables
```bash
# Add each variable
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
vercel env add CLERK_SECRET_KEY
# ... add all other variables
```

---

### Option 3: Self-Hosted with Nginx

#### Step 1: Build Application
```bash
npm run build
```

#### Step 2: Copy Nginx Configuration
```bash
sudo cp nginx-enhanced.conf /etc/nginx/sites-available/moviesearch2025
sudo ln -s /etc/nginx/sites-available/moviesearch2025 /etc/nginx/sites-enabled/
```

#### Step 3: Update Configuration
Edit `/etc/nginx/sites-available/moviesearch2025`:
- Replace `yourdomain.com` with your actual domain
- Update SSL certificate paths
- Adjust rate limits as needed

#### Step 4: Set Up SSL with Let's Encrypt
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

#### Step 5: Start Services
```bash
# Start Next.js
pm2 start npm --name "moviesearch2025" -- start

# Restart Nginx
sudo nginx -t
sudo systemctl restart nginx
```

---

## Testing Guide

### 1. Test Enhanced AuthGuard

```bash
# Navigate to protected pages without signing in
# Should redirect to /sign-in

# Test pages:
http://localhost:3000/profile
http://localhost:3000/favorites
http://localhost:3000/watchlist
http://localhost:3000/settings
```

### 2. Test Google Ads

```bash
# Check browser console for AdSense logs
# Ads should appear on pages with <GoogleAds /> component
# In development, you'll see placeholder ads
```

### 3. Test reCAPTCHA v3

```bash
# Open browser DevTools → Network tab
# Submit a form (e.g., contact form)
# Look for request to www.google.com/recaptcha/api.js
# Check response includes token
```

### 4. Test Google Analytics

```bash
# Open browser DevTools → Network tab
# Navigate between pages
# Look for requests to www.google-analytics.com/g/collect
# Verify page_view events are firing
```

### 5. Test TMDB API Integration

```bash
# Check browser console
# Should see caching messages in development mode
# Navigate to movie details page
# Verify fast subsequent loads (cached)
```

### 6. Test Error Handling

```bash
# Intentionally cause errors (e.g., invalid movie ID)
# Should see user-friendly error messages
# Check console for detailed error logs in development
```

### 7. Test MongoDB Connection

```bash
# Access health check endpoint
curl http://localhost:3000/api/health/mongodb

# Should return:
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-10-22T..."
}
```

---

## Troubleshooting

### Issue: AuthGuard Not Working

**Solution:**
1. Check Clerk environment variables are correct
2. Clear browser cookies and localStorage
3. Verify middleware is configured in `middleware.ts`
4. Check browser console for errors

### Issue: MongoDB Connection Failed

**Solution:**
1. Verify `MONGODB_URI` is correct
2. Check IP whitelist in MongoDB Atlas
3. Ensure database user has correct permissions
4. Test connection string directly:
   ```bash
   mongosh "YOUR_MONGODB_URI"
   ```

### Issue: TMDB API Rate Limit

**Solution:**
1. Enhanced TMDB client has automatic retry with backoff
2. Check cache is enabled
3. Consider implementing request queuing
4. Monitor API usage in TMDB dashboard

### Issue: Google Analytics Not Tracking

**Solution:**
1. Verify `NEXT_PUBLIC_GA_MEASUREMENT_ID` is correct
2. Check browser extensions (ad blockers) aren't blocking
3. Use GA Debug View in GA4 dashboard
4. Check Network tab for blocked requests

### Issue: reCAPTCHA Not Loading

**Solution:**
1. Verify site key and secret key are correct
2. Check domain is registered in reCAPTCHA admin
3. Ensure site is using HTTPS in production
4. Check browser console for errors

### Issue: Ads Not Showing

**Solution:**
1. AdSense approval can take 1-2 weeks
2. In development, placeholders are shown
3. Check AdSense account status
4. Verify ad units are created
5. Ensure content meets AdSense policies

---

## Performance Optimization Checklist

- [ ] Enable all caching layers (Nginx, Next.js, TMDB client)
- [ ] Configure CDN for static assets
- [ ] Enable image optimization
- [ ] Use lazy loading for images
- [ ] Implement code splitting
- [ ] Enable Gzip/Brotli compression
- [ ] Configure proper cache headers
- [ ] Minimize JavaScript bundle size
- [ ] Use production build for deployment
- [ ] Enable database connection pooling

---

## Security Checklist

- [ ] All API keys in environment variables (never in code)
- [ ] HTTPS enabled in production
- [ ] reCAPTCHA on all forms
- [ ] Rate limiting configured
- [ ] Security headers configured in Nginx
- [ ] CORS properly configured
- [ ] Input validation on all forms
- [ ] SQL injection protection
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Session timeout configured
- [ ] Regular security updates

---

## Support & Resources

- **Clerk Documentation:** https://clerk.com/docs
- **TMDB API Documentation:** https://developers.themoviedb.org/3
- **MongoDB Documentation:** https://docs.mongodb.com/
- **Next.js Documentation:** https://nextjs.org/docs
- **Google Analytics Help:** https://support.google.com/analytics
- **reCAPTCHA Documentation:** https://developers.google.com/recaptcha
- **Nginx Documentation:** https://nginx.org/en/docs/

---

## Need Help?

If you encounter any issues or need assistance:

1. Check the troubleshooting section above
2. Review the documentation for the specific service
3. Check GitHub issues for similar problems
4. Contact support through Tawk.to chat widget

---

**Last Updated:** October 22, 2025  
**Version:** 2.0.0 Enhanced

