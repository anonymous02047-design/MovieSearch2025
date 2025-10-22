# 🚀 Installation & Setup Guide

## Prerequisites

- Node.js 18+ 
- npm 8+
- TMDB API Key
- Clerk Account (for authentication)

## Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd MovieSearch2025
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# TMDB API
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Optional: Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_id
```

### 4. Get API Keys

#### TMDB API Key
1. Visit [TMDB](https://www.themoviedb.org/)
2. Create an account
3. Go to Settings > API
4. Request an API key
5. Copy your API key

#### Clerk API Keys
1. Visit [Clerk](https://clerk.com/)
2. Create an account
3. Create a new application
4. Copy your publishable and secret keys

### 5. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

### 6. Build for Production
```bash
npm run build
npm start
```

## Features Configuration

### Country Detection
The app automatically detects user location using:
- ipapi.co (primary)
- ip-api.com (fallback)
- Browser timezone (last resort)

No additional configuration needed!

### Local Storage Features
The following features use browser local storage:
- Watchlist
- Favorites
- Continue Watching
- User Reviews
- Language Preference
- Country Cache

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # TypeScript type checking
```

### Project Structure

```
MovieSearch2025/
├── src/
│   ├── app/                 # Next.js pages
│   │   ├── page.tsx        # Enhanced homepage
│   │   ├── browse/         # Genre browsing
│   │   ├── tv/             # TV shows
│   │   └── ...
│   ├── components/         # React components
│   │   ├── TVShowCard.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── TrendingSection.tsx
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   │   ├── useCountryDetection.ts
│   │   ├── useWatchlist.ts
│   │   └── ...
│   └── lib/                # Utilities
│       ├── tmdb.ts
│       ├── i18n.ts
│       └── ...
├── public/                 # Static files
└── ...
```

## Troubleshooting

### Common Issues

#### 1. API Rate Limiting
If you see rate limit errors:
- Wait a few minutes
- Check your TMDB API key
- Verify your request count

#### 2. Authentication Issues
- Verify Clerk keys in `.env.local`
- Check Clerk dashboard settings
- Clear browser cache

#### 3. Country Detection Not Working
- Check internet connection
- Try manual refresh
- Clear local storage

#### 4. Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Netlify
1. Build the project: `npm run build`
2. Upload `.next` folder
3. Configure environment variables
4. Deploy!

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## Performance Optimization

### Image Optimization
- Uses Next.js Image component
- Lazy loading enabled
- Responsive images

### Code Splitting
- Dynamic imports for large components
- Route-based splitting

### Caching Strategy
- API responses cached (24 hours)
- Country data cached (24 hours)
- Static assets cached indefinitely

## Security

### Best Practices Implemented
- Environment variables for secrets
- Rate limiting by country
- Input sanitization
- Secure authentication (Clerk)
- HTTPS recommended

## Support

For issues or questions:
1. Check [ENHANCEMENTS_2025.md](./ENHANCEMENTS_2025.md)
2. Check [FEATURES_SUMMARY.md](./FEATURES_SUMMARY.md)
3. Create an issue on GitHub

## License

MIT License - see LICENSE file

---

**Happy Coding!** 🎉

