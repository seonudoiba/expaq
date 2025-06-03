"use client"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { useQuery } from "@tanstack/react-query";
import { activityTypeService } from "@/lib/api/services";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ActivityType() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const containerRef = useRef(null);
  
  // Responsive visible items: 2 on mobile, 4 on desktop
  const getVisibleItems = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? 2 : 4; // 768px is md breakpoint
    }
    return 4;
  };
  
  const [visibleItems, setVisibleItems] = useState(getVisibleItems);

  const {
    data: activityTypes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["activityTypes"],
    queryFn: () => activityTypeService.getAll(),
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newVisibleItems = getVisibleItems();
      setVisibleItems(newVisibleItems);
      // Reset to start when changing screen size to avoid index issues
      if (currentIndex >= (activityTypes?.length || 0) - newVisibleItems) {
        setCurrentIndex(Math.max(0, (activityTypes?.length || 0) - newVisibleItems));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex, activityTypes?.length]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-6">
          {[...Array(getVisibleItems())].map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg bg-white p-6 shadow flex-shrink-0" style={{ width: `calc(${100/getVisibleItems()}% - 1.125rem)` }}>
              <div className="h-24 bg-gray-200 rounded-lg mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading activity types
            </h3>
            <div className="mt-2 text-sm text-red-700">
              {error instanceof Error ? error.message : "An error occurred"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!activityTypes?.length) {
    return (
      <div className="text-center">
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          No activity Types
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new activity.
        </p>
      </div>
    );
  }

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < activityTypes.length - visibleItems;

  const handlePrevious = () => {
    if (canGoBack) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (canGoForward) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // Touch/swipe handlers
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const diff = startX - currentX;
    const threshold = 50; // minimum swipe distance
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && canGoForward) {
        // Swiped left, go to next
        handleNext();
      } else if (diff < 0 && canGoBack) {
        // Swiped right, go to previous
        handlePrevious();
      }
    }
    
    setIsDragging(false);
    setStartX(0);
    setCurrentX(0);
  };

  // Mouse handlers for desktop
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setCurrentX(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const diff = startX - currentX;
    const threshold = 50; // minimum drag distance
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && canGoForward) {
        // Dragged left, go to next
        handleNext();
      } else if (diff < 0 && canGoBack) {
        // Dragged right, go to previous
        handlePrevious();
      }
    }
    
    setIsDragging(false);
    setStartX(0);
    setCurrentX(0);
  };

  return (
    <div>
      {/* Main carousel container */}
      <div className="relative">
        <div className="overflow-hidden">
          <div 
            ref={containerRef}
            className="flex gap-6 transition-transform duration-500 ease-in-out select-none"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleItems + 6)}%)`,
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {activityTypes.map((activityType) => (
              <Link
                key={activityType.name}
                href={"" + activityType.name}
                className="group relative flex flex-col items-center justify-end aspect-[3/4] rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white transition-all hover:scale-105 hover:shadow-2xl hover:border-primary flex-shrink-0"
                style={{ 
                  minHeight: 100,
                  width: `calc(${100/visibleItems}% - 1.125rem)` // Dynamic width based on visible items
                }}
              >
                {/* Activity count badge */}
                <span className="absolute top-3 right-3 z-20 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg backdrop-blur-md">
                  {activityType.activityCount ?? 0}
                </span>
                <div
                  className="absolute inset-0 bg-center bg-cover transition-all duration-300 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${activityType.image})`,
                    filter: "brightness(0.85)",
                  }}
                  aria-hidden="true"
                />
                <div className="relative z-10 w-full px-3 py-2 bg-white/60 backdrop-blur-md rounded-b-xl flex flex-col items-center">
                  <span className="text-sm md:text-base font-semibold text-gray-900 drop-shadow-sm">
                    {activityType.name}
                  </span>
                </div>
                <div className="absolute inset-0 rounded-xl ring-0 group-hover:ring-4 group-hover:ring-primary/30 transition-all pointer-events-none" />
              </Link>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        {activityTypes.length > visibleItems && (
          <>
            {/* Previous button */}
            {canGoBack && (
              <button
                onClick={handlePrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 backdrop-blur-md hover:bg-white border border-gray-200 rounded-full p-3 shadow-lg transition-all hover:scale-110 hover:shadow-xl z-10 group"
                aria-label="Previous item"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700 group-hover:text-primary transition-colors" />
              </button>
            )}

            {/* Next button */}
            {canGoForward && (
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 backdrop-blur-md hover:bg-white border border-gray-200 rounded-full p-3 shadow-lg transition-all hover:scale-110 hover:shadow-xl z-10 group"
                aria-label="Next item"
              >
                <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-primary transition-colors" />
              </button>
            )}
          </>
        )}
      </div>


    </div>
  );
}