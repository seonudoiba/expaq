import { useAuthStore } from "@/lib/store/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

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
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      // Not loading anymore, so we can check permissions
      if (!user) {
        // Not logged in
        if (typeof window !== "undefined") {
          localStorage.setItem("redirectTo", window.location.pathname);
        }
        router.push("/login");
        return;
      }

      // Check if user has ANY of the required admin roles
      const hasPermission = adminRoles.some((role) => hasRole(role));

      if (!hasPermission) {
        // User doesn't have required role
        if (typeof window !== "undefined") {
          localStorage.setItem("redirectTo", window.location.pathname);
        }
        router.push("/not-authorized");
        return;
      }

      // User is authenticated and has required role
      setChecking(false);
    }
  }, [user, isLoading, hasRole, router, adminRoles]);

  if (isLoading || checking) {
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

  // At this point, the user is authenticated and has admin permissions
  return <>{children}</>;
};

export default RequireAdmin;
