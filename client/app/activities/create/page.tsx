"use client"

import { useState, useEffect } from "react"
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
import { geocodingService } from '@/lib/api/services';
import { uploadActivityImages } from '@/lib/api/services';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, } from 'date-fns';

const activitySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be a positive number"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  startTime: z.string().min(1, "Start time is required"),
  daysOfWeek: z.array(z.string()).min(1, "At least one day must be selected"),
  maxParticipants: z.number().min(1, "Maximum participants must be at least 1"),
  // capacity: z.number().min(1, "Capacity must be at least 1"),
  bookedCapacity: z.number().min(0, "Booked capacity must be at least 0"),
  address: z.string().min(1, "Address is required"),
  // isFeatured: z.string(),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  activityType: z.string().min(1, "Activity type is required"),
  minParticipants: z.number().min(1, "Minimum participants must be at least 1"),
  durationMinutes: z.number().min(1, "Duration must be at least 1 minute"),
});

export default function CreateActivityPage() {
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
  } = useQuery({
    queryKey: ["countries"],
    queryFn: () => countryService.getAllCountries(),
  })

  const {
    data: activityTypesData,
  } = useQuery({
    queryKey: ["activityTypes"],
    queryFn: () => activityTypeService.getAll(),
  })

  const { data: citiesData } = useQuery({
    queryKey: ["cities", selectedCountry],
    queryFn: () => cityService.getByCountry(selectedCountry),
    enabled: !!selectedCountry, // Only fetch cities if a country is selected
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof activitySchema>>({
    resolver: zodResolver(activitySchema),
  });

  const onSubmit = async (data: z.infer<typeof activitySchema>) => {
    console.log("Form submitted with data:", data); // Debugging log
    setIsLoading(true);

    try {
      // Convert isFeatured to boolean
      // const isFeatured = data.isFeatured === "true";

      const { address, city, country, startDate, endDate, ...rest } = data;
      console.log("Processing data:", { address, city, country, rest }); // Debugging log

      const cityName = cities.find((c) => c.id === city)?.name;
      const countryName = countries.find((c) => c.id === country)?.name;

      if (!cityName || !countryName) {
        throw new Error("Invalid city or country selection.");
      }

      const query = `${address}, ${cityName}, ${countryName}`;
      let latitude, longitude;

      try {
        ({ latitude, longitude } = await geocodingService.getCoordinates(query));

        if (!latitude || !longitude) {
          console.warn(`No results found for the full address: ${query}. Retrying with city and country only.`);
          const fallbackQuery = `${cityName}, ${countryName}`;
          ({ latitude, longitude } = await geocodingService.getCoordinates(fallbackQuery));

          if (!latitude || !longitude) {
            throw new Error(`No results found for the fallback location: ${fallbackQuery}`);
          }
        }
      } catch (geoError) {
        console.error("Geocoding error:", geoError);
        throw new Error("Unable to fetch coordinates. Please check the address and try again.");
      }

      console.log("Coordinates fetched:", { latitude, longitude }); // Debugging log

      // Format startDate and endDate to include time
      const formattedStartDate = format(new Date(startDate), "yyyy-MM-dd'T'HH:mm:ss");
      const formattedEndDate = format(new Date(endDate), "yyyy-MM-dd'T'HH:mm:ss");

      const activityData = {
        ...rest,
        // isFeatured, // Use the converted boolean value
        latitude,
        longitude,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        city: { id: city },
        country: { id: country },
        activityType: { id: data.activityType },
        address,
        mediaUrls: [],
        schedule: {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          startTime: data.startTime,
          daysOfWeek: data.daysOfWeek,
        },
      };

      console.log("Final activity data:", activityData); // Debugging log

      // Step 1: Create the activity
      const createdActivity = await activityService.create(activityData);
      console.log("Activity created with ID:", createdActivity.id); // Debugging log

      // Step 2: Upload images
      if (images.length > 0) {
        try {
          await uploadActivityImages(createdActivity.id, images);
          console.log("Images uploaded for activity ID:", createdActivity.id); // Debugging log
        } catch (imageUploadError) {
          console.error("Error uploading images:", imageUploadError);
          throw new Error("Failed to upload images. Please try again.");
        }
      }

      toast({
        title: "Success",
        description: "Activity created successfully",
      });

    } catch (error: unknown) {
      console.error("Error creating activity:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create activity. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files))
    }
  }

  useEffect(() => {
    if (countriesData) {
      setCountries(countriesData);
    }
  }, [countriesData, setCountries]);

  useEffect(() => {
    if (activityTypesData) {
      setActivityTypes(activityTypesData);
    }
  }, [activityTypesData, setActivityTypes]);

  useEffect(() => {
    if (citiesData) {
      setCities(citiesData);
    }
  }, [citiesData, setCities]);

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
          <form
            onSubmit={handleSubmit(onSubmit)} // Directly pass the onSubmit function
            className="space-y-6"
          >
            {Object.keys(errors).length > 0 && (
              <div className="text-red-500">
                <p>Validation Errors:</p>
                <ul>
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field}>{field}: {error.message}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Country and City Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country</Label>
                <select
                  id="country"
                  {...register("country")}
                  required
                  className="w-full p-2 border rounded-md"
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                  }}
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <select
                  id="city"
                  {...register("city")}
                  required
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select a city</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.name}>
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
                {...register("activityType")}
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
                  {...register("title")}
                  required
                  placeholder="Enter activity title"
                />
                {errors.title && <p className="text-red-500">{errors.title.message}</p>}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  required
                  placeholder="Describe your activity"
                  className="min-h-[100px]"
                />
                {errors.description && <p className="text-red-500">{errors.description.message}</p>}
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
                    type="number"
                    {...register("maxParticipants", { valueAsNumber: true })}
                    required
                    min="1"
                    placeholder="Enter max participants"
                    className="pl-10"
                  />
                </div>
                {errors.maxParticipants && <p className="text-red-500">{errors.maxParticipants.message}</p>}
              </div>

              <div>
                <Label htmlFor="price">Price per Person ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="price"
                    type="number"
                    {...register("price", { valueAsNumber: true })}
                    required
                    min="0"
                    step="0.01"
                    placeholder="Enter price"
                    className="pl-10"
                  />
                </div>
                {errors.price && <p className="text-red-500">{errors.price.message}</p>}
              </div>
            </div>

            {/* Capacity and Booked Capacity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bookedCapacity">Booked Capacity</Label>
                <Input
                  id="bookedCapacity"
                  type="number"
                  {...register("bookedCapacity", { valueAsNumber: true })}
                  required
                  min="0"
                  placeholder="Enter booked capacity"
                  className="pl-10"
                />
                {errors.bookedCapacity && <p className="text-red-500">{errors.bookedCapacity.message}</p>}
              </div>
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                {...register("address")}
                required
                placeholder="Enter address"
              />
              {errors.address && <p className="text-red-500">{errors.address.message}</p>}
            </div>
            {/* Minimum Participants */}
            <div>
              <Label htmlFor="minParticipants">Minimum Participants</Label>
              <Input
                id="minParticipants"
                type="number"
                {...register("minParticipants", { valueAsNumber: true })}
                required
                min="1"
                placeholder="Enter minimum participants"
                className="pl-10"
              />
              {errors.minParticipants && <p className="text-red-500">{errors.minParticipants.message}</p>}
            </div>

            {/* Duration in Minutes */}
            <div>
              <Label htmlFor="durationMinutes">Duration (Minutes)</Label>
              <Input
                id="durationMinutes"
                type="number"
                {...register("durationMinutes", { valueAsNumber: true })}
                required
                min="1"
                placeholder="Enter duration in minutes"
                className="pl-10"
              />
              {errors.durationMinutes && <p className="text-red-500">{errors.durationMinutes.message}</p>}
            </div>

            {/* Schedule Inputs */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register("startDate")}
                  required
                />
                {errors.startDate && <p className="text-red-500">{errors.startDate.message}</p>}
              </div>

              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  {...register("endDate")}
                  required
                />
                {errors.endDate && <p className="text-red-500">{errors.endDate.message}</p>}
              </div>

              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  {...register("startTime")}
                  required
                />
                {errors.startTime && <p className="text-red-500">{errors.startTime.message}</p>}
              </div>

              <div>
                <Label htmlFor="daysOfWeek">Days of the Week</Label>
                <select
                  id="daysOfWeek"
                  multiple
                  {...register("daysOfWeek")}
                  required
                  className="w-full p-2 border rounded-md"
                >
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <option key={day.toUpperCase()} value={day.toUpperCase()}>{day}</option>
                  ))}
                </select>
                <p className="text-sm text-muted-foreground">Hold Ctrl (Cmd on Mac) to select multiple days.</p>
                {errors.daysOfWeek && <p className="text-red-500">{errors.daysOfWeek.message}</p>}
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