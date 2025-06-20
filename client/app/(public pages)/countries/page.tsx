"use client";

import { Suspense, useEffect, useState } from "react";
import { HeroSection } from "@/components/shared/hero-section";
import { LocationGrid } from "@/components/shared/location-grid";
import { Country } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { CountryService } from "@/services/location-services";

export default function CountriesPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const data = await CountryService.getAll();
        setCountries(data);
      } catch (err) {
        console.error("Error fetching countries:", err);
        setError("Failed to load countries. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return (
    <div>
      <HeroSection
        title="Explore Countries"
        subtitle="Discover amazing destinations across the globe with unique cultures and experiences"
        imageSrc="/hero2.jpg"
        overlayColor="rgba(0, 0, 0, 0.5)"
      />

      <section className="container mx-auto py-16 px-6" id="browse">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Worldwide Destinations</h2>
          <p className="text-gray-600">
            Explore countries around the world, each offering unique cultures, landscapes, and 
            experiences. From popular tourist destinations to off-the-beaten-path adventures, 
            find your next travel inspiration.
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
              items={countries.map(country => ({
                id: country.id,
                name: country.name,
                image: country.image,
                itemCount: country.cityCount,
                subTitle: `${country.activityCount} Activities`
              }))}
              type="country"
              linkPrefix="countries"
            />
          </Suspense>
        )}
      </section>
    </div>
  );
}
