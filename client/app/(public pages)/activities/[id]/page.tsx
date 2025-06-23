"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Clock, Users, Star, Heart, MapPin, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ActivityService} from "@/services/public-services";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import ActivityReviews from "@/components/activities/ActivityReviews";
// import { useAuthStore } from "@/lib/store/auth";
import BookingWidget from "@/components/BookingWidget";
import { Skeleton } from "@/components/ui/skeleton";
export default function ActivityDetailsPage() {
  const params = useParams();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const {
    data: activity,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["activity", params.id],
    queryFn: () => ActivityService.getById(params.id as string),
  });

  if (error) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="bg-white border border-red-100 rounded-lg shadow-lg p-8 max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Unable to Load Activity</h2>
          <p className="text-gray-600 mb-6">
            We encountered an error while trying to load this activity. This might be due to a network issue or the activity may no longer be available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </Button>
            <Button
              onClick={() => window.history.back()}
              variant="default"
              className="flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Go Back
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-8">
            Error details: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }
  
  // Skeleton loading UI
  if (isLoading || !activity) {
    return (
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery Skeleton */}
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Skeleton className="w-full h-full" />
              <div className="absolute bottom-4 left-4 right-4 flex overflow-x-auto space-x-2 p-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-20 flex-shrink-0" />
                ))}
              </div>
            </div>

            {/* Title and Basic Info Skeleton */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-10 w-3/4" /> {/* Title */}
              <Skeleton className="h-6 w-full" /> {/* Address */}
              <div className="flex items-center space-x-6">
                <Skeleton className="h-6 w-32" /> {/* Duration */}
                <Skeleton className="h-6 w-32" /> {/* Participants */}
              </div>
            </div>

            {/* Host Info Skeleton */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Skeleton className="h-16 w-16 rounded-full" /> {/* Avatar */}
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-40" /> {/* Host name */}
                    <Skeleton className="h-4 w-60" /> {/* Host info */}
                  </div>
                </div>
                <Skeleton className="h-20 w-full" /> {/* Bio */}
                <Skeleton className="h-10 w-32 mt-4" /> {/* Button */}
              </CardContent>
            </Card>

            {/* Description Skeleton */}
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-60 mb-4" /> {/* About this activity */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>

            {/* Tabs Skeleton */}
            <Card>
              <CardContent className="p-6">
                <div className="border-b mb-6">
                  <div className="flex space-x-4">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar Skeleton */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-6">
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-32" /> {/* Price */}
                  <Skeleton className="h-6 w-24" /> {/* Rating */}
                </div>
                <Skeleton className="h-12 w-full" /> {/* Date selector */}
                <Skeleton className="h-12 w-full" /> {/* Time selector */}
                <Skeleton className="h-12 w-full" /> {/* Guests selector */}
                <Skeleton className="h-16 w-full" /> {/* Total */}
                <Skeleton className="h-12 w-full" /> {/* Book button */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src={activity.mediaUrls[activeImageIndex] || "https://res.cloudinary.com/do0rdj8oj/image/upload/v1750338649/vt3nisp4gn62vnpy39zr.webp"}
              alt={activity.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 right-4 flex space-x-2">
              <Button variant="secondary" size="sm">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>            {activity.mediaUrls.length > 1 && (
              <div className="absolute bottom-4 left-4 right-4 flex overflow-x-auto space-x-2 p-2 bg-black/30 rounded">
                {activity.mediaUrls.map((url: string, index:number) => (
                  <div 
                    key={index}
                    className="relative h-20 w-20 flex-shrink-0"
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <Image
                      src={url}
                      alt={`${activity.title} ${index + 1}`}
                      fill
                      className={`object-cover rounded cursor-pointer transition-all ${
                        index === activeImageIndex ? "ring-2 ring-primary ring-offset-2" : "opacity-70 hover:opacity-100"
                      }`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>


                  {/* Title and Basic Info */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge>{activity.activityType.name}</Badge>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">{activity.averageRating}</span>
                  <span className="ml-1 text-sm text-gray-600">({activity.totalReviews} reviews)</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2">{activity.title}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                {activity.address}, {activity.city.name}, {activity.country.name}
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-600">                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {activity.durationMinutes >= 60 ? (
                    <>
                      {Math.floor(activity.durationMinutes / 60)}
                      {Math.floor(activity.durationMinutes / 60) === 1 ? " hour" : " hours"}
                      {activity.durationMinutes % 60 > 0 && (
                        <> {activity.durationMinutes % 60} {activity.durationMinutes % 60 === 1 ? "minute" : "minutes"}</>
                      )}
                    </>
                  ) : (
                    `${activity.durationMinutes} ${activity.durationMinutes === 1 ? "minute" : "minutes"}`
                  )}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  Up to {activity.maxParticipants} guests
                </div>
              </div>
            </div>

  {/* Host Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">                  <Avatar className="h-16 w-16">
                    <AvatarImage 
                      src={activity.hostProfilePictureUrl} 
                      alt={activity.hostName} 
                    />
                    <AvatarFallback>
                      {(activity.hostName || 'Host').charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Hosted by {activity.hostName}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Host</span>
                      <span>
                        Member since {new Date(activity.hostCreatedAt).getFullYear()}
                      </span>                      {activity.verified && (
                        <span className="flex items-center">
                          <Star className="h-4 w-4 text-blue-500 mr-1" />
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {activity.hostBio && (
                  <p className="text-gray-700 mb-4">{activity.hostBio}</p>
                )}
                <Button variant="outline">Contact Host</Button>
              </CardContent>
            </Card>            {/* Description Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">About this activity</h2>
                <div className="prose text-gray-700">
                  <p>{activity.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Tabs Section */}
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details">
                    <div className="mt-4">
                      <h3 className="text-xl font-semibold mb-2">What&apos;s Included</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {activity.includes?.map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        )) || <li>No inclusions specified</li>}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="itinerary">
                    <div className="mt-4">
                      <h3 className="text-xl font-semibold mb-2">Activity Schedule</h3>
                      {activity.itinerary ? (
                        <div className="prose text-gray-700">
                          <p>{activity.itinerary}</p>
                        </div>
                      ) : (
                        <p className="text-gray-500">No detailed itinerary available.</p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="reviews">
                    <div className="mt-4">
                      <ActivityReviews activityId={activity.id} pageSize={5} />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
        </div>

        {/* Booking Sidebar */}
        <BookingWidget activity={{
          id: activity.id,
          title: activity.title,
          price: activity.price,
          rating: activity.averageRating,
          reviews: activity.totalReviews,
          maxGuests: activity.maxParticipants,
          duration: `${activity.durationMinutes} minutes`,
          images: activity.mediaUrls
        }} />
      </div>
    </div>
  );
}
