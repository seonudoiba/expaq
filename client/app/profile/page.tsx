"use client"

// import { useAuth } from "@/hooks/use-auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Star } from "lucide-react"

import { useAuthStore } from "@/lib/store/auth";


import { Suspense } from 'react';
import { HostActivityList } from '@/components/activities/host-activity-list';
import { HostList } from "@/components/home/host-list"

export default function ProfilePage() {
  // const { user } = useAuth()
    const { user } = useAuthStore();
    // const { user, isAuthenticated, logout } = useAuthStore();
  
console.log("User in ProfilePage:", user);
  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-32 h-32 mx-auto mb-4">
                <AvatarImage src={user.avatar} alt={user.userName} />
                <AvatarFallback>{user.userName?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{user.userName}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Member since</span>
                  <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Roles</span>
                  <span className="capitalize">{user.roles.map(role => role.name).join(', ')}</span>
                </div>
                <Button className="w-full" variant="outline">
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        {user.roles.some(role => role.name === 'HOST')  ?(
 <div className="md:col-span-2">
          <Tabs defaultValue="activities" className="space-y-4">
            <TabsList>
              <TabsTrigger value="activities">My Activities</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="activities" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>My Activities</CardTitle>
                  <CardDescription>Activities you&apos;ve created</CardDescription>
                </CardHeader>
                <Suspense fallback={<div>Loading activities...</div>}>
                            <HostActivityList hostId={user.id}/>
                          </Suspense>
                
              </Card>
            </TabsContent>

            <TabsContent value="bookings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>My Bookings</CardTitle>
                  <CardDescription>Activities you&apos;ve booked</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Sample Booking Card */}
                    <div className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">Mountain Hiking Adventure</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>June 15, 2024</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>Colorado</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline">View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>My Reviews</CardTitle>
                  <CardDescription>Reviews you&apos;ve written</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Sample Review Card */}
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="font-semibold">5.0</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Amazing experience! The guide was knowledgeable and friendly.
                      </p>
                      <div className="mt-2 text-sm text-muted-foreground">
                        City Tour Experience • June 10, 2024
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        ) : (
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Welcome to Your Profile</CardTitle>
                <CardDescription>
                  You can view your activities, bookings, and reviews here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  As a regular user, you can explore activities and manage your bookings.
                </p>
                <div className="mt-4 mb-8">
                  <Button variant="outline" className="w-full">
                    Explore Hosts
                  </Button>
                </div>
                <HostList/>
                
              </CardContent>
            </Card>
          </div>
        ) }
       
      </div>
    </div>
  )
}