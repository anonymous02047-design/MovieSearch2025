# 🚀 Netlify Production Setup Guide - MovieSearch 2025

## Complete Guide: MongoDB + Strapi CMS on Netlify

**For**: Production deployment on Netlify  
**Time Required**: 30-40 minutes  
**Cost**: 100% FREE (using free tiers)  
**Difficulty**: Beginner-friendly  

---

## 📋 TABLE OF CONTENTS

1. [MongoDB Atlas Setup](#part-1-mongodb-atlas-setup)
2. [Add MongoDB to Netlify](#part-2-add-mongodb-to-netlify)
3. [Strapi CMS Setup](#part-3-strapi-cms-setup)
4. [Add Strapi to Netlify](#part-4-add-strapi-to-netlify)
5. [Deploy & Verify](#part-5-deploy--verify)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 WHAT YOU'LL HAVE

**After this guide**:
- ✅ MongoDB database (free tier)
- ✅ User profiles, favorites, reviews
- ✅ Strapi CMS for blog
- ✅ All working on your Netlify site!

---

# PART 1: MongoDB Atlas Setup

## Step 1: Create MongoDB Atlas Account

### 1.1 Sign Up

1. **Visit**: https://www.mongodb.com/cloud/atlas/register
2. **Click**: "Try Free"
3. **Sign up with**:
   - Google (recommended - fastest)
   - OR GitHub
   - OR Email/Password

4. **Complete registration**
5. **Verify email** (if using email signup)

### 1.2 Answer Setup Questions (Optional)

- Goal: **"Learn MongoDB"**
- Application: **"Build a new application"**
- Preferred Language: **"JavaScript"**
- Click **"Finish"**

---

## Step 2: Create Free Cluster

### 2.1 Choose Free Tier

1. **Plan**: Select **"M0 Free"** (should be pre-selected)
   - ✅ 512 MB storage
   - ✅ Shared RAM
   - ✅ Perfect for your app!

2. **Provider & Region**:
   - Provider: **AWS** (recommended)
   - Region: **Choose closest to your users**:
     - 🇺🇸 USA: `us-east-1` (Virginia)
     - 🇪🇺 Europe: `eu-west-1` (Ireland)
     - 🇮🇳 India: `ap-south-1` (Mumbai)
     - 🇸🇬 Asia-Pacific: `ap-southeast-1` (Singapore)

3. **Cluster Name**: 
   - Default: `Cluster0`
   - OR rename: `MovieSearch2025`

4. **Click**: "Create Cluster"

⏳ **Wait 3-5 minutes** for cluster creation...

---

## Step 3: Create Database User

### 3.1 Security Quickstart

You'll see a "Security Quickstart" modal automatically.

If not, go to: **Security** → **Database Access** → **Add New Database User**

### 3.2 Add User

1. **Authentication Method**: Password
2. **Username**: `moviesearch_admin`
3. **Password**: 
   - Click **"Autogenerate Secure Password"**
   - ⚠️ **COPY AND SAVE THIS PASSWORD!** (You'll need it!)
   - Example: `xY9mK2pL5qR8nT3v`

4. **Database User Privileges**: 
   - Select **"Read and write to any database"**

5. **Click**: "Add User"

---

## Step 4: Configure Network Access

### 4.1 Whitelist IP Address

1. **Go to**: Security → **Network Access**
2. **Click**: "Add IP Address"

### 4.2 Allow Access from Anywhere (For Netlify)

⚠️ **Important**: Netlify functions run from multiple IPs, so we need to allow all.

1. **Click**: "Allow Access from Anywhere"
2. **IP Address**: `0.0.0.0/0` (automatically filled)
3. **Comment**: `Netlify Production Access`
4. **Click**: "Confirm"

> **Note**: This is safe because:
> - Access still requires username/password
> - MongoDB uses TLS encryption
> - Your connection string is secret

---

## Step 5: Get Connection String

### 5.1 Connect to Cluster

1. **Go to**: Database → **Clusters**
2. **Click**: "Connect" button (on your cluster)

### 5.2 Choose Connection Method

1. **Select**: "Connect your application"
2. **Driver**: "Node.js"
3. **Version**: "4.1 or later"

### 5.3 Copy & Modify Connection String

You'll see something like:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**Now modify it**:

1. **Replace** `<username>` with: `moviesearch_admin`
2. **Replace** `<password>` with: Your saved password
3. **Add database name** after `.net/`: `moviesearch`

**Final format**:
```
mongodb+srv://moviesearch_admin:xY9mK2pL5qR8nT3v@cluster0.xxxxx.mongodb.net/moviesearch?retryWrites=true&w=majority
```

⚠️ **SAVE THIS STRING!** You'll add it to Netlify next.

---

# PART 2: Add MongoDB to Netlify

## Step 1: Login to Netlify

1. **Visit**: https://app.netlify.com
2. **Login** with your account
3. **Select your site**: MovieSearch2025 (or whatever you named it)

---

## Step 2: Add Environment Variables

### 2.1 Navigate to Environment Variables

**Two ways to get there**:

**Method A** (Recommended):
1. Click on your site name
2. Go to **Site configuration** → **Environment variables**

**Method B**:
1. Click **"Site settings"**
2. Scroll to **"Environment variables"** (in left sidebar)
3. Click **"Environment variables"**

### 2.2 Add MongoDB URI

1. **Click**: "Add a variable" or "Add environment variable"

2. **Fill in**:
   - **Key**: `MONGODB_URI`
   - **Value**: Your connection string from Step 5.3
     ```
     mongodb+srv://moviesearch_admin:xY9mK2pL5qR8nT3v@cluster0.xxxxx.mongodb.net/moviesearch?retryWrites=true&w=majority
     ```
   - **Scopes**: 
     - ✅ Production
     - ✅ Deploy previews (optional)
     - ✅ Branch deploys (optional)

3. **Click**: "Create variable" or "Save"

### 2.3 Verify All Required Variables

Make sure you also have these (should already exist):

| Variable Name | Example Value | Status |
|---------------|---------------|--------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_test_...` | ✅ Required |
| `CLERK_SECRET_KEY` | `sk_test_...` | ✅ Required |
| `NEXT_PUBLIC_TMDB_API_KEY` | `your_tmdb_key` | ✅ Required |
| `NEXT_PUBLIC_TMDB_BASE_URL` | `https://api.themoviedb.org/3` | ✅ Required |
| `NEXT_PUBLIC_TMDB_IMAGE_BASE_URL` | `https://image.tmdb.org/t/p` | ✅ Required |
| `NEXT_PUBLIC_BASE_URL` | `https://your-site.netlify.app` | ✅ Recommended |
| `MONGODB_URI` | `mongodb+srv://...` | ✅ **NEW!** |

---

## Step 3: Redeploy Site

### 3.1 Trigger New Deployment

**Option A - Clear Cache & Deploy** (Recommended):
1. Go to **"Deploys"** tab
2. Click **"Trigger deploy"** dropdown
3. Select **"Clear cache and deploy site"**

**Option B - Quick Deploy**:
1. Go to **"Deploys"**
2. Click **"Trigger deploy"** → **"Deploy site"**

### 3.2 Monitor Deployment

1. **Watch the build log**
2. **Look for**: "✅ MongoDB connected successfully"
3. **Wait**: 3-5 minutes for deployment

---

# PART 3: Strapi CMS Setup

You have **3 options** for Strapi. Choose ONE:

---

## OPTION 1: Strapi Cloud (Easiest) ⭐ RECOMMENDED

### Best for: Quick setup, no server management
### Free tier: 2 content types, 1000 entries

### Step 1: Create Strapi Cloud Account

1. **Visit**: https://cloud.strapi.io/signup
2. **Sign up with**:
   - GitHub (recommended)
   - OR Email
3. **Verify email** (if using email)

### Step 2: Create Project

1. **Click**: "Create Project"
2. **Project name**: `MovieSearch2025-Blog`
3. **Region**: Choose closest to you:
   - 🇺🇸 US East (Virginia)
   - 🇪🇺 Europe (Ireland)
   - 🇸🇬 Asia Pacific (Singapore)
4. **Plan**: 
   - Free Trial (14 days) - converts to Developer plan
   - OR Developer ($9/month) - **Free tier available**
5. **Click**: "Create Project"

⏳ **Wait 3-5 minutes** for deployment...

### Step 3: Access Admin Panel

1. **Click**: "Open Admin Panel"
2. **URL will be**: `https://your-project-name.strapiapp.com`
3. **Create admin account**:
   - First Name: Your name
   - Last Name: Your last name
   - Email: your@email.com
   - Password: Strong password (8+ chars)
4. **Click**: "Let's start"

**✅ Jump to**: [Configure Strapi Content Type](#configure-strapi-content-type)

---

## OPTION 2: Railway (Free Hosting)

### Best for: Free hosting with more control
### Free tier: $5 credit/month (enough for Strapi)

### Step 1: Create Railway Account

1. **Visit**: https://railway.app/
2. **Click**: "Start a New Project"
3. **Login with GitHub** (required)

### Step 2: Deploy Strapi Template

1. **Click**: "Deploy from template"
2. **Search for**: "Strapi"
3. **Select**: "Strapi 4" template
4. **Click**: "Deploy"
5. **Configure**:
   - Project name: `MovieSearch2025-Blog`
   - Keep default settings
6. **Click**: "Deploy"

⏳ **Wait 5-10 minutes** for deployment...

### Step 3: Access Admin Panel

1. **Click** on your project
2. **Click** on the Strapi service
3. **Click** "Open" (or copy the URL)
4. **Add `/admin` to URL**
   - Example: `https://your-app.railway.app/admin`
5. **Create admin account** (same as Strapi Cloud)

**✅ Continue to**: [Configure Strapi Content Type](#configure-strapi-content-type)

---

## OPTION 3: Render (Free Hosting)

### Best for: Alternative free hosting
### Free tier: Free PostgreSQL + Web Service

### Step 1: Create Render Account

1. **Visit**: https://render.com/
2. **Sign up** with GitHub
3. **Authorize** Render

### Step 2: Deploy Strapi

1. **Click**: "New +"
2. **Select**: "Web Service"
3. **Connect** your Strapi repo (you'll need to create one)
4. **OR use Strapi's starter repo**

### Step 3: Configure

1. **Name**: `moviesearch-blog`
2. **Environment**: `Node`
3. **Build Command**: `yarn build`
4. **Start Command**: `yarn start`
5. **Plan**: Free
6. **Click**: "Create Web Service"

⏳ **Wait 10-15 minutes** for initial deployment...

**✅ Continue to**: [Configure Strapi Content Type](#configure-strapi-content-type)

---

## Configure Strapi Content Type

**This applies to ALL options above!**

### Step 1: Open Content-Type Builder

1. **In Strapi Admin Panel**
2. **Click**: "Content-Type Builder" (left sidebar, wrench icon)

### Step 2: Create Blog Post Collection

1. **Click**: "Create new collection type"
2. **Display name**: `Blog Post`
   - ⚠️ Must be exactly "Blog Post" (singular)
3. **Click**: "Continue"

### Step 3: Add Fields

**Add these fields one by one**:

#### Field 1: Title
- **Type**: Text
- **Name**: `title`
- **Type**: Short text
- **Required**: ✅ Yes
- Click "Add another field"

#### Field 2: Slug
- **Type**: UID
- **Name**: `slug`
- **Attached field**: `title`
- **Required**: ✅ Yes
- Click "Add another field"

#### Field 3: Excerpt
- **Type**: Text
- **Name**: `excerpt`
- **Type**: Long text
- Click "Add another field"

#### Field 4: Content
- **Type**: Rich Text
- **Name**: `content`
- **Required**: ✅ Yes
- Click "Add another field"

#### Field 5: Featured Image
- **Type**: Media
- **Name**: `featuredImage`
- **Type**: Single media
- **Allowed types**: Images only
- Click "Add another field"

#### Field 6: Category
- **Type**: Text
- **Name**: `category`
- **Type**: Short text
- Click "Add another field"

#### Field 7: Tags
- **Type**: Text
- **Name**: `tags`
- **Type**: Short text
- Click "Add another field"

#### Field 8: Author
- **Type**: Text
- **Name**: `author`
- **Type**: Short text
- Click "Add another field"

#### Field 9: Published Date
- **Type**: Date
- **Name**: `publishedDate`
- **Type**: Date
- Click "Add another field"

#### Field 10: Reading Time
- **Type**: Number
- **Name**: `readingTime`
- **Number format**: Integer
- Click "Finish"

### Step 4: Save Content Type

1. **Click**: "Save" (top right)
2. **Wait**: Strapi will restart (~30 seconds)
3. **Refresh page** if needed

---

## Configure API Permissions

### Step 1: Open Roles & Permissions

1. **Click**: "Settings" (bottom left, gear icon)
2. **Under "Users & Permissions Plugin"**
3. **Click**: "Roles"

### Step 2: Configure Public Role

1. **Click**: "Public"
2. **Scroll down** to "Permissions"
3. **Expand**: "Blog-post"
4. **Check these boxes**:
   - ✅ `find` (get all posts)
   - ✅ `findOne` (get single post)
   - ✅ `count` (count posts)
5. **Click**: "Save" (top right)

---

## Add Sample Blog Posts

### Step 1: Open Content Manager

1. **Click**: "Content Manager" (left sidebar)
2. **Click**: "Blog Post"

### Step 2: Create First Post

1. **Click**: "+ Create new entry"
2. **Fill in**:
   - **Title**: `Welcome to MovieSearch 2025 Blog`
   - **Slug**: (auto-generated from title)
   - **Excerpt**: `Discover the latest movie news, reviews, and industry insights right here on MovieSearch 2025.`
   - **Content**: 
     ```
     Welcome to our brand new blog! Here you'll find:
     
     - Latest movie news and updates
     - In-depth reviews and analysis
     - Behind-the-scenes content
     - Industry trends and insights
     
     We're excited to share our passion for cinema with you. Stay tuned for regular updates!
     ```
   - **Category**: `News`
   - **Tags**: `announcement, welcome, news`
   - **Author**: `MovieSearch Team`
   - **Published Date**: Today's date
   - **Reading Time**: `3`

3. **Upload Featured Image** (optional):
   - Click "Add" under Featured Image
   - Upload an image or use URL

4. **Click**: "Save"
5. **Click**: "Publish" (top right)

### Step 3: Create More Posts

Repeat for 3-5 more posts. Here are ideas:

**Post 2**:
- Title: `Top 10 Movies of 2025`
- Category: `Lists`
- Tags: `top 10, recommendations, 2025`

**Post 3**:
- Title: `How to Use MovieSearch Effectively`
- Category: `Guides`  
- Tags: `tutorial, guide, tips`

**Post 4**:
- Title: `Best Sci-Fi Films of All Time`
- Category: `Reviews`
- Tags: `sci-fi, classics, recommendations`

**Post 5**:
- Title: `Upcoming Movie Releases This Month`
- Category: `News`
- Tags: `upcoming, releases, preview`

---

## Get Your Strapi API URL

### For Strapi Cloud:
```
https://your-project-name.strapiapp.com
```

### For Railway:
```
https://your-app-name.railway.app
```

### For Render:
```
https://your-service-name.onrender.com
```

**⚠️ SAVE THIS URL!** You'll add it to Netlify next.

---

# PART 4: Add Strapi to Netlify

## Step 1: Add Strapi URL to Netlify

1. **Go to**: https://app.netlify.com
2. **Select your site**
3. **Go to**: Site configuration → Environment variables
4. **Click**: "Add variable"

### Add Variable:

- **Key**: `NEXT_PUBLIC_STRAPI_URL`
- **Value**: Your Strapi URL (from above)
  ```
  https://your-project-name.strapiapp.com
  ```
  OR
  ```
  https://your-app.railway.app
  ```
  OR
  ```
  https://your-service.onrender.com
  ```
  
  ⚠️ **NO trailing slash!**

- **Scopes**: 
  - ✅ Production
  - ✅ Deploy previews
  - ✅ Branch deploys

5. **Click**: "Create variable"

---

## Step 2: (Optional) Add Strapi API Token

If you want authenticated requests:

1. **In Strapi Admin Panel**:
   - Settings → API Tokens
   - Click "Create new API Token"
   - Name: `MovieSearch Production`
   - Token type: `Read-only`
   - Duration: `Unlimited`
   - Click "Save"
   - **COPY THE TOKEN!**

2. **In Netlify**:
   - Add variable
   - Key: `NEXT_PUBLIC_STRAPI_API_TOKEN`
   - Value: Your token
   - Click "Create variable"

---

# PART 5: Deploy & Verify

## Step 1: Redeploy Site

1. **Go to**: Deploys tab
2. **Click**: "Trigger deploy" → "Clear cache and deploy site"
3. **Wait**: 3-5 minutes

## Step 2: Check Build Log

Look for these success messages:
```
✅ MongoDB connected successfully
✅ Build completed
```

## Step 3: Verify MongoDB

1. **Visit your site**: `https://your-site.netlify.app`
2. **Sign in** with Clerk
3. **Go to Profile**: Should work!
4. **Try adding a favorite**: Should save to MongoDB!

## Step 4: Verify Strapi Blog

1. **Visit**: `https://your-site.netlify.app/blog`
2. **Should see**: Your blog posts from Strapi!
3. **Try search**: Should work!
4. **Try filters**: Should work!

## Step 5: Check MongoDB Atlas

1. **Go to**: MongoDB Atlas Dashboard
2. **Click**: "Browse Collections"
3. **Should see**:
   - Database: `moviesearch`
   - Collections: `users`, `reviews`, `collections`
   - Data: Your user data!

---

# Troubleshooting

## MongoDB Issues

### Issue: "MongoDB not configured" error

**Solution**:
1. Check `MONGODB_URI` in Netlify env vars
2. Verify connection string format
3. Check username/password (no special characters unencoded)
4. Redeploy site

### Issue: "MongoServerError: bad auth"

**Solution**:
1. Check username is correct
2. Check password is correct
3. URL-encode special characters:
   - `@` → `%40`
   - `#` → `%23`
   - `%` → `%25`

### Issue: Connection timeout

**Solution**:
1. Verify IP whitelist includes `0.0.0.0/0`
2. Check MongoDB cluster is running
3. Try different region

---

## Strapi Issues

### Issue: CORS error

**Solution**:
Add your Netlify URL to Strapi CORS settings:

1. **In Strapi project**, edit `config/middlewares.js` or `config/middlewares.ts`
2. **Add**:
   ```javascript
   {
     name: 'strapi::cors',
     config: {
       enabled: true,
       origin: ['https://your-site.netlify.app'],
     },
   }
   ```
3. **Redeploy Strapi**

### Issue: Blog posts not showing

**Check**:
1. Posts are published (not just saved)
2. API permissions set correctly (Public → Blog-post → find, findOne)
3. Strapi URL correct in Netlify
4. No trailing slash in URL

### Issue: Images not loading

**Solution**:
1. Check image URLs in Strapi
2. Verify media upload works in Strapi admin
3. Check CORS settings

---

## Netlify Issues

### Issue: Build fails

**Check**:
1. All required env vars are set
2. Values don't have quotes around them
3. MongoDB URI is properly formatted
4. Trigger "Clear cache and deploy"

### Issue: Environment variables not updating

**Solution**:
1. After adding/changing env vars
2. Always trigger new deployment
3. "Clear cache and deploy" works best

---

# ✅ FINAL CHECKLIST

## MongoDB Setup Complete:
- [ ] MongoDB Atlas account created
- [ ] Free cluster created
- [ ] Database user created
- [ ] IP whitelist configured (0.0.0.0/0)
- [ ] Connection string obtained
- [ ] `MONGODB_URI` added to Netlify
- [ ] Site redeployed
- [ ] User profiles work on site

## Strapi Setup Complete:
- [ ] Strapi account/server created
- [ ] Admin account created
- [ ] Blog Post content type created
- [ ] API permissions configured
- [ ] 3-5 sample posts created and published
- [ ] Strapi URL obtained
- [ ] `NEXT_PUBLIC_STRAPI_URL` added to Netlify
- [ ] Site redeployed
- [ ] Blog posts visible on site

## Production Ready:
- [ ] Site deployed successfully
- [ ] No build errors
- [ ] MongoDB features working
- [ ] Blog displaying posts
- [ ] All pages loading correctly

---

# 🎉 CONGRATULATIONS!

Your MovieSearch 2025 app is now fully configured with:

✅ **MongoDB** - User profiles, favorites, reviews  
✅ **Strapi CMS** - Real blog system with admin panel  
✅ **Netlify** - Fast, reliable hosting  
✅ **197 Countries** - Global support  
✅ **Smart Recommendations** - Personalized content  

**All for FREE!** 🎊

---

## 📚 HELPFUL LINKS

### MongoDB
- Dashboard: https://cloud.mongodb.com/
- Docs: https://docs.mongodb.com/

### Strapi
- Strapi Cloud: https://cloud.strapi.io/
- Railway: https://railway.app/
- Render: https://render.com/
- Docs: https://docs.strapi.io/

### Netlify
- Dashboard: https://app.netlify.com/
- Docs: https://docs.netlify.com/

---

**Need help?** Check the troubleshooting section or create an issue!

**Version**: 4.1.0  
**Status**: Production Ready  
**Free Tier**: ✅ 100% Compatible

