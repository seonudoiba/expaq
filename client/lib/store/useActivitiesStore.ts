import { create } from 'zustand';
import { ActivitiesState } from '@/types/activity';
import { ActivityService } from '../../services/public-services';

// Import Activity type from main types file instead of redefining
// import { Activity as ActivityType } from '@/types';

// Use the imported type
// export type Activity = ActivityType;

export const useActivitiesStore = create<ActivitiesState>((set, get) => ({
  activities: [],
  filters: {
    city: "",
    country: "",
    activityType: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "",
    querySearch: "",
    when: "",
    numOfPeople: "",
  },
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    pageSize: 9, // Default page size
    totalItems: 0,
  },
  
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, currentPage: 1 } // Reset to first page when filters change
    }));
  },
  
  clearFilters: () => {
    set({
      filters: {
        city: "",
        country: "",
        activityType: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "",
        querySearch: "",
        when: "",
        numOfPeople: "",
      },
      pagination: {
        ...get().pagination,
        currentPage: 1 // Reset to first page
      }
    });
    get().fetchActivities();
  },
  
  setPage: (page) => {
    set(state => ({
      pagination: { ...state.pagination, currentPage: page }
    }));
    get().fetchActivities();
  },
  
  setPageSize: (size) => {
    set(state => ({
      pagination: { ...state.pagination, pageSize: size, currentPage: 1 }
    }));
    get().fetchActivities();
  },    fetchActivities: async () => {
    try {
      set({ isLoading: true });
      const { filters, pagination } = get();
      
      // Convert filters to API parameters
      const params: Record<string, string | number | undefined> = {
        page: pagination.currentPage - 1, // API uses 0-based indexing
        limit: pagination.pageSize,
        city: filters.city || undefined,
        country: filters.country || undefined,
        activityType: filters.activityType || undefined,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        sortBy: filters.sortBy || undefined,
        querySearch: filters.querySearch || undefined,
        when: filters.when || undefined,
        numOfPeople: filters.numOfPeople || undefined
      };
      
      // Remove undefined values
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
      
      console.log("Fetching activities with params:", params);
      const response = await ActivityService.getAll(params);
      
      console.log("API response received:", response);
      
      // Handle the response structure properly
      if (response && Array.isArray(response.content)) {
        console.log(`Found ${response.content.length} activities in response`);
        
        set({ 
          activities: response.content, // Extract activities from content array
          pagination: {
            currentPage: (response.number || 0) + 1, // Convert from 0-based to 1-based
            totalPages: response.totalPages || 1,
            pageSize: response.size || pagination.pageSize,
            totalItems: response.totalElements || response.content.length
          },
          isLoading: false, 
          error: null 
        });
      } else {
        console.error("Invalid response format:", response);
        set({
          isLoading: false,
          error: new Error('Invalid response format from the API')
        });
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error : new Error('Failed to fetch activities') 
      });
    }
  },
    applyFilters: async () => {
    try {
      const { filters, pagination } = get();
      set({ isLoading: true });
      
      const response = await ActivityService.getAll({
        city: filters.city || undefined,
        country: filters.country || undefined,
        activityType: filters.activityType || undefined,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        sortBy: filters.sortBy || undefined,
        querySearch: filters.querySearch || undefined,
        when: filters.when || undefined,
        numOfPeople: filters.numOfPeople || undefined,
        page: pagination.currentPage - 1, // API uses 0-based indexing
        limit: pagination.pageSize
      });
      
      set({ 
        activities: response.content, // Extract activities from content array
        pagination: {
          currentPage: response.number + 1, // Convert from 0-based to 1-based
          totalPages: response.totalPages,
          pageSize: response.size,
          totalItems: response.totalElements
        },
        isLoading: false, 
        error: null 
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error : new Error('Failed to fetch filtered activities') 
      });
    }
  },
}));
