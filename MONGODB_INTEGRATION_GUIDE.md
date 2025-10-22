# 🗄️ MongoDB Integration Guide - MovieSearch 2025

## Complete Step-by-Step Setup Guide

**Version**: 3.0.0  
**Last Updated**: October 2025  
**Difficulty**: Beginner-Friendly  
**Time Required**: 15-20 minutes

---

## 📋 **TABLE OF CONTENTS**

1. [Prerequisites](#prerequisites)
2. [MongoDB Atlas Setup](#mongodb-atlas-setup)
3. [Local Environment Configuration](#local-environment-configuration)
4. [Netlify Deployment Configuration](#netlify-deployment-configuration)
5. [Testing the Connection](#testing-the-connection)
6. [Common Issues & Solutions](#common-issues--solutions)
7. [Best Practices](#best-practices)
8. [Advanced Configuration](#advanced-configuration)

---

## 🎯 **PREREQUISITES**

Before starting, ensure you have:

- ✅ A GitHub account
- ✅ Node.js 18+ installed
- ✅ Your MovieSearch 2025 project cloned
- ✅ Basic understanding of environment variables
- ✅ A web browser (Chrome, Firefox, Safari, Edge)

---

## 🌐 **MONGODB ATLAS SETUP**

### Step 1: Create MongoDB Atlas Account

1. **Visit MongoDB Atlas**:
   ```
   https://www.mongodb.com/cloud/atlas/register
   ```

2. **Sign Up**:
   - Click "Try Free"
   - Use Google/GitHub sign-in OR email/password
   - Complete the registration form
   - Verify your email if required

3. **Answer Setup Questions** (optional):
   - Goal: "Learn MongoDB"
   - Application: "Build a new application"
   - Preferred Language: "JavaScript"
   - Click "Finish"

### Step 2: Create a Free Cluster

1. **Choose Free Tier**:
   - Select "M0 Free" cluster (should be pre-selected)
   - Provider: AWS, Google Cloud, or Azure (any is fine)
   - Region: Choose closest to your users
     - USA: `us-east-1` (Virginia)
     - Europe: `eu-west-1` (Ireland)
     - Asia: `ap-southeast-1` (Singapore)
     - India: `ap-south-1` (Mumbai)

2. **Cluster Name**:
   - Name: `MovieSearch2025` (or leave default)
   - Click "Create Cluster"
   - Wait 3-5 minutes for cluster creation

### Step 3: Create Database User

1. **Security Quickstart**:
   - You'll see a "Security Quickstart" modal
   - If not, go to: Database → Security → Database Access

2. **Add New Database User**:
   - Click "Add New Database User"
   - Authentication Method: "Password"
   - Username: `moviesearch_user` (or your choice)
   - Password: Click "Autogenerate Secure Password"
   - **IMPORTANT**: Copy and save this password securely!
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

### Step 4: Configure Network Access

1. **IP Whitelist**:
   - Go to: Database → Security → Network Access
   - Click "Add IP Address"

2. **Allow Access from Anywhere** (for development):
   - Click "Allow Access from Anywhere"
   - IP Address: `0.0.0.0/0` (automatically filled)
   - Comment: "Development & Netlify Access"
   - Click "Confirm"

   > ⚠️ **Production Note**: For production, use specific IP addresses for better security

### Step 5: Get Connection String

1. **Connect to Cluster**:
   - Go to: Database → Clusters
   - Click "Connect" button on your cluster

2. **Choose Connection Method**:
   - Select "Connect your application"
   - Driver: "Node.js"
   - Version: "4.1 or later"

3. **Copy Connection String**:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

4. **Modify Connection String**:
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - Add database name after `.net/`: `moviesearch`
   
   **Final Format**:
   ```
   mongodb+srv://moviesearch_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/moviesearch?retryWrites=true&w=majority
   ```

---

## 💻 **LOCAL ENVIRONMENT CONFIGURATION**

### Step 1: Install Dependencies

```bash
# Navigate to your project directory
cd "C:\Users\anony\OneDrive - Naushad Alam\Desktop\MovieSearch2025"

# Install mongoose
npm install mongoose

# Install types (if using TypeScript)
npm install --save-dev @types/mongoose
```

### Step 2: Create Environment File

1. **Create `.env.local` file** in the project root:

```bash
# Create new file
New-Item -Path .env.local -ItemType File
```

2. **Add MongoDB Configuration**:

Open `.env.local` and add:

```env
# ===================================
# MONGODB CONFIGURATION
# ===================================
MONGODB_URI=mongodb+srv://moviesearch_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/moviesearch?retryWrites=true&w=majority

# ===================================
# APPLICATION CONFIGURATION
# ===================================
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# ===================================
# EXISTING CLERK CONFIGURATION
# ===================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# ===================================
# EXISTING TMDB CONFIGURATION
# ===================================
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_key
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

# ... rest of your existing variables
```

3. **Save the file**

### Step 3: Verify Environment Variables

Create a test file to verify:

```typescript
// test-mongo.ts
import { connectDB } from './src/lib/mongodb';

async function testConnection() {
  try {
    await connectDB();
    console.log('✅ MongoDB connection successful!');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}

testConnection();
```

Run the test:
```bash
npx ts-node test-mongo.ts
```

---

## 🚀 **NETLIFY DEPLOYMENT CONFIGURATION**

### Step 1: Add Environment Variables to Netlify

1. **Login to Netlify**:
   ```
   https://app.netlify.com
   ```

2. **Select Your Site**:
   - Click on your MovieSearch 2025 site

3. **Go to Environment Variables**:
   - Site Settings → Environment Variables
   - Or: Build & Deploy → Environment

4. **Add MongoDB URI**:
   - Click "Add a variable" or "Add environment variable"
   - Key: `MONGODB_URI`
   - Value: Your connection string
   ```
   mongodb+srv://moviesearch_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/moviesearch?retryWrites=true&w=majority
   ```
   - Scopes: Select "All" or choose specific deploy contexts
   - Click "Save"

5. **Add Base URL**:
   - Key: `NEXT_PUBLIC_BASE_URL`
   - Value: `https://your-site-name.netlify.app`
   - Click "Save"

### Step 2: Redeploy Site

1. **Trigger Rebuild**:
   - Go to: Deploys
   - Click "Trigger deploy" → "Clear cache and deploy site"
   - Wait for deployment to complete (3-5 minutes)

2. **Check Deploy Logs**:
   - Look for successful MongoDB connection messages
   - Should see: "✅ MongoDB connected successfully"

---

## 🧪 **TESTING THE CONNECTION**

### Local Testing

1. **Start Development Server**:
```bash
npm run dev
```

2. **Test API Endpoint**:
Open browser and navigate to:
```
http://localhost:3000/api/profile
```

Expected response (if authenticated):
```json
{
  "success": true,
  "data": {
    "clerkId": "user_xxx",
    "email": "user@example.com",
    ...
  }
}
```

### Production Testing

1. **Visit Your Netlify Site**:
```
https://your-site-name.netlify.app
```

2. **Sign In** with your Clerk account

3. **Test Profile API**:
```
https://your-site-name.netlify.app/api/profile
```

4. **Check MongoDB Atlas**:
   - Go to: Database → Collections
   - You should see `moviesearch` database
   - Collections: `users`, `reviews`, `collections`

---

## 🔧 **COMMON ISSUES & SOLUTIONS**

### Issue 1: "MongoServerError: bad auth"

**Cause**: Incorrect username or password

**Solution**:
1. Double-check your connection string
2. Ensure password has no special characters or is URL-encoded
3. Special characters encoding:
   - `@` → `%40`
   - `#` → `%23`
   - `%` → `%25`

### Issue 2: "MongooseServerSelectionError: connection timed out"

**Cause**: IP not whitelisted or network issues

**Solution**:
1. Verify IP whitelist includes `0.0.0.0/0`
2. Check your internet connection
3. Try different network (mobile hotspot)
4. Disable VPN temporarily

### Issue 3: "MONGODB_URI is not defined"

**Cause**: Environment variable not loaded

**Solution**:
1. Verify `.env.local` exists in project root
2. Restart development server
3. Check for typos in variable name
4. Ensure no spaces around `=` sign

### Issue 4: "Cannot find module 'mongoose'"

**Cause**: Package not installed

**Solution**:
```bash
npm install mongoose
```

### Issue 5: Connection Pool Errors

**Cause**: Too many concurrent connections (free tier limit: 10)

**Solution**:
- Already configured in `src/lib/mongodb.ts`
- Uses connection pooling with max 10 connections
- No action needed

---

## ✅ **BEST PRACTICES**

### Security

1. **Never Commit Credentials**:
   ```bash
   # .gitignore should include:
   .env.local
   .env*.local
   ```

2. **Use Strong Passwords**:
   - At least 16 characters
   - Mix of letters, numbers, symbols
   - Use MongoDB's password generator

3. **Rotate Credentials Regularly**:
   - Change database password every 90 days
   - Update in `.env.local` and Netlify

### Performance

1. **Connection Pooling**:
   - Already configured (max 10 connections)
   - Reuses connections automatically

2. **Indexes**:
   - Already created on all models
   - `clerkId`, `email`, `movieId` indexed

3. **Query Optimization**:
   - Use pagination for large datasets
   - Limit fields with `.select()`
   - Use `.lean()` for read-only queries

### Monitoring

1. **MongoDB Atlas Metrics**:
   - Go to: Database → Metrics
   - Monitor: Connections, Operations, Data Size

2. **Set Up Alerts**:
   - Go to: Alerts
   - Create alert for connection spikes
   - Email notifications enabled

---

## 🚀 **ADVANCED CONFIGURATION**

### Custom Database Name

Change `moviesearch` to your preferred name:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/YOUR_DB_NAME?retryWrites=true&w=majority
```

### Multiple Environments

**Development**:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/moviesearch-dev?retryWrites=true&w=majority
```

**Production**:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/moviesearch-prod?retryWrites=true&w=majority
```

### Connection Options

Add to connection string:

```
&maxPoolSize=10
&minPoolSize=5
&serverSelectionTimeoutMS=5000
&socketTimeoutMS=45000
&family=4
```

### Backup Configuration

1. **Enable Cloud Backup**:
   - Go to: Database → Backups
   - Enable "Cloud Backup" (may require upgrade)

2. **Export Data**:
   - Go to: Database → Collections
   - Click "..." → "Export Collection"

---

## 📊 **MONITORING YOUR DATABASE**

### MongoDB Atlas Dashboard

1. **Real-time Metrics**:
   - Database → Metrics
   - View: Connections, Operations, Storage

2. **Performance Advisor**:
   - Database → Performance Advisor
   - Get index recommendations

3. **Query Profiler**:
   - Database → Profiler
   - Analyze slow queries

### Application Logs

Check Netlify Function Logs:
```
Deploys → [Latest Deploy] → Function Log
```

Look for:
- ✅ "MongoDB connected successfully"
- ❌ Connection errors

---

## 🎓 **LEARNING RESOURCES**

### MongoDB University (Free Courses):
- MongoDB Basics: https://university.mongodb.com/courses/M001
- MongoDB for Node.js Developers: https://university.mongodb.com/courses/M220JS

### Documentation:
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- Mongoose Docs: https://mongoosejs.com/docs/

### Community:
- MongoDB Community Forums: https://www.mongodb.com/community/forums/
- Stack Overflow: Tag `mongodb` + `mongoose`

---

## 🎉 **SUCCESS CHECKLIST**

Before considering setup complete:

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password saved
- [ ] IP whitelist configured (0.0.0.0/0)
- [ ] Connection string obtained and modified
- [ ] `mongoose` npm package installed
- [ ] `.env.local` file created with `MONGODB_URI`
- [ ] Local connection tested successfully
- [ ] Environment variables added to Netlify
- [ ] Site redeployed on Netlify
- [ ] Production connection tested
- [ ] Can see database in MongoDB Atlas
- [ ] API endpoints working
- [ ] No errors in logs

---

## 📞 **NEED HELP?**

### MongoDB Support:
- Free Tier Support: Community Forums
- Email: support@mongodb.com
- Chat: Available in Atlas dashboard

### MovieSearch 2025:
- Check logs in: `npm run dev` console
- MongoDB connection file: `src/lib/mongodb.ts`
- API routes: `src/app/api/`

---

## 🔄 **UPDATING CONFIGURATION**

### Change Connection String:

1. **Locally**:
   - Update `.env.local`
   - Restart dev server

2. **Netlify**:
   - Site Settings → Environment Variables
   - Edit `MONGODB_URI`
   - Redeploy site

### Reset Database Password:

1. **MongoDB Atlas**:
   - Security → Database Access
   - Click "..." on user → "Edit"
   - "Edit Password" → Generate new
   - Save password

2. **Update Everywhere**:
   - `.env.local`
   - Netlify environment variables
   - Redeploy

---

**Congratulations! Your MongoDB integration is complete!** 🎊

You now have a fully functional database for storing:
- ✅ User profiles
- ✅ Favorites & watchlists
- ✅ Reviews
- ✅ Collections
- ✅ Search history
- ✅ And more!

**Version**: 3.0.0  
**Status**: Production Ready  
**Free Tier**: ✅ Fully Compatible

