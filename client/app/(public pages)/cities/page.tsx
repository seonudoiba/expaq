"use client";

import { Suspense, useEffect, useState } from "react";
import { HeroSection } from "@/components/shared/hero-section";
import { LocationGrid } from "@/components/shared/location-grid";
import { City } from "@/types";
import { CityService } from "@/lib/api/location-services";
import { Skeleton } from "@/components/ui/skeleton";

export default function CitiesPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const data = await CityService.getAll();
        setCities(data);
      } catch (err) {
        console.error("Error fetching cities:", err);
        setError("Failed to load cities. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  return (
    <div>
      <HeroSection
        title="Explore Destinations"
        subtitle="Discover amazing cities around the world with unique experiences and activities"
        imageSrc="/discover.jpg"
      />

      <section className="container mx-auto py-16 px-6" id="browse">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Explore Cities</h2>
          <p className="text-gray-600">
            Browse our collection of amazing destinations with unique experiences and 
            activities curated by local hosts. From bustling metropolises to hidden gems, 
            find your next adventure.
          </p>
        </div>

        {error && (
          <div className="text-center py-10">
            <div className="text-red-500 mb-4">{error}</div>
            <button
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-60 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
          </div>
        ) : (
          <Suspense fallback={<div>Loading...</div>}>
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
          </Suspense>
        )}
      </section>
    </div>
  );
}
