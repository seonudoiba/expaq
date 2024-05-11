import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Expaq",
  description: "Activities Exchange Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      {/* <AuthProvider>
          <ThemeContextProvider>
            <ThemeProvider>
              <div className="container">
                <div className="wrapper"> */}
                  {/* <Navbar /> */}
                  {children}
                  {/* <Footer /> */}
                {/* </div>
              </div>
            </ThemeProvider>
          </ThemeContextProvider>
        </AuthProvider> */}
      </body>
    </html>
  );
}
