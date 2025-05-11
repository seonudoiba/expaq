"use client"

import { useState } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Calendar, MapPin, Clock, Users, Star, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ActivityDetailsPage() {
  const params = useParams()
  const [selectedDate, setSelectedDate] = useState("")
  const [participants, setParticipants] = useState(1)

  // This would be fetched from the API in a real application
  const activity = {
    id: params.id,
    title: "City Tour Experience",
    description: "Experience the vibrant city life with our expert guides. Visit iconic landmarks, hidden gems, and local hotspots while learning about the city's rich history and culture.",
    location: "New York City",
    duration: "3 hours",
    maxParticipants: 10,
    price: 75,
    rating: 4.8,
    reviewCount: 120,
    images: [
      "/img/activity-1.jpg",
      "/img/activity-2.jpg",
      "/img/activity-3.jpg",
    ],
    host: {
      name: "John Doe",
      avatar: "/img/guide-1.jpg",
      rating: 4.9,
      reviewCount: 250,
    },
    reviews: [
      {
        id: 1,
        user: {
          name: "Alice Smith",
          avatar: "/img/user-1.jpg",
        },
        rating: 5,
        comment: "Amazing experience! The guide was knowledgeable and friendly.",
        date: "2024-03-15",
      },
      {
        id: 2,
        user: {
          name: "Bob Johnson",
          avatar: "/img/user-2.jpg",
        },
        rating: 4,
        comment: "Great tour, but it was a bit rushed at some points.",
        date: "2024-03-10",
      },
    ],
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src={activity.images[0]}
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
                <span>{activity.location}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{activity.duration}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>Max {activity.maxParticipants} people</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-400" />
                <span>{activity.rating} ({activity.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Host Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={activity.host.avatar} alt={activity.host.name} />
                    <AvatarFallback>{activity.host.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{activity.host.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="h-4 w-4 mr-1 text-yellow-400" />
                      <span>{activity.host.rating} ({activity.host.reviewCount} reviews)</span>
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
                {activity.reviews.map((review) => (
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
                ))}
              </TabsContent>
            </Tabs>
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