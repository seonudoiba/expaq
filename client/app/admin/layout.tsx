import './admin.css';

import { SidebarProvider } from '@/contexts/admin/SidebarContext';
import { ThemeProvider } from '@/contexts/admin/ThemeContext';
import RequireAdmin from '@/components/auth/RequireAdmin';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>
            {/* All admin pages are protected by RequireAdmin */}
            <RequireAdmin adminRoles={["ADMIN", "super-admin"]}>
              {children}
            </RequireAdmin>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
