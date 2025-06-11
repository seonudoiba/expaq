"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  activityTypeService,
  cityService,
  countryService,
} from "@/lib/api/services";
import { Label } from "@/components/ui/label";
import type { ActivityType, City, Country } from "@/types";
import { useActivitiesStore } from "@/lib/store/useActivitiesStore";

import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, Users } from "lucide-react";

export function ActivityFilters() {
  const { 
    filters, 
    setFilters: updateFilters, 
    applyFilters,
    clearFilters,
    isLoading
  } = useActivitiesStore();
  
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);


  const sortData = [
    { label: "Most Popular", value: "popular" },
    { label: "Price: Low to High", value: "lowPrice" },
    { label: "Price: High to Low", value: "highPrice" },
    { label: "Rating: High to Low", value: "highRating" },
    { label: "Rating: Low to High", value: "lowRating" },
]

  // Fetch activity types from API
  const { data: activityTypesData, isLoading: isLoadingTypes } = useQuery({
    queryKey: ["activityTypes"],
    queryFn: () => activityTypeService.getAll(),
  });

  // Fetch cities from API
  const { data: citiesData, isLoading: isLoadingCities } = useQuery({
    queryKey: ["cities"],
    queryFn: () => cityService.getAll(),
  });
  // Fetch countries from API
  const { data: countriesData, isLoading: isLoadingCountries } = useQuery({
    queryKey: ["countries"],
    queryFn: () => countryService.getAllCountries(),
  });
  // Since we're now using the Zustand store, no need to fetch activities here
  // The store will handle loading activities based on filters
  // No need for ID maps since we're using names directly
  // Set data when loaded from the API
  useEffect(() => {
    if (activityTypesData) {
      setActivityTypes(activityTypesData);
    }
    if (citiesData) {
      setCities(citiesData);
    }
    if (countriesData) {
      setCountries(countriesData);
    }
  }, [activityTypesData, citiesData, countriesData]);
  
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
      // Update filters with the selected value
    updateFilters({ [name]: value });
    
    // Apply filters immediately when any input changes
    setTimeout(() => applyFilters(filters), 300); // Debounce for better performance
  };
  // Form submit handler (for search form) 
  // We'll keep the form for structure, but it doesn't need to do anything special
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-4">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Where are you looking for?" value={filters.querySearch} name="querySearch" onChange={handleFilterChange} className="pl-10" />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input placeholder="When?" value={filters.when} name="when" onChange={handleFilterChange} className="pl-10" />
            </div>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Number of people" 
                name="numOfPeople"
                value={filters.numOfPeople}
                onChange={handleFilterChange}
                className="pl-10" 
              />
            </div>            <div className="w-full flex items-center justify-center bg-primary text-white p-2 rounded-md">
              <Search className="mr-2 h-4 w-4" /> 
              <span>Search results update as you type</span>
            </div>
          </div>
        </form>
      </div>
      <div className="bg-white p-6 shadow-md rounded-xl border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Filter Activities
        </h2>
        <div className="space-y-5 flex items-end flex-wrap gap-4">
          <div className="min-w-[168px]">
            <Label
              htmlFor="type"
              className="text-sm font-medium text-gray-700 mb-1 block"
            >
              Activity Type
            </Label>
            <div className="relative">
              <select
                name="activityType"
                id="activityType"
                value={filters.activityType}
                onChange={handleFilterChange}
                className="w-full appearance-none rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors duration-200"
              >
                <option value="">All Types</option>
                {isLoadingTypes ? (
                  <option disabled>Loading types...</option>
                ) : (
                  activityTypes.map((activityType) => (
                    <option key={activityType.id} value={activityType.name}>
                      {activityType.name}
                    </option>
                  ))
                )}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="min-w-[168px]">
            <Label
              htmlFor="type"
              className="text-sm font-medium text-gray-700 mb-1 block"
            >
              City
            </Label>
            <div className="relative">
              <select
                name="city"
                id="city"
                value={filters.city}
                onChange={handleFilterChange}
                className="w-full appearance-none rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors duration-200"
              >
                <option value="">All Cities</option>
                {isLoadingCities ? (
                  <option disabled>Loading cities...</option>
                ) : (
                  cities.map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.name}
                    </option>
                  ))
                )}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="min-w-[168px]">
            <Label
              htmlFor="type"
              className="text-sm font-medium text-gray-700 mb-1 block"
            >
              Country
            </Label>
            <div className="relative">
              <select
                name="country"
                id="country"
                value={filters.country}
                onChange={handleFilterChange}
                className="w-full appearance-none rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors duration-200"
              >
                <option value="">All Countries</option>
                {isLoadingCountries ? (
                  <option disabled>Loading countries...</option>
                ) : (
                  countries.map((country) => (
                    <option key={country.id} value={country.name}>
                      {country.name}
                    </option>
                  ))
                )}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="min-w-[168px]">
            <Label
              htmlFor="type"
              className="text-sm font-medium text-gray-700 mb-1 block"
            >
              Sort By
            </Label>
            <div className="relative">
              <select
                name="sortBy"
                id="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                className="w-full appearance-none rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors duration-200"
              >
                <option value="">Default</option>
                {sortData.map((option) => (
                    <option key={option.label} value={option.value}>
                      {option.label}
                    </option>
                )
                )}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="minPrice"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                Min Price
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  name="minPrice"
                  id="minPrice"
                  min="0"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  className="w-full pl-8 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors duration-200"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="maxPrice"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                Max Price
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  name="maxPrice"
                  id="maxPrice"
                  min="0"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="w-full pl-8 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors duration-200"
                  placeholder="9999"
                />
              </div>
            </div>
          </div>          <div className="flex items-center pt-2">
            <button
              type="button"
              onClick={clearFilters}
              className="flex-1 py-2 px-4 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Clear All
            </button>
          </div>
        </div>        {isLoading && (
          <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Updating results...
          </div>
        )}
        
        {!isLoading && (
          <div className="mt-4 flex items-center justify-center text-sm text-green-600">
            <span>Filters are applied in real-time</span>
          </div>
        )}
      </div>
    </>
  );
}
