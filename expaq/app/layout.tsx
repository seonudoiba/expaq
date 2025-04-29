import type { Metadata } from "next";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import {Nunito} from 'next/font/google'
import {
  ClerkProvider,
} from '@clerk/nextjs'
import ShowNavLayout from "./components/ShowNavLayout";
import { NotificationProvider } from "./providers/NotificationContext";

const nuntio = Nunito({
  subsets: ["latin"],
  weight:['300', "400", "500", "600", "700", "800"],
  variable: "--font-nunito",
})

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
        <body className={`bg-white text-primary overflow-x-hidden ${nuntio.variable}`}>
          <NotificationProvider>
            <ShowNavLayout/>
            {children}
          </NotificationProvider>
        </body>
      </html>
    </ClerkProvider>  
  );
}

