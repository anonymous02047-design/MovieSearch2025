# 🔐 Clerk Authentication Setup Guide

## 🚨 **Current Issues:**
- ❌ Google login not working
- ❌ Email/password signup not working
- ❌ Email verification not working

## 🔧 **Step-by-Step Fix:**

### **Step 1: Configure Clerk Dashboard**

#### **1.1 Enable Social Providers**
1. Go to [clerk.com](https://clerk.com) and sign in
2. Select your project
3. Go to **"User & Authentication"** → **"Social Connections"**
4. Enable the following providers:

**Google:**
- Click **"Google"**
- Toggle **"Enable Google"** to ON
- Add your Google OAuth credentials:
  - Client ID
  - Client Secret
- Set redirect URLs: `https://your-domain.netlify.app/api/auth/callback/google`



#### **1.2 Configure Email Authentication**
1. Go to **"User & Authentication"** → **"Email, Phone, Username"**
2. Enable **"Email address"**
3. Configure email settings:
   - **From name:** MovieSearch 2025
   - **From email:** your-email@domain.com
   - **Reply-to email:** your-email@domain.com

#### **1.3 Configure Email Verification**
1. Go to **"User & Authentication"** → **"Email, Phone, Username"**
2. Under **"Email address"**:
   - Enable **"Require email verification"**
   - Set verification method to **"Email code"** or **"Email link"**
3. Customize verification email template if needed

### **Step 2: Get OAuth Credentials**

#### **2.1 Google OAuth Setup**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **"Credentials"** → **"Create Credentials"** → **"OAuth 2.0 Client ID"**
5. Set application type to **"Web application"**
6. Add authorized redirect URIs:
   - `https://your-domain.netlify.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (for development)
7. Copy Client ID and Client Secret

#### **2.2 Facebook App Setup**
1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create a new app
3. Add **"Facebook Login"** product
4. Go to **"Facebook Login"** → **"Settings"**
5. Add valid OAuth redirect URIs:
   - `https://your-domain.netlify.app/api/auth/callback/facebook`
   - `http://localhost:3000/api/auth/callback/facebook`
6. Copy App ID and App Secret


### **Step 3: Update Environment Variables**

Add these to your Netlify environment variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_publishable_key
CLERK_SECRET_KEY=sk_live_your_secret_key

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Social OAuth (Optional - if you want to store them in env vars)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
```

### **Step 4: Update Clerk Configuration**

The Clerk configuration in your app is already properly set up. The issue is likely in the Clerk dashboard configuration.

### **Step 5: Common Issues & Solutions**

#### **Issue 1: Social Login Buttons Not Showing**
**Solution:**
1. Go to Clerk Dashboard → **"User & Authentication"** → **"Social Connections"**
2. Make sure each provider is **enabled** and **configured**
3. Check that OAuth credentials are correct
4. Verify redirect URLs are set properly

#### **Issue 2: Email Verification Not Working**
**Solution:**
1. Go to Clerk Dashboard → **"User & Authentication"** → **"Email, Phone, Username"**
2. Under **"Email address"**:
   - Enable **"Require email verification"**
   - Set verification method to **"Email code"** or **"Email link"**
3. Configure email templates if needed

#### **Issue 3: "Missing required parameter: client_id"**
**Solution:**
1. Check that `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set correctly in Netlify
2. Verify the key starts with `pk_live_` (production) or `pk_test_` (development)
3. Make sure there are no extra spaces or quotes in the environment variable

#### **Issue 4: Social Login Redirects to Wrong URL**
**Solution:**
1. In Clerk Dashboard → **"User & Authentication"** → **"Social Connections"**
2. For each provider, set the redirect URL to:
   - `https://your-domain.netlify.app/api/auth/callback/[provider]`
3. Make sure the URL matches your deployed domain

### **Step 6: Testing Checklist**

After configuration, test these features:

#### **✅ Email/Password Authentication:**
- [ ] Sign up with email/password works
- [ ] Email verification is sent and works
- [ ] Sign in with email/password works
- [ ] Password reset works

#### **✅ Social Authentication:**
- [ ] Google login works
- [ ] Facebook login works
- [ ] Social login redirects correctly

#### **✅ General Authentication:**
- [ ] Sign out works
- [ ] Protected routes redirect to sign-in
- [ ] After sign-in, user is redirected to correct page
- [ ] User session persists across page refreshes

### **Step 7: Environment Variables Checklist**

Make sure these are set in Netlify:

```env
# REQUIRED - Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_actual_key_here
CLERK_SECRET_KEY=sk_live_your_actual_key_here

# REQUIRED - Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# REQUIRED - TMDB API
NEXT_PUBLIC_TMDB_API_KEY=your_actual_tmdb_api_key_here

# OPTIONAL - reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here

# OPTIONAL - Tawk.to Chat
NEXT_PUBLIC_TAWK_PROPERTY_ID=your_tawk_property_id_here
NEXT_PUBLIC_TAWK_WIDGET_ID=your_tawk_widget_id_here

# REQUIRED - Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_JWT_SECRET=your-very-secure-secret-key-change-in-production
```

### **Step 8: Quick Fix Commands**

If you're still having issues, try these steps:

1. **Clear Netlify cache:**
   - Go to Netlify Dashboard → Deploys → Trigger deploy → "Clear cache and deploy site"

2. **Verify environment variables:**
   - Check that all variables are set correctly
   - Make sure there are no typos
   - Ensure values are not placeholder text

3. **Test locally first:**
   - Create a `.env.local` file with your keys
   - Run `npm run dev` and test authentication locally
   - If it works locally, the issue is in Netlify configuration

4. **Check Clerk dashboard:**
   - Verify all social providers are enabled
   - Check that OAuth credentials are correct
   - Ensure redirect URLs match your domain

### **Step 9: Support Resources**

If you're still having issues:

1. **Clerk Documentation:** [clerk.com/docs](https://clerk.com/docs)
2. **Clerk Support:** [clerk.com/support](https://clerk.com/support)
3. **Check build logs** in Netlify dashboard
4. **Check browser console** for JavaScript errors
5. **Verify API keys** are active and correct

## 🎯 **Expected Results After Fix:**

- ✅ **Google/Facebook login** working
- ✅ **Email/password signup** working
- ✅ **Email verification** working
- ✅ **All authentication flows** working correctly
- ✅ **User sessions** persisting properly
- ✅ **Protected routes** working correctly

Your authentication should work perfectly after following these steps! 🔐
