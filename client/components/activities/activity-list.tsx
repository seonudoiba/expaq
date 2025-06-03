"use client"
import { useQuery } from '@tanstack/react-query';
import { activityService } from '@/lib/api/services';
import { ActivityCard } from './activity-card';
import { formatDate, formatPrice } from '@/lib/utils';

export function ActivityList() {
  const { data: activities, isLoading, error } = useQuery({
    queryKey: ['activities'],
    queryFn: () => activityService.getAll(),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg bg-white p-6 shadow"
          >
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
              {error instanceof Error ? error.message : 'An error occurred'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!activities?.length) {
    return (
      <div className="text-center">
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No activities</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new activity.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {activities.map((activity) => (
        <ActivityCard
          key={activity.id}
          id={activity.id}
          title={activity.title}
          description={activity.description}
          city ={activity.city}
          country={activity.country}
          activityType={activity.activityType}
          
          // city={activity.city }
          // country={{ name: activity.country }}
          location={activity.locationPoint}
          price={formatPrice(activity.price)}
          startDate={formatDate(activity.startDate)}
          endDate={formatDate(activity.endDate)}
          image={activity.mediaUrls?.[0] || "/default-image.jpg"}
          rating={activity.averageRating}
          reviewCount={activity.totalReviews}
        />
      ))}
    </div>
  );
}