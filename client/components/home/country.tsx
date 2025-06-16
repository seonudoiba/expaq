"use client";

import { countryService } from "@/lib/api/services";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Country } from "@/types";

export default function Countries() {
  const {
    data: countries,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["countries"],
    queryFn: () => countryService.getAllCountries(),
  });
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>Error loading countries: {error.message}</p>
      </div>
    );
  }
  console.log(countries);

  return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {countries.map((country: Country, index: number) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg shadow-md"
            >
              <Image
                src={country.image}
                alt={country.name}
                width={400}
                height={300}
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 cursor-pointer hover:scale-110 flex flex-col justify-center items-center text-white">
                <h5 className="text-lg font-semibold">{country.name}</h5>
                <p className=" pt-2">{country.cityCount} Cities</p>
                <span>{country.activityCount} Activities</span>
              </div>
            </div>
          ))}
        </div>
  );
}
