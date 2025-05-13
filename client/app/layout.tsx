// "use client"

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
// import { Navbar } from "@/components/layout/navbar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Expaq - Discover Unforgettable Experiences",
  description:
    "Connect with local hosts and find unique activities anywhere in the world",
  applicationName: "Expaq",
  keywords: [
    "tour guide",
    "travel",
    "local experiences",
    "tourism",
    "adventure",
  ],
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
          <Providers>
            {/* Uncomment the Navbar component if needed */}
            {/* <Navbar /> */}
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <Toaster />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
