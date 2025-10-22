import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ClientLayout from "@/components/ClientLayout";
import SkipToContent from "@/components/SkipToContent";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Performance: swap text display
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "MovieSearch 2025 - Discover Your Next Favorite Movie",
    template: "%s | MovieSearch 2025",
  },
  description: "Discover, explore, and track your favorite movies and TV shows with MovieSearch 2025. Get personalized recommendations, read reviews, and find what to watch next.",
  keywords: ["movies", "tv shows", "movie database", "film reviews", "streaming", "cinema", "entertainment"],
  authors: [{ name: "MovieSearch 2025" }],
  creator: "MovieSearch 2025",
  publisher: "MovieSearch 2025",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://moviesearch2025.netlify.app",
    siteName: "MovieSearch 2025",
    title: "MovieSearch 2025 - Discover Your Next Favorite Movie",
    description: "Discover, explore, and track your favorite movies and TV shows",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MovieSearch 2025",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MovieSearch 2025 - Discover Your Next Favorite Movie",
    description: "Discover, explore, and track your favorite movies and TV shows",
    images: ["/og-image.jpg"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
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
          <link rel="dns-prefetch" href="https://api.themoviedb.org" />
          <link rel="dns-prefetch" href="https://image.tmdb.org" />
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        </head>
        <body className={inter.className}>
          {/* Skip to main content link for accessibility */}
          <SkipToContent />
          
          <ThemeProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
