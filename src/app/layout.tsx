import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Box, Typography } from "@mui/material";
import { CustomThemeProvider } from "@/contexts/ThemeContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import AdminLayoutWrapper from "@/components/AdminLayoutWrapper";
import { RecaptchaProvider } from "@/components/RecaptchaProvider";
import { TawkProvider } from "@/components/TawkProvider";
import OfflineSupport from "@/components/OfflineSupport";
import CookiesConsent from "@/components/CookiesConsent";
import AccessibilityReset from "@/components/AccessibilityReset";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";
import "../styles/accessibility.css";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "MovieSearch 2025 - Advanced Movie Discovery Platform",
    template: "%s | MovieSearch 2025"
  },
  description: "Discover, search, and explore movies with advanced filtering and recommendations. Find your next favorite movie with our comprehensive database powered by TMDB API.",
  keywords: [
    "movies", "movie search", "movie discovery", "film database", "movie recommendations",
    "movie ratings", "movie reviews", "cinema", "films", "movie finder", "TMDB",
    "movie search engine", "movie database", "film search", "movie explorer"
  ],
  authors: [{ name: "MovieSearch Team" }],
  creator: "MovieSearch Team",
  publisher: "MovieSearch 2025",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ladlihub.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ladlihub.in',
    siteName: 'MovieSearch 2025',
    title: 'MovieSearch 2025 - Advanced Movie Discovery Platform',
    description: 'Discover, search, and explore movies with advanced filtering and recommendations. Find your next favorite movie with our comprehensive database powered by TMDB API.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MovieSearch 2025 - Advanced Movie Discovery Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@MovieSearch2025',
    creator: '@MovieSearch2025',
    title: 'MovieSearch 2025 - Advanced Movie Discovery Platform',
    description: 'Discover, search, and explore movies with advanced filtering and recommendations. Find your next favorite movie with our comprehensive database powered by TMDB API.',
    images: ['/og-image.jpg'],
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
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <CustomThemeProvider>
          <RecaptchaProvider autoLoad={true} hideBadge={false}>
            <TawkProvider autoInitialize={true} autoShow={false}>
              <ErrorBoundary 
                fallback={
                  <Box sx={{ 
                    minHeight: '100vh', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}>
                    <Typography variant="h4" color="white" textAlign="center">
                      Something went wrong. Please refresh the page.
                    </Typography>
                  </Box>
                }
                showDetails={process.env.NODE_ENV === 'development'}
                showRetry={true}
                showHome={true}
              >
                <AdminLayoutWrapper>
                  {children}
                </AdminLayoutWrapper>
                <OfflineSupport showStatus={true} showQueue={true} />
                <CookiesConsent />
                <AccessibilityReset />
                <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
              </ErrorBoundary>
            </TawkProvider>
          </RecaptchaProvider>
        </CustomThemeProvider>
      </body>
    </html>
  );
}
