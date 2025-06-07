"use client"

import { useState } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Clock, Users, Star, Heart, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { activityService } from "@/lib/api/services"
import { useQuery } from "@tanstack/react-query"

export default function ActivityDetailsPage() {
  const params = useParams()
  const [selectedDate, setSelectedDate] = useState("")
  const [participants, setParticipants] = useState(1)

  // This would be fetched from the API in a real application

  const { data: activity, error, isLoading} = useQuery({
    queryKey: ['activity'],
    queryFn: () => activityService.getById(params.id as string),
  });
  if (error) {
    return <div>Error loading activity details</div>
  }
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (!activity) {
    return <div>Activity not found</div>
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
          </div>

          {/* Activity Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">{activity.title}</h1>
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{activity.address + activity.city.name + ", " + activity.country.name }</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{activity.durationMinutes/60 + "Hours"}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>Max {activity.maxParticipants} people</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-400" />
                <span>{activity.averageRating} ({activity.totalReviews} reviews)</span>
              </div>
            </div>

            {/* Host Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={activity.hostProfilePicture ?? undefined} alt={activity.hostName} />
                    <AvatarFallback>{activity.hostName}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{activity.hostName}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="h-4 w-4 mr-1 text-yellow-400" />
                      <span>{activity.averageRating} ({activity.totalReviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description and Reviews */}
            <Tabs defaultValue="description" className="space-y-4">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-4">
                <p className="text-muted-foreground">{activity.description}</p>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                {/* {activity.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4 mb-2">
                        <Avatar>
                          <AvatarImage src={review.user.avatar} alt={review.user.name} />
                          <AvatarFallback>{review.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{review.user.name}</h4>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Star className="h-4 w-4 mr-1 text-yellow-400" />
                            <span>{review.rating}</span>
                            <span className="mx-2">•</span>
                            <span>{new Date(review.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))} */}
              </TabsContent>
            </Tabs>

            {/* Additional Activity Details */}
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-primary">Activity Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg shadow-sm bg-white">
                  <h3 className="text-lg font-semibold text-secondary">Host Information</h3>
                  <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                    <li><strong>Host ID:</strong> {activity.hostId}</li>
                    <li><strong>Host Name:</strong> {activity.hostName}</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg shadow-sm bg-white">
                  <h3 className="text-lg font-semibold text-secondary">Location</h3>
                  <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                    <li><strong>Latitude:</strong> {activity.latitude}</li>
                    <li><strong>Longitude:</strong> {activity.longitude}</li>
                    <li><strong>City:</strong> {activity.city.name}</li>
                    <li><strong>Country:</strong> {activity.country.name}</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg shadow-sm bg-white">
                  <h3 className="text-lg font-semibold text-secondary">Activity Type</h3>
                  <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                    <li><strong>Type:</strong> {activity.activityType.name}</li>
                    <li><strong>Image:</strong> <Image src={activity.activityType.image} alt={activity.activityType.name} width={64} height={64} className="rounded-md" /></li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg shadow-sm bg-white">
                  <h3 className="text-lg font-semibold text-secondary">Status</h3>
                  <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                    <li><strong>Active:</strong> {activity.active ? 'Yes' : 'No'}</li>
                    <li><strong>Verified:</strong> {activity.verified ? 'Yes' : 'No'}</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg shadow-sm bg-white">
                  <h3 className="text-lg font-semibold text-secondary">Participants</h3>
                  <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                    <li><strong>Minimum Participants:</strong> {activity.minParticipants}</li>
                    <li><strong>Maximum Participants:</strong> {activity.maxParticipants}</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg shadow-sm bg-white">
                  <h3 className="text-lg font-semibold text-secondary">Timestamps</h3>
                  <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                    <li><strong>Created At:</strong> {new Date(activity.createdAt).toLocaleString()}</li>
                    <li><strong>Updated At:</strong> {new Date(activity.updatedAt).toLocaleString()}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
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
                  <label className="block text-sm font-medium mb-2">Select Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Number of Participants</label>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setParticipants(Math.max(1, participants - 1))}
                    >
                      -
                    </Button>
                    <span>{participants}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setParticipants(Math.min(activity.maxParticipants, participants + 1))}
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
  )
}