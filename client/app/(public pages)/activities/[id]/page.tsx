"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Clock, Users, Star, Heart, MapPin, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ActivityService} from "@/services/public-services";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
// import { useAuthStore } from "@/lib/store/auth";
import BookingWidget from "@/components/BookingWidget";
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
    return <div>Error loading activity details</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!activity) {
    return <div>Activity not found</div>;
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
            </Card>

            {/* Description Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">About this activity</h2>
                <div className="prose text-gray-700">
                  <p>{activity.description}</p>
                </div>
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
