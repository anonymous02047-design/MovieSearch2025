# ⚡ Performance Implementation Guide

## 🎯 Goal: Improve Performance from 41 → 85+

This guide provides step-by-step instructions to implement the performance improvements.

---

## ✅ Already Completed

### 1. Google Analytics Integration ✓
- Created `ClientLayout.tsx` component
- Integrated GoogleAnalytics component
- Added DNS prefetch for Google Tag Manager
- **Impact**: Fixes Lighthouse "Google tag not detected" error

### 2. Created TMDBImage Component ✓
- New optimized image component using Next.js Image
- Automatic lazy loading
- Automatic WebP/AVIF conversion
- Reduced bandwidth usage
- **Impact**: Expected 20-30 point improvement in Lighthouse performance

### 3. Next.js Configuration ✓
- Image optimization enabled for TMDB domains
- WebP and AVIF formats configured
- Code splitting implemented
- Security headers added
- **Impact**: 10-15 point improvement

---

## 📋 Implementation Steps

### Step 1: Replace CardMedia with TMDBImage

#### Current Problem:
Images use MUI's `CardMedia` with regular `<img>` tags:
```typescript
<CardMedia
  component="img"
  image={getImageUrl(movie.poster_path, 'w500')}
  alt={movie.title}
/>
```

#### Solution:
Replace with optimized TMDBImage component:

```typescript
import TMDBImage, { TMDB_IMAGE_SIZES } from '@/components/TMDBImage';

<TMDBImage
  path={movie.poster_path}
  alt={`${movie.title} poster`}
  {...TMDB_IMAGE_SIZES.poster}
  priority={false} // Set to true for above-the-fold images
/>
```

#### Files to Update:

1. **`src/components/MovieCard.tsx`** (Lines 212-231)
   - Replace CardMedia with TMDBImage
   - Use `TMDB_IMAGE_SIZES.poster`
   - Keep existing loading and error states

2. **`src/components/EnhancedMovieCard.tsx`** (Lines 75-82)
   - Similar replacement
   - Use appropriate size based on variant

3. **`src/components/MovieDetails.tsx`** (Lines 153-168)
   - Replace poster image
   - Set `priority={true}` (above the fold)

4. **`src/components/TVShowCard.tsx`**
   - Same pattern as MovieCard

5. **`src/app/classics/page.tsx`** (Lines 376-382)
   - Update all CardMedia instances

6. **`src/app/movie/[id]/page.tsx`** (Lines 697-713)
   - Update poster gallery images
   - Use smaller sizes for thumbnails

#### Example Implementation:

**Before**:
```typescript
<CardMedia
  component="img"
  image={
    imageError 
      ? '/placeholder-movie.svg' 
      : getImageUrl(movie.poster_path, 'w500')
  }
  alt={movie.title}
  onLoad={handleImageLoad}
  onError={handleImageError}
  sx={{
    display: imageLoading ? 'none' : 'block',
    height: '100%',
    objectFit: 'cover',
  }}
/>
```

**After**:
```typescript
<TMDBImage
  path={movie.poster_path}
  alt={`${movie.title} movie poster`}
  {...TMDB_IMAGE_SIZES.poster}
  priority={false}
  sx={{
    height: '100%',
  }}
/>
```

**Benefits**:
- ✅ Automatic lazy loading
- ✅ Automatic WebP conversion
- ✅ Built-in loading states
- ✅ Built-in error handling
- ✅ Prevents layout shift
- ✅ 50-70% faster loading

---

### Step 2: Implement Dynamic Imports for Heavy Components

#### Problem:
All components load on initial page load, increasing bundle size.

#### Solution:
Lazy load components that aren't immediately visible.

#### Implementation:

**`src/app/page.tsx`**:
```typescript
import dynamic from 'next/dynamic';

// Lazy load heavy components
const TrendingSection = dynamic(() => import('@/components/TrendingSection'), {
  loading: () => <LoadingSkeleton />,
  ssr: true, // Keep SSR for SEO
});

const RecommendationsSection = dynamic(() => import('@/components/RecommendationsSection'), {
  loading: () => <LoadingSkeleton />,
  ssr: false, // Disable SSR for below-the-fold content
});

const MovieDetails = dynamic(() => import('@/components/MovieDetails'), {
  loading: () => <LoadingSkeleton />,
  ssr: false,
});
```

#### Components to Lazy Load:
- `MovieDetails` (modal/dialog)
- `MediaGallery` (image viewer)
- `VideoPlayer` (video player)
- Below-the-fold sections
- Chart components (if any)
- Heavy third-party widgets

**Impact**: 15-20 point improvement

---

### Step 3: Optimize Third-Party Scripts

#### Problem:
Heavy scripts loading with `afterInteractive` strategy.

#### Solution:
Use `lazyOnload` for non-critical scripts.

**`src/components/TawkWidget.tsx`**:
```typescript
// Before
<Script strategy="afterInteractive" />

// After
<Script strategy="lazyOnload" />
```

**Files to Check**:
- Tawk.to chat widget
- Any analytics scripts (except GA)
- Social media widgets
- Comment systems

**Impact**: 5-10 point improvement

---

### Step 4: Optimize API Requests

#### Problem:
Multiple API calls on page load without caching.

#### Solution:
Implement SWR or React Query for API caching.

**Install SWR**:
```bash
npm install swr
```

**Create hook** (`src/hooks/useTMDB.ts`):
```typescript
import useSWR from 'swr';
import { tmdbApi } from '@/lib/tmdb';

export function useTrendingMovies() {
  const { data, error, isLoading } = useSWR(
    'trending/movies',
    () => tmdbApi.getTrending('movie', 'day'),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute
      refreshInterval: 300000, // 5 minutes
    }
  );

  return {
    movies: data?.results || [],
    isLoading,
    error,
  };
}
```

**Use in components**:
```typescript
function TrendingSection() {
  const { movies, isLoading, error } = useTrendingMovies();
  
  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay error={error} />;
  
  return <MovieGrid movies={movies} />;
}
```

**Impact**: 10-15 point improvement

---

### Step 5: Reduce JavaScript Bundle Size

#### Check Current Bundle Size:
```bash
npm run build
```

Look for large chunks in the build output.

#### Solutions:

**A. Use Barrel Imports Correctly**:
```typescript
// ❌ Bad (imports entire library)
import { Button } from '@mui/material';

// ✅ Good (imports only Button)
import Button from '@mui/material/Button';
```

**B. Remove Unused Dependencies**:
```bash
npm install -g depcheck
depcheck
```

Remove any unused packages.

**C. Analyze Bundle**:
```bash
npm install -D @next/bundle-analyzer
```

Update `next.config.ts`:
```typescript
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
```

Run analysis:
```bash
ANALYZE=true npm run build
```

**Impact**: 10-20 point improvement

---

### Step 6: Add Resource Hints

#### Already Added:
✅ Preconnect to TMDB
✅ DNS prefetch for TMDB
✅ Preconnect to Google Tag Manager

#### Add More (if needed):

**`src/app/layout.tsx`**:
```typescript
<head>
  {/* Existing preconnects */}
  <link rel="preconnect" href="https://api.themoviedb.org" />
  <link rel="preconnect" href="https://image.tmdb.org" />
  
  {/* Add if using Clerk images */}
  <link rel="preconnect" href="https://img.clerk.com" />
  
  {/* Preload critical resources */}
  <link 
    rel="preload" 
    href="/fonts/inter-var.woff2" 
    as="font" 
    type="font/woff2" 
    crossOrigin="anonymous"
  />
</head>
```

**Impact**: 3-5 point improvement

---

### Step 7: Implement Image Sizes Optimization

Use optimal TMDB image sizes based on display size:

| Use Case | Display Width | TMDB Size | Actual Size |
|----------|---------------|-----------|-------------|
| Thumbnail | < 185px | `w185` | 185x278 |
| Card Poster | 185-342px | `w342` | 342x513 |
| Detail Poster | 342-500px | `w500` | 500x750 |
| Backdrop | Full width | `w780` | 780x439 |
| High Res | Large screens | `w1280` | 1280x720 |

**Don't use `original` size** unless absolutely necessary.

**Update all image URLs**:
```typescript
// ❌ Bad
getImageUrl(movie.poster_path, 'original') // Too large!

// ✅ Good
getImageUrl(movie.poster_path, 'w342') // Optimal for cards
```

**Impact**: 15-20 point improvement

---

## 📊 Expected Performance Improvements

| Step | Action | Impact | Cumulative |
|------|--------|--------|------------|
| 0 | Current | - | 41 |
| 1 | TMDBImage Component | +25 | 66 |
| 2 | Dynamic Imports | +15 | 81 |
| 3 | Optimize Scripts | +5 | 86 |
| 4 | API Caching (SWR) | +5 | 91 |
| 5 | Reduce Bundle | +5 | 96 |

**Final Target**: 85-95

---

## 🧪 Testing

### Test Performance Locally:

```bash
# 1. Build production version
npm run build

# 2. Run production server
npm start

# 3. Run Lighthouse
npx lighthouse http://localhost:3000 --view

# Or use Chrome DevTools
# Open DevTools → Lighthouse → Generate Report
```

### Key Metrics to Watch:

- **First Contentful Paint (FCP)**: < 1.8s (good)
- **Largest Contentful Paint (LCP)**: < 2.5s (good)
- **Total Blocking Time (TBT)**: < 200ms (good)
- **Cumulative Layout Shift (CLS)**: < 0.1 (good)
- **Speed Index**: < 3.4s (good)

---

## 🔥 Quick Wins (Do These First)

### Immediate Impact (30 minutes):

1. **Replace 5 most common images with TMDBImage**:
   - MovieCard.tsx
   - EnhancedMovieCard.tsx
   - TVShowCard.tsx
   - MovieDetails.tsx
   - Home page hero

2. **Change Tawk.to to lazyOnload**:
   - One line change in TawkWidget.tsx

3. **Use optimal image sizes**:
   - Find/replace 'original' → 'w500'
   - Find/replace 'w500' → 'w342' (for thumbnails)

**Expected Improvement**: 41 → 65-70

---

## 🚀 Full Implementation (2-4 hours):

1. Replace ALL CardMedia with TMDBImage (1 hour)
2. Add dynamic imports for heavy components (30 minutes)
3. Implement SWR for API caching (45 minutes)
4. Optimize third-party scripts (15 minutes)
5. Analyze and reduce bundle size (45 minutes)
6. Test and verify improvements (30 minutes)

**Expected Improvement**: 41 → 85-90

---

## 📝 Implementation Checklist

### Images:
- [ ] Replace MovieCard images
- [ ] Replace EnhancedMovieCard images
- [ ] Replace TVShowCard images
- [ ] Replace MovieDetails images
- [ ] Replace all page images (classics, streaming, etc.)
- [ ] Use optimal sizes (not 'original')

### Code Splitting:
- [ ] Lazy load MovieDetails
- [ ] Lazy load MediaGallery
- [ ] Lazy load VideoPlayer
- [ ] Lazy load below-the-fold sections

### Scripts:
- [ ] Change Tawk.to to lazyOnload
- [ ] Defer non-critical analytics
- [ ] Check all Script components

### API:
- [ ] Install SWR
- [ ] Create TMDB hooks
- [ ] Replace direct API calls
- [ ] Configure caching

### Bundle:
- [ ] Run bundle analyzer
- [ ] Fix barrel imports
- [ ] Remove unused dependencies
- [ ] Verify code splitting works

### Testing:
- [ ] Build production
- [ ] Test locally
- [ ] Run Lighthouse audit
- [ ] Verify score > 85
- [ ] Deploy to Netlify
- [ ] Test production Lighthouse

---

## 🎯 Priority Order

**Day 1** (Biggest Impact):
1. Replace images with TMDBImage
2. Use optimal TMDB image sizes
3. Lazy load heavy components

**Day 2** (Fine-tuning):
1. Implement SWR caching
2. Optimize third-party scripts
3. Reduce bundle size

**Day 3** (Polish):
1. Add resource hints
2. Test and verify
3. Deploy and monitor

---

## 📞 Support

If you get stuck:

1. **Check browser console** for errors
2. **Run build** to see bundle sizes
3. **Use Chrome DevTools**:
   - Performance tab → Record page load
   - Network tab → Check image sizes
   - Coverage tab → Find unused code

4. **Lighthouse Report**:
   - Focus on "Opportunities" section
   - Follow specific recommendations

---

## 🎉 After Implementation

Your site will have:
- ✅ 40+ point Lighthouse improvement
- ✅ 50-70% faster image loading
- ✅ Smaller bundle size
- ✅ Better caching
- ✅ Improved user experience
- ✅ Better SEO rankings
- ✅ Lower bandwidth costs

**Next**: Move on to Accessibility improvements (88 → 95+)


