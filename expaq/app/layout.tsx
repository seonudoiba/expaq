import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import Hero from "./components/Hero";

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
           
          <div className="bg-[url('/hero.jpg')] bg-[length:900px] md:bg-[length:100%] bg-no-repeat">
          <Navbar />
          <Hero />
          </div>


          {children}
          </body>
        </html>
      </ClerkProvider>  
  );
}

