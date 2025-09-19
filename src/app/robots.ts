import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/profile/manage/',
        '/_next/',
        '/private/',
      ],
    },
    sitemap: 'https://moviesearch2025.com/sitemap.xml',
  }
}
