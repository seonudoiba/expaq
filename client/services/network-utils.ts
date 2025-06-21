import { apiClient } from '@/lib/api/client';
import type {

  User,
  PaginatedUsersResponse,
} from '@/types';



// Auth Services
export const authService = {

  getHostById: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/api/auth/${id}`);
    return response.data;
  },
  getHosts: async (): Promise<PaginatedUsersResponse> => {
    const response = await apiClient.get<PaginatedUsersResponse>('/api/auth/users-by-role?roleName=HOST');
    return response.data;
  },
};
