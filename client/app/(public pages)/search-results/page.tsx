"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useActivitiesStore } from "@/lib/store/useActivitiesStore";
import { SearchActivityList } from "@/components/activities/search-activity-list";

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const { setFilters } = useActivitiesStore();
  
  // Get search parameters
  const query = searchParams.get("query") || "";
  const when = searchParams.get("when") || "";
  const numOfPeople = searchParams.get("numOfPeople") || "";
  
  // Apply search filters from URL parameters when the page loads - only once
  useEffect(() => {
    // Create a new filters object based on URL parameters
    const newFilters = {
      querySearch: query,
      when: when,
      numOfPeople: numOfPeople,
      // Add required empty fields to match ActivityFilters type
      city: "",
      country: "",
      activityType: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "",
    };
    
    // Set the filters - the SearchActivityList component will handle fetching
    setFilters(newFilters);
    
  }, [query, when, numOfPeople, setFilters]);

  return (
    <section className="py-1 md:py-1 lg:py-2 px-6">
      <div className="flex items-center justify-between py-4 container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Search Results
            </h2>
            <p className="text-muted-foreground mt-2">
              {query ? `Showing results for "${query}"` : "All activities"}
            </p>
          </div>
        </div>
      </div>      <div className="container px-4 md:px-6 py-4">
        <Suspense fallback={<div>Loading activities...</div>}>
          <SearchActivityList />
        </Suspense>
      </div>
    </section>
  );
}
