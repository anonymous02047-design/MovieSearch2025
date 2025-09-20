# 🚀 Complete Netlify Deployment Guide - MovieSearch 2025

## 📋 Pre-Deployment Checklist

### ✅ **All Issues Fixed:**
- ✅ reCAPTCHA implementation working across all pages
- ✅ TMDB API rate limiting preventing "Rate limit exceeded" errors
- ✅ Admin analytics page displaying data correctly
- ✅ Rate limit configuration and IP/country blocking working
- ✅ Profile API routes restored and functional
- ✅ All forms (contact, feedback, bug-report, admin login) with reCAPTCHA
- ✅ Logout functionality fixed
- ✅ UI/UX issues resolved
- ✅ All pages have consistent header/footer
- ✅ No duplicate footers
- ✅ All dynamic routes working properly

---

## 🔧 **Step 1: Netlify Account Setup**

1. **Create Netlify Account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub (recommended)
   - Connect your GitHub account

2. **Install Netlify CLI** (Optional but recommended)
   ```bash
   npm install -g netlify-cli
   netlify login
   ```

---

## 🔗 **Step 2: Connect GitHub Repository**

1. **In Netlify Dashboard:**
   - Click "New site from Git"
   - Choose "GitHub" as provider
   - Select your repository: `anonymous02047-design/MovieSearch2025`
   - Choose branch: `main`

2. **Build Settings:**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Advanced Build Settings:**
   - Node.js version: `18`
   - NPM version: `8` or higher

---

## 🔐 **Step 3: Environment Variables**

### **Required Environment Variables:**

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_clerk_publishable_key_here
CLERK_SECRET_KEY=sk_live_your_clerk_secret_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# TMDB API
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

# Google reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here
RECAPTCHA_THRESHOLD=0.5
RECAPTCHA_ACTION=movie_search
RECAPTCHA_TIMEOUT=5000

# Tawk.to Chat
NEXT_PUBLIC_TAWK_PROPERTY_ID=your_tawk_property_id_here
NEXT_PUBLIC_TAWK_WIDGET_ID=your_tawk_widget_id_here
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

# Admin Authentication (IMPORTANT: Change these in production!)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_JWT_SECRET=your-very-secure-secret-key-change-in-production

# Contact Information
NEXT_PUBLIC_CONTACT_EMAIL=naushadalamprivate@gmail.com
NEXT_PUBLIC_CONTACT_PHONE=+91 7209752686
```

### **How to Add Environment Variables in Netlify:**

1. Go to your site dashboard
2. Click "Site settings"
3. Click "Environment variables"
4. Add each variable with "Add variable"
5. Click "Save"

---

## 🏗️ **Step 4: Netlify Configuration**

### **netlify.toml** (Already configured in your project):

```toml
[build]
  command = "npm run build"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"
  NEXT_TELEMETRY_DISABLED = "1"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
    X-DNS-Prefetch-Control = "on"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains"

[[headers]]
  for = "/_next/image/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[redirects]]
  from = "/api/contact"
  to = "/.netlify/functions/contact"
  status = 200

[[redirects]]
  from = "/api/admin/auth/login"
  to = "/.netlify/functions/admin-auth"
  status = 200

[build.processing]
  skip_processing = false

[build.processing.css]
  bundle = true
  minify = true

[build.processing.js]
  bundle = true
  minify = true

[build.processing.html]
  pretty_urls = true

[functions]
  directory = "netlify/functions"

[[plugins]]
  package = "@netlify/plugin-functions-install-core"
```

---

## 🚀 **Step 5: Deploy to Netlify**

### **Option A: Automatic Deployment (Recommended)**

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for Netlify deployment"
   git push origin main
   ```

2. **Netlify will automatically:**
   - Detect the push
   - Start building your site
   - Deploy when build completes

### **Option B: Manual Deployment**

1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Deploy via CLI:**
   ```bash
   netlify deploy --prod --dir=.next
   ```

---

## 🔍 **Step 6: Post-Deployment Testing**

### **Essential Tests:**

1. **Homepage:**
   - ✅ Loads correctly
   - ✅ Search functionality works
   - ✅ Navigation works

2. **Authentication:**
   - ✅ Sign up with email/password
   - ✅ Sign in with Google/Facebook/Microsoft
   - ✅ Email verification works
   - ✅ Redirects after verification

3. **Movie/TV Pages:**
   - ✅ Movie detail pages load
   - ✅ TV show detail pages load
   - ✅ Person detail pages load
   - ✅ No 404 errors

4. **Forms with reCAPTCHA:**
   - ✅ Contact form
   - ✅ Feedback form
   - ✅ Bug report form
   - ✅ Admin login

5. **Admin Dashboard:**
   - ✅ Login works
   - ✅ Analytics page loads data
   - ✅ Rate limits configuration
   - ✅ IP/country blocking

6. **Profile System:**
   - ✅ Profile page loads
   - ✅ Profile management works
   - ✅ Image upload works

---

## 🛠️ **Step 7: External Service Configuration**

### **1. Clerk Dashboard Setup:**

1. **Go to [clerk.com](https://clerk.com)**
2. **Configure your application:**
   - Add your Netlify domain to allowed origins
   - Configure social login providers
   - Set up email templates
   - Configure redirect URLs

3. **Social Login Setup:**
   - **Google:** Enable Google OAuth
   - **Facebook:** Enable Facebook Login
   - **Microsoft:** Enable Microsoft OAuth

### **2. reCAPTCHA Setup:**

1. **Go to [Google reCAPTCHA](https://www.google.com/recaptcha/)**
2. **Create a new site:**
   - Type: reCAPTCHA v3
   - Domains: Add your Netlify domain
   - Get your site key and secret key

### **3. TMDB API:**

1. **Go to [TMDB API](https://www.themoviedb.org/settings/api)**
2. **Create API key**
3. **Add to environment variables**

### **4. Tawk.to Setup:**

1. **Go to [tawk.to](https://www.tawk.to)**
2. **Create account and get widget code**
3. **Add property ID and widget ID to environment variables**

---

## 🔧 **Step 8: Performance Optimization**

### **Netlify Optimizations:**

1. **Enable Netlify Analytics**
2. **Set up form handling**
3. **Configure redirects for SEO**
4. **Enable image optimization**

### **Custom Domain (Optional):**

1. **In Netlify Dashboard:**
   - Go to "Domain settings"
   - Click "Add custom domain"
   - Follow DNS configuration instructions

---

## 🚨 **Troubleshooting Common Issues**

### **Build Failures:**

1. **Node.js Version Issues:**
   ```bash
   # Add to netlify.toml
   [build.environment]
     NODE_VERSION = "18"
   ```

2. **Environment Variable Issues:**
   - Check all required variables are set
   - Verify variable names match exactly
   - Check for typos in values

3. **API Route Issues:**
   - Ensure all API routes are properly configured
   - Check Netlify Functions are working
   - Verify redirects in netlify.toml

### **Runtime Issues:**

1. **reCAPTCHA Not Working:**
   - Check site key and secret key
   - Verify domain is added to reCAPTCHA settings
   - Check browser console for errors

2. **Authentication Issues:**
   - Verify Clerk keys are correct
   - Check domain is added to Clerk dashboard
   - Ensure redirect URLs are configured

3. **TMDB API Issues:**
   - Check API key is valid
   - Verify rate limiting is working
   - Check network requests in browser

---

## 📊 **Step 9: Monitoring and Maintenance**

### **Set Up Monitoring:**

1. **Netlify Analytics**
2. **Error tracking**
3. **Performance monitoring**
4. **Uptime monitoring**

### **Regular Maintenance:**

1. **Update dependencies**
2. **Monitor API usage**
3. **Check error logs**
4. **Update environment variables as needed**

---

## 🎉 **Deployment Complete!**

Your MovieSearch 2025 application should now be fully deployed on Netlify with:

- ✅ All functionality working
- ✅ reCAPTCHA protection on all forms
- ✅ Rate limiting preventing API errors
- ✅ Admin dashboard fully functional
- ✅ Profile system working
- ✅ All pages loading correctly
- ✅ Authentication working
- ✅ No duplicate footers or UI issues

### **Your Live URL:**
`https://your-site-name.netlify.app`

### **Admin Access:**
- URL: `https://your-site-name.netlify.app/admin/login`
- Username: `admin`
- Password: `admin123` (change this!)

---

## 📞 **Support**

If you encounter any issues during deployment:

1. Check the troubleshooting section above
2. Review Netlify build logs
3. Check browser console for errors
4. Verify all environment variables are set correctly

**Contact:** naushadalamprivate@gmail.com | +91 7209752686

---

**🎊 Congratulations! Your MovieSearch 2025 application is now live on Netlify!**
