import { apiClient } from '@/lib/api/client';
import { Activity } from '@/types/activity';

export const wishlistService = {
  /**
   * Get user's wishlist
   */
  getWishlist: async (page = 0, size = 20): Promise<Activity[]> => {
    try {
      const response = await apiClient.get<Activity[]>(`/api/wishlist?page=${page}&size=${size}`);
      console.log('Wishlist response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      return [];
    }
  },

  /**
   * Add activity to wishlist
   */
  addToWishlist: async (activityId: string): Promise<boolean> => {
    try {
      const response = await apiClient.post<string>(`/api/wishlist/add/${activityId}`);
      console.log('Added to wishlist:', response.data);
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }
  },

  /**
   * Remove activity from wishlist
   */
  removeFromWishlist: async (activityId: string): Promise<boolean> => {
    try {
      const response = await apiClient.delete<string>(`/api/wishlist/remove/${activityId}`);
      console.log('Removed from wishlist:', response.data);
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }
  },

  /**
   * Check if activity is in wishlist
   */
  isInWishlist: async (activityId: string): Promise<boolean> => {
    try {
      const response = await apiClient.get<boolean>(`/api/wishlist/check/${activityId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      return false;
    }
  },

  /**
   * Get wishlist count
   */
  getWishlistCount: async (): Promise<number> => {
    try {
      const response = await apiClient.get<number>('/api/wishlist/count');
      return response.data;
    } catch (error) {
      console.error('Error getting wishlist count:', error);
      return 0;
    }
  },

  /**
   * Clear entire wishlist
   */
  clearWishlist: async (): Promise<boolean> => {
    try {
      const response = await apiClient.delete<string>('/api/wishlist/clear');
      console.log('Wishlist cleared:', response.data);
      return true;
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      return false;
    }
  },

  /**
   * Get popular wishlisted activities
   */
  getPopularWishlistActivities: async (limit = 10): Promise<Activity[]> => {
    try {
      const response = await apiClient.get<Activity[]>(`/api/wishlist/popular?limit=${limit}`);
      console.log('Popular wishlist activities:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching popular wishlist activities:', error);
      return [];
    }
  },

  /**
   * Bulk add activities to wishlist
   */
  bulkAddToWishlist: async (activityIds: string[]): Promise<boolean> => {
    try {
      const response = await apiClient.post<string>('/api/wishlist/bulk-add', activityIds);
      console.log('Bulk added to wishlist:', response.data);
      return true;
    } catch (error) {
      console.error('Error bulk adding to wishlist:', error);
      return false;
    }
  },

  /**
   * Bulk remove activities from wishlist
   */
  bulkRemoveFromWishlist: async (activityIds: string[]): Promise<boolean> => {
    try {
      const response = await apiClient.post<string>('/api/wishlist/bulk-remove', activityIds);
      console.log('Bulk removed from wishlist:', response.data);
      return true;
    } catch (error) {
      console.error('Error bulk removing from wishlist:', error);
      return false;
    }
  },

  /**
   * Toggle activity in wishlist (add if not present, remove if present)
   */
  toggleWishlist: async (activityId: string): Promise<{ isInWishlist: boolean; success: boolean }> => {
    try {
      const isCurrentlyInWishlist = await wishlistService.isInWishlist(activityId);
      
      let success: boolean;
      if (isCurrentlyInWishlist) {
        success = await wishlistService.removeFromWishlist(activityId);
      } else {
        success = await wishlistService.addToWishlist(activityId);
      }
      
      return {
        isInWishlist: success ? !isCurrentlyInWishlist : isCurrentlyInWishlist,
        success,
      };
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      return { isInWishlist: false, success: false };
    }
  },
};

export default wishlistService;