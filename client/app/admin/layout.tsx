import './admin.css';

import { SidebarProvider } from '@/contexts/admin/SidebarContext';
import { ThemeProvider } from '@/contexts/admin/ThemeContext';



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
