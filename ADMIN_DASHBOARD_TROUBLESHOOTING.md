# 🔧 Admin Dashboard Troubleshooting Guide

## 🚨 **Issue: Admin Dashboard Not Working at `https://ladlihub.in/admin/dashboard/`**

If you're having trouble accessing the admin dashboard, here's how to fix it:

---

## 🔍 **Step 1: Check Current Status**

### **1.1 Test Admin Login**
1. **Go to:** `https://ladlihub.in/admin/login/`
2. **Try logging in with:**
   - Username: `admin`
   - Password: `admin123`
3. **Check for errors** in browser console (F12)

### **1.2 Check Environment Variables**
The admin system requires these environment variables in Netlify:
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_JWT_SECRET=5be0c6c031217dd0a06965b0905f7a7fa350410ccbbc7f8ff1606581f65ab0ac
```

---

## 🔧 **Step 2: Fix Environment Variables**

### **2.1 Set Admin Environment Variables in Netlify**
1. **Go to:** [Netlify Dashboard](https://app.netlify.com/)
2. **Select your site**
3. **Go to:** Site settings → Environment variables
4. **Add these variables:**
   ```
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ADMIN_JWT_SECRET=5be0c6c031217dd0a06965b0905f7a7fa350410ccbbc7f8ff1606581f65ab0ac
   ```

### **2.2 Redeploy Site**
1. **Go to:** Netlify Deploys tab
2. **Click:** "Trigger deploy"
3. **Wait:** 2-3 minutes for deployment

---

## 🧪 **Step 3: Test Admin System**

### **3.1 Test Admin Login**
1. **Visit:** `https://ladlihub.in/admin/login/`
2. **Enter credentials:**
   - Username: `admin`
   - Password: `admin123`
3. **Click:** "Sign In"
4. **Should redirect to:** `/admin/dashboard/`

### **3.2 Test Admin Dashboard**
1. **After login, you should see:**
   - Rate limiting statistics
   - Blocked IPs list
   - Blocked countries list
   - Analytics summary
   - Admin controls

### **3.3 Test Admin API Endpoints**
Test these endpoints (should return data, not errors):
```
GET /api/admin/rate-limits/stats
GET /api/admin/rate-limits/block-ip
GET /api/admin/rate-limits/block-country
GET /api/admin/analytics/summary
```

---

## 🚨 **Common Issues & Solutions:**

### **Issue 1: "Network error" or "Failed to load resource"**
**Problem:** Admin API routes not accessible
**Solution:**
1. Check if environment variables are set in Netlify
2. Redeploy site after adding variables
3. Check Netlify build logs for errors

### **Issue 2: "Invalid credentials" error**
**Problem:** Wrong username/password or environment variables not set
**Solution:**
1. Verify environment variables in Netlify:
   - `ADMIN_USERNAME=admin`
   - `ADMIN_PASSWORD=admin123`
2. Use exact credentials: `admin` / `admin123`

### **Issue 3: "JWT secret not configured" error**
**Problem:** `ADMIN_JWT_SECRET` not set
**Solution:**
1. Add `ADMIN_JWT_SECRET` to Netlify environment variables
2. Use the generated secret: `5be0c6c031217dd0a06965b0905f7a7fa350410ccbbc7f8ff1606581f65ab0ac`

### **Issue 4: Dashboard loads but shows "Loading..." forever**
**Problem:** API endpoints not responding
**Solution:**
1. Check browser console for API errors
2. Verify all admin API routes exist
3. Check if JWT token is being sent correctly

### **Issue 5: Redirected to login page immediately**
**Problem:** Session not being stored or JWT token invalid
**Solution:**
1. Check if `ADMIN_JWT_SECRET` is set correctly
2. Clear browser localStorage and try again
3. Check browser console for JWT errors

---

## 🔧 **Manual Testing Commands:**

### **Test Admin Login API:**
```bash
curl -X POST https://ladlihub.in/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Expected response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin",
  "message": "Login successful"
}
```

### **Test Admin Stats API:**
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://ladlihub.in/api/admin/rate-limits/stats
```

---

## 🎯 **Admin Dashboard Features:**

Once working, the admin dashboard provides:

### **Rate Limiting Management:**
- View active IPs and countries
- Block/unblock specific IPs
- Block/unblock countries
- View rate limit statistics

### **Analytics:**
- Total sessions
- Active users
- Top pages
- Top referrers
- User engagement metrics

### **Security Controls:**
- IP blocking system
- Country-based restrictions
- Rate limit configuration
- Admin session management

---

## 📞 **Still Not Working?**

If the admin dashboard still doesn't work:

1. **Check Netlify build logs** for environment variable errors
2. **Verify all environment variables** are set correctly
3. **Test API endpoints directly** using curl or browser
4. **Check browser console** for JavaScript errors
5. **Try in incognito mode** to avoid cache issues

### **Emergency Debug Steps:**
1. **Disable Cloudflare temporarily** (gray cloud)
2. **Test admin login** without Cloudflare
3. **Check if it works** on direct Netlify URL
4. **Re-enable Cloudflare** and check settings

---

## 🎯 **Expected Result:**

After fixing all issues:
- ✅ **Admin login works** at `/admin/login/`
- ✅ **Dashboard loads** at `/admin/dashboard/`
- ✅ **All admin features functional**
- ✅ **Rate limiting controls work**
- ✅ **Analytics data displays**
- ✅ **No console errors**

**Your admin dashboard will be fully operational!** 🎉

---

## 🔐 **Security Notes:**

- **Change default credentials** in production
- **Use strong JWT secret** (already generated)
- **Keep admin access secure**
- **Monitor admin activity**
- **Regular security updates**

**The admin system is designed to be secure and functional in production!** 🛡️
