"use client"

import { Search, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchLoadingProps {
  message?: string
  className?: string
}

export function SearchLoading({ message = "Searching for experiences...", className }: SearchLoadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 space-y-4", className)}>
      <div className="relative">
        <div className="absolute inset-0 animate-ping">
          <div className="h-12 w-12 rounded-full bg-primary/20"></div>
        </div>
        <div className="relative h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Search className="h-6 w-6 text-primary" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-foreground">{message}</p>
        <div className="flex items-center justify-center space-x-1">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">This may take a moment</span>
        </div>
      </div>

      {/* Animated dots */}
      <div className="flex space-x-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-primary/40 rounded-full animate-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
    </div>
  )
}
