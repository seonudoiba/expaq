import { apiClient } from './client';
import type {
  City,
  Country,
  ActivityType,
  Activity
} from '@/types';

/**
 * Location-based API services
 */

export const CityService = {
  getAll: async (): Promise<City[]> => {
    const response = await apiClient.get<City[]>('/api/cities');
    return response.data;
  },
  
  getById: async (id: string): Promise<City> => {
    const response = await apiClient.get<City>(`/api/cities/${id}`);
    return response.data;
  },
  
  getActivities: async (cityId: string): Promise<Activity[]> => {
    const response = await apiClient.get<Activity[]>(`/api/cities/${cityId}/activities`);
    return response.data;
  },

  getFeaturedCities: async (limit?: number): Promise<City[]> => {
    const response = await apiClient.get<City[]>('/api/cities/featured', { 
      params: { limit } 
    });
    return response.data;
  }
};

export const CountryService = {
  getAll: async (): Promise<Country[]> => {
    const response = await apiClient.get<Country[]>('/api/countries');
    return response.data;
  },
  
  getById: async (id: string): Promise<Country> => {
    const response = await apiClient.get<Country>(`/api/countries/${id}`);
    return response.data;
  },
  
  getCities: async (countryId: string): Promise<City[]> => {
    const response = await apiClient.get<City[]>(`/api/countries/${countryId}/cities`);
    return response.data;
  },
  
  getActivities: async (countryId: string): Promise<Activity[]> => {
    const response = await apiClient.get<Activity[]>(`/api/countries/${countryId}/activities`);
    return response.data;
  },

  getFeatured: async (limit?: number): Promise<Country[]> => {
    const response = await apiClient.get<Country[]>('/api/countries/featured', { 
      params: { limit } 
    });
    return response.data;
  }
};

export const ActivityTypeService = {
  getAll: async (): Promise<ActivityType[]> => {
    const response = await apiClient.get<ActivityType[]>('/api/activity-types');
    return response.data;
  },
  
  getById: async (id: string): Promise<ActivityType> => {
    const response = await apiClient.get<ActivityType>(`/api/activity-types/${id}`);
    return response.data;
  },
  
  getActivities: async (activityTypeId: string): Promise<Activity[]> => {
    const response = await apiClient.get<Activity[]>(`/api/activity-types/${activityTypeId}/activities`);
    return response.data;
  },

  getFeatured: async (limit?: number): Promise<ActivityType[]> => {
    const response = await apiClient.get<ActivityType[]>('/api/activity-types/featured', { 
      params: { limit } 
    });
    return response.data;
  }
};
