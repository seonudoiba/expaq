/* eslint-disable react/no-unescaped-entities */
"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { DetailHeader } from "@/components/shared/detail-header";
import { FeaturedActivities, Activity } from "@/components/shared/featured-activities";
import { City, Country } from "@/types";
// import { CityService, CountryService } from "@/lib/api/location-services";
import { MapPin, Globe, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CityService, CountryService } from "@/services/location-services";

export default function CityDetailPage() {
  const params = useParams();
  const [city, setCity] = useState<City | null>(null);
  const [country, setCountry] = useState<Country | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCityDetails = async () => {
      try {
        setLoading(true);
        const cityData = await CityService.getById(params.id as string);
        setCity(cityData);
        
        // Get country information
        if (cityData.countryId) {
          const countryData = await CountryService.getById(cityData.countryId);
          setCountry(countryData);
        }
        
        // Get activities in this city
        const activitiesData = await CityService.getActivities(params.id as string);
        setActivities(activitiesData);
      } catch (err) {
        console.error("Error fetching city details:", err);
        setError("Failed to load city details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCityDetails();
    }
  }, [params.id]);

  if (error) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-red-500 mb-6">{error}</p>
        <Button asChild>
          <Link href="/cities">Back to Cities</Link>
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <Skeleton className="h-[50vh] w-full" />
        <div className="container mx-auto py-10 px-6">
          <Skeleton className="h-10 w-1/3 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Skeleton className="h-40 w-full mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array(4).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-60 w-full" />
                ))}
              </div>
            </div>
            <div>
              <Skeleton className="h-60 w-full mb-4" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!city) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">City Not Found</h2>
        <p className="mb-6">The city you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/cities">View All Cities</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <DetailHeader
        name={city.name}
        image={city.image || "/default.png"}
        stats={[
          {
            label: "Activities",
            value: city.activityCount,
            icon: "calendar",
          },
          {
            label: "Country",
            value: country?.name || "Unknown",
            icon: "map",
          },
        ]}
        backLink={{
          href: "/cities",
          label: "Back to Cities",
        }}
      />

      <section className="container mx-auto py-10 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="prose max-w-none mb-10">
              <h2 className="text-2xl font-bold mb-4">About {city.name}</h2>
              <p className="text-gray-700">
                {city.name} is a vibrant destination where culture, history, and modernity blend seamlessly. 
                Visitors can explore local attractions, enjoy the cuisine, and participate in 
                a variety of activities hosted by locals who know the city best.
              </p>
            </div>

            {activities.length > 0 ? (
              <FeaturedActivities
                activities={activities}
                title={`Experiences in ${city.name}`}
                viewAllHref={`/activities?city=${city.id}`}
              />
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <h3 className="text-xl font-medium mb-2">No activities yet</h3>
                <p className="text-gray-600 mb-4">
                  There are no activities available in {city.name} at the moment.
                </p>
                <Button asChild>
                  <Link href="/activities">Browse All Activities</Link>
                </Button>
              </div>
            )}
          </div>

          <aside>
            <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Location Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <span className="block text-sm text-gray-500">City</span>
                    <span className="font-medium">{city.name}</span>
                  </div>
                </div>
                
                {country && (
                  <div className="flex items-start">
                    <Globe className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <span className="block text-sm text-gray-500">Country</span>
                      <Link 
                        href={`/countries/${country.id}`}
                        className="font-medium hover:text-primary"
                      >
                        {country.name}
                      </Link>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <span className="block text-sm text-gray-500">Activities</span>
                    <span className="font-medium">{city.activityCount} available experiences</span>
                  </div>
                </div>
                
                {/* Call to action */}
                <Button className="w-full mt-4" asChild>
                  <Link href={`/activities?city=${city.id}`}>
                    Browse All Activities
                  </Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
