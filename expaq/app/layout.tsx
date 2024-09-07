import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/Navbar";
// import AppHead from "./components/Header/AppHead";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

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
    <html lang="en">
      {/* <AppHead /> */}
      <body
      >

        {/* <Navbar/> exploreNearby={exploreNearby} */}
        <div className="bg-[url('/hero.jpg')] bg-[length:900px] md:bg-[length:100%] bg-no-repeat bg-opacity">
          <Navbar />

          {children}
        </div>

      </body>
    </html>
  );
}
