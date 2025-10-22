# 🔐 Complete Netlify Environment Variables Setup Guide

## MovieSearch 2025 - Production Deployment

**Last Updated:** October 22, 2025  
**Version:** 2.0.0 Enhanced  
**Status:** Production Ready ✅

---

## 📋 Quick Reference

### Total Variables Required
- **Critical (Required):** 6 variables
- **Recommended:** 8 variables  
- **Optional (Enhanced Features):** 7 variables
- **Total:** 21 environment variables

---

## 🚨 CRITICAL VARIABLES (Required for Basic Functionality)

### 1. Clerk Authentication (Required)

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_YOUR_CLERK_PUBLISHABLE_KEY_HERE
CLERK_SECRET_KEY=sk_live_YOUR_CLERK_SECRET_KEY_HERE
```

**Where to get:**
1. Go to https://dashboard.clerk.com/
2. Select your application
3. Navigate to **API Keys**
4. Copy both keys

**Important Notes:**
- ⚠️ Use **production keys** (pk_live_* and sk_live_*) for Netlify
- ⚠️ Never use test keys (pk_test_*, sk_test_*) in production
- ✅ These are REQUIRED - app won't work without them

---

### 2. TMDB API (Required for Movie Data)

```bash
NEXT_PUBLIC_TMDB_API_KEY=your_32_character_tmdb_api_key_here
```

**Where to get:**
1. Sign up at https://www.themoviedb.org/signup
2. Go to https://www.themoviedb.org/settings/api
3. Request API Key (Developer)
4. Copy **API Key (v3 auth)**

**Important Notes:**
- ✅ Free to use with generous limits
- ⚠️ Required for all movie/TV show data
- 📊 Handles 50 requests/second per IP

---

### 3. MongoDB Database (Required for User Data)

```bash
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/moviesearch2025?retryWrites=true&w=majority
```

**Where to get:**
1. Sign up at https://cloud.mongodb.com/
2. Create a new cluster (FREE tier M0)
3. Click **Connect** → **Connect your application**
4. Copy connection string
5. Replace `<password>` with your database password

**Important Notes:**
- ✅ FREE tier available (512MB storage)
- ⚠️ Required for favorites, watchlist, user profiles
- 🔒 Whitelist Netlify IPs or use 0.0.0.0/0 (all IPs)

---

### 4. Application URL (Required)

```bash
NEXT_PUBLIC_BASE_URL=https://your-site-name.netlify.app
```

**Where to get:**
- This is your Netlify site URL
- Example: `https://moviesearch2025.netlify.app`

**Important Notes:**
- ✅ Use HTTPS (required)
- ⚠️ Update after custom domain setup
- 🔄 Used for redirects and metadata

---

### 5. Clerk Redirect URLs (Recommended)

```bash
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

**Important Notes:**
- ✅ Default values work out of the box
- 🔄 Customize if using custom auth pages

---

### 6. Node Environment (Auto-set by Netlify)

```bash
NODE_ENV=production
```

**Important Notes:**
- ✅ Netlify sets this automatically
- ⚠️ Do NOT set manually
- 📊 Enables production optimizations

---

## ⭐ RECOMMENDED VARIABLES (Highly Recommended)

### 7. Google Analytics (Recommended)

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Where to get:**
1. Go to https://analytics.google.com/
2. Create property "MovieSearch 2025"
3. Create **Web** data stream
4. Copy **Measurement ID** (G-XXXXXXXXXX)

**Benefits:**
- ✅ Track user behavior
- ✅ Monitor Web Vitals
- ✅ Measure conversions
- ✅ Understand traffic sources

**Cost:** FREE

---

### 8. Google reCAPTCHA v3 (Recommended for Security)

```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
RECAPTCHA_SECRET_KEY=6LeXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Where to get:**
1. Go to https://www.google.com/recaptcha/admin/create
2. Choose **reCAPTCHA v3**
3. Add domains:
   - `your-site-name.netlify.app`
   - `yourdomain.com` (if using custom domain)
4. Copy both keys

**Benefits:**
- ✅ Prevent bot spam
- ✅ Protect forms
- ✅ Score-based validation
- ✅ Invisible to users

**Cost:** FREE (up to 1M assessments/month)

---

### 9. OpenAI API (Recommended for AI Features)

```bash
OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Where to get:**
1. Sign up at https://platform.openai.com/signup
2. Go to https://platform.openai.com/api-keys
3. Click **Create new secret key**
4. Copy the key (starts with sk-proj-)

**Benefits:**
- ✅ 14 advanced AI features
- ✅ Smart recommendations
- ✅ Sentiment analysis
- ✅ Movie trivia & more
- ✅ Optimized for low token usage

**Cost:** 
- ~$0.0001 per request (with optimization)
- ~$27/month for 1000 active users
- FREE $5 credit for new accounts

---

## 💡 OPTIONAL VARIABLES (Enhanced Features)

### 10. Google AdSense (Optional - Revenue)

```bash
NEXT_PUBLIC_GOOGLE_ADS_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
```

**Where to get:**
1. Apply at https://www.google.com/adsense/
2. Wait for approval (1-2 weeks)
3. Find **Publisher ID** in AdSense dashboard

**Benefits:**
- 💰 Generate revenue from ads
- ✅ Auto-optimized ad placement
- ✅ Multiple ad formats

**Cost:** FREE (revenue share)

**Note:** App works without this - ads just won't show

---

### 11. Tawk.to Live Chat (Optional)

```bash
NEXT_PUBLIC_TAWK_PROPERTY_ID=your_property_id_here
NEXT_PUBLIC_TAWK_WIDGET_ID=your_widget_id_here
```

**Where to get:**
1. Sign up at https://www.tawk.to/
2. Add property for your website
3. Go to **Administration** → **Channels** → **Chat Widget**
4. Extract IDs from widget code URL:
   ```
   https://embed.tawk.to/{PROPERTY_ID}/{WIDGET_ID}
   ```

**Benefits:**
- ✅ Live chat support
- ✅ User engagement
- ✅ Visitor tracking
- ✅ Mobile app available

**Cost:** FREE

---

### 12. Strapi CMS (Optional - Blog)

```bash
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-instance.herokuapp.com
NEXT_PUBLIC_STRAPI_API_TOKEN=your_strapi_api_token_here
```

**Where to get:**
1. Deploy Strapi to Heroku/Railway/Render
2. Create API token in Strapi admin
3. Copy instance URL and token

**Benefits:**
- ✅ Manage blog posts
- ✅ Content management
- ✅ Editorial workflow

**Cost:** 
- FREE tier available on Railway/Render
- Heroku: $5-7/month

**Note:** App works without this - blog will just be empty

---

### 13. MongoDB Advanced Settings (Optional)

```bash
MONGODB_DATABASE_NAME=moviesearch2025
MONGODB_MAX_POOL_SIZE=10
MONGODB_MIN_POOL_SIZE=2
MONGODB_ENCRYPTION_ENABLED=false
```

**Important Notes:**
- ✅ Default values work well
- 🔧 Only customize for advanced use cases
- ⚠️ Not required - sensible defaults in code

---

### 14. Additional Configuration (Optional)

```bash
NEXT_PUBLIC_APP_VERSION=2.0.0
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
SESSION_MAX_AGE_MINUTES=480
```

**Important Notes:**
- ✅ These have sensible defaults
- 🔧 Only set if you need custom values

---

## 📝 Step-by-Step Netlify Setup

### Step 1: Access Environment Variables

1. Log in to https://app.netlify.com/
2. Select your site
3. Go to **Site settings**
4. Click **Environment variables** (left sidebar)
5. Click **Add a variable**

---

### Step 2: Add Critical Variables (Required)

Add these one by one:

#### Clerk Authentication
```
Key: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
Value: pk_live_YOUR_CLERK_PUBLISHABLE_KEY_HERE
Scopes: All scopes (default)
```

```
Key: CLERK_SECRET_KEY
Value: sk_live_YOUR_CLERK_SECRET_KEY_HERE
Scopes: All scopes (default)
```

#### TMDB API
```
Key: NEXT_PUBLIC_TMDB_API_KEY
Value: your_32_character_api_key
Scopes: All scopes (default)
```

#### MongoDB
```
Key: MONGODB_URI
Value: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/moviesearch2025?retryWrites=true&w=majority
Scopes: All scopes (default)
```

#### Base URL
```
Key: NEXT_PUBLIC_BASE_URL
Value: https://your-site-name.netlify.app
Scopes: All scopes (default)
```

---

### Step 3: Add Recommended Variables

#### Google Analytics
```
Key: NEXT_PUBLIC_GA_MEASUREMENT_ID
Value: G-XXXXXXXXXX
Scopes: All scopes (default)
```

#### Google reCAPTCHA v3
```
Key: NEXT_PUBLIC_RECAPTCHA_SITE_KEY
Value: 6LeXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Scopes: All scopes (default)
```

```
Key: RECAPTCHA_SECRET_KEY
Value: 6LeXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Scopes: All scopes (default)
```

#### OpenAI
```
Key: OPENAI_API_KEY
Value: sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Scopes: All scopes (default)
```

---

### Step 4: Add Optional Variables (As Needed)

Only add these if you're using the features:

#### Google AdSense (if approved)
```
Key: NEXT_PUBLIC_GOOGLE_ADS_CLIENT
Value: ca-pub-XXXXXXXXXXXXXXXX
```

#### Tawk.to (if using chat)
```
Key: NEXT_PUBLIC_TAWK_PROPERTY_ID
Value: your_property_id

Key: NEXT_PUBLIC_TAWK_WIDGET_ID
Value: your_widget_id
```

#### Strapi CMS (if using blog)
```
Key: NEXT_PUBLIC_STRAPI_URL
Value: https://your-strapi-instance.herokuapp.com

Key: NEXT_PUBLIC_STRAPI_API_TOKEN
Value: your_strapi_token
```

---

### Step 5: Redeploy

After adding all variables:

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Clear cache and deploy site**
3. Wait for build to complete (~3-5 minutes)
4. Test your site!

---

## ✅ Verification Checklist

After deployment, verify each feature:

### Critical Features
- [ ] **Authentication** - Can you sign in/sign up?
- [ ] **Movie Data** - Do movies display correctly?
- [ ] **User Data** - Can you add favorites/watchlist?
- [ ] **Navigation** - All links working?

### Recommended Features
- [ ] **Analytics** - Check GA4 dashboard for events
- [ ] **reCAPTCHA** - Check browser console (no errors)
- [ ] **AI Features** - Try AI recommendations

### Optional Features
- [ ] **Ads** - Do ads display? (if enabled)
- [ ] **Chat** - Chat widget visible? (if enabled)
- [ ] **Blog** - Blog posts loading? (if using Strapi)

---

## 🐛 Troubleshooting

### Issue: Site shows "Authentication Error"

**Solution:**
```
✅ Check NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is correct
✅ Check CLERK_SECRET_KEY is correct
✅ Verify you're using LIVE keys (not test keys)
✅ Redeploy after adding keys
```

---

### Issue: Movies not loading

**Solution:**
```
✅ Check NEXT_PUBLIC_TMDB_API_KEY is correct
✅ Test API key: https://api.themoviedb.org/3/movie/popular?api_key=YOUR_KEY
✅ Verify API key is not rate limited
```

---

### Issue: Favorites/Watchlist not saving

**Solution:**
```
✅ Check MONGODB_URI is correct
✅ Verify MongoDB cluster is running
✅ Check IP whitelist (0.0.0.0/0 for all IPs)
✅ Test connection: mongosh "YOUR_MONGODB_URI"
```

---

### Issue: Environment variables not working

**Solution:**
```
✅ Variables starting with NEXT_PUBLIC_ are exposed to browser
✅ Other variables are server-side only
✅ Redeploy after adding/changing variables
✅ Clear cache before redeploying
```

---

## 💾 Backup Your Variables

**IMPORTANT:** Save all your environment variables securely!

### Method 1: Use Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Export variables
netlify env:list --json > env-backup.json
```

### Method 2: Manual Backup

Create a file `env-backup.txt` (DO NOT commit to Git):

```bash
# === CRITICAL ===
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_YOUR_KEY_HERE
CLERK_SECRET_KEY=sk_live_YOUR_KEY_HERE
NEXT_PUBLIC_TMDB_API_KEY=YOUR_TMDB_KEY_HERE
MONGODB_URI=mongodb+srv://YOUR_CONNECTION_STRING

# === RECOMMENDED ===
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=YOUR_RECAPTCHA_SITE_KEY
RECAPTCHA_SECRET_KEY=YOUR_RECAPTCHA_SECRET_KEY
OPENAI_API_KEY=sk-proj-YOUR_OPENAI_KEY_HERE

# === OPTIONAL ===
NEXT_PUBLIC_GOOGLE_ADS_CLIENT=ca-pub-YOUR_ADS_ID
# ... etc
```

**⚠️ Keep this file SECURE and PRIVATE!**

---

## 🔒 Security Best Practices

### DO ✅
- ✅ Use strong, unique passwords for all services
- ✅ Enable 2FA on all accounts (Clerk, MongoDB, etc.)
- ✅ Regularly rotate API keys
- ✅ Use production keys for production
- ✅ Keep `.env.local` out of Git (already in .gitignore)
- ✅ Use HTTPS for all URLs

### DON'T ❌
- ❌ Never commit API keys to Git
- ❌ Never share keys publicly
- ❌ Don't use test keys in production
- ❌ Don't expose secret keys to frontend
- ❌ Don't reuse passwords across services

---

## 📊 Cost Summary

### FREE Services (Total: $0/month)
- ✅ **Clerk** - 10,000 MAU free
- ✅ **TMDB** - Unlimited (fair use)
- ✅ **MongoDB** - 512MB free
- ✅ **Google Analytics** - Unlimited
- ✅ **Google reCAPTCHA** - 1M requests/month
- ✅ **Tawk.to** - Unlimited
- ✅ **Netlify** - 100GB bandwidth/month

### Paid Services (Optional)
- 💰 **OpenAI** - ~$27/month (1000 users) or FREE $5 credit
- 💰 **Google AdSense** - Revenue (you earn money)
- 💰 **Strapi** - FREE tier on Railway/Render

### Total Monthly Cost
- **Minimum:** $0/month (all FREE tiers)
- **With AI:** ~$27/month (or FREE with $5 credit)
- **With earnings:** Potentially profitable with AdSense

---

## 🎯 Quick Setup (Copy-Paste Template)

Here's a template with all variables. Replace XXX with your actual values:

```bash
# === CRITICAL (REQUIRED) ===
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_YOUR_CLERK_KEY_HERE
CLERK_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE
NEXT_PUBLIC_TMDB_API_KEY=YOUR_TMDB_KEY_HERE
MONGODB_URI=mongodb+srv://YOUR_CONNECTION_STRING_HERE
NEXT_PUBLIC_BASE_URL=https://your-site.netlify.app

# === RECOMMENDED ===
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-YOUR_GA_ID_HERE
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=YOUR_RECAPTCHA_SITE_KEY
RECAPTCHA_SECRET_KEY=YOUR_RECAPTCHA_SECRET_KEY
OPENAI_API_KEY=sk-proj-YOUR_OPENAI_KEY_HERE

# === OPTIONAL ===
NEXT_PUBLIC_GOOGLE_ADS_CLIENT=ca-pub-YOUR_ADS_ID
NEXT_PUBLIC_TAWK_PROPERTY_ID=YOUR_TAWK_PROPERTY_ID
NEXT_PUBLIC_TAWK_WIDGET_ID=YOUR_TAWK_WIDGET_ID
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-url.com
NEXT_PUBLIC_STRAPI_API_TOKEN=YOUR_STRAPI_TOKEN

# === AUTO-SET BY NETLIFY ===
NODE_ENV=production
```

---

## 🚀 Final Deployment Steps

1. ✅ Add all CRITICAL variables to Netlify
2. ✅ Add RECOMMENDED variables (for full functionality)
3. ✅ Add OPTIONAL variables (if using those features)
4. ✅ Clear cache and redeploy
5. ✅ Test all features
6. ✅ Monitor for errors in Netlify logs
7. ✅ Set up custom domain (optional)
8. ✅ Configure DNS (if using custom domain)
9. ✅ Enable HTTPS (automatic with Netlify)
10. ✅ 🎉 **Your site is LIVE!**

---

## 📞 Support Resources

### Service Documentation
- **Clerk:** https://clerk.com/docs
- **TMDB:** https://developers.themoviedb.org/3
- **MongoDB:** https://docs.mongodb.com/
- **Google Analytics:** https://support.google.com/analytics
- **Google reCAPTCHA:** https://developers.google.com/recaptcha
- **OpenAI:** https://platform.openai.com/docs
- **Netlify:** https://docs.netlify.com/

### Need Help?
- Check troubleshooting section above
- Review `🚀_COMPLETE_ENHANCED_SETUP_GUIDE.md`
- Check Netlify deploy logs for errors

---

## ✅ Checklist Summary

### Must Have (App won't work without these)
- [ ] Clerk Publishable Key
- [ ] Clerk Secret Key
- [ ] TMDB API Key
- [ ] MongoDB URI
- [ ] Base URL

### Should Have (Recommended for production)
- [ ] Google Analytics ID
- [ ] reCAPTCHA Site Key
- [ ] reCAPTCHA Secret Key
- [ ] OpenAI API Key

### Nice to Have (Optional features)
- [ ] Google Ads Client ID
- [ ] Tawk.to Property ID
- [ ] Tawk.to Widget ID
- [ ] Strapi URL
- [ ] Strapi API Token

---

**🎉 Congratulations!** 

Once all variables are set, your MovieSearch 2025 application will be **fully functional** with:
- ✅ Authentication
- ✅ Movie/TV data
- ✅ User profiles & favorites
- ✅ AI-powered features
- ✅ Analytics tracking
- ✅ Security protection
- ✅ Revenue generation (optional)

**Your app is PRODUCTION READY!** 🚀

---

**Version:** 2.0.0 Enhanced  
**Last Updated:** October 22, 2025  
**Status:** Complete ✅

