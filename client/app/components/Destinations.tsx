"use client"
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { countryService, cityService } from "@/lib/api/services";
import type { Location } from "@/types";

export default function Destinations() {
  // Fetch countries and cities
  const {
    data: countries,
    isLoading: loadingCountries,
    error: errorCountries,
  } = useQuery<Location[]>({
    queryKey: ["countries"],
    queryFn: () => countryService.getAll(),
  });
  const {
    data: cities,
    isLoading: loadingCities,
    error: errorCities,
  } = useQuery<Location[]>({
    queryKey: ["cities"],
    queryFn: () => cityService.getAll(),
  });

  if (loadingCountries || loadingCities) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-lg bg-white p-6 shadow">
            <div className="h-48 bg-gray-200 rounded-lg mb-4" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (errorCountries || errorCities) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading destinations
            </h3>
            <div className="mt-2 text-sm text-red-700">
              {errorCountries instanceof Error
                ? errorCountries.message
                : errorCities instanceof Error
                ? errorCities.message
                : "An error occurred"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Compute number of cities per country (now provided by API)
  const countryCards = (countries || []);
  const cityCards = (cities || []);

  return (
    <>
      <section className="container px-4 md:px-6 py-12 md:py-16 lg:py-20">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Top Countries</h2>
            <p className="text-muted-foreground mt-2">Explore Top Countries</p>
          </div>
          <Link
            href="/activities"
            className="flex items-center text-primary mt-4 md:mt-0"
          >
            View all Countries <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {countryCards.map((country) => (
            <div
              key={country.id}
              className="relative overflow-hidden rounded-lg shadow-md"
            >
              <Image
                src={country.image}
                alt={country.name}
                width={400}
                height={300}
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 cursor-pointer hover:scale-110 flex flex-col justify-center items-center text-white transition-all">
                <h5 className="text-lg font-semibold">{country.name}</h5>
                <span>{country.cityCount} Cities</span>
                <span className="mt-1 text-xs bg-primary/80 px-2 py-1 rounded-full font-semibold">{country.activityCount} Activities</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="container px-4 md:px-6 py-12 md:py-16 lg:py-20">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Top Cities</h2>
            <p className="text-muted-foreground mt-2">Explore Top Cities</p>
          </div>
          <Link
            href="/activities"
            className="flex items-center text-primary mt-4 md:mt-0"
          >
            View all Cities <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {cityCards.map((city) => (
            <div
              key={city.id}
              className="relative overflow-hidden rounded-lg shadow-md"
            >
              <Image
                src={city.image}
                alt={city.name}
                width={400}
                height={300}
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 cursor-pointer hover:scale-110 flex flex-col justify-center items-center text-white transition-all">
                <h5 className="text-lg font-semibold">{city.name}</h5>
                <span className="mt-1 text-xs bg-primary/80 px-2 py-1 rounded-full font-semibold">{city.activityCount} Activities</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
