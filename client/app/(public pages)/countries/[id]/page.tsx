/* eslint-disable react/no-unescaped-entities */
"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { DetailHeader } from "@/components/shared/detail-header";
import { FeaturedActivities } from "@/components/shared/featured-activities";
import { LocationGrid } from "@/components/shared/location-grid";
import { Country, City } from "@/types";
import { CountryService } from "@/services/location-services";
import { MapPin, Building, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity } from "@/types/activity";

export default function CountryDetailPage() {
  const params = useParams();
  const [country, setCountry] = useState<Country | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountryDetails = async () => {
      try {
        setLoading(true);
        const countryData = await CountryService.getById(params.id as string);
        setCountry(countryData);
        
        // Get cities in this country
        const citiesData = await CountryService.getCities(params.id as string);
        setCities(citiesData);
        
        // Get activities in this country
        const activitiesData = await CountryService.getActivities(params.id as string);
        setActivities(activitiesData);
      } catch (err) {
        console.error("Error fetching country details:", err);
        setError("Failed to load country details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCountryDetails();
    }
  }, [params.id]);

  if (error) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-red-500 mb-6">{error}</p>
        <Button asChild>
          <Link href="/countries">Back to Countries</Link>
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

  if (!country) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Country Not Found</h2>
        <p className="mb-6">The country you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/countries">View All Countries</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <DetailHeader
        name={country.name}
        image={country.image || "/default.png"}
        stats={[
          {
            label: "Cities",
            value: country.cityCount,
            icon: "map",
          },
          {
            label: "Activities",
            value: country.activityCount,
            icon: "calendar",
          },
        ]}
        backLink={{
          href: "/countries",
          label: "Back to Countries",
        }}
      />

      <section className="container mx-auto py-10 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="prose max-w-none mb-10">
              <h2 className="text-2xl font-bold mb-4">About {country.name}</h2>
              <p className="text-gray-700">
                {country.name} offers travelers a rich tapestry of experiences, from its vibrant cities to 
                its cultural heritage. Visitors can explore diverse landscapes, enjoy local cuisines, 
                and immerse themselves in the unique traditions and lifestyles.
              </p>
            </div>

            <Tabs defaultValue="cities" className="mb-10">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cities">Cities ({cities.length})</TabsTrigger>
                <TabsTrigger value="activities">Activities ({activities.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="cities" className="pt-6">
                {cities.length > 0 ? (
                  <LocationGrid
                    items={cities.map(city => ({
                      id: city.id,
                      name: city.name,
                      image: city.image,
                      itemCount: city.activityCount,
                      countryId: city.countryId
                    }))}
                    type="city"
                    linkPrefix="cities"
                  />
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <h3 className="text-xl font-medium mb-2">No cities available</h3>
                    <p className="text-gray-600 mb-4">
                      There are no cities listed for {country.name} at the moment.
                    </p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="activities" className="pt-6">
                {activities.length > 0 ? (
                  <FeaturedActivities
                    activities={activities}
                    title={`Experiences in ${country.name}`}
                    viewAllHref={`/activities?country=${country.id}`}
                  />
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <h3 className="text-xl font-medium mb-2">No activities yet</h3>
                    <p className="text-gray-600 mb-4">
                      There are no activities available in {country.name} at the moment.
                    </p>
                    <Button asChild>
                      <Link href="/activities">Browse All Activities</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <aside>
            <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Country Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <span className="block text-sm text-gray-500">Country</span>
                    <span className="font-medium">{country.name}</span>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Building className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <span className="block text-sm text-gray-500">Cities</span>
                    <span className="font-medium">{country.cityCount} destinations</span>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <span className="block text-sm text-gray-500">Activities</span>
                    <span className="font-medium">{country.activityCount} experiences</span>
                  </div>
                </div>
                
                {/* Call to action */}
                {cities.length > 0 && (
                  <Button className="w-full mt-4" asChild>
                    <Link href="#cities">
                      Explore Cities
                    </Link>
                  </Button>
                )}
                
                <Button className="w-full mt-2" variant="outline" asChild>
                  <Link href={`/activities?country=${country.id}`}>
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
