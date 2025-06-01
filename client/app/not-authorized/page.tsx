'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth';

export default function NotAuthorizedPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
        <div className="text-gray-600 mb-6">
          <p className="mb-4">
            Sorry, you do not have permission to access this page. This area is
            restricted to administrators only.
          </p>
          <p>
            If you believe this is an error, please contact your system
            administrator.
          </p>
        </div>
        <div className="flex space-x-4 justify-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
