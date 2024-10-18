import type { Metadata } from "next";
import "./globals.css";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import ShowNavLayout from "./components/ShowNavLayout";

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
          
<ShowNavLayout/>

          {children}
          </body>
        </html>
      </ClerkProvider>  
  );
}

