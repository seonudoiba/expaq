import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

export const metadata: Metadata = {
  title: "Expaq",
  description: "Explore diverse cultural activities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <ClerkProvider>
        <html lang="en">
          <body>
           
            <div className="bg-[url('/hero.jpg')] bg-[length:900px] md:bg-[length:100%] bg-no-repeat bg-opacity">
          <Navbar />

          {children}
        </div>
          </body>
        </html>
      </ClerkProvider>  
  );
}

