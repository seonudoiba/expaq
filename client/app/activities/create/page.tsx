"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { MapPin, Clock, Users, DollarSign, Image as ImageIcon } from "lucide-react"
import { useAuthStore } from "@/lib/store/auth"
import { activityService } from "@/lib/api/services"
import { useQuery } from "@tanstack/react-query"
import { useActivityStore } from "@/lib/store/activity"
import { countryService, cityService, activityTypeService } from "@/lib/api/services"
import { activityType, Country, CreateActivityRequest } from "@/types"
import axios from "axios"
import { geocodingService } from '@/lib/api/services';

export default function CreateActivityPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const {
    countries,
    cities,
    activityTypes,
    selectedCountry,
    setCountries,
    setCities,
    setActivityTypes,
    setSelectedCountry,
  } = useActivityStore()

  const {
    data: countriesData,
    isLoading: isLoadingCountries,
    error: countriesError,
  } = useQuery({
    queryKey: ["countries"],
    queryFn: () => countryService.getAllCountries(),
  })

  const {
    data: activityTypesData,
    isLoading: isLoadingActivityTypes,
    error: activityTypesError,
  } = useQuery({
    queryKey: ["activityTypes"],
    queryFn: () => activityTypeService.getAll(),
  })

  const { data: citiesData, isLoading: isCitiesLoading, error: citiesError } = useQuery({
    queryKey: ["cities", selectedCountry],
    queryFn: () => cityService.getByCountry(selectedCountry),
    enabled: !!selectedCountry, // Only fetch cities if a country is selected
  })
console.log("Cities Data:", citiesData, "Selected Country:", selectedCountry, "Countries Data:", countriesData, "Activity Types Data:", activityTypesData)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const address = formData.get("address") as string | null
      const city = formData.get("city") as string
      const country = selectedCountry

      // Fetch coordinates using geocodingService
      const query = address ? `${address}, ${city}, ${country}` : `${city}, ${country}`;
      const { latitude, longitude } = await geocodingService.getCoordinates(query);

      const activityData: CreateActivityRequest = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        price: parseFloat(formData.get("price") as string),
        latitude,
        longitude,
        category: formData.get("category") as string,
        cityId: city,
        countryId: country,
        activityTypeId: formData.get("activityType") as string,
        location: formData.get("location") as string,
        startDate: formData.get("startDate") as string,
        endDate: formData.get("endDate") as string,
        schedule: {
          startTime: formData.get("startTime") as string,
          daysOfWeek: (formData.get("daysOfWeek") as string)?.split(","),
        },
        maxParticipants: parseInt(formData.get("maxParticipants") as string),
        capacity: parseInt(formData.get("capacity") as string),
        bookedCapacity: parseInt(formData.get("bookedCapacity") as string),
        address: address || '',
        isFeatured: formData.get("isFeatured") === "true",
        minParticipants: parseInt(formData.get("minParticipants") as string),
        durationMinutes: parseInt(formData.get("durationMinutes") as string),
      }

      await activityService.create(activityData, images)

      toast({
        title: "Success",
        description: "Activity created successfully",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Error creating activity:", error)
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
            {/* Country and City Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country</Label>
                <select
                  id="country"
                  name="country"
                  required
                  className="w-full p-2 border rounded-md"
                  onChange={(e) => setSelectedCountry(e.target.value)}
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <select
                  id="city"
                  name="city"
                  required
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select a city</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Activity Type Selection */}
            <div>
              <Label htmlFor="activityType">Activity Type</Label>
              <select
                id="activityType"
                name="activityType"
                required
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select an activity type</option>
                {activityTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

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