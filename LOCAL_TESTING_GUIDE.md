# 🧪 Local Testing Guide - MovieSearch 2025 v4.1.0

## Complete Local Testing Checklist

**Version**: 4.1.0  
**Date**: October 22, 2025  
**Features**: Country Detection + MongoDB + Strapi Blog + All Enhancements  

---

## 🎯 WHAT YOU'LL TEST

### Core Features
1. ✅ Country Detection (197 countries)
2. ✅ Recommendations Engine
3. ✅ Strapi Blog System (NEW!)
4. ✅ MongoDB Integration (Optional)
5. ✅ SEO & Sitemap
6. ✅ Responsive Design
7. ✅ Authentication (Clerk)
8. ✅ All 93+ Pages

---

## 🚀 QUICK START (5 MINUTES)

### Step 1: Start MovieSearch App

```bash
cd "C:\Users\anony\OneDrive - Naushad Alam\Desktop\MovieSearch2025"

# Install dependencies (if not done)
npm install

# Start development server
npm run dev
```

**App will start at**: `http://localhost:3000` ✅

### Step 2: Test Basic Features

1. **Open**: http://localhost:3000
2. **Check**: Country detection banner appears
3. **Try**: Changing country selector
4. **Navigate**: Browse movies, TV shows
5. **Test**: Search functionality

**If everything works**: ✅ Basic features OK!

---

## 🗂️ STRAPI BLOG TESTING (OPTIONAL)

### Option 1: Use Without Strapi (Default)

The blog page will show a helpful message about setting up Strapi.
- **Works**: Yes, shows setup instructions
- **Action**: None needed
- **Result**: Blog page displays but no posts

### Option 2: Set Up Strapi (Recommended)

#### A. Create Strapi Project

**Open NEW terminal** (separate from MovieSearch):

```bash
# Navigate to parent directory
cd "C:\Users\anony\OneDrive - Naushad Alam\Desktop"

# Create Strapi project
npx create-strapi-app@latest MovieSearch2025-Blog --quickstart
```

Wait 3-5 minutes for installation...

#### B. Configure Strapi

1. **Admin panel opens automatically** at `http://localhost:1337/admin`
2. **Create admin account**:
   - First Name: Your Name
   - Email: your@email.com
   - Password: Strong password (8+ chars)

3. **Create Blog Post Content Type**:
   - Click "Content-Type Builder"
   - Click "Create new collection type"
   - Display name: `Blog Post`
   - Add fields:
     - `title` (Text - Short, Required)
     - `slug` (UID, attached to title, Required)
     - `excerpt` (Text - Long)
     - `content` (Rich Text, Required)
     - `featuredImage` (Media - Single image)
     - `category` (Text - Short)
     - `tags` (Text - Short)
     - `author` (Text - Short)
     - `publishedDate` (Date)
     - `readingTime` (Number - Integer)
   - Click "Save" (Strapi will restart)

4. **Set Permissions**:
   - Settings → Roles → Public
   - Blog-post: Check `find`, `findOne`, `count`
   - Click "Save"

5. **Add Sample Posts**:
   - Content Manager → Blog Post
   - Create 3-5 sample posts
   - Click "Save" & "Publish" for each

#### C. Connect to MovieSearch

1. **Add to `.env.local`** in MovieSearch project:
   ```env
   NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
   ```

2. **Restart MovieSearch**:
   ```bash
   # In MovieSearch terminal (Ctrl+C to stop)
   npm run dev
   ```

3. **Test Blog**:
   - Visit: http://localhost:3000/blog
   - Should see your Strapi posts! ✅

---

## 🗄️ MONGODB TESTING (OPTIONAL)

### Skip This If:
- You don't need user profiles
- You're just testing
- You'll set it up later

### If You Want MongoDB:

See `MONGODB_INTEGRATION_GUIDE.md` for complete setup.

**Quick Setup**:
1. Create MongoDB Atlas account (free)
2. Get connection string
3. Add to `.env.local`:
   ```env
   MONGODB_URI=mongodb+srv://...
   ```
4. Restart app
5. Test user profile features

---

## ✅ TESTING CHECKLIST

### 1. Core Features (MUST TEST)

#### Country Detection
- [ ] Country banner appears on homepage
- [ ] Can open country selector
- [ ] Can search countries
- [ ] Can change country
- [ ] Content updates based on country

#### Navigation
- [ ] All menu items work
- [ ] Can browse movies
- [ ] Can browse TV shows
- [ ] Search works
- [ ] Filters work

#### Authentication (Clerk)
- [ ] Can sign in
- [ ] Can sign up
- [ ] Protected pages require auth
- [ ] Can access profile when signed in

#### Responsiveness
- [ ] Works on desktop (1920x1080)
- [ ] Works on laptop (1366x768)
- [ ] Works on tablet (768x1024)
- [ ] Works on mobile (375x667)

### 2. Blog Features (TEST IF STRAPI RUNNING)

- [ ] Blog page loads
- [ ] Can see blog posts from Strapi
- [ ] Can search posts
- [ ] Can filter by category
- [ ] Can sort posts
- [ ] Pagination works
- [ ] Post images display
- [ ] "Read More" buttons work

### 3. Advanced Features (OPTIONAL)

#### Recommendations
- [ ] Country-specific recommendations work
- [ ] Language filtering works
- [ ] Trending section displays

#### SEO
- [ ] Sitemap accessible: http://localhost:3000/sitemap.xml
- [ ] Meta tags present (view page source)
- [ ] Open Graph tags exist

#### MongoDB (if configured)
- [ ] Can view profile
- [ ] Can update profile
- [ ] Can add/remove favorites
- [ ] Data persists across refreshes

---

## 🐛 TROUBLESHOOTING

### Issue: Port 3000 already in use

**Solution**:
```bash
# Kill the process
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### Issue: Strapi connection error

**Check**:
1. Is Strapi running? (`npm run develop` in Strapi folder)
2. Correct URL in `.env.local`? (`http://localhost:1337`)
3. Permissions set in Strapi admin?
4. Blog posts published (not just saved)?

### Issue: Countries not loading

**Solution**:
- Check browser console for errors
- Verify `src/utils/countries.ts` exists
- Clear browser cache (Ctrl+Shift+R)

### Issue: MongoDB connection failed

**Solution**:
- Check connection string in `.env.local`
- Verify MongoDB Atlas IP whitelist (0.0.0.0/0)
- Ensure correct username/password

### Issue: Build errors

**Solution**:
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

---

## 📊 TESTING RESULTS TEMPLATE

### Test Results: [Date]

**Environment**:
- OS: Windows 10/11
- Node: [version]
- Browser: Chrome/Firefox/Edge

**Core Features**: ✅ / ❌
- Country Detection: ___
- Movies Browse: ___
- TV Shows Browse: ___
- Search: ___
- Auth: ___

**Blog (Strapi)**: ✅ / ❌ / SKIPPED
- Posts Display: ___
- Search: ___
- Filters: ___
- Images: ___

**MongoDB**: ✅ / ❌ / SKIPPED
- Connection: ___
- Profile: ___
- Favorites: ___

**Responsive**: ✅ / ❌
- Desktop: ___
- Tablet: ___
- Mobile: ___

**Overall**: PASS ✅ / FAIL ❌

**Notes**:
___________________

---

## 🎯 MINIMUM TESTING (5 MINUTES)

If you're short on time, test these essentials:

1. **Start app** → Homepage loads ✅
2. **Country banner** → Appears and works ✅
3. **Browse movies** → Shows movies ✅
4. **Search** → Returns results ✅
5. **Sign in** → Authentication works ✅
6. **Blog page** → Loads (with or without Strapi) ✅

**If all pass**: Ready to deploy! 🚀

---

## 🚀 AFTER TESTING

### If All Tests Pass:

```bash
# Commit changes
git add .
git commit -m "feat: Add Strapi CMS blog integration"

# Push to GitHub
git push origin main
```

### If Tests Fail:

1. Note which features failed
2. Check troubleshooting section
3. Review error messages in console
4. Fix issues and re-test

---

## 📚 ADDITIONAL RESOURCES

- **Strapi Setup**: `STRAPI_CMS_INTEGRATION_GUIDE.md`
- **MongoDB Setup**: `MONGODB_INTEGRATION_GUIDE.md`
- **Deployment**: `READY_TO_DEPLOY.md`
- **All Features**: `COMPLETE_ENHANCEMENTS_SUMMARY.md`

---

## ✅ TESTING COMPLETE CHECKLIST

Before deploying:
- [ ] Tested locally (minimum 5 minutes)
- [ ] No console errors
- [ ] All core features work
- [ ] Responsive on at least 2 screen sizes
- [ ] Authentication works
- [ ] Blog page loads (with or without Strapi)
- [ ] Ready to commit and push

---

**Version**: 4.1.0  
**Status**: Ready for Testing  
**Estimated Time**: 5-30 minutes (depending on features)  

**🎉 Happy Testing! 🎉**

