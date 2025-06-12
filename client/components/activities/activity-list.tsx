"use client";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import { useActivitiesStore } from "@/lib/store/useActivitiesStore";

import { Calendar, Heart, MapPin, Star } from "lucide-react";
import { Button } from "../ui/button";

export function ActivityList() {
  function formatDateShort(dateString: string | number | Date) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const { activities, isLoading, error, fetchActivities, clearFilters } =
    useActivitiesStore();
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-lg bg-white p-6 shadow">
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
      <div className="flex justify-between items-center my-6">
        <div>
          <h2 className="text-2xl font-bold">Activities</h2>
          <p className="text-sm text-gray-600 mt-1">
            {activities.length} activities found
          </p>
        </div>{" "}
        <button
          onClick={clearFilters}
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
            className=""
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative xxl:h-64 h-52 w-full">
                <Image
                  src={activity.mediaUrls[0] || "/default.png"}
                  alt={activity.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <Badge className="absolute top-4 left-4 bg-white text-gray-900 hover:text-white">
                  {activity.activityType.name}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 text-white hover:scale-110 transition-transform"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {activity.city.name}, {activity.country.name}
                </div>
                <h3 className="text-xl font-semibold mb-2">{activity.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {activity.description}
                </p>

                <div className="flex items-center space-x-4 mb-4 text-sm">
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
                  </svg>{" "}
                  From {formatDateShort(activity.startDate)} -{" "}
                  {formatDateShort(activity.endDate)}
                </div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium">
                      {activity.averageRating}
                    </span>
                    <span className="ml-1 text-sm text-gray-600">
                      ({activity.totalReviews})
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    {activity.durationMinutes >= 60 ? (
                      // Show hours and minutes for 60+ minutes
                      <>
                        {Math.floor(activity.durationMinutes / 60)}
                        {Math.floor(activity.durationMinutes / 60) === 1
                          ? " hour"
                          : " hours"}
                        {activity.durationMinutes % 60 > 0 && (
                          <>
                            {" "}
                            {activity.durationMinutes % 60}{" "}
                            {activity.durationMinutes % 60 === 1
                              ? "minute"
                              : "minutes"}
                          </>
                        )}
                      </>
                    ) : (
                      // Show just minutes for less than 60 minutes
                      `${activity.durationMinutes} ${
                        activity.durationMinutes === 1 ? "minute" : "minutes"
                      }`
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      ${activity.price}
                      <span className="text-sm font-normal text-gray-600">
                        /person
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      by {activity.hostName}
                    </div>
                  </div>
                  <Link href={`/activities/${activity.id}`}>
                    <Button>View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
