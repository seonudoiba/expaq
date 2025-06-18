"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AccessDeniedProps {
  requiredRoles?: string[];
  isAuthenticated?: boolean;
  message?: string;
  loginPath?: string;
  homePath?: string;
}

/**
 * A component that shows when a user doesn't have access to a protected route
 * Instead of automatically redirecting, it explains the permissions needed
 * and provides navigation options
 */
export default function AccessDenied({
  requiredRoles = [],
  isAuthenticated = false,
  message,
  loginPath = "/login",
  homePath = "/"
}: AccessDeniedProps) {
  // Format role names for display
  const formattedRoles = requiredRoles.map(role => 
    role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
  ).join(", ");
  
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-8 h-8 text-red-600 dark:text-red-300" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m0 0v2m0-2h2m-2 0H9m4-4H9m4-4H9m4-4H9m10 11v2m0 0v2m0-2h2m-2 0h-2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            Access Restricted
          </h2>
          
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            {message || (isAuthenticated 
              ? `You need ${formattedRoles || "additional"} permissions to access this page.` 
              : "You need to be logged in to access this page."
            )}
          </p>
          
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center">
            {!isAuthenticated && (
              <Button 
                asChild
                variant="default" 
                className="w-full sm:w-auto"
              >
                <Link href={`${loginPath}?returnUrl=${encodeURIComponent(window.location.pathname)}`}>
                  Sign In
                </Link>
              </Button>
            )}
            
            <Button 
              asChild
              variant="outline" 
              className="w-full sm:w-auto"
            >
              <Link href={homePath}>
                Return Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
