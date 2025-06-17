"use client";

import { useAuthStore } from "@/lib/store/auth";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Define which paths should be protected and which are public
const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/forgot-password",
  "/",
  "/activities",
  "/blog",
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, getCurrentUser, isLoading } = useAuthStore();
  const [isAuthReady, setIsAuthReady] = useState(false);
  const pathname = usePathname();

  // Check if the current path is public
  const isPublicPath = PUBLIC_PATHS.some((path) => 
    pathname === path || pathname.startsWith(`${path}/`)
  );

  useEffect(() => {
    const initializeAuth = async () => {
      // Only check current user if not already loaded
      if (!user && !isLoading) {
        try {
          await getCurrentUser();
        } catch (error) {
          console.error("Failed to get current user:", error);
        }
      }
      setIsAuthReady(true);
    };

    initializeAuth();
  }, [getCurrentUser, user, isLoading]);

  // Show nothing until auth is ready, but only for protected routes
  if (!isAuthReady && !isPublicPath) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
