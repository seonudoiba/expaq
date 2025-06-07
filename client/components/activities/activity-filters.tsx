"use client"
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { activityService, activityTypeService } from '@/lib/api/services';
import { Label } from "@/components/ui/label";
import type { ActivityType, Activity } from '@/types';

interface ActivityFiltersProps {
  onFilterChange?: (activities: Activity[]) => void;
}

export function ActivityFilters({ onFilterChange }: ActivityFiltersProps = {}) {
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    minPrice: '',
    maxPrice: '',
  });
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);

  // Fetch activity types from API
  const {
    data: activityTypesData,
    isLoading: isLoadingTypes,
  } = useQuery({
    queryKey: ["activityTypes"],
    queryFn: () => activityTypeService.getAll(),
  });

  // Fetch activities based on filters
  const { data: activities, isLoading } = useQuery({
    queryKey: ['activities', filters],
    queryFn: () =>
      activityService.getAll({
        location: filters.location || undefined,
        type: filters.type || undefined,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      }),
    enabled: true, // Enable the query to run on component mount
  });

  // When filters change or activities are loaded, notify parent component
  useEffect(() => {
    if (activities && onFilterChange) {
      onFilterChange(activities);
    }
  }, [activities, onFilterChange]);

  // Set activity types when data is loaded
  useEffect(() => {
    if (activityTypesData) {
      setActivityTypes(activityTypesData);
    }
  }, [activityTypesData]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-xl border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Filter Activities</h2>
      <div className="space-y-5">
        <div>
          <Label htmlFor="location" className="text-sm font-medium text-gray-700 mb-1 block">
            Location
          </Label>
          <div className="relative">
            <input
              type="text"
              name="location"
              id="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors duration-200"
              placeholder="City, Country or Address"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="type" className="text-sm font-medium text-gray-700 mb-1 block">
            Activity Type
          </Label>
          <div className="relative">
            <select
              name="type"
              id="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full appearance-none rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors duration-200"
            >
              <option value="">All Types</option>
              {isLoadingTypes ? (
                <option disabled>Loading types...</option>
              ) : (
                activityTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))
              )}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="minPrice" className="text-sm font-medium text-gray-700 mb-1 block">
              Min Price
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
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
            <Label htmlFor="maxPrice" className="text-sm font-medium text-gray-700 mb-1 block">
              Max Price
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
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
        </div>

        <div className="flex items-center pt-2 space-x-4">
          <button 
            onClick={() => setFilters({location: '', type: '', minPrice: '', maxPrice: ''})}
            className="flex-1 py-2 px-4 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Clear All
          </button>
          
          <button 
            className="flex-1 py-2 px-4 text-sm font-medium rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Updating results...
        </div>
      )}
    </div>
  );
}