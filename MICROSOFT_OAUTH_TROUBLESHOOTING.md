# 🚨 Microsoft OAuth Troubleshooting - "Unable to complete action at this time"

## 🔍 **Immediate Diagnostic Steps**

### **Step 1: Check Your Current Configuration**

1. **What's your current Netlify domain?**
   - Example: `https://your-app-name.netlify.app`
   - This must match exactly in Azure Portal

2. **Are you testing on the live site or localhost?**
   - Microsoft OAuth only works on HTTPS domains
   - Localhost testing won't work for Microsoft OAuth

### **Step 2: Azure Portal Configuration Check**

Go to [Azure Portal](https://portal.azure.com/) and verify:

#### **2.1 App Registration Settings:**
- **Name:** MovieSearch 2025 (or your app name)
- **Supported account types:** ✅ "Accounts in any organizational directory and personal Microsoft accounts"
- **Redirect URI:** ✅ `https://your-actual-domain.netlify.app/api/auth/callback/microsoft`

#### **2.2 Authentication Settings:**
- **Redirect URIs:** Must include:
  ```
  https://your-actual-domain.netlify.app/api/auth/callback/microsoft
  https://your-actual-domain.netlify.app/sign-in
  https://your-actual-domain.netlify.app/sign-up
  ```
- **ID tokens:** ✅ Enabled
- **Access tokens:** ✅ Enabled
- **Allow public client flows:** ✅ Enabled

#### **2.3 API Permissions:**
- **Microsoft Graph:**
  - ✅ `User.Read` (Delegated)
  - ✅ `email` (Delegated) 
  - ✅ `openid` (Delegated)
  - ✅ `profile` (Delegated)
- **Status:** ✅ "Granted for [Your Organization]"

#### **2.4 Client Secret:**
- **Status:** ✅ Active (not expired)
- **Value:** Copy the secret value (you'll need this for Clerk)

### **Step 3: Clerk Dashboard Configuration Check**

Go to [Clerk Dashboard](https://dashboard.clerk.com/) and verify:

#### **3.1 Social Connections:**
- **Microsoft:** ✅ Enabled
- **Client ID:** ✅ Matches Azure Application (client) ID
- **Client Secret:** ✅ Matches Azure client secret

#### **3.2 Domains:**
- **Production domain:** ✅ `https://your-actual-domain.netlify.app`
- **Status:** ✅ Set as primary domain

---

## 🔧 **Common Fixes for "Unable to complete action at this time"**

### **Fix 1: Redirect URI Mismatch**
**Problem:** Azure redirect URI doesn't match your actual domain
**Solution:**
1. Go to Azure Portal > App registrations > Your app > Authentication
2. Update redirect URI to: `https://your-actual-domain.netlify.app/api/auth/callback/microsoft`
3. Save changes
4. Wait 5-10 minutes for changes to propagate

### **Fix 2: Account Type Issue**
**Problem:** Wrong account type selected
**Solution:**
1. Go to Azure Portal > App registrations > Your app > Overview
2. If account type is wrong, create a new app registration
3. Select: "Accounts in any organizational directory and personal Microsoft accounts"

### **Fix 3: API Permissions Not Granted**
**Problem:** Admin consent not granted
**Solution:**
1. Go to Azure Portal > App registrations > Your app > API permissions
2. Click "Grant admin consent for [Your Organization]"
3. Confirm the action

### **Fix 4: Client Secret Expired**
**Problem:** Client secret has expired
**Solution:**
1. Go to Azure Portal > App registrations > Your app > Certificates & secrets
2. Create a new client secret
3. Update Clerk Dashboard with the new secret

### **Fix 5: Clerk Configuration Mismatch**
**Problem:** Clerk has wrong credentials
**Solution:**
1. Go to Clerk Dashboard > Social Connections > Microsoft
2. Verify Client ID matches Azure Application (client) ID exactly
3. Verify Client Secret matches Azure client secret exactly
4. Save changes

---

## 🧪 **Step-by-Step Testing Process**

### **Test 1: Verify Azure Configuration**
1. Go to Azure Portal
2. Navigate to your app registration
3. Click "Authentication"
4. Verify redirect URI is exactly: `https://your-domain.netlify.app/api/auth/callback/microsoft`
5. Test the redirect URI by clicking "Test" (if available)

### **Test 2: Verify Clerk Configuration**
1. Go to Clerk Dashboard
2. Navigate to Social Connections > Microsoft
3. Verify it shows as "Enabled"
4. Check that Client ID and Secret are filled in

### **Test 3: Test OAuth Flow**
1. Open your app in an incognito browser window
2. Go to: `https://your-domain.netlify.app/sign-in`
3. Click "Continue with Microsoft"
4. Check what happens:
   - ✅ **Success:** You're redirected to Microsoft login
   - ❌ **Error:** Check the error message

### **Test 4: Check Browser Console**
1. Open browser developer tools (F12)
2. Go to Console tab
3. Try Microsoft login again
4. Look for any JavaScript errors
5. Check Network tab for failed requests

---

## 🚨 **Emergency Fixes**

### **Emergency Fix 1: Create New Azure App**
If nothing else works:
1. Create a completely new app registration in Azure
2. Use the exact settings from the guide
3. Update Clerk with new credentials
4. Test immediately

### **Emergency Fix 2: Disable and Re-enable Microsoft**
1. Go to Clerk Dashboard > Social Connections
2. Disable Microsoft
3. Wait 30 seconds
4. Re-enable Microsoft with correct credentials
5. Test again

### **Emergency Fix 3: Check Domain Configuration**
1. Verify your Netlify domain is correct
2. Ensure it's using HTTPS
3. Test that the domain is accessible
4. Update all configurations with the correct domain

---

## 📞 **Still Not Working?**

If you're still getting the error, please provide:

1. **Your exact Netlify domain** (e.g., `https://movie-search-2025.netlify.app`)
2. **Screenshot of Azure Portal Authentication settings**
3. **Screenshot of Clerk Dashboard Microsoft settings**
4. **Any error messages from browser console**
5. **What happens when you click "Continue with Microsoft"**

### **Quick Diagnostic Commands:**
Run these in your browser console on your live site:
```javascript
// Check if Clerk is loaded
console.log('Clerk loaded:', typeof window.Clerk !== 'undefined');

// Check environment
console.log('App URL:', process.env.NEXT_PUBLIC_APP_URL);

// Check for errors
console.log('Any errors:', window.console.error);
```

---

## ✅ **Success Indicators**

You'll know it's working when:
- ✅ Clicking "Continue with Microsoft" redirects to Microsoft login
- ✅ After Microsoft login, you're redirected back to your app
- ✅ You're successfully signed in
- ✅ No error messages appear

The key is ensuring **exact matches** between Azure Portal, Clerk Dashboard, and your actual domain!
