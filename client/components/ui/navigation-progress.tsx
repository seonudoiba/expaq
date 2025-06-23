/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Add custom event type
interface NavigationStartEvent extends Event {
  detail: {
    href: string;
  };
}

// Component that uses useSearchParams wrapped in Suspense
function NavigationProgressContent({
  setProgress,
  setIsNavigating,
}: {
  setProgress: (value: number) => void;
  setIsNavigating: (value: boolean) => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // When the route changes, complete the progress bar
    setProgress(100);
    const timer = setTimeout(() => {
      setIsNavigating(false);
      setProgress(0);
    }, 300); // Wait for transition to complete

    return () => clearTimeout(timer);
  }, [pathname, searchParams, setProgress, setIsNavigating]);

  return null;
}

export function NavigationProgressBar() {
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  // Start the progress bar when a navigation action is triggered
  useEffect(() => {
    const handleStartNavigation = () => {
      setIsNavigating(true);
      setProgress(20); // Start with some progress

      // Simulate progress
      const timer1 = setTimeout(() => setProgress(40), 100);
      const timer2 = setTimeout(() => setProgress(60), 300);
      const timer3 = setTimeout(() => setProgress(80), 600);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    };

    // Listen for our custom navigation start event
    const handleNavigationStart = (_event: Event) => {
      handleStartNavigation();
    };

    // Listen for navigation start events (for Next.js Link components that aren't enhanced yet)
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isNavigationElement =
        target.tagName === "A" ||
        target.closest("a") ||
        target.tagName === "BUTTON" ||
        target.closest("button");

      if (isNavigationElement) {
        // Check if this is not one of our enhanced navigation elements
        const isEnhanced =
          target.hasAttribute("data-enhanced-navigation") ||
          target.closest("[data-enhanced-navigation]");

        if (!isEnhanced) {
          handleStartNavigation();
        }
      }
    };

    window.addEventListener("navigationStart", handleNavigationStart);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("touchstart", handleMouseDown as unknown as EventListener);

    return () => {
      window.removeEventListener("navigationStart", handleNavigationStart);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("touchstart", handleMouseDown as unknown as EventListener);
    };
  }, []);

  if (!isNavigating && progress === 0) return null;
  return (
    <>
      <Suspense fallback={null}>
        <NavigationProgressContent setProgress={setProgress} setIsNavigating={setIsNavigating} />
      </Suspense>
      <div className="fixed top-0 left-0 right-0 h-1 z-[9999] bg-transparent pointer-events-none">
        <div
          className="h-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />      </div>
    </>
  );
}
