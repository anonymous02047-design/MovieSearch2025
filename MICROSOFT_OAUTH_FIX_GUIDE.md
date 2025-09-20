# 🔧 Microsoft OAuth Fix Guide

## 🚨 **Issue: "Unable to complete action at this time"**

This error occurs when Microsoft OAuth is not properly configured. Here's how to fix it:

---

## 🔧 **Step 1: Microsoft Azure Portal Configuration**

### **1.1 Create/Update App Registration:**

1. **Go to [Azure Portal](https://portal.azure.com/)**
2. **Navigate to "Azure Active Directory" > "App registrations"**
3. **Find your existing app or create a new one:**
   - Click "New registration"
   - Name: "MovieSearch 2025"
   - Supported account types: **"Accounts in any organizational directory and personal Microsoft accounts"**
   - Redirect URI: Web - `https://your-netlify-domain.netlify.app/api/auth/callback/microsoft`

### **1.2 Configure Authentication:**

1. **Go to "Authentication" in your app**
2. **Add these redirect URIs:**
   ```
   https://your-netlify-domain.netlify.app/api/auth/callback/microsoft
   https://your-netlify-domain.netlify.app/sign-in
   https://your-netlify-domain.netlify.app/sign-up
   ```

3. **Enable these settings:**
   - ✅ **ID tokens** (used for implicit and hybrid flows)
   - ✅ **Access tokens** (used for implicit flows)
   - ✅ **Allow public client flows** (if needed)

### **1.3 Configure API Permissions:**

1. **Go to "API permissions"**
2. **Add these Microsoft Graph permissions:**
   - `User.Read` (Delegated) - Sign in and read user profile
   - `email` (Delegated) - View users' email address
   - `openid` (Delegated) - Sign users in
   - `profile` (Delegated) - View users' basic profile

3. **Click "Grant admin consent"** (if you have admin rights)

### **1.4 Get Client Credentials:**

1. **Go to "Overview"**
2. **Copy the "Application (client) ID"**
3. **Go to "Certificates & secrets"**
4. **Create a new client secret:**
   - Description: "MovieSearch 2025 Secret"
   - Expires: 24 months
   - **Copy the secret value immediately** (you won't see it again)

---

## 🔧 **Step 2: Clerk Dashboard Configuration**

### **2.1 Update Microsoft OAuth Settings:**

1. **Go to [Clerk Dashboard](https://dashboard.clerk.com/)**
2. **Select your application**
3. **Go to "User & Authentication" > "Social Connections"**
4. **Find Microsoft and click to configure:**
   - Toggle **"Enable Microsoft"** to ON
   - **Client ID:** Paste your Azure Application (client) ID
   - **Client Secret:** Paste your Azure client secret
   - **Save changes**

### **2.2 Verify Domain Configuration:**

1. **Go to "Domains" in Clerk Dashboard**
2. **Ensure your production domain is added:**
   - `https://your-netlify-domain.netlify.app`
   - Set as primary domain

---

## 🔧 **Step 3: Environment Variables**

### **3.1 Update Netlify Environment Variables:**

1. **Go to your Netlify dashboard**
2. **Site settings > Environment variables**
3. **Ensure these are set:**
   ```
   NEXT_PUBLIC_APP_URL=https://your-netlify-domain.netlify.app
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

---

## 🔧 **Step 4: Common Issues & Solutions**

### **Issue 1: "AADSTS50011: The reply URL specified in the request does not match"**
- **Solution:** Ensure redirect URIs in Azure match exactly with your domain
- **Check:** All URLs use HTTPS and correct domain

### **Issue 2: "AADSTS65001: The user or administrator has not consented"**
- **Solution:** Grant admin consent for API permissions in Azure
- **Check:** All required permissions are granted

### **Issue 3: "AADSTS7000215: Invalid client secret is provided"**
- **Solution:** Regenerate client secret in Azure and update Clerk
- **Check:** No extra spaces or characters in secret

### **Issue 4: "Unable to complete action at this time"**
- **Solution:** Check all configuration steps above
- **Check:** Ensure app is live and accessible

---

## 🔧 **Step 5: Testing**

### **5.1 Test Microsoft Login:**

1. **Visit your app:** `https://your-netlify-domain.netlify.app`
2. **Click "Sign In"**
3. **Click "Continue with Microsoft"**
4. **Complete OAuth flow**
5. **Verify successful login**

### **5.2 Test Microsoft Sign-up:**

1. **Visit your app**
2. **Click "Sign Up"**
3. **Click "Continue with Microsoft"**
4. **Complete OAuth flow**
5. **Verify successful account creation**

---

## ✅ **Verification Checklist**

- [ ] Azure app registration created/updated
- [ ] Redirect URIs configured correctly
- [ ] API permissions granted
- [ ] Client ID and Secret obtained
- [ ] Clerk Dashboard configured with correct credentials
- [ ] Environment variables set in Netlify
- [ ] App is live and accessible
- [ ] Microsoft login works
- [ ] Microsoft sign-up works

---

## 🚨 **Important Notes**

1. **Account Types:** Use "Accounts in any organizational directory and personal Microsoft accounts" for maximum compatibility
2. **Redirect URIs:** Must match exactly (including HTTPS)
3. **Client Secret:** Regenerate if expired or compromised
4. **Permissions:** Only request necessary permissions
5. **Testing:** Always test in production environment

---

## 📞 **Still Having Issues?**

If Microsoft login still doesn't work:

1. **Check Azure app logs** for detailed error messages
2. **Verify all URLs use HTTPS** in production
3. **Test with a fresh browser session** (incognito mode)
4. **Check browser console** for JavaScript errors
5. **Ensure Clerk Dashboard shows Microsoft as enabled**

The most common issue is incorrect redirect URIs or missing API permissions. Double-check these first!
