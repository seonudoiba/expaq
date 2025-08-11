import { apiClient } from '@/lib/api/client';
import { Activity } from '@/types/activity';

export interface RecommendationParams {
  limit?: number;
}

export interface LocationRecommendationParams extends RecommendationParams {
  city: string;
  country?: string;
}

export const recommendationService = {
  /**
   * Get personalized recommendations for authenticated user
   */
  getUserRecommendations: async (params: RecommendationParams = {}): Promise<Activity[]> => {
    try {
      const { limit = 10 } = params;
      const response = await apiClient.get<Activity[]>(`/api/recommendations/user?limit=${limit}`);
      console.log('User recommendations response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user recommendations:', error);
      return [];
    }
  },

  /**
   * Get popular activities
   */
  getPopularActivities: async (params: RecommendationParams = {}): Promise<Activity[]> => {
    try {
      const { limit = 10 } = params;
      const response = await apiClient.get<Activity[]>(`/api/recommendations/popular?limit=${limit}`);
      console.log('Popular activities response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching popular activities:', error);
      return [];
    }
  },

  /**
   * Get trending activities
   */
  getTrendingActivities: async (params: RecommendationParams = {}): Promise<Activity[]> => {
    try {
      const { limit = 10 } = params;
      const response = await apiClient.get<Activity[]>(`/api/recommendations/trending?limit=${limit}`);
      console.log('Trending activities response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching trending activities:', error);
      return [];
    }
  },

  /**
   * Get activities similar to a specific activity
   */
  getSimilarActivities: async (activityId: string, params: RecommendationParams = {}): Promise<Activity[]> => {
    try {
      const { limit = 5 } = params;
      const response = await apiClient.get<Activity[]>(`/api/recommendations/similar/${activityId}?limit=${limit}`);
      console.log('Similar activities response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching similar activities:', error);
      return [];
    }
  },

  /**
   * Get location-based recommendations
   */
  getLocationRecommendations: async (params: LocationRecommendationParams): Promise<Activity[]> => {
    try {
      const { city, country, limit = 10 } = params;
      const queryParams = new URLSearchParams({
        city,
        limit: limit.toString(),
      });
      
      if (country) {
        queryParams.append('country', country);
      }

      const response = await apiClient.get<Activity[]>(`/api/recommendations/location?${queryParams}`);
      console.log('Location recommendations response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching location recommendations:', error);
      return [];
    }
  },
};

export default recommendationService;