"use client"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query";
import { activityTypeService } from "@/lib/api/services";
export function CategorySelector() {
  

  const {
    data: activityTypes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["activityTypes"],
    queryFn: () => activityTypeService.getAll(),
  });


  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-lg bg-white p-6 shadow">
            <div className="h-24 bg-gray-200 rounded-lg mb-4" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
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

  return (
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
  {activityTypes.map((activityType) => (
    <Link
      key={activityType.name}
      href={"" + activityType.name}
      className="group relative flex flex-col items-center justify-end aspect-[3/4] rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white transition-all hover:scale-105 hover:shadow-2xl hover:border-primary"
      style={{ minHeight: 100 }}
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
        <span className="text-base font-semibold text-gray-900 drop-shadow-sm">
          {activityType.name}
        </span>
      </div>
      <div className="absolute inset-0 rounded-xl ring-0 group-hover:ring-4 group-hover:ring-primary/30 transition-all pointer-events-none" />
    </Link>
  ))}
</div>
  )
}