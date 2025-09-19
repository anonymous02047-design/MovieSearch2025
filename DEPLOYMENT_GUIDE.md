# MovieSearch 2025 - Deployment Guide

## 🚀 Deployment Options

This guide covers deploying MovieSearch 2025 to three popular platforms:

1. **Vercel** (Recommended for Next.js)
2. **Netlify** 
3. **GitHub Pages**

## 📋 Pre-Deployment Checklist

### ✅ Environment Variables Setup

Create a `.env.local` file with the following variables:

```bash
# Copy from env.example and fill in your actual values
cp env.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk authentication
- `CLERK_SECRET_KEY` - Clerk secret key
- `NEXT_PUBLIC_TMDB_API_KEY` - TMDB API key
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` - Google reCAPTCHA site key
- `RECAPTCHA_SECRET_KEY` - Google reCAPTCHA secret key
- `NEXT_PUBLIC_TAWK_PROPERTY_ID` - Tawk.to property ID (optional)
- `NEXT_PUBLIC_TAWK_WIDGET_ID` - Tawk.to widget ID (optional)

### ✅ API Keys Setup

1. **Clerk Authentication**
   - Sign up at [clerk.com](https://clerk.com)
   - Create a new application
   - Copy publishable and secret keys

2. **TMDB API**
   - Sign up at [themoviedb.org](https://www.themoviedb.org/settings/api)
   - Request API key
   - Copy the API key

3. **Google reCAPTCHA**
   - Go to [Google reCAPTCHA](https://www.google.com/recaptcha/admin)
   - Create a new site
   - Copy site and secret keys

4. **Tawk.to (Optional)**
   - Sign up at [tawk.to](https://www.tawk.to)
   - Get property and widget IDs

## 🌐 Deployment Methods

### 1. Vercel Deployment (Recommended)

#### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
vercel env add CLERK_SECRET_KEY
vercel env add NEXT_PUBLIC_TMDB_API_KEY
vercel env add NEXT_PUBLIC_RECAPTCHA_SITE_KEY
vercel env add RECAPTCHA_SECRET_KEY
```

#### Option B: GitHub Integration
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard
5. Deploy automatically

### 2. Netlify Deployment

#### Option A: Netlify CLI
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=out
```

#### Option B: GitHub Integration
1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Connect your GitHub repository
4. Set build command: `npm run build`
5. Set publish directory: `out`
6. Add environment variables in Netlify dashboard

### 3. GitHub Pages Deployment

#### Automatic Deployment
1. Push your code to GitHub
2. Go to repository Settings > Pages
3. Select "GitHub Actions" as source
4. The workflow will automatically deploy on push to main branch

#### Manual Deployment
```bash
# Build the project
npm run build

# Deploy to GitHub Pages
npx gh-pages -d out
```

## 🔧 Build Configuration

The project is configured for static export with the following optimizations:

- **Static Export**: Enabled for GitHub Pages compatibility
- **Image Optimization**: Configured for TMDB images
- **Security Headers**: Added for production security
- **Bundle Optimization**: MUI components optimized
- **Console Removal**: Production builds remove console logs

## 🛡️ Security Considerations

### Environment Variables
- Never commit `.env.local` to version control
- Use platform-specific secret management
- Rotate API keys regularly

### Security Headers
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: origin-when-cross-origin
- Permissions-Policy: Restricted camera/microphone/geolocation

## 📊 Performance Optimization

### Build Optimizations
- Static export for faster loading
- Image optimization for TMDB images
- Bundle splitting for better caching
- Tree shaking for smaller bundles

### Runtime Optimizations
- Lazy loading for components
- Image lazy loading
- Code splitting by route
- Service worker for offline support

## 🔍 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check environment variables
   - Verify API keys are valid
   - Check for TypeScript errors

2. **Authentication Issues**
   - Verify Clerk configuration
   - Check domain settings in Clerk dashboard
   - Ensure proper redirect URLs

3. **API Issues**
   - Verify TMDB API key
   - Check rate limiting
   - Ensure CORS settings

4. **Image Loading Issues**
   - Check TMDB image URLs
   - Verify image optimization settings
   - Check network connectivity

### Debug Mode
```bash
# Run in development mode
npm run dev

# Check build output
npm run build

# Analyze bundle
npm run build && npx @next/bundle-analyzer
```

## 📱 Mobile Optimization

The app is fully responsive and optimized for mobile devices:
- Touch-friendly interface
- Mobile-first design
- Optimized images for mobile
- Fast loading on slow connections

## 🔄 Continuous Deployment

### GitHub Actions
- Automatic deployment on push to main
- Environment-specific builds
- Automated testing (if configured)

### Vercel/Netlify
- Automatic deployments from GitHub
- Preview deployments for pull requests
- Rollback capabilities

## 📞 Support

For deployment issues:
- Email: naushadalamprivate@gmail.com
- WhatsApp: +91 7209752686
- GitHub Issues: Create an issue in the repository

## 🎯 Post-Deployment Checklist

- [ ] Test all authentication flows
- [ ] Verify API integrations work
- [ ] Check mobile responsiveness
- [ ] Test search functionality
- [ ] Verify reCAPTCHA protection
- [ ] Check analytics (if enabled)
- [ ] Test contact forms
- [ ] Verify SEO meta tags
- [ ] Check performance scores
- [ ] Test error handling

---

**Happy Deploying! 🚀**
