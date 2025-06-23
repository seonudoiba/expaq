"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

// Create context for navigation loading state
type NavigationLoadingContextType = {
  isNavigating: boolean;
  startNavigation: (href?: string) => void;
};

const NavigationLoadingContext = createContext<NavigationLoadingContextType>({
  isNavigating: false,
  startNavigation: () => {}
});

export const useNavigationLoading = () => useContext(NavigationLoadingContext);

// Define the navigation start event type
interface NavigationStartEvent extends Event {
  detail: {
    href: string;
  };
}

export function NavigationLoadingProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track navigation state changes
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname, searchParams]);
  
  // Listen for navigation start events
  useEffect(() => {
    const handleNavigationStart = (event: Event) => {
      setIsNavigating(true);
    };
    
    window.addEventListener('navigationStart', handleNavigationStart);
    
    return () => {
      window.removeEventListener('navigationStart', handleNavigationStart);
    };
  }, []);
  // Expose a method to manually set loading state
  const startNavigation = (href?: string) => {
    setIsNavigating(true);
    if (href) {
      // Dispatch the event so other components know about it
      window.dispatchEvent(new CustomEvent('navigationStart', {
        detail: { href }
      }));
    }
  };

  // Create a component to render the loading indicator
  const NavigationLoadingIndicator = () => {
    if (!isNavigating) return null;

    return (
      <div className="fixed top-0 left-0 w-full z-[9999] flex justify-center">
        <div className="bg-primary text-primary-foreground px-4 py-1 rounded-b-md flex items-center gap-2 shadow-md">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm font-medium">Loading...</span>
        </div>
      </div>
    );
  };
  return (
    <NavigationLoadingContext.Provider value={{ isNavigating, startNavigation }}>
      <NavigationLoadingIndicator />
      {children}
    </NavigationLoadingContext.Provider>
  );
}
