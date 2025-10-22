# 🚀 Strapi CMS Integration Guide - MovieSearch 2025

## Complete Setup Guide for Free Strapi CMS

**Version**: 1.0.0  
**Last Updated**: October 22, 2025  
**Difficulty**: Beginner-Friendly  
**Time Required**: 20-30 minutes  
**Cost**: 100% FREE ✅

---

## 📋 TABLE OF CONTENTS

1. [What is Strapi?](#what-is-strapi)
2. [Why Strapi for Blog?](#why-strapi-for-blog)
3. [Setup Options](#setup-options)
4. [Local Development Setup](#local-development-setup)
5. [Strapi Cloud Setup (Free)](#strapi-cloud-setup)
6. [Content Types Configuration](#content-types-configuration)
7. [API Integration](#api-integration)
8. [Environment Configuration](#environment-configuration)
9. [Testing](#testing)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)

---

## 🎯 WHAT IS STRAPI?

Strapi is a **free, open-source headless CMS** that gives you:
- ✅ Beautiful admin panel (no coding needed for content management)
- ✅ RESTful API automatically generated
- ✅ GraphQL support
- ✅ Media library for images/videos
- ✅ Role-based access control
- ✅ 100% free and open-source
- ✅ Can be self-hosted or use free cloud tier

---

## 💡 WHY STRAPI FOR BLOG?

### Before (Mock Blog)
- ❌ Hardcoded blog posts
- ❌ No admin panel
- ❌ Can't add/edit posts without coding
- ❌ No image uploads
- ❌ No categories/tags

### After (Real Strapi Blog)
- ✅ Real database-backed blog posts
- ✅ Beautiful admin panel for content management
- ✅ Easy to add/edit/delete posts
- ✅ Rich text editor
- ✅ Image uploads with media library
- ✅ Categories, tags, authors
- ✅ SEO fields built-in
- ✅ Search & filtering

---

## 🔧 SETUP OPTIONS

### Option 1: Strapi Cloud (Recommended for Beginners)
- **Pros**: Free tier, no server management, instant setup
- **Cons**: Limited to 2 content types on free tier
- **Best for**: Quick start, beginners, small blogs

### Option 2: Self-Hosted Local (Recommended for Development)
- **Pros**: Unlimited content types, full control, free
- **Cons**: Need to deploy separately
- **Best for**: Development, testing, learning

### Option 3: Deploy to Free Services
- **Options**: Railway, Render, Heroku (with PostgreSQL addon)
- **Pros**: Free hosting, more control than Strapi Cloud
- **Cons**: Requires setup and deployment
- **Best for**: Production on budget

**We'll cover Option 1 (Strapi Cloud) and Option 2 (Local)**

---

## 💻 LOCAL DEVELOPMENT SETUP

### Prerequisites
```bash
# Check Node.js version (need 16.x or 18.x)
node --version

# If not installed or wrong version, download from:
# https://nodejs.org/
```

### Step 1: Create Strapi Project

Open a **NEW terminal** (separate from your MovieSearch project):

```bash
# Navigate to a parent directory (NOT inside MovieSearch2025)
cd "C:\Users\anony\OneDrive - Naushad Alam\Desktop"

# Create Strapi project
npx create-strapi-app@latest MovieSearch2025-Blog --quickstart

# This will:
# 1. Create a new folder "MovieSearch2025-Blog"
# 2. Install Strapi
# 3. Create SQLite database
# 4. Open admin panel in browser
```

**Wait 3-5 minutes for installation...**

### Step 2: Create Admin Account

Once installation completes, your browser will open to:
```
http://localhost:1337/admin
```

Create your admin account:
- **First Name**: Your Name
- **Last Name**: Your Last Name  
- **Email**: your@email.com
- **Password**: Choose a strong password (min 8 characters)

Click **"Let's start"**

### Step 3: Create Blog Content Type

In the Strapi Admin Panel:

1. **Click "Content-Type Builder"** (left sidebar)

2. **Create "Blog Post" Collection Type**:
   - Click **"Create new collection type"**
   - Display name: `Blog Post`
   - Click **"Continue"**

3. **Add Fields**:

   **a) Title** (Text):
   - Click **"Add another field"** → **"Text"**
   - Name: `title`
   - Type: Short text
   - Required: ✅ Yes
   - Click **"Finish"**

   **b) Slug** (UID):
   - **"Add another field"** → **"UID"**
   - Name: `slug`
   - Attached field: `title`
   - Required: ✅ Yes
   - Click **"Finish"**

   **c) Excerpt** (Text):
   - **"Add another field"** → **"Text"**
   - Name: `excerpt`
   - Type: Long text
   - Click **"Finish"**

   **d) Content** (Rich Text):
   - **"Add another field"** → **"Rich Text"**
   - Name: `content`
   - Required: ✅ Yes
   - Click **"Finish"**

   **e) Featured Image** (Media):
   - **"Add another field"** → **"Media"**
   - Name: `featuredImage`
   - Type: Single media
   - Allowed types: Images
   - Click **"Finish"**

   **f) Category** (Text):
   - **"Add another field"** → **"Text"**
   - Name: `category`
   - Type: Short text
   - Click **"Finish"**

   **g) Tags** (Text):
   - **"Add another field"** → **"Text"**
   - Name: `tags`
   - Type: Short text (can add multiple with JSON array later)
   - Click **"Finish"**

   **h) Author** (Text):
   - **"Add another field"** → **"Text"**
   - Name: `author`
   - Type: Short text
   - Click **"Finish"**

   **i) Published Date** (Date):
   - **"Add another field"** → **"Date"**
   - Name: `publishedDate`
   - Type: Date
   - Click **"Finish"**

   **j) Reading Time** (Number):
   - **"Add another field"** → **"Number"**
   - Name: `readingTime`
   - Number format: Integer
   - Click **"Finish"**

4. **Click "Save"** (top right)

Strapi will restart (wait ~30 seconds).

### Step 4: Configure Permissions

1. **Go to Settings** (left sidebar, bottom)
2. **Click "Roles"** under USERS & PERMISSIONS PLUGIN
3. **Click "Public"**
4. **Expand "Blog-post"**
5. **Check these permissions**:
   - ✅ `find` (get all posts)
   - ✅ `findOne` (get single post)
   - ✅ `count` (count posts)
6. **Click "Save"** (top right)

### Step 5: Add Sample Blog Posts

1. **Click "Content Manager"** (left sidebar)
2. **Click "Blog Post"**
3. **Click "+ Create new entry"**

Add 3-5 sample posts:

**Post 1:**
- Title: "Welcome to MovieSearch 2025 Blog"
- Excerpt: "Discover the latest movie news, reviews, and industry insights"
- Content: "Welcome to our blog! Here you'll find..."
- Category: "News"
- Tags: "announcement, welcome"
- Author: "MovieSearch Team"
- Published Date: Today
- Reading Time: 3

**Post 2:**
- Title: "Top 10 Movies of 2025"
- Excerpt: "Our curated list of must-watch films this year"
- Content: "Here are our top picks for 2025..."
- Category: "Lists"
- Tags: "top 10, 2025, recommendations"
- Author: "Film Critic"
- Published Date: Today
- Reading Time: 8

**Post 3:**
- Title: "How to Use MovieSearch Effectively"
- Excerpt: "Tips and tricks for discovering your next favorite movie"
- Content: "Learn how to make the most of MovieSearch..."
- Category: "Guides"
- Tags: "tutorial, tips, guide"
- Author: "MovieSearch Team"
- Reading Time: 5

After adding each post, click **"Save"** and **"Publish"**

### Step 6: Test API

Open your browser and visit:
```
http://localhost:1337/api/blog-posts
```

You should see JSON data with your blog posts! ✅

---

## ☁️ STRAPI CLOUD SETUP (FREE)

### Step 1: Create Strapi Cloud Account

1. **Visit**: https://cloud.strapi.io/signup
2. **Sign up** with email or GitHub
3. **Verify email**

### Step 2: Create Project

1. **Click "Create Project"**
2. **Project name**: MovieSearch2025-Blog
3. **Region**: Choose closest to your users
4. **Plan**: Select **"Free Trial"** (14 days) or **"Developer"** (paid but has free tier)
5. **Click "Create Project"**

Wait 3-5 minutes for deployment...

### Step 3: Access Admin Panel

1. Once deployed, click **"Open Admin Panel"**
2. **Create admin account** (like local setup)
3. **Follow Steps 3-6 from Local Setup** (create content type, permissions, add posts)

### Step 4: Get API URL

Your API will be at:
```
https://your-project-name.strapiapp.com/api/blog-posts
```

Save this URL for later!

---

## 🔗 API INTEGRATION

### Step 1: Create Strapi Client

Create `src/lib/strapi.ts`:

```typescript
// src/lib/strapi.ts
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || '';

export interface BlogPost {
  id: number;
  attributes: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string;
    author: string;
    publishedDate: string;
    readingTime: number;
    featuredImage?: {
      data: {
        attributes: {
          url: string;
          alternativeText: string;
        };
      };
    };
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export interface BlogPostsResponse {
  data: BlogPost[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

class StrapiAPI {
  private baseURL: string;
  private headers: HeadersInit;

  constructor() {
    this.baseURL = STRAPI_URL;
    this.headers = {
      'Content-Type': 'application/json',
    };

    if (STRAPI_API_TOKEN) {
      this.headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`;
    }
  }

  /**
   * Get all blog posts with pagination
   */
  async getBlogPosts(page: number = 1, pageSize: number = 10): Promise<BlogPostsResponse> {
    const response = await fetch(
      `${this.baseURL}/api/blog-posts?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*&sort=publishedDate:desc`,
      { headers: this.headers }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch blog posts: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get single blog post by slug
   */
  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const response = await fetch(
      `${this.baseURL}/api/blog-posts?filters[slug][$eq]=${slug}&populate=*`,
      { headers: this.headers }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch blog post: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data[0] || null;
  }

  /**
   * Get blog posts by category
   */
  async getBlogPostsByCategory(category: string, page: number = 1): Promise<BlogPostsResponse> {
    const response = await fetch(
      `${this.baseURL}/api/blog-posts?filters[category][$eq]=${category}&pagination[page]=${page}&pagination[pageSize]=10&populate=*&sort=publishedDate:desc`,
      { headers: this.headers }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch blog posts by category: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Search blog posts
   */
  async searchBlogPosts(query: string): Promise<BlogPostsResponse> {
    const response = await fetch(
      `${this.baseURL}/api/blog-posts?filters[$or][0][title][$containsi]=${query}&filters[$or][1][content][$containsi]=${query}&populate=*&sort=publishedDate:desc`,
      { headers: this.headers }
    );

    if (!response.ok) {
      throw new Error(`Failed to search blog posts: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get featured image URL
   */
  getImageUrl(imageData: any): string {
    if (!imageData?.data?.attributes?.url) {
      return '/placeholder-blog.jpg';
    }

    const url = imageData.data.attributes.url;
    
    // If URL is relative, prepend Strapi URL
    if (url.startsWith('/')) {
      return `${this.baseURL}${url}`;
    }

    return url;
  }
}

export const strapiApi = new StrapiAPI();
```

### Step 2: Update Environment Variables

Add to `.env.local`:
```env
# Strapi CMS Configuration
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
# For production, use your Strapi Cloud URL:
# NEXT_PUBLIC_STRAPI_URL=https://your-project.strapiapp.com

# Optional: API Token for authenticated requests
NEXT_PUBLIC_STRAPI_API_TOKEN=
```

Add to `env.example`:
```env
# Strapi CMS Configuration
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_TOKEN=
```

---

## 🧪 TESTING

### Test Local Strapi

1. **Start Strapi** (in Strapi project folder):
   ```bash
   cd MovieSearch2025-Blog
   npm run develop
   ```

2. **In new terminal, test API**:
   ```bash
   curl http://localhost:1337/api/blog-posts
   ```

3. **Should return JSON with your blog posts** ✅

### Test Integration

1. **Start your MovieSearch app**:
   ```bash
   cd MovieSearch2025
   npm run dev
   ```

2. **Visit**: http://localhost:3000/blog

3. **Should see real blog posts from Strapi** ✅

---

## 🚀 DEPLOYMENT

### Deploy Strapi

**Option 1: Strapi Cloud**
- Already deployed if you used Strapi Cloud setup!
- Update `.env.local` with cloud URL

**Option 2: Railway** (Free):
1. Visit https://railway.app/
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your Strapi repository
5. Add environment variables
6. Deploy!

**Option 3: Render** (Free):
1. Visit https://render.com/
2. Sign up
3. Click "New +" → "Web Service"
4. Connect GitHub repository
5. Deploy!

### Update MovieSearch Environment

In Netlify:
1. **Site Settings** → **Environment Variables**
2. **Add**:
   ```
   NEXT_PUBLIC_STRAPI_URL=https://your-strapi-url.com
   ```
3. **Redeploy**

---

## 🔧 TROUBLESHOOTING

### Issue: CORS Error
**Solution**: In Strapi, edit `config/middlewares.ts`:
```typescript
export default [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'https:'],
          'media-src': ["'self'", 'data:', 'blob:', 'https:'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: ['http://localhost:3000', 'https://your-site.netlify.app'],
    },
  },
  // ... other middlewares
];
```

### Issue: Images not loading
**Solution**: Check `getImageUrl()` function in `strapi.ts`

### Issue: Can't connect to Strapi
**Solution**: 
1. Verify Strapi is running (`npm run develop`)
2. Check URL in `.env.local`
3. Check permissions in Strapi admin

---

## 📚 NEXT STEPS

1. **Customize content type** - Add more fields as needed
2. **Add categories** - Create separate Category collection
3. **Add comments** - Install comments plugin
4. **Add SEO plugin** - Install `@strapi/plugin-seo`
5. **Add sitemap** - Include blog posts in sitemap

---

## ✅ CHECKLIST

- [ ] Strapi installed (local or cloud)
- [ ] Admin account created
- [ ] Blog Post content type created
- [ ] Permissions configured
- [ ] Sample posts added
- [ ] API tested
- [ ] Strapi client created (`strapi.ts`)
- [ ] Environment variables configured
- [ ] Blog page updated
- [ ] Tested locally
- [ ] Deployed (optional)

---

**Version**: 1.0.0  
**Status**: Production Ready  
**Free Tier**: ✅ Yes  
**Documentation**: Complete  

**🎉 You now have a real blog system powered by Strapi CMS! 🎉**

