"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Clock, Users, Star, Heart, MapPin, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { activityService } from "@/lib/api/services";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

export default function ActivityDetailsPage() {
  const params = useParams();
  const [selectedDate, setSelectedDate] = useState("");
  const [participants, setParticipants] = useState(1);

  // This would be fetched from the API in a real application

  const {
    data: activity,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["activity"],
    queryFn: () => activityService.getById(params.id as string),
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
              src={activity.mediaUrls[0]}
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
            </div>
            {/* {activity.mediaUrls.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {activity.images.map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    alt={`${activity.title} ${index + 1}`}
                    className={`h-20 object-cover rounded cursor-pointer ${
                      index === 0 ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                  />
                ))}
              </div>
            )} */}
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
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {activity.durationMinutes}
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
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={activity.hostProfilePicture ?? undefined} alt={activity.hostName} />
                    <AvatarFallback>{activity.hostName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">Hosted by {activity.hostName}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Host</span>
                      <span>Member since {new Date(activity.hostCreatedAt).getFullYear()}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline">Contact Host</Button>
              </CardContent>
            </Card>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-bold">${activity.price}</h2>
                <p className="text-sm text-muted-foreground">per person</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Number of Participants
                  </label>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setParticipants(Math.max(1, participants - 1))
                      }
                    >
                      -
                    </Button>
                    <span>{participants}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setParticipants(
                          Math.min(activity.maxParticipants, participants + 1)
                        )
                      }
                    >
                      +
                    </Button>
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  Book Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
