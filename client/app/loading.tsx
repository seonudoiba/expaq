import React from "react";

export default function Loading() {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600"
      role="status"
      aria-live="polite"
      aria-label="Loading content, please wait"
    >
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 bg-white opacity-75"></div>
        <div className="rounded-full h-16 w-16 border-t-4 border-white border-solid animate-spin"></div>
      </div>
    </div>
  );
}
