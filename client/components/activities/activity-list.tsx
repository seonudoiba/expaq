"use client"
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import { useActivitiesStore } from "@/lib/store/useActivitiesStore";

import { MapPin, Star } from "lucide-react"

export function ActivityList() {
  function formatDateShort(dateString: string | number | Date) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const { activities, isLoading, error, fetchActivities, clearFilters } = useActivitiesStore();
    useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg bg-white p-6 shadow"
          >
            <div className="h-48 bg-gray-200 rounded-lg mb-4" />
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
              Error loading activities
            </h3>
            <div className="mt-2 text-sm text-red-700">
              {error instanceof Error ? error.message : "An error occurred"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center">
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          No activities
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new activity.
        </p>
      </div>
    );
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Activities</h2>
          <p className="text-sm text-gray-600 mt-1">
            {activities.length} activities found
          </p>
        </div>        <button 
          onClick={() => clearFilters()} 
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Clear Filters
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <Link
            href={`/activities/${activity.id}`}
            key={activity.id}
            className="group"
          >
            <Card className="overflow-hidden h-full transition-all hover:shadow-md">
              <div className="relative h-64 w-full">
                <Image
                  src={activity.mediaUrls[0] || "/default.png"}
                  alt={activity.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <Badge className="absolute top-3 left-3 z-10">
                  {activity.activityType.name}
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {activity.city.name}, {activity.country.name}
                </div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {activity.title}
                </h3>
                <p className="text-sm text-gray-800 line-clamp-2">
                  {activity.description}
                </p>
                <div className="flex items-center text-base py-2 text-gray-800">
                  <svg
                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-800"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 14a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5A.75.75 0 018 14zm0-4a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5A.75.75 0 018 10zm0-4a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5A.75.75 0 018 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {formatDateShort(activity.startDate)} -{" "}
                  {formatDateShort(activity.endDate)}
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="font-medium mr-1">
                    {activity.averageRating}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    ({activity.totalReviews} reviews)
                  </span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <div className="font-semibold">
                  ${activity.price}{" "}
                  <span className="text-muted-foreground font-normal text-sm">
                    / person
                  </span>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}