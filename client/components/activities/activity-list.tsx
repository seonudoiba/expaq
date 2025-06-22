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

export function ActivityList() {
  const { 
    activities, 
    isLoading, 
    error, 
    fetchActivities, 
    clearFilters,
    pagination,
    setPage
  } = useActivitiesStore();
  
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

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
      <div className="text-center py-10">
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          No activities found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {isLoading 
          ? "Loading activities..." 
          : error 
            ? `Error: ${(error as unknown) instanceof Error ? (error as Error).message : 'Unknown error'}` 
            : "Try adjusting your filters or create a new activity."}
        </p>
        
        {process.env.NODE_ENV !== 'production' && (
          <div className="mt-4 p-4 border border-gray-200 bg-gray-50 rounded-md inline-block text-left">
            <p className="font-bold text-sm mb-2">Debug Information:</p>
            <ul className="text-xs space-y-1">
              <li>Loading state: {isLoading ? 'true' : 'false'}</li>
              <li>Activities array: {Array.isArray(activities) ? `Array with ${activities.length} items` : typeof activities}</li>
              <li>Current page: {pagination.currentPage}</li>
              <li>Total pages: {pagination.totalPages}</li>
            </ul>
            <button 
              onClick={() => fetchActivities()}
              className="mt-2 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry Fetch
            </button>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div>      <div className="flex justify-between items-center my-6">
        <div>
          <h2 className="text-2xl font-bold">Activities</h2>
          <p className="text-sm text-gray-600 mt-1">
            {pagination.totalItems} activities found
          </p>
        </div>
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Clear Filters
        </button>
      </div>
      
      {/* Import this directly at the top of the file */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="mb-4">
          <p className="text-sm font-medium p-2 bg-yellow-100 border border-yellow-300 rounded">
            Debug mode: {activities.length} activities in state
          </p>
        </div>
      )}
      
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
}
