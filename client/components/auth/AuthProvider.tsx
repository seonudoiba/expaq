"use client";

import { useAuthStore } from "@/lib/store/auth";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

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
  );  // Use a ref to track if we've already tried to get the current user
  const authAttemptedRef = useRef(false);

  useEffect(() => {
    const initializeAuth = async () => {
      // Skip if already loading or we already have a user or we've already tried
      if (authAttemptedRef.current || isLoading || user) {
        setIsAuthReady(true);
        return;
      }

      // Mark that we've attempted auth to prevent multiple API calls
      authAttemptedRef.current = true;
      
      try {
        await getCurrentUser();
      } catch (error) {
        console.error("Failed to get current user:", error);
      }
      
      setIsAuthReady(true);
    };

    initializeAuth();
    
    // Don't include getCurrentUser in dependencies as it would cause constant re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading]);

  // Only show loading state for protected routes during initialization
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
