import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { activityService } from '@/lib/api/services';

export function ActivityFilters() {
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    minPrice: '',
    maxPrice: '',
  });

  const { data: activities, isLoading } = useQuery({
    queryKey: ['activities', filters],
    queryFn: () =>
      activityService.getAll({
        location: filters.location || undefined,
        type: filters.type || undefined,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      }),
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="text-lg font-medium text-gray-900">Filters</h2>
      <div className="mt-4 space-y-4">
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <input
            type="text"
            name="location"
            id="location"
            value={filters.location}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="Enter location"
          />
        </div>

        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700"
          >
            Type
          </label>
          <select
            name="type"
            id="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="">All Types</option>
            <option value="outdoor">Outdoor</option>
            <option value="indoor">Indoor</option>
            <option value="sports">Sports</option>
            <option value="cultural">Cultural</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="minPrice"
            className="block text-sm font-medium text-gray-700"
          >
            Min Price
          </label>
          <input
            type="number"
            name="minPrice"
            id="minPrice"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="Enter min price"
          />
        </div>

        <div>
          <label
            htmlFor="maxPrice"
            className="block text-sm font-medium text-gray-700"
          >
            Max Price
          </label>
          <input
            type="number"
            name="maxPrice"
            id="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="Enter max price"
          />
        </div>
      </div>

      {isLoading && (
        <div className="mt-4 text-sm text-gray-500">Updating results...</div>
      )}
    </div>
  );
} 