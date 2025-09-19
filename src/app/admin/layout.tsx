import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Box } from "@mui/material";
import { AdminThemeProvider } from "@/contexts/AdminThemeContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import "./admin.css";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Admin Panel - MovieSearch 2025",
  description: "Administrative panel for MovieSearch 2025",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminThemeProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box component="main" sx={{ flexGrow: 1 }}>
          {children}
        </Box>
      </Box>
    </AdminThemeProvider>
  );
}
