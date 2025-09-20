#!/usr/bin/env node

/**
 * Production Optimization Script
 * This script optimizes the app for production deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting production optimization...');

// 1. Create optimized package.json scripts
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add production scripts
packageJson.scripts = {
  ...packageJson.scripts,
  'build:production': 'NODE_ENV=production next build',
  'start:production': 'NODE_ENV=production next start',
  'analyze': 'ANALYZE=true next build',
  'lint:fix': 'next lint --fix',
  'type-check': 'tsc --noEmit',
  'optimize': 'node scripts/optimize-production.js',
};

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('✅ Updated package.json with production scripts');

// 2. Create production environment template
const envTemplate = `# Production Environment Variables
# Copy this to .env.local and fill in your actual values

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# TMDB API
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here

# Tawk.to Chat
NEXT_PUBLIC_TAWK_PROPERTY_ID=your_tawk_property_id_here
NEXT_PUBLIC_TAWK_WIDGET_ID=your_tawk_widget_id_here

# Production Settings
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
`;

fs.writeFileSync(path.join(process.cwd(), '.env.production'), envTemplate);
console.log('✅ Created .env.production template');

// 3. Create robots.txt for SEO
const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://your-domain.com/sitemap.xml

# Disallow admin and API routes
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /profile/manage/
`;

fs.writeFileSync(path.join(process.cwd(), 'public', 'robots.txt'), robotsTxt);
console.log('✅ Created robots.txt');

// 4. Create sitemap.xml template
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-domain.com/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://your-domain.com/movies/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://your-domain.com/tv/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://your-domain.com/trending/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://your-domain.com/about/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://your-domain.com/contact/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`;

fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemapXml);
console.log('✅ Created sitemap.xml template');

// 5. Create performance monitoring script
const performanceScript = `// Performance monitoring
if (typeof window !== 'undefined') {
  // Core Web Vitals monitoring
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });

  // Performance observer
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          console.log('Navigation timing:', entry);
        }
      }
    });
    observer.observe({ entryTypes: ['navigation'] });
  }
}`;

fs.writeFileSync(path.join(process.cwd(), 'src', 'lib', 'performance.ts'), performanceScript);
console.log('✅ Created performance monitoring script');

// 6. Create deployment checklist
const deploymentChecklist = `# 🚀 Production Deployment Checklist

## Pre-Deployment
- [ ] All environment variables configured
- [ ] API keys are valid and active
- [ ] Database connections tested
- [ ] All pages load without errors
- [ ] Authentication working properly
- [ ] Image uploads functioning
- [ ] Contact forms working
- [ ] reCAPTCHA configured
- [ ] Analytics tracking setup

## Security
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] CORS settings appropriate
- [ ] Rate limiting implemented
- [ ] Input validation in place
- [ ] SQL injection protection
- [ ] XSS protection enabled

## Performance
- [ ] Images optimized
- [ ] Code splitting implemented
- [ ] Caching configured
- [ ] CDN setup (if applicable)
- [ ] Bundle size optimized
- [ ] Core Web Vitals acceptable

## SEO
- [ ] Meta tags configured
- [ ] Open Graph tags set
- [ ] Twitter Card tags set
- [ ] Sitemap.xml generated
- [ ] Robots.txt configured
- [ ] Structured data implemented

## Testing
- [ ] All pages tested
- [ ] Mobile responsiveness verified
- [ ] Cross-browser compatibility
- [ ] Accessibility compliance
- [ ] Performance benchmarks met

## Post-Deployment
- [ ] Monitor error logs
- [ ] Check analytics data
- [ ] Verify all functionality
- [ ] Test user flows
- [ ] Monitor performance metrics

## Backup & Recovery
- [ ] Database backups configured
- [ ] Code repository backed up
- [ ] Environment variables documented
- [ ] Rollback plan prepared
`;

fs.writeFileSync(path.join(process.cwd(), 'DEPLOYMENT_CHECKLIST.md'), deploymentChecklist);
console.log('✅ Created deployment checklist');

console.log('🎉 Production optimization complete!');
console.log('');
console.log('Next steps:');
console.log('1. Review and update .env.production with your actual values');
console.log('2. Update sitemap.xml with your actual domain');
console.log('3. Test the build: npm run build:production');
console.log('4. Follow the deployment checklist in DEPLOYMENT_CHECKLIST.md');
console.log('');
console.log('Happy deploying! 🚀');
