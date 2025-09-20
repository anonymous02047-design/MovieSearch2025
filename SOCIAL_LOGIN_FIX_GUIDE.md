# 🔧 Social Login Fix Guide - Google, Facebook, Microsoft OAuth

## 🚨 **Issue Identified**

The error you're seeing:
```
Error 400: invalid_request
Missing required parameter: client_id
```

This occurs because Clerk's social login providers are not properly configured for your production domain.

---

## 🔧 **Step 1: Fix Google OAuth**

### **1.1 Google Cloud Console Setup:**

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Create or select a project**
3. **Enable Google+ API:**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
   - Also enable "Google Identity" API

4. **Create OAuth 2.0 Credentials:**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "MovieSearch 2025"

5. **Add Authorized Redirect URIs:**
   ```
   https://your-netlify-domain.netlify.app/api/auth/callback/google
   https://your-netlify-domain.netlify.app/sign-in
   https://your-netlify-domain.netlify.app/sign-up
   ```

6. **Add Authorized JavaScript Origins:**
   ```
   https://your-netlify-domain.netlify.app
   ```

### **1.2 Clerk Dashboard Configuration:**

1. **Go to [Clerk Dashboard](https://dashboard.clerk.com/)**
2. **Select your application**
3. **Go to "User & Authentication" > "Social Connections"**
4. **Enable Google:**
   - Toggle "Google" to ON
   - Enter your Google Client ID
   - Enter your Google Client Secret
   - Save changes

---

## 🔧 **Step 2: Fix Facebook OAuth**

### **2.1 Facebook Developer Console Setup:**

1. **Go to [Facebook Developers](https://developers.facebook.com/)**
2. **Create a new app:**
   - Click "Create App"
   - Choose "Consumer" or "Other"
   - App name: "MovieSearch 2025"
   - Contact email: your email

3. **Add Facebook Login:**
   - Go to "Products" > "Facebook Login" > "Set Up"
   - Choose "Web" platform
   - Site URL: `https://your-netlify-domain.netlify.app`

4. **Configure OAuth Settings:**
   - Go to "Facebook Login" > "Settings"
   - Valid OAuth Redirect URIs:
     ```
     https://your-netlify-domain.netlify.app/api/auth/callback/facebook
     ```

5. **Get App ID and Secret:**
   - Go to "Settings" > "Basic"
   - Copy "App ID" and "App Secret"

### **2.2 Clerk Dashboard Configuration:**

1. **In Clerk Dashboard:**
2. **Go to "User & Authentication" > "Social Connections"**
3. **Enable Facebook:**
   - Toggle "Facebook" to ON
   - Enter your Facebook App ID
   - Enter your Facebook App Secret
   - Save changes

---

## 🔧 **Step 3: Fix Microsoft OAuth**

### **3.1 Microsoft Azure Portal Setup:**

1. **Go to [Azure Portal](https://portal.azure.com/)**
2. **Go to "Azure Active Directory" > "App registrations"**
3. **Click "New registration":**
   - Name: "MovieSearch 2025"
   - Supported account types: "Accounts in any organizational directory and personal Microsoft accounts"
   - Redirect URI: Web - `https://your-netlify-domain.netlify.app/api/auth/callback/microsoft`

4. **Configure Authentication:**
   - Go to "Authentication"
   - Add redirect URI: `https://your-netlify-domain.netlify.app/api/auth/callback/microsoft`
   - Enable "ID tokens" and "Access tokens"

5. **Get Client ID and Secret:**
   - Go to "Overview" - copy "Application (client) ID"
   - Go to "Certificates & secrets" - create new client secret

### **3.2 Clerk Dashboard Configuration:**

1. **In Clerk Dashboard:**
2. **Go to "User & Authentication" > "Social Connections"**
3. **Enable Microsoft:**
   - Toggle "Microsoft" to ON
   - Enter your Microsoft Client ID
   - Enter your Microsoft Client Secret
   - Save changes

---

## 🔧 **Step 4: Update Environment Variables**

### **4.1 Update your `.env.local` file:**

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_clerk_publishable_key_here
CLERK_SECRET_KEY=sk_live_your_clerk_secret_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-netlify-domain.netlify.app
```

### **4.2 Update Netlify Environment Variables:**

1. **Go to your Netlify dashboard**
2. **Site settings > Environment variables**
3. **Update these variables:**
   - `NEXT_PUBLIC_APP_URL` = `https://your-netlify-domain.netlify.app`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = your live Clerk publishable key
   - `CLERK_SECRET_KEY` = your live Clerk secret key

---

## 🔧 **Step 5: Update Clerk Dashboard Settings**

### **5.1 Domain Configuration:**

1. **In Clerk Dashboard:**
2. **Go to "Domains"**
3. **Add your production domain:**
   - Domain: `your-netlify-domain.netlify.app`
   - Set as primary domain

### **5.2 Redirect URLs:**

1. **Go to "Paths"**
2. **Update these paths:**
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in URL: `/`
   - After sign-up URL: `/`

---

## 🔧 **Step 6: Test Social Logins**

### **6.1 Test Each Provider:**

1. **Google Login:**
   - Click "Sign in with Google"
   - Should redirect to Google OAuth
   - Should redirect back to your app

2. **Facebook Login:**
   - Click "Sign in with Facebook"
   - Should redirect to Facebook OAuth
   - Should redirect back to your app

3. **Microsoft Login:**
   - Click "Sign in with Microsoft"
   - Should redirect to Microsoft OAuth
   - Should redirect back to your app

---

## 🚨 **Common Issues & Solutions**

### **Issue 1: "Invalid redirect URI"**
**Solution:** Make sure all redirect URIs in OAuth providers match exactly:
```
https://your-netlify-domain.netlify.app/api/auth/callback/google
https://your-netlify-domain.netlify.app/api/auth/callback/facebook
https://your-netlify-domain.netlify.app/api/auth/callback/microsoft
```

### **Issue 2: "App not verified"**
**Solution:** 
- For Google: Go through app verification process
- For Facebook: Add privacy policy and terms of service
- For Microsoft: Usually works without verification for personal accounts

### **Issue 3: "Client ID not found"**
**Solution:** 
- Double-check client IDs in Clerk dashboard
- Ensure you're using live keys, not test keys
- Verify the keys are correctly copied

### **Issue 4: "Domain not authorized"**
**Solution:**
- Add your Netlify domain to all OAuth providers
- Update Clerk dashboard with correct domain
- Ensure HTTPS is used (not HTTP)

---

## 🔧 **Step 7: Update Code (if needed)**

### **7.1 Check ClerkProvider Configuration:**

Make sure your `AdminLayoutWrapper.tsx` has the correct configuration:

```typescript
<ClerkProvider
  appearance={{
    // ... your appearance config
  }}
  signInUrl="/sign-in"
  signUpUrl="/sign-up"
  afterSignInUrl="/"
  afterSignUpUrl="/"
>
  {/* Your app content */}
</ClerkProvider>
```

---

## 📋 **Quick Checklist**

- [ ] Google Cloud Console configured with correct redirect URIs
- [ ] Facebook Developer Console configured with correct redirect URIs
- [ ] Microsoft Azure Portal configured with correct redirect URIs
- [ ] Clerk Dashboard has all social providers enabled
- [ ] Clerk Dashboard has correct client IDs and secrets
- [ ] Netlify environment variables updated
- [ ] Clerk domain configuration updated
- [ ] All redirect URIs use HTTPS
- [ ] Test each social login provider

---

## 🎯 **Expected Result**

After completing these steps:
- ✅ Google login should work without "client_id" error
- ✅ Facebook login should work properly
- ✅ Microsoft login should work properly
- ✅ Users can sign in with any social provider
- ✅ Proper redirects after authentication

---

## 📞 **Support**

If you still encounter issues:
1. Check browser console for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure all OAuth providers have the correct redirect URIs
4. Test with a fresh browser session

**Contact:** naushadalamprivate@gmail.com | +91 7209752686
