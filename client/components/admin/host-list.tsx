'use client';
import { useQuery } from '@tanstack/react-query';
import { authService } from '@/lib/api/services';
import { UserProfile } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function HostList() {
  const {
    data: hostsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['hosts'],
    queryFn: authService.getHosts,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </CardContent>
          </Card>
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
              Error loading hosts
            </h3>
            <div className="mt-2 text-sm text-red-700">
              {error instanceof Error ? error.message : 'An error occurred'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hosts = hostsResponse?.content;

  if (!hosts?.length) {
    return (
      <div className="text-center">
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          No hosts found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          There are currently no hosts available.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {hosts.map((host: UserProfile) => (
        <Card key={host.id}>
          <CardHeader>
            <CardTitle>{host.firstName} {host.lastName}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{host.email}</p>
            {/* Add more host details here as needed */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
