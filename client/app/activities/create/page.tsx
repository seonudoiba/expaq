"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { MapPin, Clock, Users, DollarSign, Image as ImageIcon } from "lucide-react"

export default function CreateActivityPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<File[]>([])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const activityData = {
        title: formData.get("title"),
        description: formData.get("description"),
        location: formData.get("location"),
        duration: formData.get("duration"),
        maxParticipants: parseInt(formData.get("maxParticipants") as string),
        price: parseFloat(formData.get("price") as string),
        category: formData.get("category"),
      }

      // Here you would typically upload images first, then create the activity
      const response = await fetch("/api/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activityData),
      })

      if (!response.ok) {
        throw new Error("Failed to create activity")
      }

      toast({
        title: "Success",
        description: "Activity created successfully",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create activity. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files))
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Activity Title</Label>
                <Input
                  id="title"
                  name="title"
                  required
                  placeholder="Enter activity title"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  placeholder="Describe your activity"
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  required
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select a category</option>
                  <option value="city-tour">City Tour</option>
                  <option value="hiking">Hiking</option>
                  <option value="food">Food & Drink</option>
                  <option value="culture">Cultural Experience</option>
                  <option value="adventure">Adventure</option>
                </select>
              </div>
            </div>

            {/* Location and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="location"
                    name="location"
                    required
                    placeholder="Enter location"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="duration">Duration (hours)</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    required
                    min="1"
                    placeholder="Enter duration"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Capacity and Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxParticipants">Maximum Participants</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="maxParticipants"
                    name="maxParticipants"
                    type="number"
                    required
                    min="1"
                    placeholder="Enter max participants"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="price">Price per Person ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    placeholder="Enter price"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <Label htmlFor="images">Activity Images</Label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="images"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/90"
                    >
                      <span>Upload images</span>
                      <input
                        id="images"
                        name="images"
                        type="file"
                        multiple
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
              {images.length > 0 && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {images.length} image(s) selected
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Activity"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 