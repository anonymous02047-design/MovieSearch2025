# 🔧 COMPLETE ENVIRONMENT SETUP GUIDE
## Step-by-Step Setup for All Environment Variables

**Last Updated**: October 22, 2025  
**For**: MovieSearch 2025  

---

## 📋 TABLE OF CONTENTS

1. [MongoDB Atlas Setup](#1-mongodb-atlas-setup) ⭐ RECOMMENDED
2. [Strapi CMS Setup](#2-strapi-cms-setup) (Optional)
3. [All Environment Variables](#3-all-environment-variables)
4. [Testing Configuration](#4-testing-configuration)
5. [Quick Setup Commands](#5-quick-setup-commands)

---

## ✅ CURRENT CONFIGURATION STATUS

Your project is **CONFIGURED** for:
- ✅ MongoDB (code ready, needs environment variables)
- ✅ Strapi CMS (code ready, needs environment variables)
- ✅ Clerk Authentication (code ready, needs keys)
- ✅ TMDB API (code ready, needs API key)

**What You Need**: Set up the services and add environment variables!

---

## 1️⃣ MONGODB ATLAS SETUP (FREE TIER)

### Why MongoDB?
MongoDB stores:
- User profiles and preferences
- Favorites and watchlists
- Viewing history
- Movie notes
- User reviews
- Collections

### Step 1: Create MongoDB Atlas Account

1. **Go to MongoDB Atlas**
   - Visit: https://www.mongodb.com/cloud/atlas
   - Click **"Try Free"** or **"Sign Up"**

2. **Sign Up**
   - Use Google, GitHub, or email
   - Fill in basic information
   - Verify your email

3. **Create Organization** (if prompted)
   - Organization Name: `MovieSearch` (or your name)
   - Click **"Next"**

### Step 2: Create a Cluster (FREE)

1. **Choose Deployment Type**
   - Select **"Shared"** (FREE tier)
   - Click **"Create"**

2. **Select Cloud Provider & Region**
   ```
   Cloud Provider:  AWS (recommended)
   Region:          Choose closest to you
                   - US: us-east-1 (N. Virginia)
                   - Europe: eu-west-1 (Ireland)
                   - Asia: ap-south-1 (Mumbai)
   Cluster Tier:    M0 Sandbox (FREE forever)
   ```

3. **Cluster Name**
   - Name: `MovieSearch2025` (or keep default)
   - Click **"Create Cluster"**

4. **Wait** (1-3 minutes for cluster creation)

### Step 3: Create Database User

1. **Security → Database Access**
   - Click **"Add New Database User"**

2. **Authentication Method**
   - Select **"Password"**

3. **User Credentials**
   ```
   Username: moviesearch_user
   Password: (Click "Autogenerate Secure Password")
   ```
   
   **⚠️ IMPORTANT**: 
   - Copy and save the password immediately!
   - You'll need it for the connection string

4. **Database User Privileges**
   - Select **"Read and write to any database"**
   - Click **"Add User"**

### Step 4: Configure Network Access

1. **Security → Network Access**
   - Click **"Add IP Address"**

2. **For Development** (Easiest):
   ```
   Access List Entry: 0.0.0.0/0
   Comment: Allow access from anywhere
   ```
   - Click **"Confirm"**

3. **For Production** (More Secure):
   - Add Netlify IP ranges or your specific IPs
   - For Netlify: Use `0.0.0.0/0` (Netlify uses dynamic IPs)

### Step 5: Get Connection String

1. **Go to Database → Connect**
   - Click **"Connect"** button on your cluster

2. **Choose Connection Method**
   - Select **"Connect your application"**

3. **Driver and Version**
   ```
   Driver: Node.js
   Version: 5.5 or later
   ```

4. **Copy Connection String**
   ```
   mongodb+srv://moviesearch_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

5. **Replace `<password>`** with your actual password:
   ```
   mongodb+srv://moviesearch_user:YOUR_ACTUAL_PASSWORD@cluster0.xxxxx.mongodb.net/moviesearch2025?retryWrites=true&w=majority
   ```

   **Note**: I added `/moviesearch2025` before the `?` to specify the database name.

### Step 6: Add to .env.local

```bash
MONGODB_URI=mongodb+srv://moviesearch_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/moviesearch2025?retryWrites=true&w=majority
```

### ✅ MongoDB Setup Complete!

---

## 2️⃣ STRAPI CMS SETUP (OPTIONAL - FOR BLOG)

### Why Strapi?
Strapi provides:
- Headless CMS for blog posts
- Admin panel for content management
- REST API for content delivery

### Option A: Local Strapi (Development)

#### Step 1: Install Strapi

```bash
# In a SEPARATE directory (not in MovieSearch2025)
cd ..
npx create-strapi-app@latest moviesearch-blog --quickstart
```

#### Step 2: Wait for Installation
- Strapi will install dependencies
- Browser will auto-open to admin panel
- Takes 2-5 minutes

#### Step 3: Create Admin User

In the browser:
```
First Name: Your Name
Last Name: Your Last Name
Email: your-email@example.com
Password: (Strong password)
```

#### Step 4: Create Blog Post Content Type

1. **Go to Content-Type Builder**
   - Click **"Create new collection type"**
   - Display name: `Blog Post`
   - Click **"Continue"**

2. **Add Fields**:

   **Text Fields**:
   - `title` (Short text, required)
   - `slug` (UID, attached to title)
   - `excerpt` (Long text)
   - `content` (Rich text)
   - `category` (Short text)
   - `tags` (Short text)
   - `author` (Short text, default: "MovieSearch Team")

   **Date/Time Fields**:
   - `publishedDate` (Date)

   **Number Field**:
   - `readingTime` (Integer, default: 5)

   **Media Field**:
   - `featuredImage` (Single media)

3. **Save and Restart**
   - Click **"Save"**
   - Strapi will restart (wait 30 seconds)

#### Step 5: Configure Permissions

1. **Settings → Roles → Public**
2. **Permissions → Blog-post**
   - Check: `find`, `findOne`
3. **Save**

#### Step 6: Create API Token

1. **Settings → API Tokens**
2. Click **"Create new API Token"**
   ```
   Name: MovieSearch Frontend
   Token duration: Unlimited
   Token type: Read-only
   ```
3. **Copy the token** (you'll only see it once!)

#### Step 7: Get Environment Variables

```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_TOKEN=your_copied_token_here
```

### Option B: Cloud Strapi (Production)

#### Use Strapi Cloud (Easiest)

1. **Go to**: https://cloud.strapi.io
2. **Sign up** for free account
3. **Create new project**
4. Follow the wizard
5. **Get URL and API token**

#### Use Heroku (Free Tier)

1. **Create Heroku account**: https://heroku.com
2. **Deploy Strapi**:
   ```bash
   # In your Strapi directory
   git init
   git add .
   git commit -m "Initial Strapi setup"
   heroku create moviesearch-blog
   git push heroku main
   ```
3. **Add Heroku PostgreSQL**:
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

4. **Get your Heroku URL**:
   ```
   NEXT_PUBLIC_STRAPI_URL=https://moviesearch-blog.herokuapp.com
   ```

### ✅ Strapi Setup Complete!

---

## 3️⃣ ALL ENVIRONMENT VARIABLES

### Step 1: Create .env.local File

```bash
# In your MovieSearch2025 directory
# Create .env.local (if it doesn't exist)
```

### Step 2: Copy This Template

Save this as `.env.local` in your project root:

```bash
# ==============================================
# 🔐 CLERK AUTHENTICATION (REQUIRED)
# ==============================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_CLERK_PUBLISHABLE_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_CLERK_SECRET_KEY_HERE

# ==============================================
# 🎬 TMDB API (REQUIRED)
# ==============================================
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
NEXT_PUBLIC_TMDB_API_BASE_URL=https://api.themoviedb.org/3

# ==============================================
# 🗄️ MONGODB (REQUIRED FOR USER FEATURES)
# ==============================================
MONGODB_URI=mongodb+srv://moviesearch_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/moviesearch2025?retryWrites=true&w=majority

# ==============================================
# 📝 STRAPI CMS (OPTIONAL - FOR BLOG)
# ==============================================
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_TOKEN=your_strapi_token_here

# ==============================================
# 🌐 APPLICATION
# ==============================================
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# ==============================================
# 📊 ANALYTICS (OPTIONAL)
# ==============================================
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Step 3: Fill in the Values

#### REQUIRED Variables:

1. **Clerk Keys** (Get from https://dashboard.clerk.com)
   ```bash
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
   CLERK_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_HERE
   ```

2. **TMDB API Key** (Get from https://www.themoviedb.org/settings/api)
   ```bash
   NEXT_PUBLIC_TMDB_API_KEY=your_actual_key
   ```

3. **MongoDB URI** (From Step 1 above)
   ```bash
   MONGODB_URI=mongodb+srv://moviesearch_user:YOUR_PASSWORD@...
   ```

#### OPTIONAL Variables:

4. **Strapi** (If using blog, from Step 2 above)
   ```bash
   NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
   NEXT_PUBLIC_STRAPI_API_TOKEN=your_token
   ```

5. **Google Analytics** (Get from https://analytics.google.com)
   ```bash
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

---

## 4️⃣ TESTING CONFIGURATION

### Test MongoDB Connection

```bash
# Create a test file
node -e "
const mongoose = require('mongoose');
const uri = 'YOUR_MONGODB_URI_HERE';
mongoose.connect(uri)
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
  });
"
```

### Test via Next.js App

1. **Start the dev server**:
   ```bash
   npm run dev
   ```

2. **Check console for MongoDB**:
   ```
   ✅ MongoDB connected successfully
   ```
   or
   ```
   ⚠️  MongoDB URI not configured
   ```

3. **Test API endpoint**:
   ```bash
   # Open in browser:
   http://localhost:3000/api/health/mongodb
   ```

   **Expected response**:
   ```json
   {
     "status": "healthy",
     "mongodb": {
       "connected": true,
       "host": "cluster0.xxxxx.mongodb.net",
       "database": "moviesearch2025"
     }
   }
   ```

### Test Strapi Connection

1. **Open Strapi admin**:
   ```
   http://localhost:1337/admin
   ```

2. **Create a test blog post**:
   - Go to Content Manager → Blog Posts
   - Click "Create new entry"
   - Fill in details
   - Click "Save" and "Publish"

3. **Test in MovieSearch app**:
   ```
   http://localhost:3000/blog
   ```
   - Should show your blog post

---

## 5️⃣ QUICK SETUP COMMANDS

### Full Setup Script

Save this as `setup-environment.sh`:

```bash
#!/bin/bash

echo "🔧 MovieSearch 2025 - Environment Setup"
echo "======================================="
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "⚠️  .env.local already exists!"
    read -p "Do you want to overwrite it? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 1
    fi
fi

# Copy template
cp env.example .env.local

echo "✅ Created .env.local from template"
echo ""
echo "📝 REQUIRED SETUP:"
echo "1. Get Clerk keys: https://dashboard.clerk.com"
echo "2. Get TMDB API key: https://www.themoviedb.org/settings/api"
echo "3. Setup MongoDB Atlas: https://www.mongodb.com/cloud/atlas"
echo "4. (Optional) Setup Strapi CMS for blog"
echo ""
echo "📄 Edit .env.local and fill in your values"
echo "📚 See COMPLETE_ENVIRONMENT_SETUP_GUIDE.md for detailed instructions"
```

### Run Setup:

```bash
chmod +x setup-environment.sh
./setup-environment.sh
```

---

## 📊 ENVIRONMENT VARIABLES CHECKLIST

### Development (.env.local)

- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- [ ] `CLERK_SECRET_KEY` - Clerk secret key  
- [ ] `NEXT_PUBLIC_TMDB_API_KEY` - TMDB API key
- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] `NEXT_PUBLIC_STRAPI_URL` - Strapi URL (if using blog)
- [ ] `NEXT_PUBLIC_STRAPI_API_TOKEN` - Strapi API token (if using blog)
- [ ] `NEXT_PUBLIC_BASE_URL` - Set to `http://localhost:3000`

### Production (Netlify)

All the same variables as development, but:
- [ ] `NEXT_PUBLIC_BASE_URL` - Set to your Netlify URL
- [ ] Use production Clerk keys (pk_live_, sk_live_)
- [ ] Use production MongoDB cluster (if different)
- [ ] Use production Strapi URL (if deployed separately)

---

## 🆘 TROUBLESHOOTING

### MongoDB Issues

**Error: "MongoServerError: bad auth"**
- ✅ Check username and password in connection string
- ✅ Password should be URL-encoded (replace `@` with `%40`, etc.)
- ✅ Check database user exists in Atlas

**Error: "MongooseServerSelectionError"**
- ✅ Check network access whitelist in Atlas
- ✅ Ensure `0.0.0.0/0` is added for development
- ✅ Check internet connection

**Error: "MongoDB URI not configured"**
- ✅ Verify `MONGODB_URI` is in `.env.local`
- ✅ Restart the development server
- ✅ Check for typos in variable name

### Strapi Issues

**Error: "Failed to fetch blog posts"**
- ✅ Check Strapi is running (`http://localhost:1337`)
- ✅ Verify API token is correct
- ✅ Check public permissions are set for blog-posts
- ✅ Ensure content type is named exactly `blog-post`

**Error: "CORS error"**
- ✅ In Strapi: Settings → CORS
- ✅ Add `http://localhost:3000` to allowed origins

### Clerk Issues

**Error: "Missing publishableKey"**
- ✅ Check `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` exists
- ✅ Restart dev server after adding env vars
- ✅ Verify key starts with `pk_test_` or `pk_live_`

### TMDB Issues

**Error: "Invalid API key"**
- ✅ Verify key is correct from TMDB settings
- ✅ Check key is activated (may take a few minutes)
- ✅ Ensure no extra spaces in the key

---

## 🎉 SUCCESS CHECKLIST

After completing setup:

- [ ] ✅ MongoDB Atlas cluster created
- [ ] ✅ Database user created
- [ ] ✅ Network access configured
- [ ] ✅ Connection string copied
- [ ] ✅ `.env.local` file created
- [ ] ✅ All REQUIRED variables filled
- [ ] ✅ MongoDB connection tested (✅ in console)
- [ ] ✅ App starts without errors (`npm run dev`)
- [ ] ✅ Strapi running (if using blog)
- [ ] ✅ Blog posts display (if using Strapi)

---

## 📞 NEED HELP?

### Resources

- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Strapi Docs**: https://docs.strapi.io
- **Clerk Docs**: https://clerk.com/docs
- **TMDB API Docs**: https://developers.themoviedb.org

### Project Documentation

- `MONGODB_INTEGRATION_GUIDE.md` - MongoDB details
- `FINAL_NETLIFY_DEPLOYMENT_GUIDE_2025.md` - Deployment
- `env.example` - All variable descriptions

---

## 🎊 CONGRATULATIONS!

You've successfully configured all environment variables for MovieSearch 2025!

**Next Steps:**
1. Test locally: `npm run dev`
2. Create some blog posts in Strapi (optional)
3. Test all features
4. Ready for deployment!

---

**Your environment is now fully configured!** 🚀

