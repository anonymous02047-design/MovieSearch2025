import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://ladlihub.in';
  const currentDate = new Date().toISOString();

  // Define all the pages with their priorities and change frequencies
  const pages = [
    // High priority pages
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: '/popular', priority: '0.9', changefreq: 'daily' },
    { url: '/top-rated', priority: '0.9', changefreq: 'weekly' },
    { url: '/now-playing', priority: '0.9', changefreq: 'daily' },
    { url: '/actors', priority: '0.8', changefreq: 'weekly' },
    { url: '/directors', priority: '0.8', changefreq: 'weekly' },
    { url: '/genres', priority: '0.8', changefreq: 'monthly' },
    { url: '/search', priority: '0.8', changefreq: 'daily' },
    { url: '/trending', priority: '0.8', changefreq: 'daily' },
    
    // Medium priority pages
    { url: '/upcoming', priority: '0.7', changefreq: 'weekly' },
    { url: '/profile', priority: '0.7', changefreq: 'weekly' },
    { url: '/favorites', priority: '0.7', changefreq: 'weekly' },
    { url: '/watchlist', priority: '0.7', changefreq: 'weekly' },
    { url: '/recommendations', priority: '0.7', changefreq: 'weekly' },
    { url: '/collections', priority: '0.6', changefreq: 'monthly' },
    { url: '/studios', priority: '0.6', changefreq: 'monthly' },
    { url: '/awards', priority: '0.6', changefreq: 'monthly' },
    { url: '/festivals', priority: '0.6', changefreq: 'monthly' },
    { url: '/history', priority: '0.6', changefreq: 'weekly' },
    { url: '/classics', priority: '0.6', changefreq: 'monthly' },
    { url: '/indie-films', priority: '0.6', changefreq: 'monthly' },
    { url: '/box-office', priority: '0.6', changefreq: 'weekly' },
    { url: '/streaming', priority: '0.6', changefreq: 'weekly' },
    { url: '/languages', priority: '0.6', changefreq: 'monthly' },
    { url: '/decades', priority: '0.6', changefreq: 'monthly' },
    
    // Support and information pages
    { url: '/about', priority: '0.5', changefreq: 'monthly' },
    { url: '/contact', priority: '0.5', changefreq: 'monthly' },
    { url: '/help', priority: '0.5', changefreq: 'monthly' },
    { url: '/sitemap', priority: '0.5', changefreq: 'weekly' },
    { url: '/privacy', priority: '0.4', changefreq: 'yearly' },
    { url: '/terms', priority: '0.4', changefreq: 'yearly' },
    { url: '/cookies', priority: '0.4', changefreq: 'yearly' },
    { url: '/gdpr', priority: '0.4', changefreq: 'yearly' },
    { url: '/data-protection', priority: '0.4', changefreq: 'yearly' },
    { url: '/accessibility', priority: '0.4', changefreq: 'yearly' },
    { url: '/security', priority: '0.4', changefreq: 'yearly' },
    { url: '/dmca', priority: '0.4', changefreq: 'yearly' },
    { url: '/content-guidelines', priority: '0.4', changefreq: 'yearly' },
    { url: '/user-agreement', priority: '0.4', changefreq: 'yearly' },
    
    // Additional pages
    { url: '/bug-report', priority: '0.3', changefreq: 'monthly' },
    { url: '/feedback', priority: '0.3', changefreq: 'monthly' },
    { url: '/tech-specs', priority: '0.3', changefreq: 'monthly' },
    { url: '/api-docs', priority: '0.3', changefreq: 'monthly' },
    { url: '/crew', priority: '0.3', changefreq: 'monthly' },
    { url: '/celebrity-news', priority: '0.3', changefreq: 'daily' },
    { url: '/similar', priority: '0.3', changefreq: 'weekly' },
    { url: '/reviews', priority: '0.3', changefreq: 'daily' },
    { url: '/settings', priority: '0.3', changefreq: 'monthly' },
    { url: '/notifications', priority: '0.3', changefreq: 'monthly' },
    
    // Genre pages
    { url: '/genre/action', priority: '0.5', changefreq: 'weekly' },
    { url: '/genre/comedy', priority: '0.5', changefreq: 'weekly' },
    { url: '/genre/drama', priority: '0.5', changefreq: 'weekly' },
    { url: '/genre/horror', priority: '0.5', changefreq: 'weekly' },
    { url: '/genre/romance', priority: '0.5', changefreq: 'weekly' },
    { url: '/genre/sci-fi', priority: '0.5', changefreq: 'weekly' },
    { url: '/genre/documentary', priority: '0.5', changefreq: 'weekly' },
    { url: '/genre/animation', priority: '0.5', changefreq: 'weekly' },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
