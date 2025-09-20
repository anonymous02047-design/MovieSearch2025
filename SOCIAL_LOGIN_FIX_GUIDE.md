# 🔧 Social Login Fix Guide - Google OAuth

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

## 🔧 **Step 2: Configure Environment Variables**

### **2.1 Update Netlify Environment Variables:**

1. **Go to your Netlify dashboard**
2. **Site settings > Environment variables**
3. **Add/Update:**
   ```
   NEXT_PUBLIC_APP_URL=https://your-netlify-domain.netlify.app
   ```

### **2.2 Update Clerk Dashboard:**

1. **Go to Clerk Dashboard**
2. **Go to "Domains"**
3. **Add your production domain:**
   - `https://your-netlify-domain.netlify.app`
   - Set as primary domain

---

## 🔧 **Step 3: Test the Configuration**

### **3.1 Test Google Login:**
1. Visit your app
2. Click "Sign In"
3. Click "Continue with Google"
4. Complete OAuth flow
5. Verify successful login

---

## 🚨 **Common Issues & Solutions**

### **Issue 1: "Missing required parameter: client_id"**
- **Solution:** Ensure OAuth credentials are properly configured in Clerk Dashboard
- **Check:** Client ID and Secret are correct and saved

### **Issue 2: "Redirect URI mismatch"**
- **Solution:** Verify redirect URIs in OAuth provider settings match your domain
- **Check:** All URLs use HTTPS and correct domain

### **Issue 3: "Invalid client"**
- **Solution:** Regenerate OAuth credentials and update Clerk Dashboard
- **Check:** No extra spaces or characters in credentials

### **Issue 4: "Access blocked"**
- **Solution:** Ensure your app is live and accessible
- **Check:** Domain is properly configured in Clerk

---

## ✅ **Verification Checklist**

- [ ] Google OAuth credentials created and configured
- [ ] Clerk Dashboard has correct Client ID and Secret
- [ ] Redirect URIs match your production domain
- [ ] Environment variables set in Netlify
- [ ] App is live and accessible
- [ ] Google login works
- [ ] Users can sign in and access the app

---

## 📞 **Need Help?**

If you're still experiencing issues:

1. **Check Clerk Dashboard logs** for detailed error messages
2. **Verify OAuth provider settings** match exactly
3. **Test with a fresh browser session** (incognito mode)
4. **Check browser console** for JavaScript errors
5. **Ensure all URLs use HTTPS** in production

The most common issue is incorrect redirect URIs or missing environment variables. Double-check these first!