"use client"

import { Compass, Link } from "lucide-react"
import Image from "next/image"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-8">
        {/* Animated Logo */}
        <div className="relative">
          <div className="absolute inset-0 animate-ping">
            <div className="h-16 w-16 rounded-full bg-primary/20"></div>
          </div>
          <div className="relative h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Compass className="h-8 w-8 text-primary animate-spin" style={{ animationDuration: "3s" }} />
          </div>
          <Link href="/" className="absolute inset-0">
            <Image
              src="/logo.png"
              alt="Expaq Logo"
              width={64}
              height={64} />
          </Link>
        </div>

        {/* Brand Name */}
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-foreground">Expaq</h1>
        </div>

        {/* Loading Text with Animation */}
        <div className="flex items-center space-x-1">
          <span className="text-muted-foreground">Discovering experiences</span>
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
