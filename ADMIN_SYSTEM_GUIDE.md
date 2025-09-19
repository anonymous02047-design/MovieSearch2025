# Admin System Guide - Rate Limiting & Blocking Management

## 🔐 Admin Authentication System

### **Default Admin Credentials**
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change these credentials in production by updating the `ADMIN_CREDENTIALS` in `/src/app/api/admin/auth/login/route.ts`

### **Access URLs**
- **Admin Login**: `http://localhost:3000/admin/login`
- **Admin Dashboard**: `http://localhost:3000/admin/dashboard`
- **Admin Index**: `http://localhost:3000/admin` (redirects to login/dashboard)

## 🛡️ Security Features

### **JWT Authentication**
- Admin sessions use JWT tokens with 24-hour expiration
- Tokens are stored in localStorage
- All admin API endpoints require valid JWT authentication
- Automatic session validation and logout on expiration

### **Rate Limiting Protection**
- Admin login page is excluded from rate limiting
- Admin API endpoints have their own authentication checks
- Failed authentication attempts are logged

## 📊 Admin Dashboard Features

### **Real-time Statistics**
- **Blocked IPs**: Number of currently blocked IP addresses
- **Blocked Countries**: Number of currently blocked countries
- **Active IPs**: Number of IPs with active rate limit tracking
- **Active Countries**: Number of countries with active rate limit tracking

### **IP Address Management**
- **Block IP**: Add new IP addresses to the block list
- **Unblock IP**: Remove IP addresses from the block list
- **View Blocked IPs**: See all currently blocked IP addresses
- **Block Reasons**: Track why IPs were blocked (Policy violation, Suspicious activity, Abuse, Spam, Other)

### **Country Management**
- **Block Country**: Add entire countries to the block list
- **Unblock Country**: Remove countries from the block list
- **View Blocked Countries**: See all currently blocked countries
- **Block Reasons**: Track why countries were blocked (Policy violation, Sanctions, High risk, Abuse, Other)

### **Live Rate Limit Monitoring**
- **IP Rate Limits**: Real-time view of IP-based rate limiting activity
- **Country Rate Limits**: Real-time view of country-based rate limiting activity
- **Request Counts**: See how many requests each IP/country has made
- **First Request Time**: Track when rate limiting started for each entity
- **Auto-refresh**: Statistics update every 10 seconds

## 🔧 API Endpoints

### **Authentication**
- `POST /api/admin/auth/login` - Admin login
  - Body: `{ "username": "admin", "password": "admin123" }`
  - Returns: JWT token and user info

### **Rate Limit Management**
- `GET /api/admin/rate-limits/stats` - Get rate limit statistics
- `GET /api/admin/rate-limits/block-ip` - Get blocked IPs list
- `POST /api/admin/rate-limits/block-ip` - Block an IP address
- `POST /api/admin/rate-limits/unblock-ip` - Unblock an IP address
- `GET /api/admin/rate-limits/block-country` - Get blocked countries list
- `POST /api/admin/rate-limits/block-country` - Block a country
- `POST /api/admin/rate-limits/unblock-country` - Unblock a country

### **API Request Format**
All admin API requests require authentication header:
```
Authorization: Bearer <JWT_TOKEN>
```

## 🚀 How to Use the Admin System

### **1. Access Admin Login**
1. Navigate to `http://localhost:3000/admin/login`
2. Enter credentials:
   - Username: `admin`
   - Password: `admin123`
3. Click "Sign In"

### **2. Block an IP Address**
1. In the dashboard, click "Block IP" button
2. Enter the IP address (e.g., `192.168.1.100`)
3. Select a reason from the dropdown
4. Click "Block IP"

### **3. Block a Country**
1. In the dashboard, click "Block Country" button
2. Enter the country code (e.g., `CN`, `RU`, `US`)
3. Select a reason from the dropdown
4. Click "Block Country"

### **4. Monitor Rate Limits**
1. View the "Live Rate Limit Statistics" section
2. See real-time activity for IPs and countries
3. Monitor request counts and timing
4. Use the "Refresh" button to update manually

### **5. Unblock Entities**
1. Find the IP or country in the respective lists
2. Click the delete (🗑️) icon next to the entity
3. Confirm the unblock action

## 🔒 Security Best Practices

### **Production Deployment**
1. **Change Default Credentials**: Update admin username/password
2. **Use Strong JWT Secret**: Set `ADMIN_JWT_SECRET` environment variable
3. **Enable HTTPS**: Use SSL certificates for admin access
4. **IP Whitelist**: Consider restricting admin access to specific IPs
5. **Regular Audits**: Monitor admin actions and logs

### **Environment Variables**
Add to your `.env.local`:
```env
ADMIN_JWT_SECRET=your-very-secure-secret-key-here
```

### **Logging**
All admin actions are logged to the console:
- IP blocking/unblocking
- Country blocking/unblocking
- Authentication attempts
- Rate limit violations

## 🛠️ Troubleshooting

### **Common Issues**

1. **"Admin authentication required" error**
   - Check if you're logged in
   - Verify JWT token is valid
   - Try logging out and back in

2. **Rate limiting not working**
   - Check middleware configuration
   - Verify rate limit routes are properly configured
   - Check console for geolocation errors

3. **Statistics not updating**
   - Check if rate limiting middleware is active
   - Verify API endpoints are accessible
   - Check browser network tab for API errors

### **Debug Mode**
Enable debug logging by checking the browser console and server logs for detailed information about:
- Authentication flow
- Rate limiting decisions
- API request/response details
- Error messages

## 📈 Rate Limiting Configuration

### **Current Limits**
- **Admin endpoints**: 5 requests/hour
- **Search endpoints**: 30 requests/15 minutes
- **Rating endpoints**: 10 requests/hour
- **Movie details**: 100 requests/15 minutes
- **User actions**: 50 requests/15 minutes

### **Customization**
Rate limits can be modified in `/src/middleware/rateLimit.ts`:
```typescript
export const endpointRateLimits = {
  '/api/search': {
    maxRequests: 30,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  // ... other endpoints
};
```

## 🎯 Use Cases

### **Blocking Abusive Users**
1. Monitor rate limit statistics
2. Identify high-request IPs
3. Block suspicious IPs with reason "Abuse"
4. Monitor for continued violations

### **Geographic Restrictions**
1. Block high-risk countries
2. Apply sanctions-based blocking
3. Monitor country-level activity
4. Adjust restrictions as needed

### **System Protection**
1. Set up automatic rate limiting
2. Monitor for DDoS attempts
3. Block malicious IPs quickly
4. Maintain service availability

This admin system provides comprehensive control over your application's rate limiting and blocking capabilities, ensuring security and optimal performance.
