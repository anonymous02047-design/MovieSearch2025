# 🔧 COMPLETE ENVIRONMENT VARIABLE SETUP GUIDE
## All Variables for Fully Functional MovieSearch 2025

**Last Updated**: October 22, 2025  
**Status**: Complete & Production Ready  

---

## 📋 QUICK REFERENCE

### `.env.local` Template

Copy this complete template to your `.env.local` file:

```bash
# ==============================================
# 🔐 CLERK AUTHENTICATION (REQUIRED)
# ==============================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY
CLERK_SECRET_KEY=sk_test_YOUR_KEY

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# ==============================================
# 🎬 TMDB API (REQUIRED)
# ==============================================
NEXT_PUBLIC_TMDB_API_KEY=YOUR_32_CHAR_KEY
TMDB_API_KEY=YOUR_32_CHAR_KEY

NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
NEXT_PUBLIC_TMDB_API_BASE_URL=https://api.themoviedb.org/3

# ==============================================
# 🗄️ MONGODB (REQUIRED)
# ==============================================
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/moviesearch2025

# ==============================================
# 🤖 OPENAI (OPTIONAL - AI Features)
# ==============================================
OPENAI_API_KEY=sk-proj-YOUR_KEY

# ==============================================
# 🌐 APP CONFIG (REQUIRED)
# ==============================================
NEXT_PUBLIC_BASE_URL=http://localhost:3000
JWT_SECRET=RANDOM_64_CHAR_STRING
NODE_ENV=development

# ==============================================
# 📊 ANALYTICS (OPTIONAL)
# ==============================================
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# ==============================================
# 📧 EMAIL (OPTIONAL)
# ==============================================
SENDGRID_API_KEY=SG.YOUR_KEY
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# ==============================================
# 🔐 RECAPTCHA (OPTIONAL)
# ==============================================
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=YOUR_SITE_KEY
RECAPTCHA_SECRET_KEY=YOUR_SECRET_KEY

# ==============================================
# 💬 TAWK.TO (OPTIONAL)
# ==============================================
NEXT_PUBLIC_TAWK_PROPERTY_ID=YOUR_PROPERTY_ID
NEXT_PUBLIC_TAWK_WIDGET_ID=YOUR_WIDGET_ID
```

---

## 🔑 HOW TO GET EACH API KEY

### 1. Clerk Authentication (REQUIRED)

**Get it from**: https://dashboard.clerk.com

**Steps**:
1. Sign up or log in
2. Click "Create Application"
3. Name your app: "MovieSearch 2025"
4. Go to **API Keys** in sidebar
5. Copy both keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_`)
   - `CLERK_SECRET_KEY` (starts with `sk_`)

**Free Tier**: 10,000 monthly active users

---

### 2. TMDB API (REQUIRED)

**Get it from**: https://www.themoviedb.org/settings/api

**Steps**:
1. Create account at https://www.themoviedb.org
2. Go to Settings → API
3. Click "Request an API Key"
4. Choose "Developer"
5. Fill in application details:
   - Type: Website
   - URL: Your app URL
   - Description: "Movie discovery app"
6. Accept terms
7. Copy **API Key (v3 auth)** (32 characters)

**Free Tier**: Unlimited requests (rate limited to 40/10s)

---

### 3. MongoDB Atlas (REQUIRED)

**Get it from**: https://www.mongodb.com/cloud/atlas

**Steps**:
1. Sign up for free account
2. Create new cluster:
   - Choose **M0 Sandbox** (FREE)
   - Select region closest to you
   - Name: "MovieSearch2025"
3. Create database user:
   - Go to "Database Access"
   - Add new user with password
   - Save username and password
4. Whitelist IP:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
5. Get connection string:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<username>`, `<password>`, and `<dbname>`

**Example**:
```
mongodb+srv://moviesearch:MyPassword123@cluster0.abc123.mongodb.net/moviesearch2025?retryWrites=true&w=majority
```

**Free Tier**: 512MB storage, shared RAM

---

### 4. OpenAI API (OPTIONAL - for AI features)

**Get it from**: https://platform.openai.com/api-keys

**Steps**:
1. Sign up at OpenAI
2. Add payment method (required for API access)
3. Go to "API keys"
4. Click "Create new secret key"
5. Name it: "MovieSearch 2025"
6. Copy key (starts with `sk-proj-`)

**Free Credits**: $5 for new accounts (limited time)
**Pricing**: ~$0.15-$0.60 per 1M tokens (GPT-4o-mini)

---

### 5. Google Analytics (OPTIONAL)

**Get it from**: https://analytics.google.com

**Steps**:
1. Sign in to Google Analytics
2. Click "Admin" (bottom left)
3. Create Property:
   - Name: "MovieSearch 2025"
   - Timezone: Your timezone
4. Create Web Data Stream:
   - Platform: Web
   - Website URL: Your URL
5. Copy **Measurement ID** (starts with `G-`)

**Free Tier**: Unlimited

---

### 6. SendGrid Email (OPTIONAL)

**Get it from**: https://sendgrid.com

**Steps**:
1. Sign up for free account
2. Go to Settings → API Keys
3. Create API Key
4. Choose "Full Access"
5. Copy key (starts with `SG.`)
6. Verify sender email:
   - Settings → Sender Authentication
   - Verify single sender
   - Use your email

**Free Tier**: 100 emails/day

---

### 7. reCAPTCHA (OPTIONAL)

**Get it from**: https://www.google.com/recaptcha/admin

**Steps**:
1. Sign in with Google account
2. Click "+" to create new site
3. Enter:
   - Label: "MovieSearch 2025"
   - Type: "reCAPTCHA v3"
   - Domains: `localhost`, `your-domain.netlify.app`
4. Accept terms
5. Submit
6. Copy both keys:
   - **Site Key** (for `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`)
   - **Secret Key** (for `RECAPTCHA_SECRET_KEY`)

**Free Tier**: Unlimited

---

### 8. Tawk.to Live Chat (OPTIONAL)

**Get it from**: https://www.tawk.to

**Steps**:
1. Sign up for free
2. Go to Administration → Property Settings
3. Copy **Property ID**
4. Go to Administration → Widgets
5. Copy **Widget ID** from embed code

**Free Tier**: Unlimited chats

---

### 9. JWT Secret (REQUIRED)

**Generate it yourself**:

```bash
# Option 1: Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: OpenSSL
openssl rand -hex 64

# Option 3: Online
# Visit: https://www.grc.com/passwords.htm
# Copy the 63-character password
```

---

## 📝 COMPLETE `.env.local` FILE

Create a file named `.env.local` in your project root:

```bash
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# TMDB
NEXT_PUBLIC_TMDB_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TMDB_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
NEXT_PUBLIC_TMDB_API_BASE_URL=https://api.themoviedb.org/3

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/moviesearch2025?retryWrites=true&w=majority

# OpenAI
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# App Config
NEXT_PUBLIC_BASE_URL=http://localhost:3000
JWT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NODE_ENV=development
NEXT_PUBLIC_APP_NAME=MovieSearch 2025

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Email
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_TO_EMAIL=contact@yourdomain.com

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RECAPTCHA_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Tawk.to
NEXT_PUBLIC_TAWK_PROPERTY_ID=xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_TAWK_WIDGET_ID=xxxxxxxxxxxxxxxxxxxx
```

---

## 🚀 NETLIFY PRODUCTION SETUP

Go to: https://app.netlify.com → Your Site → Site Settings → Environment Variables

Add these variables one by one:

### Required Variables (6)
1. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key
2. `CLERK_SECRET_KEY` - Your Clerk secret key  
3. `NEXT_PUBLIC_TMDB_API_KEY` - Your TMDB API key
4. `MONGODB_URI` - Your MongoDB connection string
5. `NEXT_PUBLIC_BASE_URL` - Your Netlify URL (`https://your-site.netlify.app`)
6. `JWT_SECRET` - Random 64-char string

### Recommended Variables (4)
7. `OPENAI_API_KEY` - For AI features
8. `SENDGRID_API_KEY` - For emails
9. `NEXT_PUBLIC_GA_MEASUREMENT_ID` - For analytics
10. `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` - For spam protection

### Optional Variables (2)
11. `NEXT_PUBLIC_TAWK_PROPERTY_ID` - For live chat
12. `NEXT_PUBLIC_TAWK_WIDGET_ID` - For live chat

**Important**: For each variable:
- Click "Add variable"
- Enter Key and Value
- Select all scopes (Production, Deploy Previews, Branch deploys)
- Click "Add variable"

---

## ✅ VERIFICATION

Test your setup:

```bash
# 1. Create .env.local with all variables

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Open browser
http://localhost:3000

# 5. Test features:
- ✅ Sign up/Sign in works (Clerk)
- ✅ Movies load (TMDB)
- ✅ Add to favorites (MongoDB)
- ✅ AI Chat button works (OpenAI)
- ✅ Contact form works (SendGrid)
```

---

## 🐛 TROUBLESHOOTING

### Clerk not working
- Check both keys are correct
- Ensure keys start with `pk_` and `sk_`
- Verify domain is whitelisted in Clerk dashboard

### TMDB not loading
- Verify API key is exactly 32 characters
- Check no extra spaces
- Ensure API key is approved (check email)

### MongoDB connection fails
- Check username/password in connection string
- Verify IP is whitelisted (0.0.0.0/0)
- Ensure database name is correct

### OpenAI not responding
- Verify API key starts with `sk-proj-`
- Check you have credits available
- Ensure payment method is added

---

## 📞 SUPPORT

Need help? Check these resources:

- **Clerk**: https://clerk.com/docs
- **TMDB**: https://developers.themoviedb.org
- **MongoDB**: https://docs.mongodb.com/atlas
- **OpenAI**: https://platform.openai.com/docs
- **SendGrid**: https://docs.sendgrid.com

---

**Status**: ✅ Complete  
**Last Updated**: October 22, 2025  
**All APIs**: Free tier available

