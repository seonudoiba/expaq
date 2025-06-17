import { useAuthStore } from "@/lib/store/auth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface RequireAdminProps {
  children: React.ReactNode;
  adminRoles?: string[]; // Allow specifying multiple admin roles
  loadingComponent?: React.ReactNode;
}

const RequireAdmin: React.FC<RequireAdminProps> = ({
  children,
  adminRoles = ["admin"], // Default to just "admin" role
  loadingComponent,
}) => {
  const { user, isLoading, hasRole } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're certain there's no authenticated user
    // This avoids the "flash" by not rendering children until we can confirm auth status
    if (!isLoading && !user) {
      // Not logged in
      if (typeof window !== "undefined") {
        localStorage.setItem("redirectTo", window.location.pathname);
      }
      router.push("/login");
      return;
    }

    // Check admin role only if user exists (and isn't loading)
    if (!isLoading && user) {
      // Check if user has ANY of the required admin roles
      const hasPermission = adminRoles.some((role) => hasRole(role));

      if (!hasPermission) {
        // User doesn't have required role
        if (typeof window !== "undefined") {
          localStorage.setItem("redirectTo", window.location.pathname);
        }
        router.push("/not-authorized");
      }
    }
  }, [user, isLoading, hasRole, router, adminRoles]);

  // Handle loading state
  if (isLoading || !user) {
    return (
      loadingComponent || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-700 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Checking permissions...</p>
          </div>
        </div>
      )
    );
  }

  // Check permission here to prevent rendering children while redirecting
  const hasPermission = adminRoles.some((role) => hasRole(role));
  if (!hasPermission) {
    return (
      loadingComponent || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-700 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying access...</p>
          </div>
        </div>
      )
    );
  }

  // At this point, the user is authenticated and has admin permissions
  return <>{children}</>;
};

export default RequireAdmin;
