"use client";
import { useQuery } from "@tanstack/react-query";
import { activityService } from "@/services/services";

import {
  CardContent

} from "@/components/ui/card";
import { MapPin, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HostActivityList({hostId}: { hostId?: string }) {
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["activities"],
    queryFn: () => {
      if (!hostId) throw new Error("Host ID is required");
      return activityService.getAllHostActivities(hostId);
    },
  });
    // Extract activities from the paginated response
  const activities = data?.content || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(12)].map((_, i) => (
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

  if (!activities?.length) {
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
      {activities.map((activity) => (
        <CardContent key={activity.id} className="mb-6">
          <div className="space-y-4">
            {/* Sample Activity Card */}
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold">{activity.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{activity.city.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{activity.durationMinutes/60 + "hours"}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    <span>{activity.averageRating} ({activity.totalReviews})</span>
                  </div>
                </div>
              </div>
              <Button variant="outline">View Details</Button>
            </div>
          </div>
        </CardContent>
      ))}
    </div>
  );
}
