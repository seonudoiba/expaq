"use client"


import { useState, useEffect } from "react";
import { useActivitiesStore } from "@/lib/store/useActivitiesStore";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { useRouter } from "next/navigation";

import React from 'react'
import { MapPin, Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const HeroFilter = () => {
    const router = useRouter();
    const {
        filters,
        setFilters: updateFilters,
        applyFilters,
      } = useActivitiesStore();
    
      const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        filters.when ? new Date(filters.when) : undefined
      );
    
      // Handle date changes
      const handleDateChange = (date: Date | undefined) => {
        setSelectedDate(date);
        if (date) {
          // Format date as ISO string (YYYY-MM-DDThh:mm:ss)
          const formattedDate = date.toISOString().split(".")[0]; // Remove milliseconds
          updateFilters({ when: formattedDate });
    
          // Apply filters with a small delay
          setTimeout(() => applyFilters(filters), 300);
        } else {
          updateFilters({ when: "" });
          setTimeout(() => applyFilters(filters), 300);
        }
      };
    
      // Effect to update selectedDate when filters.when changes (e.g. from clearFilters)
      useEffect(() => {
        // If filters.when is cleared, reset selectedDate
        if (!filters.when) {
          setSelectedDate(undefined);
        } else if (
          filters.when &&
          (!selectedDate ||
            filters.when !== selectedDate.toISOString().split(".")[0])
        ) {
          // If filters.when is set and different from current selectedDate
          setSelectedDate(new Date(filters.when));
        }
      }, [filters.when, selectedDate]);
    
      const handleFilterChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      ) => {
        const { name, value } = e.target;
        // Update filters with the selected value
        updateFilters({ [name]: value });
    
        // Apply filters immediately when any input changes
        setTimeout(() => applyFilters(filters), 300); // Debounce for better performance
      };      // Form submit handler for search form that navigates to search-results page
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Create query parameters for the search
        const searchParams = new URLSearchParams();
        
        // Add filters to search params
        if (filters.querySearch) {
          searchParams.append("query", filters.querySearch);
        }
        
        if (filters.when) {
          searchParams.append("when", filters.when);
        }
        
        if (filters.numOfPeople) {
          searchParams.append("numOfPeople", filters.numOfPeople);
        }
        
        // Navigate to search results page with the search parameters
        router.push(`/search-results?${searchParams.toString()}`);
      };
  return (
    <div className="w-full max-w-4xl md:max-w-5xl my-6 bg-white rounded-lg shadow-lg p-4">
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                          placeholder="Where are you going?"
                          value={filters.querySearch}
                          name="querySearch"
                          onChange={handleFilterChange}
                          className="pl-10"
                        />
                      </div>{" "}
                      <div className="relative">
                        <DateTimePicker
                          date={selectedDate}
                          setDate={handleDateChange}
                          placeholder="When would you like to go?"
                        />
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
                      </div>{" "}                      <button 
                        type="submit" 
                        className="w-full flex items-center justify-center bg-primary text-white p-2 rounded-md hover:bg-primary/90 transition-colors cursor-pointer"
                      >
                        <Search className="mr-2 h-4 w-4" />
                        <span>Search</span>
                      </button>
                    </div>
                  </form>
                </div>
  )
}

export default HeroFilter