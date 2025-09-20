# 🚀 Netlify Deployment Guide for MovieSearch 2025

This guide will help you deploy your MovieSearch 2025 application to Netlify with all functionality intact.

## 📋 Prerequisites

- GitHub repository with your code
- Netlify account (free tier available)
- All environment variables ready

## 🔧 Step 1: Prepare Your Repository

### 1.1 Verify Configuration Files

Ensure these files are in your repository root:
- ✅ `netlify.toml` - Netlify configuration
- ✅ `next.config.ts` - Next.js configuration (set to `output: 'export'`)
- ✅ `package.json` - Dependencies and scripts
- ✅ `env.example` - Environment variables template

### 1.2 Test Local Build

```bash
# Install dependencies
npm install

# Test the build locally
npm run build

# Verify the output directory
ls -la out/
```

## 🌐 Step 2: Deploy to Netlify

### 2.1 Connect to Netlify

1. **Go to [Netlify](https://netlify.com)**
2. **Sign in** with your GitHub account
3. **Click "New site from Git"**
4. **Choose GitHub** as your Git provider
5. **Select your repository** (MovieSearch2025)

### 2.2 Configure Build Settings

Netlify should auto-detect these settings from `netlify.toml`:

```
Build command: npm run build
Publish directory: out
Functions directory: netlify/functions
```

If not auto-detected, manually set:
- **Build command**: `npm run build`
- **Publish directory**: `out`
- **Functions directory**: `netlify/functions`

### 2.3 Set Environment Variables

In Netlify dashboard, go to **Site settings > Environment variables** and add:

#### Required Variables:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_actual_key_here
CLERK_SECRET_KEY=sk_live_your_actual_secret_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# TMDB API
NEXT_PUBLIC_TMDB_API_KEY=your_actual_tmdb_key_here
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

# Google reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_actual_recaptcha_site_key_here
RECAPTCHA_SECRET_KEY=your_actual_recaptcha_secret_here
RECAPTCHA_THRESHOLD=0.5
RECAPTCHA_ACTION=movie_search
RECAPTCHA_TIMEOUT=5000

# Tawk.to Chat
NEXT_PUBLIC_TAWK_PROPERTY_ID=your_actual_tawk_property_id_here
NEXT_PUBLIC_TAWK_WIDGET_ID=your_actual_tawk_widget_id_here
NEXT_PUBLIC_TAWK_ENABLED=true
NEXT_PUBLIC_TAWK_POSITION=bottom-right
NEXT_PUBLIC_TAWK_THEME=auto
NEXT_PUBLIC_TAWK_SHOW_MOBILE=true
NEXT_PUBLIC_TAWK_SHOW_DESKTOP=true
NEXT_PUBLIC_TAWK_AUTO_START=false
NEXT_PUBLIC_TAWK_GREETING_MESSAGE=Hello! How can we help you today?
NEXT_PUBLIC_TAWK_OFFLINE_MESSAGE=We are currently offline. Please leave a message and we will get back to you soon.

# Analytics
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_ANALYTICS_API_URL=/api/analytics

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# App Configuration
NEXT_PUBLIC_APP_NAME=MovieSearch 2025
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_URL=https://your-site-name.netlify.app

# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_admin_password_here
ADMIN_JWT_SECRET=your_very_secure_jwt_secret_here

# Contact Information
NEXT_PUBLIC_CONTACT_EMAIL=your_contact_email_here
NEXT_PUBLIC_CONTACT_PHONE=your_contact_phone_here
```

## 🚀 Step 3: Deploy

### 3.1 Initial Deployment

1. **Click "Deploy site"** in Netlify
2. **Wait for build** to complete (usually 2-5 minutes)
3. **Check build logs** for any errors

### 3.2 Verify Deployment

After successful deployment:

1. **Visit your site** at `https://your-site-name.netlify.app`
2. **Test all functionality**:
   - ✅ Home page loads
   - ✅ Search functionality works
   - ✅ Movie/TV/Person pages load
   - ✅ User authentication (sign up/sign in)
   - ✅ Profile management
   - ✅ Contact form
   - ✅ Feedback form
   - ✅ Bug report form
   - ✅ Admin login
   - ✅ reCAPTCHA protection

## 🔧 Step 4: Configure Custom Domain (Optional)

### 4.1 Add Custom Domain

1. **Go to Site settings > Domain management**
2. **Click "Add custom domain"**
3. **Enter your domain** (e.g., `ladlihub.in`)
4. **Follow DNS configuration** instructions

### 4.2 SSL Certificate

Netlify automatically provides SSL certificates for all domains.

## 🛠️ Step 5: Post-Deployment Configuration

### 5.1 Update Clerk Configuration

1. **Go to [Clerk Dashboard](https://dashboard.clerk.com)**
2. **Update allowed origins**:
   - Add: `https://your-site-name.netlify.app`
   - Add: `https://your-custom-domain.com` (if applicable)

### 5.2 Update reCAPTCHA Configuration

1. **Go to [Google reCAPTCHA Console](https://www.google.com/recaptcha/admin)**
2. **Add domains**:
   - `your-site-name.netlify.app`
   - `your-custom-domain.com` (if applicable)

### 5.3 Update Tawk.to Configuration

1. **Go to [Tawk.to Dashboard](https://dashboard.tawk.to)**
2. **Update domain settings** for your new domain

## 🔍 Step 6: Testing & Verification

### 6.1 Functionality Tests

Test these features on your deployed site:

#### Core Features:
- [ ] Home page loads correctly
- [ ] Search functionality works
- [ ] Movie detail pages load
- [ ] TV show detail pages load
- [ ] Person detail pages load
- [ ] Navigation works properly

#### User Features:
- [ ] User registration works
- [ ] User login works
- [ ] Profile management works
- [ ] Watchlist functionality
- [ ] Favorites functionality

#### Forms & Security:
- [ ] Contact form submits successfully
- [ ] Feedback form works
- [ ] Bug report form works
- [ ] reCAPTCHA protection active
- [ ] Admin login works

#### Performance:
- [ ] Pages load quickly
- [ ] Images load properly
- [ ] Mobile responsiveness
- [ ] SEO meta tags present

### 6.2 Performance Optimization

1. **Check Lighthouse scores** in browser dev tools
2. **Optimize images** if needed
3. **Enable Netlify's CDN** (automatic)
4. **Configure caching** (already set in netlify.toml)

## 🚨 Troubleshooting

### Common Issues:

#### Build Failures:
```bash
# Check build logs in Netlify dashboard
# Common fixes:
npm install --legacy-peer-deps
# or
npm ci
```

#### Environment Variables Not Working:
- Verify all variables are set in Netlify dashboard
- Check variable names match exactly
- Redeploy after adding new variables

#### API Routes Not Working:
- Check Netlify Functions are deployed
- Verify function names match redirects in netlify.toml
- Check function logs in Netlify dashboard

#### Authentication Issues:
- Verify Clerk domain configuration
- Check environment variables
- Ensure HTTPS is enabled

### Getting Help:

1. **Check Netlify build logs**
2. **Check browser console** for errors
3. **Verify environment variables**
4. **Test locally** with same environment

## 📊 Step 7: Monitoring & Analytics

### 7.1 Netlify Analytics

1. **Enable Netlify Analytics** in site settings
2. **Monitor traffic** and performance
3. **Set up form notifications**

### 7.2 Custom Analytics

Your app includes built-in analytics tracking that will work automatically.

## 🎉 Success!

Your MovieSearch 2025 application should now be live on Netlify with:

- ✅ All pages and functionality working
- ✅ User authentication via Clerk
- ✅ Movie/TV/Person data from TMDB
- ✅ reCAPTCHA protection on all forms
- ✅ Admin panel functionality
- ✅ Contact and feedback forms
- ✅ Mobile-responsive design
- ✅ SEO optimization
- ✅ Performance optimization
- ✅ Security headers

## 🔄 Future Updates

To update your site:

1. **Push changes** to your GitHub repository
2. **Netlify automatically rebuilds** and deploys
3. **Check deployment status** in Netlify dashboard

## 📞 Support

If you encounter any issues:

1. Check this guide first
2. Review Netlify documentation
3. Check your build logs
4. Verify environment variables
5. Test functionality systematically

---

**Your MovieSearch 2025 app is now live! 🎬✨**