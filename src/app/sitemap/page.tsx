import React from 'react';
import { Metadata } from 'next';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Stack,
  Chip,
} from '@mui/material';
import {
  Home as HomeIcon,
  Map as SitemapIcon,
  Movie as MovieIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  AccountCircle as AccountIcon,
  Support as SupportIcon,
  Security as SecurityIcon,
  Search as SearchIcon,
  TrendingUp as TrendingIcon,
  Star as StarIcon,
  Theaters as TheaterIcon,
  Language as LanguageIcon,
  Timeline as TimelineIcon,
  Public as PublicIcon,
} from '@mui/icons-material';
import SitemapSection from '@/components/SitemapSection';

export const metadata: Metadata = {
  title: 'Site Map - MovieSearch 2025 | Complete Navigation Guide',
  description: 'Complete site map for MovieSearch 2025. Find all movies, actors, directors, genres, and features. Navigate easily through our comprehensive movie database.',
  keywords: [
    'sitemap',
    'movie search',
    'navigation',
    'movies',
    'actors',
    'directors',
    'genres',
    'entertainment',
    'film database',
    'movie discovery',
    'ladlihub.in'
  ],
  openGraph: {
    title: 'Site Map - MovieSearch 2025',
    description: 'Complete site map for MovieSearch 2025. Find all movies, actors, directors, genres, and features.',
    url: 'https://ladlihub.in/sitemap',
    siteName: 'MovieSearch 2025',
    type: 'website',
    images: [
      {
        url: 'https://ladlihub.in/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MovieSearch 2025 Site Map',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Site Map - MovieSearch 2025',
    description: 'Complete site map for MovieSearch 2025. Find all movies, actors, directors, genres, and features.',
    images: ['https://ladlihub.in/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://ladlihub.in/sitemap',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function SitemapPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/', icon: <HomeIcon /> },
    { label: 'Site Map', href: '/sitemap', icon: <SitemapIcon /> },
  ];

  const quickStats = [
    { label: 'Total Pages', value: '50+', color: 'primary' },
    { label: 'Movie Categories', value: '20+', color: 'secondary' },
    { label: 'Actor Profiles', value: '1000+', color: 'success' },
    { label: 'Director Profiles', value: '500+', color: 'info' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Header Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Breadcrumbs
            sx={{ mb: 3, '& .MuiBreadcrumbs-separator': { color: 'rgba(255,255,255,0.7)' } }}
          >
            {breadcrumbs.map((breadcrumb, index) => (
              <Link
                key={breadcrumb.label}
                href={breadcrumb.href}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: index === breadcrumbs.length - 1 ? 'white' : 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                {breadcrumb.icon}
                {breadcrumb.label}
              </Link>
            ))}
          </Breadcrumbs>

          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <SitemapIcon sx={{ fontSize: 48 }} />
            <Box>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Complete Site Map
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Navigate through all pages and features of MovieSearch 2025
              </Typography>
            </Box>
          </Stack>

          {/* Quick Stats */}
          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
            {quickStats.map((stat) => (
              <Chip
                key={stat.label}
                label={`${stat.label}: ${stat.value}`}
                color={stat.color as any}
                variant="outlined"
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              />
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Introduction */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            Explore Our Complete Movie Database
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 800, mx: 'auto' }}>
            MovieSearch 2025 offers a comprehensive platform for discovering movies, TV shows, actors, 
            directors, and more. Use this site map to navigate through all our features and find exactly 
            what you're looking for.
          </Typography>
        </Box>

        {/* Sitemap Component */}
        <SitemapSection />

        {/* SEO Information */}
        <Box sx={{ mt: 8, p: 4, backgroundColor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mb: 3 }}>
            SEO & Navigation Information
          </Typography>
          <Stack spacing={2}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <strong>Total Pages:</strong> 50+ pages covering movies, actors, directors, genres, and user features
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <strong>Priority Levels:</strong> High priority pages are marked for better user experience and SEO
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <strong>Mobile Friendly:</strong> All pages are fully responsive and optimized for mobile devices
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <strong>Search Engine Optimized:</strong> All pages include proper meta tags, structured data, and SEO best practices
            </Typography>
          </Stack>
        </Box>

        {/* Quick Links */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mb: 3 }}>
            Quick Access Links
          </Typography>
          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
            <Link href="/popular" sx={{ textDecoration: 'none' }}>
              <Chip
                icon={<TrendingIcon />}
                label="Popular Movies"
                color="primary"
                variant="outlined"
                clickable
              />
            </Link>
            <Link href="/actors" sx={{ textDecoration: 'none' }}>
              <Chip
                icon={<PersonIcon />}
                label="Popular Actors"
                color="secondary"
                variant="outlined"
                clickable
              />
            </Link>
            <Link href="/directors" sx={{ textDecoration: 'none' }}>
              <Chip
                icon={<PersonIcon />}
                label="Famous Directors"
                color="success"
                variant="outlined"
                clickable
              />
            </Link>
            <Link href="/genres" sx={{ textDecoration: 'none' }}>
              <Chip
                icon={<CategoryIcon />}
                label="Movie Genres"
                color="info"
                variant="outlined"
                clickable
              />
            </Link>
            <Link href="/profile" sx={{ textDecoration: 'none' }}>
              <Chip
                icon={<AccountIcon />}
                label="My Profile"
                color="warning"
                variant="outlined"
                clickable
              />
            </Link>
            <Link href="/contact" sx={{ textDecoration: 'none' }}>
              <Chip
                icon={<SupportIcon />}
                label="Contact Us"
                color="error"
                variant="outlined"
                clickable
              />
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
