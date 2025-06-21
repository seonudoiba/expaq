import { Activity } from '@/types/activity';
import { apiClient } from '@/lib/api/client';
import type {
  User,
  PaginatedUsersResponse,
  PaginatedResponse,
} from '@/types';

/**
 * Public API services for unauthenticated access
 */


export const ActivityService = {  getAll: async (params?: {
      city?: string;
      country?: string;
      activityType?: string;
      minPrice?: number;
      maxPrice?: number;
      sortBy?: string;
      querySearch?: string;
      when?: string;
      numOfPeople?: string;
      page?: number;
      limit?: number;
    }): Promise<PaginatedResponse<Activity>> => {
      const response = await apiClient.get<PaginatedResponse<Activity>>('/api/activities', { params });
      console.log('Activities response:', response.data);
      return response.data;
    },    getAllFeaturedActivities: async (params?: {
      location?: string;
      type?: string;
      minPrice?: number;
      maxPrice?: number;
      page?: number;
      limit?: number;
    }): Promise<PaginatedResponse<Activity>> => {
      const response = await apiClient.get<PaginatedResponse<Activity>>('/api/activities/featured', { params });
      console.log('Featured Activities response:', response.data);
      return response.data;
    },
  
    getAllHostActivities: async (host:string ,params?: {
      location?: string;
      type?: string;
      minPrice?: number;
      maxPrice?: number;
      page?: number;
      limit?: number;
    }): Promise<PaginatedResponse<Activity>> => {
      const response = await apiClient.get<PaginatedResponse<Activity>>(`/api/activities/host/${host}`, { params });
      console.log('Host activities response:', response.data);
      return response.data;
    },
  
    getById: async (id: string): Promise<Activity> => {
      const response = await apiClient.get<Activity>(`/api/activities/${id}`);
      return response.data;
    },
  
};

// Auth Services
export const AuthService = {

  getHostById: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/api/auth/${id}`);
    return response.data;
  },



  getHosts: async (): Promise<PaginatedUsersResponse> => {
    const response = await apiClient.get<PaginatedUsersResponse>('/api/auth/users-by-role?roleName=HOST');
    return response.data;
  },

};
