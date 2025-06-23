"use client";

import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  size?: "small" | "medium" | "large";
  interactive?: boolean;
  className?: string;
}

export default function StarRating({
  rating,
  onChange,
  size = "medium",
  interactive = false,
  className,
}: StarRatingProps) {
  const maxRating = 5;

  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-5 h-5",
    large: "w-6 h-6",
  };

  const starSize = sizeClasses[size];

  const handleClick = (selectedRating: number) => {
    if (interactive && onChange) {
      // If clicking the same star again, remove rating
      if (rating === selectedRating) {
        onChange(0);
      } else {
        onChange(selectedRating);
      }
    }
  };  // Function for future hover effects - currently not implemented
  const handleMouseEnter = (hoveredRating: number) => {
    // Hover effects can be implemented later if needed
    return hoveredRating; // Just to avoid unused parameter warning
  };

  return (
    <div className={cn("flex items-center", className)}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;

        return (
          <button
            key={index}
            type="button" // Ensure it doesn't submit forms
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            className={cn(
              "transition-all duration-100 focus:outline-none",
              interactive ? "cursor-pointer" : "cursor-default",
              starValue === 1 ? "" : "-ml-0.5"
            )}
            disabled={!interactive}
            aria-label={`${starValue} star${starValue !== 1 ? "s" : ""}`}
          >
            <Star
              className={cn(
                starSize,
                "transition-colors",
                isFilled
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-transparent text-gray-300"
              )}
            />
          </button>
        );
      })}
      
      {interactive && (
        <span className="ml-2 text-sm text-gray-500">
          {rating > 0 ? `${rating} star${rating !== 1 ? "s" : ""}` : "No rating"}
        </span>
      )}
    </div>
  );
}
