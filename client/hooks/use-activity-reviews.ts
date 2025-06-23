"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reviewService } from '@/services/services';

export function useActivityReviews(activityId: string, initialPage = 0, pageSize = 10) {
  const [page, setPage] = useState(initialPage);
  
  const {
    data,
    error,
    isLoading,
    refetch,
    isPending,
  } = useQuery({
    queryKey: ['activityReviews', activityId, page, pageSize],
    queryFn: () => reviewService.getActivityReviews(activityId, page, pageSize),
    enabled: !!activityId,
  });
    const goToNextPage = () => {
    const totalItems = data?.statistics?.totalReviews || 0;
    const actualTotalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    
    if (data?.hasNext && page < actualTotalPages - 1) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  
  const goToPreviousPage = () => {
    if (data?.hasPrevious) {
      setPage((prevPage) => Math.max(0, prevPage - 1));
    }
  };
  
  const goToPage = (pageNumber: number) => {
    const maxPage = data?.totalPages ? data.totalPages - 1 : 0;
    setPage(Math.min(Math.max(0, pageNumber), maxPage));
  };
    // Calculate the actual total pages based on total items and page size
  const totalItems = data?.statistics?.totalReviews || 0;
  const actualTotalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  
  // Determine if there are truly next pages available
  const actualHasNext = page < actualTotalPages - 1 && (data?.reviews?.length || 0) >= pageSize;

  return {
    reviews: data?.reviews || [],
    statistics: data?.statistics,
    pagination: {
      currentPage: data?.currentPage || 0,
      totalPages: actualTotalPages,
      hasNext: actualHasNext,
      hasPrevious: data?.hasPrevious || false,
      goToNextPage,
      goToPreviousPage,
      goToPage,
    },
    isLoading,
    isPending,
    error,
    refetch,
  };
}
