"use client";

import { useAuthSync } from "@/hooks/useAuthSync";
import { useAuthStore } from "@/lib/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedComponentProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  fallback?: React.ReactNode;
}

/**
 * A component that protects its children from being rendered until 
 * authentication state is confirmed. Use this to avoid the auth flashing issue.
 */
export function ProtectedComponent({
  children,
  requiredRoles = [],
  fallback
}: ProtectedComponentProps) {
  const { isReady, isAuthenticated } = useAuthSync(true);
  const { hasRole } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Only execute redirects after auth state is confirmed
    if (isReady) {
      // Handle not authenticated
      if (!isAuthenticated) {
        if (typeof window !== "undefined") {
          localStorage.setItem("redirectTo", window.location.pathname);
        }
        router.push("/login");
        return;
      }

      // Handle role-based access if roles are required
      if (requiredRoles.length > 0) {
        const hasAccess = requiredRoles.some(role => hasRole(role));
        if (!hasAccess) {
          router.push("/not-authorized");
        }
      }
    }
  }, [isReady, isAuthenticated, router, requiredRoles, hasRole]);

  // If not ready or not authenticated, show loading or fallback
  if (!isReady || !isAuthenticated) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If role check is required, do it here
  if (requiredRoles.length > 0) {
    const hasAccess = requiredRoles.some(role => hasRole(role));
    if (!hasAccess) {
      return fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-700 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Checking permissions...</p>
          </div>
        </div>
      );
    }
  }

  // Ready and authenticated (and has required roles if any)
  return <>{children}</>;
}
