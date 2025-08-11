import { apiClient } from '@/lib/api/client';

export interface PlatformMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
  description: string;
}

export interface GrowthData {
  month: string;
  users: number;
  hosts: number;
  activities: number;
}

export interface CategoryData {
  name: string;
  value: number;
}

export interface RegionalData {
  name: string;
  value: number;
}

export interface PendingItem {
  type: string;
  count: number;
}

export interface DashboardData {
  platformMetrics: PlatformMetric[];
  growthData: GrowthData[];
  activityCategoryData: CategoryData[];
  regionalData: RegionalData[];
  pendingItems: {
    items: PendingItem[];
  };
  timestamp: string;
}

export const analyticsService = {
  /**
   * Get complete dashboard data
   */
  getDashboardData: async (): Promise<DashboardData> => {
    try {
      const response = await apiClient.get<DashboardData>('/api/analytics/dashboard');
      console.log('Dashboard data response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Return fallback data if API fails
      return getFallbackDashboardData();
    }
  },

  /**
   * Get platform metrics only
   */
  getPlatformMetrics: async (): Promise<PlatformMetric[]> => {
    try {
      const response = await apiClient.get<PlatformMetric[]>('/api/analytics/platform-metrics');
      console.log('Platform metrics response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching platform metrics:', error);
      return getFallbackMetrics();
    }
  },

  /**
   * Get growth data only
   */
  getGrowthData: async (): Promise<GrowthData[]> => {
    try {
      const response = await apiClient.get<GrowthData[]>('/api/analytics/growth-data');
      console.log('Growth data response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching growth data:', error);
      return getFallbackGrowthData();
    }
  },

  /**
   * Get activity categories data only
   */
  getCategoryData: async (): Promise<CategoryData[]> => {
    try {
      const response = await apiClient.get<CategoryData[]>('/api/analytics/activity-categories');
      console.log('Category data response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching category data:', error);
      return getFallbackCategoryData();
    }
  },
};

// Fallback data functions
function getFallbackDashboardData(): DashboardData {
  return {
    platformMetrics: getFallbackMetrics(),
    growthData: getFallbackGrowthData(),
    activityCategoryData: getFallbackCategoryData(),
    regionalData: getFallbackRegionalData(),
    pendingItems: {
      items: getFallbackPendingItems()
    },
    timestamp: new Date().toISOString()
  };
}

function getFallbackMetrics(): PlatformMetric[] {
  return [
    {
      title: "Total Users",
      value: "12,856",
      change: "+15.3%",
      trend: "up",
      icon: "UserCircle",
      description: "Total users on the platform"
    },
    {
      title: "Total Hosts",
      value: "1,432",
      change: "+8.7%",
      trend: "up",
      icon: "UserCircle",
      description: "Total hosts on the platform"
    },
    {
      title: "Active Activities",
      value: "3,245",
      change: "+12.4%",
      trend: "up",
      icon: "Box",
      description: "Currently active experiences"
    },
    {
      title: "Revenue (Month)",
      value: "$143,245",
      change: "+23.6%",
      trend: "up",
      icon: "PieChart",
      description: "Platform revenue this month"
    }
  ];
}

function getFallbackGrowthData(): GrowthData[] {
  return [
    { month: "Jan", users: 2500, hosts: 350, activities: 1200 },
    { month: "Feb", users: 3000, hosts: 400, activities: 1300 },
    { month: "Mar", users: 3400, hosts: 450, activities: 1450 },
    { month: "Apr", users: 4200, hosts: 480, activities: 1500 },
    { month: "May", users: 4800, hosts: 520, activities: 1700 },
    { month: "Jun", users: 5200, hosts: 550, activities: 1900 },
    { month: "Jul", users: 6100, hosts: 600, activities: 2200 },
    { month: "Aug", users: 6800, hosts: 700, activities: 2300 },
    { month: "Sep", users: 7500, hosts: 750, activities: 2500 },
    { month: "Oct", users: 8300, hosts: 820, activities: 2700 },
    { month: "Nov", users: 9100, hosts: 950, activities: 2900 },
    { month: "Dec", users: 10000, hosts: 1000, activities: 3100 },
  ];
}

function getFallbackCategoryData(): CategoryData[] {
  return [
    { name: "Cooking Classes", value: 30 },
    { name: "Language Exchange", value: 25 },
    { name: "Outdoor Adventures", value: 20 },
    { name: "Local Tours", value: 15 },
    { name: "Art & Craft", value: 10 }
  ];
}

function getFallbackRegionalData(): RegionalData[] {
  return [
    { name: 'New York', value: 24 },
    { name: 'London', value: 18 },
    { name: 'Tokyo', value: 15 },
    { name: 'Paris', value: 12 },
    { name: 'Sydney', value: 8 },
  ];
}

function getFallbackPendingItems(): PendingItem[] {
  return [
    { type: "Host Verification", count: 24 },
    { type: "Activity Approval", count: 37 },
    { type: "Refund Requests", count: 12 },
    { type: "User Reports", count: 7 },
  ];
}

export default analyticsService;