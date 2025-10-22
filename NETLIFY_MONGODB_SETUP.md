# 🚀 Netlify MongoDB Production Setup

## Complete Guide to Add MongoDB to Your Production Environment

---

## 📋 Prerequisites

1. ✅ MongoDB Atlas account (Free tier available)
2. ✅ Netlify account with deployed site
3. ✅ Access to Netlify environment variables

---

## 🗄️ Step 1: Create MongoDB Atlas Cluster

### 1.1 Sign Up / Log In
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Sign up for free or log in

### 1.2 Create a New Cluster
1. Click "Create a Cluster"
2. Choose **FREE** tier (M0)
3. Select a cloud provider (AWS recommended)
4. Choose a region close to your users
5. Name your cluster: `moviesearch-production`
6. Click "Create Cluster"

### 1.3 Configure Database Access
1. Go to "Database Access" in sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `moviesearch_user` (or your choice)
5. Password: Generate a strong password (SAVE THIS!)
6. User Privileges: "Read and write to any database"
7. Click "Add User"

### 1.4 Configure Network Access
1. Go to "Network Access" in sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
   - This is safe for serverless functions like Netlify
4. Click "Confirm"

### 1.5 Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Driver: Node.js
4. Version: 5.5 or later
5. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with your actual credentials
7. Add database name before the `?`:
   ```
   mongodb+srv://moviesearch_user:YOUR_PASSWORD@cluster.mongodb.net/moviesearch?retryWrites=true&w=majority
   ```

---

## 🔐 Step 2: Add Environment Variables to Netlify

### 2.1 Navigate to Site Settings
1. Log in to [Netlify](https://www.netlify.com)
2. Go to your site dashboard
3. Click "Site configuration" → "Environment variables"

### 2.2 Add MongoDB URI
1. Click "Add a variable" → "Add a single variable"
2. **Key**: `MONGODB_URI`
3. **Value**: Your MongoDB connection string from Step 1.5
4. **Scopes**: Check all (Deploy contexts, Branches)
5. Click "Create variable"

### 2.3 Add Auto-Init Setting
1. Click "Add a variable" → "Add a single variable"
2. **Key**: `MONGODB_AUTO_INIT`
3. **Value**: `true`
4. **Scopes**: Check all
5. Click "Create variable"

### 2.4 Add Webhook Secret (Optional)
1. Click "Add a variable" → "Add a single variable"
2. **Key**: `MONGODB_INIT_SECRET`
3. **Value**: Generate a random string (e.g., use a password generator)
4. **Scopes**: Check all
5. Click "Create variable"

### Current Environment Variables Checklist
After setup, you should have these variables in Netlify:

```
✅ MONGODB_URI=mongodb+srv://...
✅ MONGODB_AUTO_INIT=true
✅ MONGODB_INIT_SECRET=your-secret-key
✅ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
✅ CLERK_SECRET_KEY=sk_...
✅ NEXT_PUBLIC_TMDB_API_KEY=...
✅ NEXT_PUBLIC_BASE_URL=https://your-site.netlify.app
✅ (All other existing variables)
```

---

## 🔄 Step 3: Trigger Re-deployment

### Method 1: Via Netlify Dashboard
1. Go to "Deploys" tab
2. Click "Trigger deploy" → "Deploy site"
3. Wait for deployment to complete

### Method 2: Via Git Push
```bash
# Make a small change (e.g., update a comment)
git add .
git commit -m "Add MongoDB configuration"
git push origin main
```

---

## ✅ Step 4: Verify MongoDB Connection

### 4.1 Check Health Endpoint
After deployment, visit:
```
https://your-site.netlify.app/api/health/mongodb
```

You should see:
```json
{
  "status": "healthy",
  "connection": {
    "state": 1,
    "host": "cluster.mongodb.net",
    "name": "moviesearch"
  },
  "collections": {
    "users": 0,
    "reviews": 0,
    "collections": 0
  },
  "initialized": true
}
```

### 4.2 Check Netlify Function Logs
1. Go to Netlify dashboard
2. Click "Functions" tab
3. Look for MongoDB initialization logs
4. Should see: "✅ MongoDB connected successfully"

### 4.3 Test User Profile Features
1. Sign in to your app
2. Go to `/profile`
3. Update your profile
4. Check if changes are saved
5. Refresh page - changes should persist

---

## 🔍 Step 5: Monitor MongoDB Usage

### 5.1 MongoDB Atlas Metrics
1. Go to MongoDB Atlas dashboard
2. Click "Metrics" tab
3. Monitor:
   - Connections
   - Operations per second
   - Network traffic
   - Storage size

### 5.2 Free Tier Limits
- **Storage**: 512 MB
- **RAM**: 512 MB (shared)
- **Connections**: 100 concurrent
- **Backup**: None (upgrade for backups)

### 5.3 Usage Alerts
1. Go to "Alerts" in MongoDB Atlas
2. Set up alerts for:
   - 80% storage used
   - Connection limits approaching
   - High query execution time

---

## 🛠️ Troubleshooting

### Problem 1: "Cannot connect to MongoDB"
**Solution**:
1. Verify connection string is correct
2. Check if IP whitelist includes `0.0.0.0/0`
3. Verify username and password are correct
4. Check if cluster is running (not paused)

### Problem 2: "Authentication failed"
**Solution**:
1. Verify username and password in connection string
2. Check if user has correct permissions
3. Ensure password doesn't contain special characters (or URL encode them)
4. Try creating a new database user

### Problem 3: "Database not found"
**Solution**:
1. Ensure database name is in connection string:
   ```
   mongodb+srv://...@cluster.mongodb.net/YOUR_DB_NAME?...
   ```
2. MongoDB will auto-create database on first write

### Problem 4: "Too many connections"
**Solution**:
1. Check `maxPoolSize` in `src/lib/mongodb.ts`
2. Reduce to 5-10 for free tier
3. Implement connection pooling (already done)

### Problem 5: Environment Variable Not Found
**Solution**:
1. Verify variable name is exactly `MONGODB_URI`
2. Check if variable is set for correct deploy context
3. Re-deploy after adding variables
4. Check Netlify function logs for errors

---

## 📊 Performance Optimization

### 1. Indexing
Indexes are automatically created on:
- `clerkUserId` (User model)
- `userId` (Review, Collection models)
- `movieId` (Review model)

### 2. Connection Pooling
Already configured in `src/lib/mongodb.ts`:
```typescript
maxPoolSize: 10 // Adjust based on your needs
```

### 3. Caching
Consider implementing:
- API response caching
- Client-side caching with SWR/React Query
- Redis for session storage (optional)

### 4. Query Optimization
- Use `.select()` to fetch only needed fields
- Implement pagination
- Use `.lean()` for read-only queries

---

## 🔒 Security Best Practices

### 1. Connection String
✅ Never commit connection string to git
✅ Use environment variables only
✅ Rotate passwords periodically

### 2. Database Access
✅ Create separate users for different environments
✅ Use minimal required permissions
✅ Enable audit logging (paid tier)

### 3. Network Security
✅ Use SSL/TLS (enabled by default)
✅ Whitelist only necessary IPs (or 0.0.0.0/0 for serverless)
✅ Monitor connection attempts

### 4. Data Protection
✅ Implement soft deletes (already done)
✅ Validate all inputs
✅ Sanitize user data
✅ Use Mongoose schema validation

---

## 📈 Scaling Considerations

### When to Upgrade from Free Tier

**Upgrade if you hit these limits:**
- Storage > 400 MB (80% of 512 MB)
- Connections frequently maxed out
- Need backup/restore capabilities
- Need advanced monitoring
- Need better performance

### Next Tier: M2 ($9/month)
- 2 GB storage
- 2 GB RAM (shared)
- 500 connections
- Automated backups
- Performance advisor

---

## 🧪 Testing in Production

### 1. Health Check
```bash
curl https://your-site.netlify.app/api/health/mongodb
```

### 2. Create Test User
1. Sign up with test account
2. Update profile
3. Add favorites
4. Check database in MongoDB Atlas

### 3. Check Data in Atlas
1. Go to MongoDB Atlas
2. Click "Browse Collections"
3. Select `moviesearch` database
4. View `users`, `reviews`, `collections`

---

## 📝 Environment Variables Reference

### Required for MongoDB
```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# Auto-initialization
MONGODB_AUTO_INIT=true

# Webhook Secret (optional but recommended)
MONGODB_INIT_SECRET=your-random-secret-key
```

### Example .env.local (for local development)
```bash
# MongoDB (Local or Atlas)
MONGODB_URI=mongodb+srv://moviesearch_user:YOUR_PASSWORD@cluster.mongodb.net/moviesearch?retryWrites=true&w=majority
MONGODB_AUTO_INIT=true

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# TMDB
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## ✅ Deployment Checklist

Before going live:

### MongoDB Setup
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with secure password
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string obtained
- [ ] Environment variables added to Netlify
- [ ] Site redeployed
- [ ] Health check passes
- [ ] Test user creation works
- [ ] Data persists correctly

### Monitoring
- [ ] Set up MongoDB alerts
- [ ] Monitor connection usage
- [ ] Monitor storage usage
- [ ] Check error logs regularly

---

## 🎉 You're Done!

Your MovieSearch2025 app now has a fully functional MongoDB database in production!

**Next Steps:**
1. Monitor usage in MongoDB Atlas
2. Test all user features
3. Set up backup strategy (paid tier)
4. Consider implementing Redis for caching
5. Add more advanced features

---

## 📚 Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

**Version**: 1.0  
**Last Updated**: 2025  
**Status**: ✅ Production Ready  

**🚀 Happy Coding! 🚀**

