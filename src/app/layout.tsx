import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider as CustomThemeProvider } from "@/contexts/ThemeContext";
import ClientLayout from "@/components/ClientLayout";
import EnhancedGoogleAnalytics from "@/components/EnhancedGoogleAnalytics";
import { GoogleAdsScript } from "@/components/GoogleAds";
import GoogleReCaptchaV3 from "@/components/GoogleReCaptchaV3";
import EnhancedTawkTo from "@/components/EnhancedTawkTo";
import SkipToContent from "@/components/SkipToContent";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MovieSearch 2025 - Discover Your Next Favorite Movie",
  description: "Explore movies, TV shows, and more with advanced search and personalized recommendations.",
  keywords: "movies, TV shows, search, recommendations, TMDB, streaming",
  authors: [{ name: "MovieSearch Team" }],
  openGraph: {
    title: "MovieSearch 2025",
    description: "Discover your next favorite movie",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MovieSearch 2025",
    description: "Discover your next favorite movie",
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
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* Preconnect to external domains for performance */}
          <link rel="preconnect" href="https://api.themoviedb.org" />
          <link rel="preconnect" href="https://image.tmdb.org" />
          <link rel="preconnect" href="https://www.googletagmanager.com" />
          <link rel="preconnect" href="https://www.google-analytics.com" />
          <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
          <link rel="preconnect" href="https://www.google.com" />
          <link rel="preconnect" href="https://embed.tawk.to" />
          
          {/* DNS Prefetch */}
          <link rel="dns-prefetch" href="https://api.themoviedb.org" />
          <link rel="dns-prefetch" href="https://image.tmdb.org" />
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
          <link rel="dns-prefetch" href="https://www.google-analytics.com" />
          <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
          
          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          
          {/* PWA Manifest */}
          <link rel="manifest" href="/manifest.webmanifest" />
          
          {/* Theme Color */}
          <meta name="theme-color" content="#667eea" />
        </head>
        <body className={inter.className}>
          {/* Skip to main content link for accessibility */}
          <SkipToContent />
          
          <CustomThemeProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </CustomThemeProvider>

          {/* Enhanced Google Analytics */}
          <EnhancedGoogleAnalytics />
          
          {/* Google Ads Script */}
          <GoogleAdsScript />
          
          {/* Google reCAPTCHA v3 */}
          <GoogleReCaptchaV3 />
          
          {/* Enhanced Tawk.to Chat */}
          <EnhancedTawkTo />
        </body>
      </html>
    </ClerkProvider>
  );
}
