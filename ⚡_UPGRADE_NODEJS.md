# 🚀 Node.js Upgrade Guide

## Current Issue
You're getting "Missing script: dev" because you're in the wrong directory, AND you need to upgrade Node.js for Next.js 15.5.3.

## ✅ Quick Fix Steps

### Step 1: Upgrade Node.js to Latest LTS

#### Option A: Using Node Version Manager (NVM) - RECOMMENDED
```bash
# Install NVM for Windows from:
# https://github.com/coreybutler/nvm-windows/releases

# After installing NVM, run:
nvm install lts
nvm use lts

# Verify installation:
node --version  # Should show v22.x.x or v20.x.x
npm --version   # Should show v10.x.x or higher
```

#### Option B: Direct Download
1. Visit: https://nodejs.org/
2. Download **LTS version** (Long Term Support)
3. Run installer
4. Restart terminal
5. Verify:
```bash
node --version
npm --version
```

### Step 2: Navigate to Project Directory

```bash
# You're currently in your home directory!
# Navigate to your project:
cd "OneDrive - Naushad Alam\Desktop\MovieSearch2025"

# Verify you're in the right place:
ls package.json  # Should exist
```

### Step 3: Install Dependencies

```bash
# Clean install
npm install

# If you get errors, try:
npm cache clean --force
npm install
```

### Step 4: Fix Clerk Error - Add Your API Keys

Edit `.env.local` and add your actual Clerk keys:

```env
# Get these from: https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
CLERK_SECRET_KEY=sk_test_your_actual_key_here
```

**How to get Clerk keys (FREE - takes 2 minutes):**
1. Go to https://dashboard.clerk.com
2. Sign up (free account)
3. Create a new application
4. Go to "API Keys" in sidebar
5. Copy **Publishable key** (starts with `pk_test_`)
6. Copy **Secret key** (starts with `sk_test_`)
7. Paste them into `.env.local`

### Step 5: Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

---

## 📊 Required Node.js Version

For **Next.js 15.5.3**, you need:
- ✅ **Node.js:** v18.18.0 or higher
- ✅ **Recommended:** v20.x.x LTS or v22.x.x LTS
- ✅ **npm:** v9.x.x or higher

---

## 🔍 Troubleshooting

### "npm run dev" still shows "Missing script"
**Cause:** You're not in the project directory
**Fix:** 
```bash
cd "OneDrive - Naushad Alam\Desktop\MovieSearch2025"
pwd  # Verify you're in the right place
```

### "Publishable key not valid"
**Cause:** `.env.local` has placeholder values
**Fix:** Add your actual Clerk keys from https://dashboard.clerk.com

### Node.js upgrade doesn't work
**Fix:** 
```bash
# Completely uninstall Node.js
# Then download fresh from: https://nodejs.org/
# Choose LTS version (recommended)
```

---

## ✅ Verification Checklist

After upgrading, verify everything:

```bash
# 1. Check Node.js version
node --version
# Should show: v20.x.x or v22.x.x

# 2. Check npm version
npm --version
# Should show: v10.x.x or higher

# 3. Navigate to project
cd "OneDrive - Naushad Alam\Desktop\MovieSearch2025"

# 4. Install dependencies
npm install

# 5. Run development server
npm run dev
```

---

## 🎯 Quick Commands

```bash
# Full reset and start:
cd "OneDrive - Naushad Alam\Desktop\MovieSearch2025"
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📝 Important Notes

1. **Always navigate to project directory first**
   ```bash
   cd "OneDrive - Naushad Alam\Desktop\MovieSearch2025"
   ```

2. **Never run npm commands in your home directory**
   - It won't find package.json
   - You'll get "Missing script" errors

3. **Use LTS version of Node.js**
   - More stable
   - Better supported
   - Recommended for production

4. **Add real API keys to .env.local**
   - Clerk keys (required)
   - TMDB key (required)
   - MongoDB URI (required)

---

## 🚀 After Upgrade

Your system will be ready with:
- ✅ Latest stable Node.js
- ✅ Latest npm
- ✅ Next.js 15.5.3 working
- ✅ All dependencies updated
- ✅ 0 vulnerabilities
- ✅ Production ready

---

**Need help?** Check the `.env.local` file for detailed instructions on getting API keys!

