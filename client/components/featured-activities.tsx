"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { activityService } from "@/lib/api/services";

export function FeaturedActivities() {
  // const activities = [
  //   {
  //     id: 1,
  //     title: "Guided Hiking Tour in the Alps",
  //     location: "Chamonix, France",
  //     price: 89,
  //     rating: 4.9,
  //     reviews: 128,
  //     image: "/placeholder.svg?height=300&width=400",
  //     category: "Outdoor",
  //   },
  //   {
  //     id: 2,
  //     title: "Traditional Pasta Making Class",
  //     location: "Rome, Italy",
  //     price: 65,
  //     rating: 4.8,
  //     reviews: 94,
  //     image: "/placeholder.svg?height=300&width=400",
  //     category: "Food",
  //   },
  //   {
  //     id: 3,
  //     title: "Street Art Tour with Local Artist",
  //     location: "Berlin, Germany",
  //     price: 35,
  //     rating: 4.7,
  //     reviews: 76,
  //     image: "/placeholder.svg?height=300&width=400",
  //     category: "Culture",
  //   },
  //   {
  //     id: 4,
  //     title: "Sunset Sailing Experience",
  //     location: "Santorini, Greece",
  //     price: 120,
  //     rating: 4.9,
  //     reviews: 152,
  //     image: "/placeholder.svg?height=300&width=400",
  //     category: "Outdoor",
  //   },
  //   {
  //     id: 5,
  //     title: "Craft Beer Tasting Tour",
  //     location: "Prague, Czech Republic",
  //     price: 45,
  //     rating: 4.6,
  //     reviews: 68,
  //     image: "/placeholder.svg?height=300&width=400",
  //     category: "Food",
  //   },
  //   {
  //     id: 6,
  //     title: "Flamenco Dance Workshop",
  //     location: "Seville, Spain",
  //     price: 55,
  //     rating: 4.8,
  //     reviews: 87,
  //     image: "/placeholder.svg?height=300&width=400",
  //     category: "Culture",
  //   },
  // ]
  function formatDateShort(dateString: string | number | Date) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  const {
    data: activities,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["activities"],
    queryFn: () => activityService.getAll(),
  });

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
                src={activity.mediaUrls[0] || "/placeholder.svg"}
                alt={activity.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <Badge className="absolute top-3 left-3 z-10">
                {activity.category}
              </Badge>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                {activity.city}, {activity.country}
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
  );
}
