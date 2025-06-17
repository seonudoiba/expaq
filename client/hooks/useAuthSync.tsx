"use client";

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/auth';

/**
 * A hook that ensures authentication state is fully loaded before rendering
 * your component. Use this to avoid the "flash of unauthenticated content".
 * 
 * @param requireAuth - If true, the hook returns isReady=false until authentication
 *                      is confirmed. If false, it returns isReady=true immediately
 *                      for public pages.
 * @returns An object containing the auth state and loading status
 */
export function useAuthSync(requireAuth = true) {
  const [isReady, setIsReady] = useState(!requireAuth);
  const { user, isLoading, getCurrentUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      // If we don't need authentication or already have a user, we're ready
      if (!requireAuth || user) {
        setIsReady(true);
        return;
      }

      // If we're still loading, wait for it to complete
      if (isLoading) {
        return;
      }

      // If we need auth but don't have a user yet, try to get the current user
      if (requireAuth && !user && !isLoading) {
        try {
          await getCurrentUser();
        } catch (error) {
          console.error('Failed to get current user:', error);
        } finally {
          // Whether successful or not, we're now ready to render
          setIsReady(true);
        }
      }
    };

    initAuth();
  }, [user, isLoading, requireAuth, getCurrentUser, isAuthenticated]);

  return {
    isReady,
    user,
    isLoading,
    isAuthenticated,
  };
}
