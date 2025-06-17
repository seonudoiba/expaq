import './admin.css';

import { SidebarProvider } from '@/contexts/admin/SidebarContext';
import { ThemeProvider } from '@/contexts/admin/ThemeContext';
import { ProtectedComponent } from '@/components/auth/ProtectedComponent';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>
            {/* All admin pages are protected by ProtectedComponent */}
            <ProtectedComponent requiredRoles={["ADMIN", "super-admin"]}>
              {children}
            </ProtectedComponent>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
