// "use client"

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { Navbar } from "@/components/layout/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Expaq - Your Tour Guide Marketplace",
  description: "Find and book local tour guides for authentic travel experiences",
  keywords: ["tour guide", "travel", "local experiences", "tourism", "adventure"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen pt-16">{children}</main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
