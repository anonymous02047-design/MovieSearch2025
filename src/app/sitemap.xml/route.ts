/**
 * Dynamic XML Sitemap Generator
 * Generates sitemap.xml with all pages and dynamic routes
 */

import { NextResponse } from 'next/server';
import { tmdbApi } from '@/lib/tmdb';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://moviesearch2025.netlify.app';

interface SitemapURL {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

function generateSitemapXML(urls: SitemapURL[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
}

export async function GET() {
  try {
    const currentDate = new Date().toISOString();
    const urls: SitemapURL[] = [];

    // Static pages
    const staticPages = [
      { path: '', priority: 1.0, changefreq: 'daily' as const },
      { path: '/discover', priority: 0.9, changefreq: 'daily' as const },
      { path: '/browse', priority: 0.9, changefreq: 'daily' as const },
      { path: '/trending', priority: 0.9, changefreq: 'hourly' as const },
      { path: '/popular', priority: 0.8, changefreq: 'daily' as const },
      { path: '/top-rated', priority: 0.8, changefreq: 'weekly' as const },
      { path: '/now-playing', priority: 0.8, changefreq: 'daily' as const },
      { path: '/upcoming', priority: 0.8, changefreq: 'daily' as const },
      { path: '/genres', priority: 0.7, changefreq: 'weekly' as const },
      { path: '/actors', priority: 0.7, changefreq: 'weekly' as const },
      { path: '/directors', priority: 0.7, changefreq: 'weekly' as const },
      { path: '/tv', priority: 0.7, changefreq: 'daily' as const },
      { path: '/collections', priority: 0.6, changefreq: 'weekly' as const },
      { path: '/studios', priority: 0.6, changefreq: 'monthly' as const },
      { path: '/festivals', priority: 0.6, changefreq: 'monthly' as const },
      { path: '/awards', priority: 0.6, changefreq: 'monthly' as const },
      { path: '/decades', priority: 0.6, changefreq: 'monthly' as const },
      { path: '/classics', priority: 0.6, changefreq: 'monthly' as const },
      { path: '/indie-films', priority: 0.6, changefreq: 'weekly' as const },
      { path: '/box-office', priority: 0.7, changefreq: 'weekly' as const },
      { path: '/streaming', priority: 0.6, changefreq: 'weekly' as const },
      { path: '/languages', priority: 0.5, changefreq: 'monthly' as const },
      { path: '/advanced-search', priority: 0.7, changefreq: 'monthly' as const },
      { path: '/about', priority: 0.5, changefreq: 'monthly' as const },
      { path: '/contact', priority: 0.5, changefreq: 'monthly' as const },
      { path: '/privacy', priority: 0.4, changefreq: 'yearly' as const },
      { path: '/terms', priority: 0.4, changefreq: 'yearly' as const },
      { path: '/help', priority: 0.5, changefreq: 'monthly' as const },
    ];

    staticPages.forEach(page => {
      urls.push({
        loc: `${BASE_URL}${page.path}`,
        lastmod: currentDate,
        changefreq: page.changefreq,
        priority: page.priority,
      });
    });

    // Dynamic movie pages from TMDB
    try {
      const [popular, topRated, nowPlaying] = await Promise.all([
        tmdbApi.getPopularMovies(1),
        tmdbApi.getTopRatedMovies(1),
        tmdbApi.getNowPlayingMovies(1),
      ]);

      const movies = new Set<number>();
      
      // Add movies from different lists
      [popular, topRated, nowPlaying].forEach(response => {
        if (response?.results) {
          response.results.slice(0, 20).forEach((movie: any) => {
            movies.add(movie.id);
          });
        }
      });

      // Add movie URLs
      movies.forEach(movieId => {
        urls.push({
          loc: `${BASE_URL}/movie/${movieId}`,
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: 0.7,
        });
      });

      // Add TV show URLs
      const tvShows = await tmdbApi.getPopularTV(1);
      if (tvShows?.results) {
        tvShows.results.slice(0, 20).forEach((show: any) => {
          urls.push({
            loc: `${BASE_URL}/tv/${show.id}`,
            lastmod: currentDate,
            changefreq: 'weekly',
            priority: 0.7,
          });
        });
      }

      // Add popular actors
      const actors = await tmdbApi.getPopularPeople(1);
      if (actors?.results) {
        actors.results.slice(0, 20).forEach((person: any) => {
          urls.push({
            loc: `${BASE_URL}/person/${person.id}`,
            lastmod: currentDate,
            changefreq: 'monthly',
            priority: 0.6,
          });
        });
      }
    } catch (error) {
      console.error('Error fetching TMDB data for sitemap:', error);
      // Continue with static pages even if TMDB fetch fails
    }

    const sitemapXML = generateSitemapXML(urls);

    return new NextResponse(sitemapXML, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}

