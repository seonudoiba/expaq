import { create } from 'zustand';
import { activityService } from '@/lib/api/services';

export interface Activity {
  id: string;
  title: string;
  description: string;
  price: number;
  mediaUrls: string[];
  city: { name: string; id: string };
  country: { name: string; id: string };
  activityType: { name: string; id: string };
  startDate: string | Date;
  endDate: string | Date;
  averageRating: number;
  totalReviews: number;
  hostName: string;
  durationMinutes: number;
}

export interface ActivityFilters {
  city: string;
  country: string;
  activityType: string;
  minPrice: string;
  maxPrice: string;
  sortBy: string;
  querySearch?: string;
  when?: string;
  numOfPeople?: string;
}

interface ActivitiesState {
  activities: Activity[];
  filters: ActivityFilters;
  isLoading: boolean;
  error: Error | null;
  fetchActivities: () => Promise<void>;
  applyFilters: (filters: ActivityFilters) => Promise<void>;
  setFilters: (filters: Partial<ActivityFilters>) => void;
  clearFilters: () => void;
}

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
  
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
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
      }
    });
    get().fetchActivities();
  },
  
  fetchActivities: async () => {
    try {
      set({ isLoading: true });
      const activities = await activityService.getAll();
      set({ activities, isLoading: false, error: null });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error : new Error('Failed to fetch activities') 
      });
    }
  },  applyFilters: async () => {
    try {
      const { filters } = get();
      set({ isLoading: true });
      
      const activities = await activityService.getAll({
        city: filters.city || undefined,
        country: filters.country || undefined,
        activityType: filters.activityType || undefined,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        sortBy: filters.sortBy || undefined,
        querySearch: filters.querySearch || undefined,
        when: filters.when || undefined,
        numOfPeople: filters.numOfPeople || undefined,
      });
      
      set({ activities, isLoading: false, error: null });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error : new Error('Failed to fetch filtered activities') 
      });
    }
  },
}));