import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { authService } from '@/lib/api/services';

interface AuthState {
  user: User | null;
  token: string | null;
  roles: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
  hasRole: (role: string | string[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      roles: [],
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authService.login({ email, password });
          // Set token as a cookie
          if (response.token) {
            document.cookie = `token=${response.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`; // Expires in 7 days
          }
          set({
            user: response.user,
            token: response.token,
            roles: response.user.roles || [],
            isAuthenticated: true,
            isLoading: false,
          });
          
          // Check for redirectTo in localStorage
          if (typeof window !== 'undefined') {
            const redirectTo = localStorage.getItem('redirectTo');
            if (redirectTo) {
              localStorage.removeItem('redirectTo');
              window.location.href = redirectTo;
            }
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authService.register(data);
          // Set token as a cookie
          if (response.token) {
            document.cookie = `token=${response.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`; // Expires in 7 days
          }
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        // Remove the cookie
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      getCurrentUser: async () => {
        const token = get().token;
        if (!token && typeof window !== 'undefined') {
          const cookieToken = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
          if (cookieToken) {
            set({ token: cookieToken });
          }
        }

        try {
          set({ isLoading: true, error: null });
          const user = await authService.getCurrentUser();
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
            isAuthenticated: false,
          });
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
          set({ token: null, user: null });
        }
      },

      hasRole: (role: string | string[]) => {
        const state = get();
        if (Array.isArray(role)) {
          // Check if user has ANY of the provided roles
          return role.some(r => state.roles.includes(r));
        }
        return state.roles.includes(role);
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);