"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Clock, Users, DollarSign, Image as ImageIcon, MapPin } from "lucide-react"
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
  const [addressVerification, setAddressVerification] = useState<{
    isVerifying?: boolean;
    isValid?: boolean;
    suggestions?: Array<{
      display_name: string;
      lat: number;
      lon: number;
    }>;
    formattedAddress?: string;
  } | null>(null)
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)
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
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm<z.infer<typeof activitySchema>>({
    resolver: zodResolver(activitySchema),
  });
  
  // Watch country and city fields to react to their changes
  const watchCountry = watch("country");
  const watchCity = watch("city");// Enhanced search for address suggestions with debouncing
  const debouncedAddressSearch = (address: string) => {
    if (!address || address.trim() === '') {
      setAddressVerification(null);
      return;
    }
    
    // Clear any existing timeout to implement debounce
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set a new timeout to delay the search
    const newTimeout = setTimeout(async () => {
      setAddressVerification(prev => ({ ...prev, isVerifying: true }));
      
      try {
        // Get the selected city and country for context
        const cityValue = getValues("city");
        const countryValue = getValues("country");
        
        // Log the values to help debug
        console.log("Address search values:", { 
          address, 
          cityValue, 
          countryValue,
          cityExists: cities.find(c => c.id === cityValue)?.name,
          countryExists: countries.find(c => c.id === countryValue)?.name
        });
        
        // Make sure city and country are selected
        if (!cityValue || !countryValue) {
          console.log("City or country not selected");
          setAddressVerification(null);
          return;
        }
        
        const cityName = cities.find((c) => c.id === cityValue)?.name;
        const countryName = countries.find((c) => c.id === countryValue)?.name;
        
        if (!cityName || !countryName) {
          console.log("City name or country name not found");
          setAddressVerification(null);
          return;
        }
        
        // Create a query based on available information, prioritizing specific address details first
        const query = `${address}, ${cityName}, ${countryName}`;
        console.log("Searching for address with query:", query);
        
        // Fetch address suggestions
        const result = await geocodingService.verifyAddress(query);
        console.log("Got address verification result:", result);
        
        // Always update the state with what we got
        setAddressVerification({
          isVerifying: false,
          isValid: result.isValid,
          suggestions: result.suggestions || [],
          formattedAddress: result.formattedAddress
        });
        
        // Log suggestions for debugging
        if (result.suggestions?.length) {
          console.log(`Found ${result.suggestions.length} suggestions for "${address}"`);
        } else {
          console.log(`No suggestions found for "${address}"`);
        }
      } catch (error) {
        console.error("Error searching addresses:", error);
        setAddressVerification({
          isVerifying: false,
          isValid: false,
          suggestions: []
        });
      }
    }, 300); // Faster debounce for better responsiveness
    
    // Save the timeout ID to be able to cancel it
    setSearchTimeout(newTimeout);
  };const onSubmit = async (data: z.infer<typeof activitySchema>) => {
    console.log("Form submitted with data:", data); // Debugging log
    setIsLoading(true);

    try {
      // Extract data from form
      const { address: originalAddress, city, country, startDate, endDate, ...rest } = data;
      
      // If we have a verified formatted address, use that instead of the original
      const address = addressVerification?.formattedAddress || originalAddress;
      
      // Make sure city and country are selected
      if (!city || !country) {
        toast({
          title: "Missing information",
          description: "Please select both a country and city",
          variant: "destructive",
          duration: 3000,
        });
        setIsLoading(false);
        return;
      }
      
      // Verify the address if not already verified
      if (!addressVerification?.isValid) {
        toast({
          title: "Address verification needed",
          description: "Please select a valid address from the suggestions",
          variant: "destructive",
          duration: 3000,
        });
        setIsLoading(false);
        return;
      }
      
      console.log("Processing data:", { address, city, country, rest }); // Debugging log

      const cityName = cities.find((c) => c.id === city)?.name;
      const countryName = countries.find((c) => c.id === country)?.name;

      if (!cityName || !countryName) {
        throw new Error("Invalid city or country selection.");
      }      // Use verified coordinates from address verification if available
      let latitude, longitude;
      
      if (addressVerification?.suggestions && addressVerification.suggestions.length > 0) {
        // Use the first suggestion's coordinates
        latitude = addressVerification.suggestions[0].lat;
        longitude = addressVerification.suggestions[0].lon;
        console.log("Using verified coordinates:", { latitude, longitude });
      } else {
        // Fallback to geocoding the address
        const query = `${address}, ${cityName}, ${countryName}`;
        console.log("Geocoding address:", query);
        
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
      }

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
  }, [citiesData, setCities]);  // Reset address when city or country changes
  useEffect(() => {
    console.log("Country or City changed:", { watchCountry, watchCity });
    
    // Reset address and verification when either city or country changes
    if (!watchCity || !watchCountry) {
      setValue("address", "");
      setAddressVerification(null);
    }
  }, [watchCity, watchCountry, setValue]);

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
            )}            {/* Country and City Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">              <div>
                <Label htmlFor="country">Country</Label>
                <select
                  id="country"
                  {...register("country")}
                  required
                  className="w-full p-2 border rounded-md"
                  onChange={(e) => {
                    // Reset the city and address selections when country changes
                    setValue("city", "");
                    setValue("address", "");
                    
                    // Clear any address verification data
                    setAddressVerification(null);
                    
                    // Update the selected country to trigger city fetch
                    setSelectedCountry(e.target.value);
                    
                    if (e.target.value) {
                      toast({
                        title: "Country selected",
                        description: `Now please select a city in ${countries.find(c => c.id === e.target.value)?.name}`,
                        duration: 3000,
                      });
                    }
                  }}
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <select
                  id="city"
                  {...register("city")}
                  required
                  className="w-full p-2 border rounded-md"
                  disabled={!selectedCountry} // Disable until country is selected
                  onChange={(e) => {
                    // Reset address when city changes
                    setValue("address", "");
                    
                    // Clear any address verification data
                    setAddressVerification(null);
                    
                    if (e.target.value) {
                      toast({
                        title: "City selected",
                        description: "Now you can enter and select an address",
                        duration: 3000,
                      });
                    }
                  }}
                >
                  <option value="">Select a city</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                {!selectedCountry && (
                  <p className="text-amber-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Please select a country first
                  </p>
                )}
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
            </div>            {/* Duration field */}
            <div>
              <Label htmlFor="durationMinutes">Duration (Minutes)</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="durationMinutes"
                  type="number"
                  {...register("durationMinutes", { valueAsNumber: true })}
                  required
                  min="1"
                  placeholder="Enter duration in minutes"
                  className="pl-10"
                />
              </div>
              {errors.durationMinutes && <p className="text-red-500">{errors.durationMinutes.message}</p>}
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
            </div>            {/* Address with Real-time Suggestions */}
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="address"
                    {...register("address")}
                    required
                    placeholder={!getValues("city") ? "Select country and city first" : "Enter address"}
                    className={`w-full pl-10 ${addressVerification?.isValid === false ? 'border-red-500' : addressVerification?.isValid === true ? 'border-green-500' : ''}`}
                    disabled={!getValues("city") || !getValues("country")} // Disable if city or country isn't selected
                    onChange={(e) => {
                      // Clear verification when user starts typing again
                      if (addressVerification) setAddressVerification(null);
                      // Make sure the field value is updated
                      setValue("address", e.target.value);
                      
                      // Fetch address suggestions as the user types (with debounce)
                      if (e.target.value.length > 2 && getValues("city") && getValues("country")) {
                        // Start searching with just 3 characters to provide faster feedback
                        debouncedAddressSearch(e.target.value);
                      }
                    }}
                    onBlur={() => {
                      // Verify address when user leaves the field
                      const addressValue = getValues("address");
                      if (addressValue && addressValue.length > 2 && getValues("city") && getValues("country") && !addressVerification?.isValid) {
                        debouncedAddressSearch(addressValue);
                      }
                    }}
                  />
                  {addressVerification?.isVerifying && (
                    <div className="absolute right-3 top-2.5">
                      <span className="animate-spin inline-block h-4 w-4 border-2 border-gray-300 border-t-primary rounded-full"></span>
                    </div>
                  )}
                </div>
              </div>
                {/* Hierarchical selection guidance */}
                            {/* Show appropriate guidance based on field state */}
              {(() => {
                const countryValue = getValues("country");
                const cityValue = getValues("city");
                
                if (!countryValue) {
                  return (
                    <p className="text-amber-500 text-sm flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Please select a country first
                    </p>
                  );
                } else if (!cityValue) {
                  return (
                    <p className="text-amber-500 text-sm flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Please select a city before entering an address
                    </p>
                  );
                }
                return null;
              })()}
              
              {/* Address validation feedback */}
              {addressVerification?.isValid === true && getValues("address") && (
                <p className="text-green-600 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Valid address confirmed
                </p>
              )}
              
              {addressVerification?.isValid === false && getValues("address") && !addressVerification?.isVerifying && (
                <p className="text-red-500 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Could not verify this address
                </p>
              )}              {/* Address suggestions dropdown - enhanced UI like Fiverr search */}
              {addressVerification?.suggestions && addressVerification.suggestions.length > 0 && (
                <div className="mt-2 bg-white border-2 border-blue-300 rounded-md shadow-2xl relative z-50" 
                     style={{ width: "100%" }}>
                  <div className="p-3 border-b bg-blue-50 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-800">Select an address from suggestions:</p>
                    <span className="ml-1 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {addressVerification.suggestions.length} found
                    </span>
                  </div>
                  <ul className="max-h-72 overflow-auto py-2">
                    {addressVerification.suggestions.map((suggestion, idx) => (
                      <li 
                        key={idx} 
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-200 border-b border-gray-100 last:border-0"
                        onClick={() => {
                          setValue("address", suggestion.display_name, { shouldValidate: true });
                          setAddressVerification({
                            isVerifying: false,
                            isValid: true,
                            suggestions: [],
                            formattedAddress: suggestion.display_name
                          });
                          toast({
                            title: "Address selected",
                            description: "Valid address confirmed from suggestions",
                            duration: 3000,
                          });
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 mt-0.5 text-blue-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div className="w-full">
                            <p className="font-medium text-gray-800">{suggestion.display_name.split(',')[0]}</p>
                            <p className="text-xs text-gray-500 mt-1">{suggestion.display_name.split(',').slice(1).join(',').trim()}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="p-2 border-t bg-gray-50 flex justify-between items-center">
                    <span className="text-xs text-gray-500">Click an address to select it</span>
                    <button 
                      type="button"
                      className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded text-gray-700 transition-colors" 
                      onClick={() => setAddressVerification({...addressVerification, suggestions: []})}
                    >
                      Close suggestions
                    </button>
                  </div>
                </div>
              )}
              
              {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
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