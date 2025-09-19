import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MovieSearch 2025 - Advanced Movie Discovery Platform',
    short_name: 'MovieSearch 2025',
    description: 'Discover, search, and explore movies with advanced filtering and recommendations. Find your next favorite movie with our comprehensive database powered by TMDB API.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1976d2',
    orientation: 'portrait-primary',
    categories: ['entertainment', 'movies', 'tv', 'lifestyle'],
    lang: 'en',
    dir: 'ltr',
    scope: '/',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png'
      }
    ],
    screenshots: [
      {
        src: '/screenshot-desktop.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'MovieSearch 2025 Desktop View'
      },
      {
        src: '/screenshot-mobile.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'MovieSearch 2025 Mobile View'
      }
    ],
    shortcuts: [
      {
        name: 'Search Movies',
        short_name: 'Search',
        description: 'Search for movies and TV shows',
        url: '/?search=',
        icons: [
          {
            src: '/icon-search.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      },
      {
        name: 'Trending',
        short_name: 'Trending',
        description: 'View trending movies and TV shows',
        url: '/trending',
        icons: [
          {
            src: '/icon-trending.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      },
      {
        name: 'Profile',
        short_name: 'Profile',
        description: 'View your profile and preferences',
        url: '/profile',
        icons: [
          {
            src: '/icon-profile.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      }
    ],
    related_applications: [
      {
        platform: 'webapp',
        url: 'https://moviesearch2025.com/manifest.json'
      }
    ],
    prefer_related_applications: false
  }
}
