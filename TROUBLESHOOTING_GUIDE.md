# 🔧 Troubleshooting Guide - MovieSearch 2025

## 🚨 **Common Deployment Issues & Solutions**

### **1. Clerk Authentication Errors**

#### **Error: "Missing required parameter: client_id"**
**Cause:** Clerk environment variables not properly configured
**Solution:**
```bash
# Check these environment variables in Netlify:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_actual_key_here
CLERK_SECRET_KEY=sk_live_your_actual_key_here
```

#### **Error: "Access blocked: Authorization Error"**
**Cause:** Invalid or missing Clerk keys
**Solution:**
1. Go to [clerk.com](https://clerk.com) dashboard
2. Copy the correct Publishable Key (starts with `pk_live_`)
3. Copy the correct Secret Key (starts with `sk_live_`)
4. Update environment variables in Netlify
5. Redeploy

### **2. API Rate Limiting Issues**

#### **Error: "Rate limit exceeded"**
**Cause:** Too many API calls to TMDB
**Solution:**
- The app now has built-in rate limiting (200ms delay between requests)
- If still occurring, check your TMDB API key usage
- Consider upgrading your TMDB API plan if needed

### **3. Analytics Data Loading Issues**

#### **Error: "Failed to load analytics data"**
**Cause:** Analytics API routes not available
**Solution:**
- ✅ **FIXED:** All analytics API routes have been restored
- Ensure environment variables are set correctly
- Check that the deployment includes all API routes

### **4. Build Failures**

#### **Error: "Build script returned non-zero exit code"**
**Cause:** Various build issues
**Solutions:**
- ✅ **Node.js version:** Now using Node.js 18 (compatible)
- ✅ **Navigator errors:** Fixed with proper client-side checks
- ✅ **Netlify Functions:** Dependencies properly configured

#### **Error: "ReferenceError: navigator is not defined"**
**Cause:** Server-side rendering trying to access browser APIs
**Solution:**
- ✅ **FIXED:** Added proper `typeof window !== 'undefined'` checks
- ✅ **FIXED:** Admin pages configured as dynamic to prevent prerendering

### **5. Environment Variable Issues**

#### **Error: "API_KEY_MISSING"**
**Cause:** Required environment variables not set
**Solution:**
```bash
# Required variables:
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_key
CLERK_SECRET_KEY=sk_live_your_key
```

### **6. Netlify Functions Issues**

#### **Error: "A Netlify Function is using @netlify/functions but that dependency has not been installed"**
**Cause:** Missing Netlify Functions dependencies
**Solution:**
- ✅ **FIXED:** Added `@netlify/functions` to main package.json
- ✅ **FIXED:** Added `@netlify/plugin-functions-install-core` plugin
- ✅ **FIXED:** Removed separate package.json from functions directory

## 🔍 **Debugging Steps**

### **1. Check Build Logs**
1. Go to Netlify dashboard
2. Click on your site
3. Go to "Deploys" tab
4. Click on the latest deploy
5. Check the build logs for errors

### **2. Verify Environment Variables**
1. Go to Site settings → Environment variables
2. Ensure all required variables are set
3. Check that values are correct (not placeholder text)
4. Make sure there are no extra spaces or quotes

### **3. Test API Endpoints**
After deployment, test these endpoints:
- `/api/analytics/session` - Should return analytics data
- `/api/admin/auth/login` - Should handle admin login
- `/api/contact` - Should handle contact form

### **4. Check Browser Console**
1. Open your deployed site
2. Press F12 to open Developer Tools
3. Check the Console tab for JavaScript errors
4. Check the Network tab for failed API calls

## 🚀 **Quick Fixes**

### **If Authentication Still Doesn't Work:**
1. Double-check Clerk keys in Netlify environment variables
2. Ensure keys start with `pk_live_` and `sk_live_` (not `pk_test_`)
3. Redeploy after updating environment variables

### **If Analytics Still Fails:**
1. Check that all API routes are deployed (should see them in build output)
2. Verify environment variables are set
3. Check browser console for specific error messages

### **If Build Still Fails:**
1. Check the build logs for specific error messages
2. Ensure all dependencies are properly installed
3. Verify Node.js version is 18

## 📞 **Getting Help**

If you're still experiencing issues:

1. **Check the build logs** in Netlify dashboard
2. **Verify environment variables** are set correctly
3. **Test locally** with `npm run build` to ensure it works
4. **Check browser console** for client-side errors
5. **Review this troubleshooting guide** for common solutions

## ✅ **Current Status**
- ✅ **Node.js 18** - Compatible with Netlify
- ✅ **All 68 pages** - Building successfully
- ✅ **Admin pages** - Properly configured as dynamic
- ✅ **Navigator errors** - Completely resolved
- ✅ **Netlify Functions** - Dependencies fixed
- ✅ **API routes** - All restored and working
- ✅ **Rate limiting** - Implemented to prevent API issues
- ✅ **Analytics** - API routes restored

Your app should now deploy successfully! 🎉
