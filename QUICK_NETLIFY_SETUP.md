# ⚡ Quick Netlify Setup - 10 Minutes

## MongoDB + Strapi on Netlify (Fast Track)

**For users who want to get started FAST!**

---

## 🎯 Quick Links

### MongoDB Atlas
👉 https://www.mongodb.com/cloud/atlas/register

### Strapi Cloud
👉 https://cloud.strapi.io/signup

### Netlify
👉 https://app.netlify.com/

---

## ⚡ 10-MINUTE SETUP

### Step 1: MongoDB (3 minutes)

1. **Sign up**: https://www.mongodb.com/cloud/atlas/register
2. **Create free cluster** (M0 - 512MB)
3. **Create user**: Username + Password (SAVE IT!)
4. **Add IP**: `0.0.0.0/0` (Allow all)
5. **Get connection string**:
   ```
   mongodb+srv://username:PASSWORD@cluster0.xxxxx.mongodb.net/moviesearch?retryWrites=true&w=majority
   ```

### Step 2: Strapi (4 minutes)

1. **Sign up**: https://cloud.strapi.io/signup
2. **Create project**: Name it `MovieSearch-Blog`
3. **Wait 3 min** for deployment
4. **Create admin account**
5. **Create Content Type**: "Blog Post" with fields:
   - title (Text, required)
   - slug (UID)
   - excerpt (Long text)
   - content (Rich text, required)
   - featuredImage (Media)
   - category (Text)
   - tags (Text)
   - author (Text)
   - publishedDate (Date)
   - readingTime (Number)
6. **Set permissions**: Settings → Roles → Public → Blog-post → Check `find`, `findOne`, `count`
7. **Add 2-3 posts**: Content Manager → Blog Post → Create
8. **Get URL**: `https://your-project.strapiapp.com`

### Step 3: Netlify (3 minutes)

1. **Login**: https://app.netlify.com/
2. **Select your site**
3. **Add environment variables**:

   Go to: **Site configuration** → **Environment variables** → **Add variable**

   **Add these TWO variables**:

   **Variable 1**:
   ```
   Key: MONGODB_URI
   Value: mongodb+srv://username:PASSWORD@cluster0.xxxxx.mongodb.net/moviesearch?retryWrites=true&w=majority
   ```

   **Variable 2**:
   ```
   Key: NEXT_PUBLIC_STRAPI_URL
   Value: https://your-project.strapiapp.com
   ```

4. **Redeploy**: Deploys → Trigger deploy → Clear cache and deploy site

5. **Wait 3-5 min** ✅ **DONE!**

---

## ✅ VERIFY IT WORKS

### Test MongoDB:
1. Visit your site
2. Sign in
3. Go to Profile → Should load!
4. Add a favorite → Should save!

### Test Strapi:
1. Visit: `your-site.netlify.app/blog`
2. Should see your blog posts! 🎉

---

## 🆘 QUICK FIXES

### MongoDB not working?
- Check connection string format
- Username/password correct?
- Database name is `moviesearch`?
- Redeployed site after adding env var?

### Strapi not working?
- Posts published (not just saved)?
- API permissions set?
- URL correct (no trailing slash)?
- Redeployed site?

### Still not working?
See full guide: `NETLIFY_PRODUCTION_SETUP.md`

---

## 📋 ENVIRONMENT VARIABLES SUMMARY

Add these to Netlify:

| Variable | Value | Required |
|----------|-------|----------|
| `MONGODB_URI` | Your MongoDB connection string | ✅ For user features |
| `NEXT_PUBLIC_STRAPI_URL` | Your Strapi URL | ✅ For blog |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Your Clerk key | ✅ Already set |
| `CLERK_SECRET_KEY` | Your Clerk secret | ✅ Already set |
| `NEXT_PUBLIC_TMDB_API_KEY` | Your TMDB key | ✅ Already set |
| `NEXT_PUBLIC_BASE_URL` | `https://your-site.netlify.app` | Recommended |

---

## 🎉 DONE!

Your app now has:
- ✅ User profiles (MongoDB)
- ✅ Real blog (Strapi)
- ✅ All working on Netlify!

**Total time**: ~10 minutes  
**Cost**: $0 (100% free tiers)

---

**For detailed instructions**: See `NETLIFY_PRODUCTION_SETUP.md`

