import { Navbar } from '@/components/shared/navbar';
import { Toaster } from 'react-hot-toast';
import { Providers } from "../providers";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}
      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Providers>
          {children}
        </Providers>
        </div>
      </main>
      <Toaster position="top-center" />
    </div>
  );
} 