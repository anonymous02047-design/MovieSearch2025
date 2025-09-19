'use client';

import Head from 'next/head';
import { useRouter } from 'next/navigation';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'movie' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  movie?: {
    title: string;
    year: number;
    rating: number;
    genre: string[];
    director: string;
    cast: string[];
    duration: string;
    description: string;
    poster: string;
  };
  structuredData?: any;
  noindex?: boolean;
  canonical?: string;
}

const defaultSEO = {
  title: 'MovieSearch 2025 - Advanced Movie Discovery Platform',
  description: 'Discover, search, and explore movies with advanced filtering and recommendations. Find your next favorite movie with our comprehensive database powered by TMDB API.',
  keywords: [
    'movies', 'movie search', 'movie discovery', 'film database', 'movie recommendations',
    'movie ratings', 'movie reviews', 'cinema', 'films', 'movie finder', 'TMDB',
    'movie search engine', 'movie database', 'film search', 'movie explorer'
  ],
  image: '/og-image.jpg',
  type: 'website' as const,
};

export default function SEO({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
  movie,
  structuredData,
  noindex = false,
  canonical,
}: SEOProps) {
  const router = useRouter();
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  
  const seoTitle = title ? `${title} | MovieSearch 2025` : defaultSEO.title;
  const seoDescription = description || defaultSEO.description;
  const seoImage = image || defaultSEO.image;
  const seoKeywords = [...defaultSEO.keywords, ...keywords].join(', ');
  
  // Generate structured data
  const generateStructuredData = () => {
    const baseStructuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': 'https://moviesearch2025.com/#website',
          url: 'https://moviesearch2025.com/',
          name: 'MovieSearch 2025',
          description: seoDescription,
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://moviesearch2025.com/?search={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
          }
        },
        {
          '@type': 'WebPage',
          '@id': currentUrl + '#webpage',
          url: currentUrl,
          name: seoTitle,
          isPartOf: {
            '@id': 'https://moviesearch2025.com/#website'
          },
          description: seoDescription,
          breadcrumb: {
            '@id': currentUrl + '#breadcrumb'
          }
        },
        {
          '@type': 'BreadcrumbList',
          '@id': currentUrl + '#breadcrumb',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://moviesearch2025.com/'
            }
          ]
        }
      ]
    };

    // Add movie-specific structured data
    if (movie) {
      baseStructuredData['@graph'].push({
        '@type': 'Movie',
        name: movie.title,
        description: movie.description,
        image: movie.poster,
        datePublished: movie.year.toString(),
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: movie.rating,
          bestRating: 10,
          worstRating: 1
        },
        genre: movie.genre,
        director: {
          '@type': 'Person',
          name: movie.director
        },
        actor: movie.cast.map(actor => ({
          '@type': 'Person',
          name: actor
        })),
        duration: movie.duration
      });
    }

    // Add article structured data
    if (type === 'article') {
      baseStructuredData['@graph'].push({
        '@type': 'Article',
        headline: seoTitle,
        description: seoDescription,
        image: seoImage,
        datePublished: publishedTime,
        dateModified: modifiedTime || publishedTime,
        author: {
          '@type': 'Person',
          name: author || 'MovieSearch Team'
        },
        publisher: {
          '@type': 'Organization',
          name: 'MovieSearch 2025',
          logo: {
            '@type': 'ImageObject',
            url: 'https://moviesearch2025.com/logo.png'
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': currentUrl
        }
      });
    }

    return structuredData || baseStructuredData;
  };

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="author" content="MovieSearch Team" />
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical || currentUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="MovieSearch 2025" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      <meta name="twitter:site" content="@MovieSearch2025" />
      <meta name="twitter:creator" content="@MovieSearch2025" />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#1976d2" />
      <meta name="msapplication-TileColor" content="#1976d2" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="MovieSearch 2025" />
      
      {/* Article specific meta tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && section && (
        <meta property="article:section" content={section} />
      )}
      {tags.length > 0 && (
        <>
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData())
        }}
      />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://image.tmdb.org" />
      <link rel="preconnect" href="https://api.themoviedb.org" />
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
    </Head>
  );
}
