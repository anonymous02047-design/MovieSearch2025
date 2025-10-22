/**
 * SEO Utilities
 * Helper functions for SEO optimization
 */

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

/**
 * Generate meta tags for a page
 */
export function generateMetaTags(metadata: SEOMetadata) {
  const {
    title,
    description,
    keywords = [],
    ogImage,
    ogType = 'website',
    canonical,
    noindex = false,
    nofollow = false,
  } = metadata;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://moviesearch2025.netlify.app';

  return {
    title,
    description,
    keywords: keywords.join(', '),
    openGraph: {
      title,
      description,
      type: ogType,
      images: ogImage ? [{ url: ogImage }] : [],
      url: canonical || baseUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
    alternates: {
      canonical: canonical || baseUrl,
    },
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
      },
    },
  };
}

/**
 * Generate JSON-LD structured data for movies
 */
export function generateMovieStructuredData(movie: {
  id: number;
  title: string;
  overview: string;
  poster_path?: string;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  genres?: Array<{ id: number; name: string }>;
  runtime?: number;
  director?: string;
  actors?: string[];
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://moviesearch2025.netlify.app';
  const imageBaseUrl = 'https://image.tmdb.org/t/p/w780';

  return {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    description: movie.overview,
    image: movie.poster_path ? `${imageBaseUrl}${movie.poster_path}` : undefined,
    datePublished: movie.release_date,
    aggregateRating: movie.vote_average
      ? {
          '@type': 'AggregateRating',
          ratingValue: movie.vote_average,
          ratingCount: movie.vote_count,
          bestRating: 10,
          worstRating: 0,
        }
      : undefined,
    genre: movie.genres?.map(g => g.name),
    duration: movie.runtime ? `PT${movie.runtime}M` : undefined,
    director: movie.director
      ? {
          '@type': 'Person',
          name: movie.director,
        }
      : undefined,
    actor: movie.actors?.map(actor => ({
      '@type': 'Person',
      name: actor,
    })),
    url: `${baseUrl}/movie/${movie.id}`,
  };
}

/**
 * Generate JSON-LD structured data for person
 */
export function generatePersonStructuredData(person: {
  id: number;
  name: string;
  biography?: string;
  profile_path?: string;
  birthday?: string;
  known_for_department?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://moviesearch2025.netlify.app';
  const imageBaseUrl = 'https://image.tmdb.org/t/p/w780';

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    description: person.biography,
    image: person.profile_path ? `${imageBaseUrl}${person.profile_path}` : undefined,
    birthDate: person.birthday,
    jobTitle: person.known_for_department,
    url: `${baseUrl}/person/${person.id}`,
  };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/**
 * Optimize page title for SEO
 */
export function optimizeTitle(title: string, siteName: string = 'MovieSearch 2025'): string {
  const maxLength = 60;
  
  if (title.length > maxLength) {
    return title.substring(0, maxLength - 3) + '...';
  }
  
  return `${title} | ${siteName}`;
}

/**
 * Optimize meta description for SEO
 */
export function optimizeDescription(description: string): string {
  const maxLength = 160;
  
  if (description.length > maxLength) {
    return description.substring(0, maxLength - 3) + '...';
  }
  
  return description;
}

/**
 * Generate keywords from text
 */
export function extractKeywords(text: string, maxKeywords: number = 10): string[] {
  // Simple keyword extraction (in production, use NLP library)
  const words = text.toLowerCase()
    .split(/\W+/)
    .filter(word => word.length > 3);
  
  // Remove duplicates and limit
  const uniqueWords = Array.from(new Set(words));
  return uniqueWords.slice(0, maxKeywords);
}

