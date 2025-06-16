/**
 * Public API services for unauthenticated access
 */
import { PublicHostResponse } from '@/types/host';
import { Activity } from '@/types/activity';
import { PaginatedResponse } from '@/types';

export const publicApiService = {
  getHostById: async (id: string): Promise<PublicHostResponse> => {
    const response = await fetch(`/api/public/hosts/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch host data');
    }
    return response.json();
  },
  
  getActivityById: async (id: string): Promise<Activity> => {
    const response = await fetch(`/api/public/activities/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch activity data');
    }
    return response.json();
  },
  
  getActivities: async (params?: { 
    page?: number; 
    size?: number;
    search?: string;
    cityId?: string;
    countryId?: string;
    activityTypeId?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<PaginatedResponse<Activity>> => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const response = await fetch(`/api/public/activities?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch activities');
    }
    return response.json();
  }
};
