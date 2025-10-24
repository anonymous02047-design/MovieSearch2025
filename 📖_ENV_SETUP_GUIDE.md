# 🔧 Environment Variables Setup Guide

## Quick Start (5 Minutes)

### Step 1: Create Your .env.local File
```bash
cp .env.local.example .env.local
```

### Step 2: Set Required Variables (MUST DO)

#### 1️⃣ Clerk Authentication (FREE - 10,000 users/month)
1. Visit https://dashboard.clerk.com
2. Sign up and create a new application
3. Copy your keys:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
   CLERK_SECRET_KEY=sk_test_xxxxx
   ```

#### 2️⃣ TMDB API (FREE - 1000 requests/day)
1. Visit https://www.themoviedb.org
2. Sign up and go to Settings → API
3. Copy your API key:
   ```env
   NEXT_PUBLIC_TMDB_API_KEY=your_32_character_key_here
   ```

#### 3️⃣ MongoDB Database (FREE - 512MB)
1. Visit https://cloud.mongodb.com
2. Create a free M0 cluster
3. Create a database user
4. Get connection string:
   ```env
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/moviesearch2025
   ```

#### 4️⃣ OpenAI API (RECOMMENDED - Pay as you go)
1. Visit https://platform.openai.com/api-keys
2. Create an API key
3. Add $5-10 credit to start
   ```env
   OPENAI_API_KEY=sk-xxxxx
   ```

### Step 3: Test Your Setup
```bash
npm run dev
```

Visit http://localhost:3000 and try:
- Sign in/Sign up (tests Clerk)
- Search for a movie (tests TMDB)
- Add to favorites (tests MongoDB)
- Get AI recommendations (tests OpenAI)

---

## Tawk.to Live Chat Setup (OPTIONAL - FREE)

### Why Use Tawk.to?
- ✅ **100% Free forever** - No hidden costs
- ✅ Real-time customer support
- ✅ Mobile apps for agents
- ✅ Unlimited messages
- ✅ Visitor monitoring
- ✅ Customizable widget

### Setup Steps

1. **Create Account**
   - Visit https://www.tawk.to
   - Sign up (free, no credit card required)

2. **Get Your Widget Code**
   - Go to Administration → Channels → Chat Widget
   - Create a new widget or use default
   - Find your Property ID and Widget ID in the widget code:
     ```javascript
     https://embed.tawk.to/{PROPERTY_ID}/{WIDGET_ID}
     ```

3. **Add to .env.local**
   ```env
   NEXT_PUBLIC_TAWK_PROPERTY_ID=your_property_id_here
   NEXT_PUBLIC_TAWK_WIDGET_ID=your_widget_id_here
   NEXT_PUBLIC_TAWK_ENABLED=true
   ```

4. **Customize (Optional)**
   ```env
   NEXT_PUBLIC_TAWK_POSITION=bottom-right
   NEXT_PUBLIC_TAWK_THEME=auto
   NEXT_PUBLIC_TAWK_GREETING_MESSAGE=Hello! How can we help?
   ```

### Tawk.to Features Included

Our implementation includes:
- ✅ Auto-initialization on page load
- ✅ User identification (synced with Clerk)
- ✅ Event tracking (chat started, messages, etc.)
- ✅ Responsive design (mobile & desktop)
- ✅ Theme switching (light/dark mode)
- ✅ Customizable position
- ✅ Greeting & offline messages
- ✅ Show/hide controls

### Testing Tawk.to

1. Start dev server: `npm run dev`
2. Look for chat widget in bottom-right corner
3. Click to open and test messaging
4. Check Tawk.to dashboard for incoming chats

### Configuration Options

```env
# Enable/Disable
NEXT_PUBLIC_TAWK_ENABLED=true

# Widget Position
NEXT_PUBLIC_TAWK_POSITION=bottom-right
# Options: bottom-right, bottom-left, top-right, top-left

# Theme
NEXT_PUBLIC_TAWK_THEME=auto
# Options: light, dark, auto (follows system)

# Device Visibility
NEXT_PUBLIC_TAWK_SHOW_MOBILE=true
NEXT_PUBLIC_TAWK_SHOW_DESKTOP=true

# Messages
NEXT_PUBLIC_TAWK_GREETING_MESSAGE=Hello! How can we help you today?
NEXT_PUBLIC_TAWK_OFFLINE_MESSAGE=We're offline. Leave a message!
```

### Advanced: User Tracking

The Tawk.to service automatically syncs with Clerk authentication:
- User name
- User email
- Custom tags
- Page visited
- Session data

---

## Optional Services

### Google Analytics (FREE)
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```
Get at: https://analytics.google.com

### Google reCAPTCHA (FREE)
```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=xxxxx
RECAPTCHA_SECRET_KEY=xxxxx
```
Get at: https://www.google.com/recaptcha/admin

### Pusher Real-time (FREE - 200k messages/day)
```env
NEXT_PUBLIC_PUSHER_KEY=xxxxx
PUSHER_SECRET=xxxxx
```
Get at: https://pusher.com

---

## Production Deployment

### Netlify
1. Go to Site Settings → Build & Deploy → Environment
2. Add all variables from your `.env.local`
3. Deploy!

### Vercel
1. Go to Project Settings → Environment Variables
2. Add all variables
3. Redeploy

### Cloudflare Pages
1. Go to Settings → Environment Variables
2. Add production variables
3. Redeploy

---

## Security Checklist

- ✅ Never commit `.env.local` to git
- ✅ Use different keys for dev/production
- ✅ Rotate secrets regularly
- ✅ Use environment-specific values
- ✅ Enable 2FA on all service accounts
- ✅ Keep API keys secret
- ✅ Monitor usage/billing

---

## Troubleshooting

### Clerk Not Working?
- Check publishable key starts with `pk_test_` or `pk_live_`
- Verify secret key starts with `sk_test_` or `sk_live_`
- Clear browser cache and cookies

### TMDB Not Loading Movies?
- Verify API key is 32 characters
- Check TMDB dashboard for usage limits
- Test API key at: https://www.themoviedb.org/settings/api

### MongoDB Connection Failed?
- Check connection string format
- Verify database user has read/write permissions
- Whitelist IP: 0.0.0.0/0 for development
- Check cluster is running (M0 free tier)

### OpenAI Errors?
- Verify API key starts with `sk-`
- Check credit balance at: https://platform.openai.com/account/usage
- Ensure billing is set up

### Tawk.to Widget Not Showing?
- Verify Property ID and Widget ID are correct
- Check `NEXT_PUBLIC_TAWK_ENABLED=true`
- Clear browser cache
- Check browser console for errors
- Verify widget is published in Tawk.to dashboard

---

## Cost Estimate (Monthly)

### FREE TIER ONLY
- Clerk: $0 (up to 10K users)
- TMDB: $0 (1000 requests/day)
- MongoDB: $0 (512MB storage)
- Tawk.to: $0 (unlimited)
- Google Analytics: $0
- Google reCAPTCHA: $0

### With OpenAI
- OpenAI: ~$5-20/month (depends on usage)
- gpt-4o-mini: ~$0.0001 per request
- 10,000 AI requests = ~$1

### Total: $0-20/month
Perfect for starting out! 🎉

---

## Need Help?

1. Check documentation in `/docs`
2. See troubleshooting section above
3. Visit service provider docs
4. Open GitHub issue
5. Contact support via Tawk.to chat widget!

---

**Last Updated:** October 2025

