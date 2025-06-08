"use client"

import { Compass } from "lucide-react"
import { ActivitySkeleton } from "./activity-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

interface PageLoadingProps {
  type?: "activities" | "profile" | "dashboard" | "general"
  title?: string
}

export function PageLoading({ type = "general", title }: PageLoadingProps) {
  const renderContent = () => {
    switch (type) {
      case "activities":
        return (
          <div className="container px-4 md:px-6 py-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Filters Sidebar Skeleton */}
              <div className="w-full md:w-64 shrink-0">
                <div className="space-y-6">
                  <Skeleton className="h-8 w-20" />
                  <div className="space-y-4">
                    <div>
                      <Skeleton className="h-4 w-16 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-16 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <div className="pt-4">
                        <Skeleton className="h-2 w-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
                <ActivitySkeleton count={9} />
              </div>
            </div>
          </div>
        )

      case "profile":
        return (
          <div className="container px-4 md:px-6 py-6">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Profile Header */}
              <div className="flex items-center space-x-6">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>

              {/* Profile Content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <Skeleton className="h-32 w-full" />
                  <ActivitySkeleton count={4} />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </div>
            </div>
          </div>
        )

      case "dashboard":
        return (
          <div className="container px-4 md:px-6 py-6">
            <div className="space-y-8">
              {/* Dashboard Header */}
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-6 border rounded-lg">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-8 w-16 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                ))}
              </div>

              {/* Charts and Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="container px-4 md:px-6 py-12">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center space-y-4">
                <Skeleton className="h-12 w-96 mx-auto" />
                <Skeleton className="h-6 w-64 mx-auto" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2">
              <Compass className="h-6 w-6 text-primary animate-pulse" />
              <span className="font-bold text-xl">Expaq</span>
            </div>
            <div className="hidden md:flex space-x-6">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </div>

      {/* Page Title */}
      {title && (
        <div className="container px-4 md:px-6 py-6">
          <Skeleton className="h-8 w-64" />
        </div>
      )}

      {/* Main Content */}
      {renderContent()}
    </div>
  )
}
