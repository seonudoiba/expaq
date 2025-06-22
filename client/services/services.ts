import { Activity, ActivityType } from '@/types/activity';
import { apiClient } from '@/lib/api/client';
import type {
  AuthResponse,
  BecomeHostRequest,
  CreateActivityRequest,
  UpdateActivityRequest,
  CreateReviewRequest,
  LoginRequest,
  RegisterRequest,
  PaginatedResponse,
  Review,
  User,  PaginatedUsersResponse,
  Booking,
  CreateBookingRequest,
} from '@/types';

// Add an interceptor to include auth details with every request
apiClient.interceptors.request.use((config) => {
  // First try to get token from localStorage
  const token = localStorage.getItem('auth-storage');
  let tokenObject = null;

  if (token) {
    try {
      tokenObject = JSON.parse(token);
      tokenObject = tokenObject.state.token; 
      console.log("Token found in localStorage:", tokenObject ? "Token exists" : "No token");
    } catch (error) {
      console.error('Failed to parse token from localStorage:', error);
    }
  }

  // If no token in localStorage, try cookies as fallback
  if (!tokenObject) {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    if (tokenCookie) {
      tokenObject = tokenCookie.split('=')[1];
      console.log("Token found in cookies:", tokenObject ? "Token exists" : "No token");
    }
  }

  if (tokenObject) {
    console.log("Using authorization header with token");
    config.headers.Authorization = `Bearer ${tokenObject}`;
  } else {
    console.warn("No authentication token found for request");
  }
  return config;
});

// Add response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.error('Authentication error (401):', error.response?.data);
      
      // Check if we should redirect to login
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        // Save current URL to redirect back after login
        localStorage.setItem('redirectTo', window.location.pathname);
        
        // Display notification (if using toast notification system)
        const event = new CustomEvent('auth:unauthorized', {
          detail: { 
            message: 'Your session has expired. Please log in again.',
            from: window.location.pathname
          }
        });
        window.dispatchEvent(event);
        
        // Delay redirect slightly to allow notification to show
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  },
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },
  

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/api/auth/me');
    return response.data;
  },  getHostById: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/api/auth/${id}`);
    return response.data;
  },

  requestPasswordReset: async (email: string): Promise<void> => {
    await apiClient.post('/api/auth/request-password-reset', { email });
  },

  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.get(`/api/auth/verify-email?token=${token}`);
  },

  getHosts: async (): Promise<PaginatedUsersResponse> => {
    const response = await apiClient.get<PaginatedUsersResponse>('/api/auth/users-by-role?roleName=HOST');
    return response.data;
  },  becomeHost: async (data?: BecomeHostRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/become-host', data);
    return response.data;
  },
};

// Booking Services
export const bookingService = {
   create: async (bookingData: CreateBookingRequest): Promise<Booking> => {
    const response = await apiClient.post<Booking>("/api/bookings", bookingData);
    return response.data;
  }
};
// Activity Services
export const activityService = {  
  
  getAll: async (params?: {
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
  },  
    getAllFeaturedActivities: async (params?: {
    location?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
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
  }): Promise<PaginatedResponse<Activity>> => {
    const response = await apiClient.get<PaginatedResponse<Activity>>(`/api/activities/host/${host}`, { params });
    console.log('Activities:', response.data);
    return response.data;
  },
  getHostDashboardActivities: async (host:string ,params?: {
    location?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Activity[]> => {
    const response = await apiClient.get<Activity[]>(`/api/activities/host/${host}`, { params });
    console.log('Activities:', response.data);
    return response.data;
  },

  getById: async (id: string): Promise<Activity> => {
    const response = await apiClient.get<Activity>(`/api/activities/${id}`);
    return response.data;
  },  create: async (activityData: CreateActivityRequest): Promise<Activity> => {    try {
      console.log("Creating activity with data:", activityData);
      
      // Verify timeSlots is an array and ensure no isAvailable field
      if (activityData.schedule && activityData.schedule.timeSlots) {
        console.log("timeSlots is an array:", Array.isArray(activityData.schedule.timeSlots));
        
        // Remove isAvailable field if it exists as it's not recognized by backend
        activityData.schedule.timeSlots = activityData.schedule.timeSlots.map(slot => {
          // Create a new object without the isAvailable property
          const { isAvailable, ...slotWithoutIsAvailable } = slot as any;
          return slotWithoutIsAvailable;
        });
        
        console.log("Updated timeSlots structure:", JSON.stringify(activityData.schedule.timeSlots));
      }
      
      // Log authentication status
      const token = localStorage.getItem('auth-storage');
      console.log("Auth token exists:", !!token);
      
      const response = await apiClient.post<Activity>("/api/activities", activityData);
      return response.data;
    } catch (error: any) { // Type as any to handle axios error structure
      console.error("Activity creation error:", error);
      
      // Enhance error with more context for debugging
      if (error && error.response) {
        console.error("Error status:", error.response.status);
        console.error("Error data:", error.response.data);
        
        // Special handling for 401 errors
        if (error.response.status === 401) {
          console.error("Authentication failed - token may be invalid or expired");
          
          // You could dispatch an event or update state here
          const event = new CustomEvent('auth:unauthorized', { 
            detail: { message: "Your session has expired" } 
          });
          window.dispatchEvent(event);
        }
      }
      
      throw error;
    }
  },

  update: async (id: string, data: Partial<UpdateActivityRequest>): Promise<Activity> => {
    const response = await apiClient.put<Activity>(`/api/activities/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/activities/${id}`);
  },
};

// Activity Type Services
export const activityTypeService = {
  getAll: async (): Promise<ActivityType[]> => {
    const response = await apiClient.get<ActivityType[]>('/api/activity-types');
    console.log('Activity types:', response.data);
    return response.data;
  },

};

// Review Services
export const reviewService = {
  create: async (data: CreateReviewRequest): Promise<Review> => {
    const response = await apiClient.post<Review>('/api/v1/reviews', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateReviewRequest>): Promise<Review> => {
    const response = await apiClient.put<Review>(`/api/v1/reviews/${id}`, data);
    return response.data;
  },
};

// File Services
export const fileService = {
  upload: async (file: File, type?: string): Promise<string> => {
    try {
      console.log('Uploading file:', file.name, 'Type:', type || 'default');
      
      const formData = new FormData();
      formData.append("file", file);
      if (type) {
        formData.append("type", type);
      }

      const response = await apiClient.post<string>(
        '/api/files/upload',
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
        console.log('File upload response:', response.data);
      
      // Ensure we always return HTTPS URLs
      const url = response.data;
      const secureUrl = typeof url === 'string' ? url.replace(/^http:\/\//i, 'https://') : url;
      
      console.log('Secure URL:', secureUrl);
      return secureUrl; // Returns the secure media URL as a string
    } catch (error: any) {
      console.error('File upload error:', error);
      if (error && error.response) {
        console.error("Error status:", error.response.status);
        console.error("Error data:", error.response.data);
      }
      throw new Error(error?.response?.data?.message || 'Failed to upload file');
    }
  }
};

// Country Services
export const countryService = {
  getAllCountries: async () => {
    const response = await apiClient.get('/api/countries');
    console.log('Countries:', response.data);
    return response.data;
  },
};

// City Services
export const cityService = {
  getAll: async () => {
    const response = await apiClient.get('/api/cities');
    return response.data;
  },
  getByCountry: async (countryId: string) => {
    const response = await apiClient.get(`/api/cities/country/${countryId}`);
    return response.data;
  }
};

export const geocodingService = {
  getCoordinates: async (query: string): Promise<{ latitude: number; longitude: number }> => {
    const response = await apiClient.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: query,
        format: 'json',
        addressdetails: 1,
        limit: 1,
      },
    });

    if (response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    } else {
      throw new Error(`No results found for the given location: ${query}`);
    }
  },
  
  verifyAddress: async (query: string): Promise<{
    isValid: boolean;
    suggestions: Array<{
      display_name: string;
      lat: number;
      lon: number;
    }>;
    formattedAddress?: string;
  }> => {
    interface NominatimResponse {
      display_name: string;
      lat: string;
      lon: string;
    }

    try {
      const response = await apiClient.get<NominatimResponse[]>('https://nominatim.openstreetmap.org/search', {
        params: {
          q: query,
          format: 'json',
          addressdetails: 1,
          limit: 5,
        },
        headers: {
          'User-Agent': 'ExpaqApp'
        }
      });

      if (response.data.length > 0) {
        return {
          isValid: true,
          suggestions: response.data.map((item: NominatimResponse) => ({
            display_name: item.display_name,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
          })),
          formattedAddress: response.data[0].display_name,
        };
      } else {
        return {
          isValid: false,
          suggestions: [],
        };
      }
    } catch (error) {
      console.error('Address verification error:', error);
      return {
        isValid: false,
        suggestions: [],
      };
    }
  },
};

export const uploadActivityImages = async (activityId: string, images: File[]) => {
  console.log('Uploading images for activity:', activityId, 'Images:', images);

  const uploadPromises = images.map((image) => {
    const formData = new FormData();
    formData.append("file", image);

    return apiClient.post(
      `/api/activities/${activityId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  });

  const responses = await Promise.all(uploadPromises);
  return responses.map((response) => response.data);
};