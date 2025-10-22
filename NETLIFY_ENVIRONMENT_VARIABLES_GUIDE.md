# 🌐 NETLIFY ENVIRONMENT VARIABLES - COMPLETE GUIDE
## Step-by-Step Configuration for MovieSearch 2025

**Last Updated**: October 22, 2025  
**Platform**: Netlify  
**App**: MovieSearch 2025  

---

## 📋 TABLE OF CONTENTS

1. [Before You Start](#before-you-start)
2. [Accessing Netlify Environment Variables](#accessing-netlify-environment-variables)
3. [Required Variables (Must Have)](#required-variables-must-have)
4. [Recommended Variables](#recommended-variables)
5. [Optional Variables](#optional-variables)
6. [Complete Variable List with Values](#complete-variable-list-with-values)
7. [Verification & Testing](#verification--testing)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 BEFORE YOU START

### What You Need to Gather:

#### 1. **Clerk Authentication Keys** (REQUIRED)
   - Go to: https://dashboard.clerk.com
   - Sign up or log in
   - Create or select your application
   - Navigate to: **API Keys** section
   - Copy both keys:
     - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_live_` or `pk_test_`)
     - `CLERK_SECRET_KEY` (starts with `sk_live_` or `sk_test_`)

#### 2. **TMDB API Key** (REQUIRED)
   - Go to: https://www.themoviedb.org
   - Sign up or log in
   - Go to: **Settings → API**
   - Request API Key (choose "Developer")
   - Copy: **API Key (v3 auth)**

#### 3. **MongoDB Connection String** (REQUIRED for user features)
   - Go to: https://www.mongodb.com/cloud/atlas
   - Sign up or log in
   - Create free cluster (M0 Sandbox)
   - Get connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`

#### 4. **Strapi CMS** (OPTIONAL - for blog)
   - If you set up Strapi, get:
     - Strapi URL
     - API Token

#### 5. **Google Analytics** (OPTIONAL)
   - If you want analytics:
     - Measurement ID (starts with `G-`)

---

## 📍 ACCESSING NETLIFY ENVIRONMENT VARIABLES

### Step 1: Log into Netlify

1. Go to: https://app.netlify.com
2. Sign in with your account
3. Select your **MovieSearch2025** site

### Step 2: Navigate to Environment Variables

1. Click **"Site settings"** (top navigation)
2. In left sidebar, click **"Environment variables"** (under "Build & deploy")
3. Or direct URL: `https://app.netlify.com/sites/YOUR_SITE_NAME/configuration/env`

### Step 3: Add Variables

You'll see this page:
```
┌─────────────────────────────────────┐
│ Environment variables               │
│                                     │
│ [Add a variable] button             │
│                                     │
│ Key                Value    Scopes  │
│ ─────────────────────────────────  │
│ (empty list)                        │
└─────────────────────────────────────┘
```

---

## ⭐ REQUIRED VARIABLES (MUST HAVE)

### Variable 1: Clerk Publishable Key

```
┌────────────────────────────────────────┐
│ Add a variable                         │
├────────────────────────────────────────┤
│ Key:   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
│                                        │
│ Value: pk_live_xxxxxxxxxxxxxxxxxxxxx   │
│        (or pk_test_ for testing)       │
│                                        │
│ Scopes: ☑ Production                   │
│         ☑ Deploy previews              │
│         ☑ Branch deploys               │
│                                        │
│ [Cancel]              [Add variable]   │
└────────────────────────────────────────┘
```

**How to Add:**
1. Click **"Add a variable"**
2. **Key**: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
3. **Value**: Paste your Clerk publishable key (starts with `pk_`)
4. **Scopes**: Check all three boxes
5. Click **"Add variable"**

---

### Variable 2: Clerk Secret Key

```
┌────────────────────────────────────────┐
│ Add a variable                         │
├────────────────────────────────────────┤
│ Key:   CLERK_SECRET_KEY                │
│                                        │
│ Value: sk_live_xxxxxxxxxxxxxxxxxxxxx   │
│        (or sk_test_ for testing)       │
│                                        │
│ Scopes: ☑ Production                   │
│         ☑ Deploy previews              │
│         ☑ Branch deploys               │
│                                        │
│ [Cancel]              [Add variable]   │
└────────────────────────────────────────┘
```

**How to Add:**
1. Click **"Add a variable"**
2. **Key**: `CLERK_SECRET_KEY`
3. **Value**: Paste your Clerk secret key (starts with `sk_`)
4. **Scopes**: Check all three boxes
5. Click **"Add variable"**

**⚠️ IMPORTANT**: This is a SECRET key - never share it!

---

### Variable 3: TMDB API Key

```
┌────────────────────────────────────────┐
│ Add a variable                         │
├────────────────────────────────────────┤
│ Key:   NEXT_PUBLIC_TMDB_API_KEY        │
│                                        │
│ Value: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p │
│        (32-character alphanumeric)     │
│                                        │
│ Scopes: ☑ Production                   │
│         ☑ Deploy previews              │
│         ☑ Branch deploys               │
│                                        │
│ [Cancel]              [Add variable]   │
└────────────────────────────────────────┘
```

**How to Add:**
1. Click **"Add a variable"**
2. **Key**: `NEXT_PUBLIC_TMDB_API_KEY`
3. **Value**: Paste your TMDB API key
4. **Scopes**: Check all three boxes
5. Click **"Add variable"**

---

### Variable 4: MongoDB Connection String

```
┌────────────────────────────────────────┐
│ Add a variable                         │
├────────────────────────────────────────┤
│ Key:   MONGODB_URI                     │
│                                        │
│ Value: mongodb+srv://username:password│
│        @cluster0.xxxxx.mongodb.net/   │
│        moviesearch2025?retryWrites=   │
│        true&w=majority                 │
│                                        │
│ Scopes: ☑ Production                   │
│         ☑ Deploy previews              │
│         ☑ Branch deploys               │
│                                        │
│ [Cancel]              [Add variable]   │
└────────────────────────────────────────┘
```

**How to Add:**
1. Click **"Add a variable"**
2. **Key**: `MONGODB_URI`
3. **Value**: Paste your complete MongoDB connection string
4. **Scopes**: Check all three boxes
5. Click **"Add variable"**

**⚠️ IMPORTANT**: 
- Replace `<password>` with actual password
- Ensure password is URL-encoded (if it contains special characters)
- Add database name: `/moviesearch2025` before the `?`

---

## ✅ RECOMMENDED VARIABLES

These enhance your app but aren't strictly required:

### Variable 5: TMDB Base URL

```
Key:    NEXT_PUBLIC_TMDB_BASE_URL
Value:  https://api.themoviedb.org/3
Scopes: ☑ All
```

### Variable 6: TMDB Image Base URL

```
Key:    NEXT_PUBLIC_TMDB_IMAGE_BASE_URL
Value:  https://image.tmdb.org/t/p
Scopes: ☑ All
```

### Variable 7: Base URL (Update After First Deploy!)

**FIRST DEPLOYMENT:**
```
Key:    NEXT_PUBLIC_BASE_URL
Value:  http://localhost:3000
Scopes: ☑ All
```

**AFTER DEPLOYMENT (Update this!):**
```
Key:    NEXT_PUBLIC_BASE_URL
Value:  https://your-actual-site.netlify.app
Scopes: ☑ All
```

**Steps:**
1. Deploy first with `http://localhost:3000`
2. Get your Netlify URL (e.g., `https://spectacular-unicorn-123456.netlify.app`)
3. Go back to Environment Variables
4. Click the three dots `⋮` next to `NEXT_PUBLIC_BASE_URL`
5. Click **"Edit"**
6. Change value to your actual Netlify URL
7. Click **"Save"**
8. **Trigger a new deployment**:
   - Go to **Deploys** tab
   - Click **"Trigger deploy"**
   - Select **"Clear cache and deploy site"**

---

## 🎨 OPTIONAL VARIABLES

### For AI-Powered Features (OpenAI)

#### Variable 8: OpenAI API Key

```
Key:    OPENAI_API_KEY
Value:  sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        (Get from: https://platform.openai.com/api-keys)
Scopes: ☑ All
```

**What it enables:**
- 🤖 AI Movie Recommendations
- 💬 AI Chat Assistant
- 📊 Sentiment Analysis
- 📝 AI-Generated Summaries
- 🔄 Movie Comparisons
- 🎯 Smart Watch Suggestions

**Cost**: ~$0.20 - $1.00 per 100 interactions (using GPT-4o-mini)

**Setup Guide**: See `OPENAI_INTEGRATION_GUIDE.md`

**Note**: App works without this - AI features will show setup instructions if missing.

---

### For Blog Functionality (Strapi CMS)

#### Variable 9: Strapi URL

```
Key:    NEXT_PUBLIC_STRAPI_URL
Value:  https://your-strapi-instance.herokuapp.com
        (or http://localhost:1337 for local)
Scopes: ☑ All
```

#### Variable 10: Strapi API Token

```
Key:    NEXT_PUBLIC_STRAPI_API_TOKEN
Value:  your_strapi_generated_token_here
Scopes: ☑ All
```

### For Google Analytics

#### Variable 11: GA Measurement ID

```
Key:    NEXT_PUBLIC_GA_MEASUREMENT_ID
Value:  G-XXXXXXXXXX
Scopes: ☑ All
```

---

## 📝 COMPLETE VARIABLE LIST WITH VALUES

### Copy-Paste Reference

Here's the complete list to add to Netlify:

```
# ================================
# REQUIRED (Must Add These 4)
# ================================

1. NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   → pk_live_REPLACE_WITH_YOUR_ACTUAL_CLERK_PUBLISHABLE_KEY

2. CLERK_SECRET_KEY
   → sk_live_REPLACE_WITH_YOUR_ACTUAL_CLERK_SECRET_KEY

3. NEXT_PUBLIC_TMDB_API_KEY
   → REPLACE_WITH_YOUR_32_CHARACTER_TMDB_API_KEY

4. MONGODB_URI
   → mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/moviesearch2025?retryWrites=true&w=majority

# ================================
# RECOMMENDED (Should Add These 3)
# ================================

5. NEXT_PUBLIC_TMDB_BASE_URL
   → https://api.themoviedb.org/3

6. NEXT_PUBLIC_TMDB_IMAGE_BASE_URL
   → https://image.tmdb.org/t/p

7. NEXT_PUBLIC_BASE_URL
   → http://localhost:3000
   (Update to https://your-site.netlify.app after first deploy!)

# ================================
# OPTIONAL (Add If Using)
# ================================

8. NEXT_PUBLIC_STRAPI_URL
   → https://your-strapi.herokuapp.com

9. NEXT_PUBLIC_STRAPI_API_TOKEN
   → your_strapi_api_token_here

10. NEXT_PUBLIC_GA_MEASUREMENT_ID
    → G-XXXXXXXXXX
```

---

## 🎯 STEP-BY-STEP SETUP PROCESS

### Complete Setup Walkthrough

#### Step 1: Add Required Variables (10 minutes)

1. **Open Netlify Dashboard**
   - https://app.netlify.com
   - Select your site
   - Go to **Site settings → Environment variables**

2. **Add Variable #1 - Clerk Publishable Key**
   - Click **"Add a variable"**
   - Key: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Value: Your Clerk publishable key
   - Check all scope boxes
   - Click **"Add variable"**

3. **Add Variable #2 - Clerk Secret Key**
   - Click **"Add a variable"**
   - Key: `CLERK_SECRET_KEY`
   - Value: Your Clerk secret key
   - Check all scope boxes
   - Click **"Add variable"**

4. **Add Variable #3 - TMDB API Key**
   - Click **"Add a variable"**
   - Key: `NEXT_PUBLIC_TMDB_API_KEY`
   - Value: Your TMDB API key
   - Check all scope boxes
   - Click **"Add variable"**

5. **Add Variable #4 - MongoDB URI**
   - Click **"Add a variable"**
   - Key: `MONGODB_URI`
   - Value: Your MongoDB connection string
   - Check all scope boxes
   - Click **"Add variable"**

#### Step 2: Add Recommended Variables (5 minutes)

Repeat the process for variables #5, #6, #7 from the list above.

#### Step 3: Add Optional Variables (if needed)

If using Strapi or Google Analytics, add variables #8, #9, #10.

#### Step 4: Verify All Variables

After adding, your list should look like:

```
┌──────────────────────────────────────────────────────┐
│ Environment variables                 [Add variable] │
├──────────────────────────────────────────────────────┤
│ Key                                  Scopes          │
│ ──────────────────────────────────────────────────  │
│ CLERK_SECRET_KEY                     Production, ... │
│ MONGODB_URI                          Production, ... │
│ NEXT_PUBLIC_BASE_URL                 Production, ... │
│ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY    Production, ... │
│ NEXT_PUBLIC_GA_MEASUREMENT_ID        Production, ... │
│ NEXT_PUBLIC_STRAPI_API_TOKEN         Production, ... │
│ NEXT_PUBLIC_STRAPI_URL               Production, ... │
│ NEXT_PUBLIC_TMDB_API_KEY             Production, ... │
│ NEXT_PUBLIC_TMDB_BASE_URL            Production, ... │
│ NEXT_PUBLIC_TMDB_IMAGE_BASE_URL      Production, ... │
└──────────────────────────────────────────────────────┘
```

---

## ✅ VERIFICATION & TESTING

### After Adding Variables

#### 1. Deploy or Redeploy

If you haven't deployed yet:
- Go to **Deploys** tab
- Click **"Trigger deploy"**
- Select **"Deploy site"**

If already deployed:
- Go to **Deploys** tab
- Click **"Trigger deploy"**
- Select **"Clear cache and deploy site"**

#### 2. Watch the Build Log

In the deploy log, you should see:
```
✓ Environment variables loaded
✓ Building Next.js app
✓ Compiled successfully
```

You should NOT see:
```
✗ Missing environment variables
✗ CLERK_PUBLISHABLE_KEY is not defined
```

#### 3. Test Your Deployed Site

Once deployed, visit your site and test:

**Test Authentication:**
1. Go to your site URL
2. Click "Sign In"
3. Should show Clerk sign-in page (not error)

**Test Movie Search:**
1. Search for a movie
2. Click on a movie
3. Should show movie details (not "API Error")

**Test MongoDB:**
1. Sign in to your account
2. Add a movie to favorites
3. Refresh page
4. Favorite should persist

**Test API Health:**
Visit: `https://your-site.netlify.app/api/health/mongodb`

Should return:
```json
{
  "status": "healthy",
  "mongodb": {
    "connected": true
  }
}
```

---

## 🐛 TROUBLESHOOTING

### Common Issues & Solutions

#### Issue 1: Build Fails with "Missing environment variables"

**Error:**
```
Error: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not defined
```

**Solution:**
1. Go to **Site settings → Environment variables**
2. Verify the variable name is EXACTLY: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
3. Check for typos (extra spaces, wrong case, etc.)
4. Ensure all scopes are checked
5. Redeploy

---

#### Issue 2: "Clerk is not configured" error at runtime

**Error:**
```
Missing publishableKey
```

**Solution:**
1. Variables starting with `NEXT_PUBLIC_` MUST be added before build
2. If you added them after deploying, you must:
   - **Trigger a new deployment** (not just restart)
   - Go to **Deploys** → **Trigger deploy** → **Clear cache and deploy site**
3. Verify the key starts with `pk_live_` or `pk_test_`

---

#### Issue 3: MongoDB connection fails

**Error:**
```
MongoServerError: bad auth
```

**Solution:**
1. Check your MongoDB connection string has:
   - Correct username
   - Correct password (URL-encoded if special chars)
   - Database name: `/moviesearch2025`
2. In MongoDB Atlas:
   - Verify database user exists
   - Check password is correct
   - Ensure network access allows `0.0.0.0/0`
3. Test connection string locally first

---

#### Issue 4: TMDB API not working

**Error:**
```
Invalid API key
```

**Solution:**
1. Verify API key from TMDB is active
2. Wait 5-10 minutes after creating key (activation time)
3. Check no extra spaces in the key
4. Ensure using API Key (v3), not Access Token (v4)

---

#### Issue 5: Variables not taking effect

**Problem:**
- Added variables but app still shows old behavior

**Solution:**
1. **MUST trigger new deployment** after adding variables
2. Simply saving variables doesn't rebuild the app
3. Go to **Deploys** tab
4. Click **"Trigger deploy"**
5. Select **"Clear cache and deploy site"**
6. Wait for build to complete (5-10 minutes)

---

#### Issue 6: Special characters in MongoDB password

**Problem:**
```
Connection string authentication failed
```

**Solution:**
If your MongoDB password contains special characters like `@`, `#`, `$`, etc:

1. **URL encode** the password:
   - `@` → `%40`
   - `#` → `%23`
   - `$` → `%24`
   - `&` → `%26`

2. Example:
   ```
   Password: MyP@ss#123
   Encoded:  MyP%40ss%23123
   
   Connection string:
   mongodb+srv://user:MyP%40ss%23123@cluster.mongodb.net/...
   ```

3. Use online URL encoder: https://www.urlencoder.org

---

## 📋 CHECKLIST

### Before Deploying

- [ ] Obtained Clerk publishable key
- [ ] Obtained Clerk secret key
- [ ] Obtained TMDB API key
- [ ] Created MongoDB Atlas cluster
- [ ] Created MongoDB database user
- [ ] Obtained MongoDB connection string
- [ ] (Optional) Set up Strapi and obtained URL + token
- [ ] (Optional) Set up Google Analytics and obtained ID

### In Netlify Dashboard

- [ ] Added `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- [ ] Added `CLERK_SECRET_KEY`
- [ ] Added `NEXT_PUBLIC_TMDB_API_KEY`
- [ ] Added `MONGODB_URI`
- [ ] Added `NEXT_PUBLIC_TMDB_BASE_URL`
- [ ] Added `NEXT_PUBLIC_TMDB_IMAGE_BASE_URL`
- [ ] Added `NEXT_PUBLIC_BASE_URL` (temporary value)
- [ ] (Optional) Added Strapi variables
- [ ] (Optional) Added Google Analytics ID
- [ ] All variables have all scopes checked
- [ ] No typos in variable names
- [ ] No extra spaces in values

### After First Deploy

- [ ] Deployment successful
- [ ] Got Netlify URL
- [ ] Updated `NEXT_PUBLIC_BASE_URL` to Netlify URL
- [ ] Triggered new deployment after updating URL
- [ ] Updated Clerk redirect URLs
- [ ] Tested authentication (sign in/sign up)
- [ ] Tested movie search
- [ ] Tested favorites/watchlist
- [ ] Tested MongoDB connection
- [ ] All features working

---

## 🎉 SUCCESS!

Once all variables are added and the site is deployed, you'll have:

✅ **Full authentication** with Clerk  
✅ **Movie/TV data** from TMDB  
✅ **User data storage** with MongoDB  
✅ **Blog functionality** with Strapi (if configured)  
✅ **Analytics tracking** with Google Analytics (if configured)  

---

## 💡 PRO TIPS

### 1. Use Environment-Specific Values

For production vs. development:
```
Production Clerk:  pk_live_...
Testing Clerk:     pk_test_...
```

### 2. Secure Sensitive Variables

Variables without `NEXT_PUBLIC_` prefix are:
- ✅ Server-side only
- ✅ Not exposed to browser
- ✅ More secure

Examples:
- `CLERK_SECRET_KEY` ✅ Secure
- `MONGODB_URI` ✅ Secure
- `NEXT_PUBLIC_TMDB_API_KEY` ⚠️ Public (but safe for TMDB)

### 3. Test Locally First

Before deploying to Netlify:
1. Create `.env.local` with same variables
2. Test: `npm run dev`
3. Verify everything works
4. Then add to Netlify

### 4. Document Your Variables

Keep a secure note with:
- Where each key came from
- When it was created
- What it's for
- How to regenerate if needed

### 5. Regular Key Rotation

For production apps:
- Rotate Clerk keys every 6-12 months
- Rotate MongoDB passwords annually
- Keep TMDB key secure but it's less critical

---

## 📞 NEED HELP?

### Quick Links

- **Netlify Docs**: https://docs.netlify.com/environment-variables/overview/
- **Clerk Docs**: https://clerk.com/docs/deployments/clerk-environment-variables
- **MongoDB Atlas**: https://docs.atlas.mongodb.com/security-add-ip-address-to-list/
- **TMDB API**: https://developers.themoviedb.org/3/getting-started/authentication

### Project Docs

- `COMPLETE_ENVIRONMENT_SETUP_GUIDE.md` - Local setup
- `FINAL_NETLIFY_DEPLOYMENT_GUIDE_2025.md` - Full deployment
- `QUICK_PUSH_AND_DEPLOY.md` - Quick start

---

## 🎊 READY TO DEPLOY!

With all environment variables configured, you're ready to:

1. **Deploy to Netlify** (or trigger redeploy)
2. **Test all features**
3. **Update base URL**
4. **Configure Clerk redirects**
5. **Share your app!**

---

**Your Netlify environment is now fully configured!** 🚀

*Time to deploy and launch your amazing MovieSearch 2025 app!* 🎬📺

