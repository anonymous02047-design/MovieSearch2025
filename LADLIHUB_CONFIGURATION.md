# 🚀 LadliHub.in Configuration Guide

## 🌐 **Domain Configuration**

### **1. Cloudflare Setup**
1. **Add Domain to Cloudflare:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Click "Add a Site"
   - Enter: `ladlihub.in`
   - Choose Free plan
   - Update nameservers at your domain registrar

2. **DNS Configuration:**
   ```
   Type: A
   Name: @
   Content: [Your Netlify IP or CNAME to Netlify]
   
   Type: CNAME
   Name: www
   Content: ladlihub.in
   ```

3. **SSL/TLS Settings:**
   - SSL/TLS encryption mode: Full (strict)
   - Always Use HTTPS: On
   - HTTP Strict Transport Security (HSTS): On

### **2. Netlify Configuration**
1. **Add Custom Domain:**
   - Go to Netlify Dashboard
   - Site settings > Domain management
   - Add custom domain: `ladlihub.in`
   - Add www subdomain: `www.ladlihub.in`

2. **Environment Variables:**
   ```
   NEXT_PUBLIC_APP_URL=https://ladlihub.in
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ADMIN_JWT_SECRET=your-secure-admin-secret
   ```

---

## 📊 **Google Analytics Integration**

### **1. Google Analytics Setup**
1. **Create GA4 Property:**
   - Go to [Google Analytics](https://analytics.google.com/)
   - Create new property for `ladlihub.in`
   - Get Measurement ID (G-XXXXXXXXXX)

2. **Configure Environment Variable:**
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

3. **Analytics Features Enabled:**
   - ✅ Page views tracking
   - ✅ Search tracking
   - ✅ Movie view tracking
   - ✅ User engagement tracking
   - ✅ Custom events

---

## 🛡️ **Rate Limiting Configuration**

### **1. India Rate Limit Removal**
- ✅ **India (IN):** Unlimited access (10,000 requests per 15 minutes)
- ✅ **Other countries:** Standard limits maintained
- ✅ **High-risk countries:** Stricter limits applied

### **2. Updated Rate Limits:**
```typescript
'IN': { maxRequests: 10000, windowMs: 15 * 60 * 1000, isBlocked: false }, // India unlimited
'US': { maxRequests: 200, windowMs: 15 * 60 * 1000, isBlocked: false },
'GB': { maxRequests: 200, windowMs: 15 * 60 * 1000, isBlocked: false },
'CN': { maxRequests: 50, windowMs: 15 * 60 * 1000, isBlocked: false },
'RU': { maxRequests: 50, windowMs: 15 * 60 * 1000, isBlocked: false },
```

---

## 🔧 **Admin Dashboard Fixes**

### **1. Admin Authentication**
- ✅ **JWT-based authentication** implemented
- ✅ **Secure token validation** in place
- ✅ **Session management** working
- ✅ **Role-based access control** active

### **2. Analytics Dashboard**
- ✅ **Real-time analytics** API endpoints
- ✅ **Session tracking** implemented
- ✅ **User behavior analytics** active
- ✅ **Performance metrics** available

### **3. Admin Panel Features**
- ✅ **Rate limit management**
- ✅ **IP/Country blocking**
- ✅ **Analytics overview**
- ✅ **System monitoring**
- ✅ **User management**

---

## 🚀 **Deployment Checklist**

### **Pre-Deployment:**
- [ ] Update domain in all configuration files
- [ ] Set up Google Analytics property
- [ ] Configure Cloudflare DNS
- [ ] Update Netlify custom domain
- [ ] Set environment variables

### **Post-Deployment:**
- [ ] Test admin dashboard: `https://ladlihub.in/admin/dashboard/`
- [ ] Test analytics dashboard: `https://ladlihub.in/admin/analytics/`
- [ ] Verify Google Analytics tracking
- [ ] Test rate limiting for different countries
- [ ] Verify India has unlimited access
- [ ] Test all authentication flows

---

## 🔍 **Troubleshooting**

### **Admin Dashboard Not Working:**
1. **Check authentication:**
   - Verify admin login works
   - Check JWT token validity
   - Ensure session is not expired

2. **Check API endpoints:**
   - Verify `/api/admin/analytics/summary` works
   - Check `/api/admin/rate-limits/stats` responds
   - Ensure all admin routes are accessible

3. **Check browser console:**
   - Look for JavaScript errors
   - Check network requests
   - Verify API responses

### **Analytics Dashboard Not Working:**
1. **Check Google Analytics:**
   - Verify Measurement ID is correct
   - Check if tracking code is loaded
   - Test events in GA4 real-time reports

2. **Check API responses:**
   - Verify analytics API endpoints
   - Check data format
   - Ensure proper authentication

### **Rate Limiting Issues:**
1. **Check configuration:**
   - Verify India has unlimited access
   - Check other country limits
   - Test with different IP addresses

2. **Check middleware:**
   - Verify rate limiting middleware is active
   - Check geolocation detection
   - Test IP whitelist/blacklist

---

## 📞 **Support**

If you encounter any issues:

1. **Check the logs:**
   - Netlify function logs
   - Browser console errors
   - Google Analytics reports

2. **Test endpoints:**
   - Admin API endpoints
   - Analytics endpoints
   - Rate limiting endpoints

3. **Verify configuration:**
   - Environment variables
   - Domain settings
   - SSL certificates

The system is now configured for `ladlihub.in` with Google Analytics, unlimited access for India, and fully functional admin and analytics dashboards!
