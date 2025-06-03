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
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
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
