import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ['100','200','300','400','500', '600', '700','800', '900'],

});

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Expaq - Connecting Travelers with Local Hosts for Authentic Experiences",
  description: "Discover, Connect, and Explore Culture Like a Local. Expaq is a platform that connects travelers with local hosts for authentic experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} `}
      >
        <Header/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
