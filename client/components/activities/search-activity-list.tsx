"use client";

import { useEffect } from "react";
import { useActivitiesStore } from "@/lib/store/useActivitiesStore";
import { ActivityCard } from "@/components/activities/activity-card";
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { ActivityService } from "@/services/public-services";

// This component replaces ActivityList with search-specific logic
export const SearchActivityList = () => {
  const { 
    filters, 
    activities, 
    isLoading, 
    error,
    pagination,
    setPage
  } = useActivitiesStore();
    useEffect(() => {
    const fetchFilteredActivities = async () => {
      try {
        // Set loading state
        useActivitiesStore.setState({ isLoading: true });
        
        // Call the API service directly to get filtered activities
        const response = await ActivityService.getAll({
          querySearch: filters.querySearch || undefined,
          when: filters.when || undefined,
          numOfPeople: filters.numOfPeople || undefined,
          page: pagination.currentPage - 1, // API uses 0-based indexing
          limit: pagination.pageSize
        });
        
        // Then update the store directly to avoid circular dependencies
        useActivitiesStore.setState({ 
          activities: response.content, // Extract activities from content array
          pagination: {
            currentPage: response.number + 1, // Convert from 0-based to 1-based
            totalPages: response.totalPages,
            pageSize: response.size,
            totalItems: response.totalElements
          },
          isLoading: false, 
          error: null 
        });
      } catch (error) {
        useActivitiesStore.setState({
          isLoading: false,
          error: error instanceof Error ? error : new Error('Failed to fetch filtered activities')
        });
      }
    };
    
    // Fetch with a small delay to ensure filters are set
    const timer = setTimeout(() => {
      fetchFilteredActivities();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [filters.querySearch, filters.when, filters.numOfPeople, pagination.currentPage, pagination.pageSize]);

  // Generate pagination items based on current page and total pages
  const renderPaginationItems = () => {
    const items = [];
    const { currentPage, totalPages } = pagination;
    
    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink 
          onClick={() => setPage(1)} 
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Show ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Show pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              onClick={() => setPage(i)} 
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    
    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink 
            onClick={() => setPage(totalPages)} 
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

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
      <div className="rounded-lg bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading activities
            </h3>
            <div className="mt-2 text-sm text-red-700">
              {error instanceof Error ? error.message : "An error occurred"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center">
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          No activities found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search filters.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center my-6">
        <div>
          <h2 className="text-2xl font-bold">Search Results</h2>
          <p className="text-sm text-gray-600 mt-1">
            {pagination.totalItems} activities found
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
      
      {pagination.totalPages > 1 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setPage(Math.max(1, pagination.currentPage - 1))} 
                  aria-disabled={pagination.currentPage === 1}
                  className={pagination.currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {renderPaginationItems()}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setPage(Math.min(pagination.totalPages, pagination.currentPage + 1))} 
                  aria-disabled={pagination.currentPage === pagination.totalPages}
                  className={pagination.currentPage === pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};
