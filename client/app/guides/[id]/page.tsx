"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { MapPin, Star, Clock, Users, Calendar, MessageCircle, Globe, Award, Instagram, Twitter, Linkedin, Phone, Mail, Share2, Heart, TrendingUp, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"

interface Guide {
  id: string
  name: string
  avatar: string
  bio: string
  location: string
  languages: string[]
  rating: number
  reviewCount: number
  memberSince: string
  contact: {
    phone: string
    email: string
  }
  socialLinks: {
    website?: string
    instagram?: string
    twitter?: string
    linkedin?: string
  }
  certifications: {
    name: string
    issuer: string
    year: string
  }[]
  availability: {
    nextAvailable: string
    calendar: {
      date: string
      available: boolean
    }[]
  }
  coordinates: {
    lat: number
    lng: number
  }
}

interface Activity {
  id: string
  title: string
  description: string
  location: string
  duration: string
  price: number
  rating: number
  reviewCount: number
  image: string
}

interface Review {
  id: string
  user: {
    name: string
    avatar: string
  }
  rating: number
  comment: string
  date: string
  activity: string
}

interface ReviewStatistics {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    [key: number]: number
  }
}

interface Booking {
  id: string
  activityId: string
  activityTitle: string
  startTime: string
  endTime: string
  status: string
  price: number
}

interface NearbyActivity {
  id: string
  title: string
  description: string
  location: string
  distance: number
  image: string
}

export default function GuideProfilePage() {
  const params = useParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const [guide, setGuide] = useState<Guide | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewStats, setReviewStats] = useState<ReviewStatistics | null>(null)
  const [nearbyActivities, setNearbyActivities] = useState<NearbyActivity[]>([])
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>("")

  useEffect(() => {
    const fetchGuideData = async () => {
      try {
        // Fetch guide details
        const guideResponse = await fetch(`/api/users/${params.id}`)
        if (!guideResponse.ok) {
          throw new Error("Failed to fetch guide details")
        }
        const guideData = await guideResponse.json()
        setGuide(guideData)

        // Fetch guide's activities
        const activitiesResponse = await fetch(`/api/activities/host/${params.id}`)
        if (!activitiesResponse.ok) {
          throw new Error("Failed to fetch activities")
        }
        const activitiesData = await activitiesResponse.json()
        setActivities(activitiesData)

        // Fetch guide's reviews
        const reviewsResponse = await fetch(`/api/reviews/host/${params.id}`)
        if (!reviewsResponse.ok) {
          throw new Error("Failed to fetch reviews")
        }
        const reviewsData = await reviewsResponse.json()
        setReviews(reviewsData.content)

        // Fetch review statistics
        const statsResponse = await fetch(`/api/reviews/host/${params.id}/statistics`)
        if (!statsResponse.ok) {
          throw new Error("Failed to fetch review statistics")
        }
        const statsData = await statsResponse.json()
        setReviewStats(statsData)

        // Fetch nearby activities
        if (guideData.coordinates) {
          const nearbyResponse = await fetch(
            `/api/activities/nearby?latitude=${guideData.coordinates.lat}&longitude=${guideData.coordinates.lng}&distance=10`
          )
          if (!nearbyResponse.ok) {
            throw new Error("Failed to fetch nearby activities")
          }
          const nearbyData = await nearbyResponse.json()
          setNearbyActivities(nearbyData)
        }

        // Check if guide is in favorites
        if (user) {
          const favoritesResponse = await fetch(`/api/users/${user.id}/favorites`)
          if (!favoritesResponse.ok) {
            throw new Error("Failed to fetch favorites")
          }
          const favoritesData = await favoritesResponse.json()
          setIsFavorite(favoritesData.some((fav: any) => fav.id === params.id))
        }
      } catch (error) {
        console.error("Error fetching guide data:", error)
        toast({
          title: "Error",
          description: "Failed to load guide information",
          variant: "destructive",
        })
      }
    }

    fetchGuideData()
  }, [params.id, user, toast])

  const handleDateSelect = async (date: string) => {
    setSelectedDate(date)
    try {
      // Fetch available activities for the selected date
      const response = await fetch(`/api/activities/available?date=${date}`)
      if (!response.ok) {
        throw new Error("Failed to fetch available activities")
      }
      const availableActivities = await response.json()
      setActivities(availableActivities)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch available activities",
        variant: "destructive",
      })
    }
  }

  const handleBooking = async (activityId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to book an activity",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activityId,
          startTime: selectedDate,
          userId: user.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create booking")
      }

      toast({
        title: "Success",
        description: "Activity booked successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book activity. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const messageData = {
        receiverId: params.id,
        type: "GUIDE_INQUIRY",
        content: formData.get("message"),
        subject: formData.get("subject")
      }

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      toast({
        title: "Success",
        description: "Your message has been sent successfully",
      })

      setIsContactFormOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${guide?.name} - Tour Guide Profile`,
          text: `Check out ${guide?.name}'s profile on our platform!`,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link Copied",
          description: "Profile link has been copied to clipboard",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share profile",
        variant: "destructive",
      })
    }
  }

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to add guides to favorites",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/users/${user.id}/favorites/${params.id}`, {
        method: isFavorite ? "DELETE" : "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to update favorite status")
      }

      setIsFavorite(!isFavorite)
      toast({
        title: isFavorite ? "Removed from Favorites" : "Added to Favorites",
        description: isFavorite
          ? "Guide has been removed from your favorites"
          : "Guide has been added to your favorites",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorite status. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!guide) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-end space-x-4 mb-6">
        <Button variant="outline" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button variant="outline" onClick={toggleFavorite}>
          <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-current text-red-500" : ""}`} />
          {isFavorite ? "Favorited" : "Add to Favorites"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Guide Profile Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-32 h-32 mx-auto mb-4">
                <AvatarImage src={guide.avatar} alt={guide.name} />
                <AvatarFallback>{guide.name[0]}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{guide.name}</CardTitle>
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{guide.location}</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>{guide.rating} ({guide.reviewCount} reviews)</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-sm text-muted-foreground">{guide.bio}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{guide.contact.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{guide.contact.email}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {guide.languages.map((language) => (
                    <span
                      key={language}
                      className="px-3 py-1 bg-muted rounded-full text-sm"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Certifications</h3>
                <div className="space-y-2">
                  {guide.certifications.map((cert) => (
                    <div key={cert.name} className="flex items-center space-x-2 text-sm">
                      <Award className="h-4 w-4 text-primary" />
                      <span>{cert.name}</span>
                      <span className="text-muted-foreground">({cert.year})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Social Links</h3>
                <div className="flex space-x-4">
                  {guide.socialLinks.website && (
                    <a href={guide.socialLinks.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-5 w-5 text-muted-foreground hover:text-primary" />
                    </a>
                  )}
                  {guide.socialLinks.instagram && (
                    <a href={`https://instagram.com/${guide.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer">
                      <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary" />
                    </a>
                  )}
                  {guide.socialLinks.twitter && (
                    <a href={`https://twitter.com/${guide.socialLinks.twitter}`} target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary" />
                    </a>
                  )}
                  {guide.socialLinks.linkedin && (
                    <a href={guide.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary" />
                    </a>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Member Since</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(guide.memberSince).toLocaleDateString()}
                </p>
              </div>

              <Dialog open={isContactFormOpen} onOpenChange={setIsContactFormOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Guide
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Contact {guide.name}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" name="subject" required />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" name="message" required className="min-h-[100px]" />
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Sending..." : "Send Message"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Availability Calendar */}
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Next Available:</span>
                  <span className="font-medium">{new Date(guide.availability.nextAvailable).toLocaleDateString()}</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {guide.availability.calendar.map((day) => (
                    <div
                      key={day.date}
                      className={`aspect-square rounded-lg border flex items-center justify-center text-sm ${
                        day.available
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {new Date(day.date).getDate()}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Map */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${guide.coordinates.lat},${guide.coordinates.lng}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </CardContent>
          </Card>

          {/* Review Statistics */}
          {reviewStats && (
            <Card>
              <CardHeader>
                <CardTitle>Review Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Average Rating:</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="font-medium">{reviewStats.averageRating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Reviews:</span>
                    <span className="font-medium">{reviewStats.totalReviews}</span>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(reviewStats.ratingDistribution)
                      .sort(([a], [b]) => Number(b) - Number(a))
                      .map(([rating, count]) => (
                        <div key={rating} className="flex items-center">
                          <span className="w-8 text-sm">{rating}★</span>
                          <div className="flex-1 h-2 bg-muted rounded-full mx-2">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{
                                width: `${(count / reviewStats.totalReviews) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-8 text-right">
                            {count}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Nearby Activities */}
          {nearbyActivities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Nearby Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {nearbyActivities.slice(0, 3).map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4">
                      <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                        <Image
                          src={activity.image}
                          alt={activity.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {activity.distance.toFixed(1)} km away
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="activities" className="space-y-6">
            <TabsList>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="activities" className="space-y-6">
              {activities.map((activity) => (
                <Card key={activity.id}>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="relative h-[200px] rounded-lg overflow-hidden">
                        <Image
                          src={activity.image}
                          alt={activity.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold">{activity.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {activity.description}
                          </p>
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
                            <Star className="h-4 w-4 mr-1 text-yellow-400" />
                            <span>{activity.rating} ({activity.reviewCount} reviews)</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-xl font-bold">${activity.price}</div>
                          <Button onClick={() => handleBooking(activity.id)}>
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src={review.user.avatar} alt={review.user.name} />
                        <AvatarFallback>{review.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{review.user.name}</h4>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Star className="h-4 w-4 mr-1 text-yellow-400" />
                              <span>{review.rating}</span>
                              <span className="mx-2">•</span>
                              <span>{new Date(review.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {review.activity}
                          </span>
                        </div>
                        <p className="mt-2 text-muted-foreground">{review.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 