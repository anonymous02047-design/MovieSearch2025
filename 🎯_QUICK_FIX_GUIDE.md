# 🚨 QUICK FIX - Start Your App NOW!

## Your Current Issues:
1. ❌ "Missing script: dev" error
2. ❌ "Publishable key not valid" error
3. ❓ Need to upgrade Node.js

---

## ✅ Solution (3 Simple Steps)

### Step 1: Navigate to Project Directory
**You're in the wrong directory!** That's why you get "Missing script" error.

#### Windows PowerShell/CMD:
```bash
cd "C:\Users\anony\OneDrive - Naushad Alam\Desktop\MovieSearch2025"
```

#### Or double-click this file:
📁 **START_APP.bat** (I just created it for you!)

---

### Step 2: Check Node.js Version
```bash
node --version
```

**Required:** v18.18.0 or higher (v20.x.x or v22.x.x recommended)

#### If Your Node.js is Old:
1. Download latest LTS from: **https://nodejs.org/**
2. Run installer
3. Restart terminal
4. Verify: `node --version`

---

### Step 3: Add Clerk API Keys (2 minutes)

#### Get FREE Clerk Keys:
1. Go to: **https://dashboard.clerk.com**
2. Sign up (100% free, no credit card)
3. Click "Create Application"
4. Choose "Email" or "Google" for sign-in
5. Go to "API Keys" in left sidebar
6. Copy both keys

#### Add to `.env.local`:
Open `.env.local` file in your project and replace:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Find your actual keys here:**
- Publishable Key: Starts with `pk_test_`
- Secret Key: Starts with `sk_test_`

---

## 🚀 Start the App

### Option 1: Use Batch File (Easiest)
Double-click: **START_APP.bat**

### Option 2: Manual Command
```bash
cd "C:\Users\anony\OneDrive - Naushad Alam\Desktop\MovieSearch2025"
npm run dev
```

---

## 🎯 Expected Result

After adding Clerk keys, you should see:

```
✓ Ready in 2.3s
○ Local:        http://localhost:3000
✓ Ready for development
```

Visit: **http://localhost:3000**

---

## ❓ Still Having Issues?

### Issue: "Missing script: dev"
**Cause:** You're not in the project folder
**Fix:** 
```bash
cd "C:\Users\anony\OneDrive - Naushad Alam\Desktop\MovieSearch2025"
dir package.json  # Should exist
```

### Issue: "Publishable key not valid"
**Cause:** You haven't added real Clerk keys to `.env.local`
**Fix:** Get keys from https://dashboard.clerk.com (takes 2 minutes)

### Issue: Old Node.js version
**Fix:** 
1. Download from: https://nodejs.org/
2. Choose "LTS" version (recommended)
3. Install
4. Restart terminal
5. Run: `node --version`

---

## 📊 System Requirements

✅ **Node.js:** v20.18.1 LTS (recommended) or v22.x.x
✅ **npm:** v10.x.x (you have 10.9.3 ✓)
✅ **Operating System:** Windows 10/11 ✓

---

## 🎬 Complete Startup Checklist

```bash
# 1. Check Node.js version
node --version
# Should be v18.18+ (preferably v20.18+ or v22.x)

# 2. Navigate to project
cd "C:\Users\anony\OneDrive - Naushad Alam\Desktop\MovieSearch2025"

# 3. Verify package.json exists
dir package.json

# 4. Install dependencies (if needed)
npm install

# 5. Check .env.local has real keys
notepad .env.local

# 6. Start development server
npm run dev

# 7. Open browser
# Visit: http://localhost:3000
```

---

## 🔑 Getting All Required API Keys

### 1. Clerk (Authentication) - REQUIRED
- **URL:** https://dashboard.clerk.com
- **Time:** 2 minutes
- **Cost:** FREE (10,000 users/month)
- **Keys:** Publishable key + Secret key

### 2. TMDB (Movie Data) - REQUIRED
- **URL:** https://www.themoviedb.org/settings/api
- **Time:** 1 minute
- **Cost:** FREE (1000 requests/day)
- **Key:** API key (32 characters)

### 3. MongoDB (Database) - REQUIRED
- **URL:** https://cloud.mongodb.com
- **Time:** 5 minutes
- **Cost:** FREE (512MB storage)
- **Key:** Connection string (URI)

### 4. OpenAI (AI Features) - OPTIONAL
- **URL:** https://platform.openai.com/api-keys
- **Cost:** ~$5-20/month (pay as you go)
- **Key:** API key

---

## 💡 Pro Tips

1. **Use START_APP.bat**
   - Automatically navigates to project
   - Checks everything
   - Starts server
   - One-click solution!

2. **Keep .env.local Secret**
   - Never commit to git
   - Never share publicly
   - Already in .gitignore ✓

3. **Upgrade Node.js First**
   - Download LTS from nodejs.org
   - Latest stable = best performance
   - Fixes compatibility issues

4. **Restart Terminal After Upgrades**
   - Node.js upgrade? Restart terminal
   - npm install? Sometimes restart helps
   - Fresh start = clean slate

---

## 🎉 You're Almost There!

Just 3 things to do:
1. ✅ Navigate to project folder
2. ✅ Add Clerk keys to `.env.local`
3. ✅ Run `npm run dev`

**That's it! Your app will be running!** 🚀

---

## 📞 Need More Help?

Check these files:
- `📖_ENV_SETUP_GUIDE.md` - Detailed environment setup
- `⚡_UPGRADE_NODEJS.md` - Node.js upgrade guide
- `🚀_SETUP_COMPLETE.md` - Complete project status
- `.env.local` - Add your API keys here

---

**Quick Start:** Double-click **START_APP.bat** → Add Clerk keys → Done! ✨

