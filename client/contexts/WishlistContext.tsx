"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { wishlistService } from '@/services/wishlist-service';
import { Activity } from '@/types/activity';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/components/ui/use-toast';

interface WishlistContextType {
  wishlist: Activity[];
  wishlistCount: number;
  isLoading: boolean;
  
  // Actions
  addToWishlist: (activityId: string) => Promise<boolean>;
  removeFromWishlist: (activityId: string) => Promise<boolean>;
  toggleWishlist: (activityId: string) => Promise<boolean>;
  clearWishlist: () => Promise<boolean>;
  isInWishlist: (activityId: string) => boolean;
  
  // Bulk actions
  bulkAddToWishlist: (activityIds: string[]) => Promise<boolean>;
  bulkRemoveFromWishlist: (activityIds: string[]) => Promise<boolean>;
  
  // Utility
  loadMoreWishlist: () => void;
  refreshWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

interface WishlistProviderProps {
  children: ReactNode;
}

export function WishlistProvider({ children }: WishlistProviderProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [wishlist, setWishlist] = useState<Activity[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Fetch wishlist
  const { data: wishlistData, isLoading, refetch } = useQuery({
    queryKey: ['wishlist', page],
    queryFn: () => wishlistService.getWishlist(page, 20),
    enabled: !!user,
  });

  // Fetch wishlist count
  const { data: wishlistCount = 0 } = useQuery({
    queryKey: ['wishlist-count'],
    queryFn: wishlistService.getWishlistCount,
    enabled: !!user,
    refetchInterval: 60000, // Refetch every minute
  });

  // Update wishlist when data changes
  useEffect(() => {
    if (wishlistData) {
      if (page === 0) {
        setWishlist(wishlistData);
      } else {
        setWishlist(prev => [...prev, ...wishlistData]);
      }
      setHasMore(wishlistData.length === 20); // Assume no more if less than page size
    }
  }, [wishlistData, page]);

  // Add to wishlist mutation
  const addMutation = useMutation({
    mutationFn: wishlistService.addToWishlist,
    onSuccess: (success, activityId) => {
      if (success) {
        // Optimistically update local state
        queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        queryClient.invalidateQueries({ queryKey: ['wishlist-count'] });
        
        toast({
          title: "Added to Wishlist",
          description: "Activity has been added to your wishlist",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add activity to wishlist",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add activity to wishlist",
        variant: "destructive",
      });
    },
  });

  // Remove from wishlist mutation
  const removeMutation = useMutation({
    mutationFn: wishlistService.removeFromWishlist,
    onSuccess: (success, activityId) => {
      if (success) {
        // Optimistically update local state
        setWishlist(prev => prev.filter(activity => activity.id !== activityId));
        queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        queryClient.invalidateQueries({ queryKey: ['wishlist-count'] });
        
        toast({
          title: "Removed from Wishlist",
          description: "Activity has been removed from your wishlist",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to remove activity from wishlist",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove activity from wishlist",
        variant: "destructive",
      });
    },
  });

  // Clear wishlist mutation
  const clearMutation = useMutation({
    mutationFn: wishlistService.clearWishlist,
    onSuccess: (success) => {
      if (success) {
        setWishlist([]);
        queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        queryClient.invalidateQueries({ queryKey: ['wishlist-count'] });
        
        toast({
          title: "Wishlist Cleared",
          description: "Your wishlist has been cleared",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to clear wishlist",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to clear wishlist",
        variant: "destructive",
      });
    },
  });

  // Bulk add mutation
  const bulkAddMutation = useMutation({
    mutationFn: wishlistService.bulkAddToWishlist,
    onSuccess: (success, activityIds) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        queryClient.invalidateQueries({ queryKey: ['wishlist-count'] });
        
        toast({
          title: "Added to Wishlist",
          description: `${activityIds.length} activities added to your wishlist`,
        });
      }
    },
  });

  // Bulk remove mutation
  const bulkRemoveMutation = useMutation({
    mutationFn: wishlistService.bulkRemoveFromWishlist,
    onSuccess: (success, activityIds) => {
      if (success) {
        setWishlist(prev => prev.filter(activity => !activityIds.includes(activity.id!)));
        queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        queryClient.invalidateQueries({ queryKey: ['wishlist-count'] });
        
        toast({
          title: "Removed from Wishlist",
          description: `${activityIds.length} activities removed from your wishlist`,
        });
      }
    },
  });

  const addToWishlist = async (activityId: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to add activities to your wishlist",
        variant: "destructive",
      });
      return false;
    }
    
    return new Promise((resolve) => {
      addMutation.mutate(activityId, {
        onSuccess: (success) => resolve(success),
        onError: () => resolve(false),
      });
    });
  };

  const removeFromWishlist = async (activityId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      removeMutation.mutate(activityId, {
        onSuccess: (success) => resolve(success),
        onError: () => resolve(false),
      });
    });
  };

  const toggleWishlist = async (activityId: string): Promise<boolean> => {
    const isCurrentlyInWishlist = isInWishlist(activityId);
    
    if (isCurrentlyInWishlist) {
      return await removeFromWishlist(activityId);
    } else {
      return await addToWishlist(activityId);
    }
  };

  const clearWishlist = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      clearMutation.mutate(undefined, {
        onSuccess: (success) => resolve(success),
        onError: () => resolve(false),
      });
    });
  };

  const isInWishlist = (activityId: string): boolean => {
    return wishlist.some(activity => activity.id === activityId);
  };

  const bulkAddToWishlist = async (activityIds: string[]): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to add activities to your wishlist",
        variant: "destructive",
      });
      return false;
    }
    
    return new Promise((resolve) => {
      bulkAddMutation.mutate(activityIds, {
        onSuccess: (success) => resolve(success),
        onError: () => resolve(false),
      });
    });
  };

  const bulkRemoveFromWishlist = async (activityIds: string[]): Promise<boolean> => {
    return new Promise((resolve) => {
      bulkRemoveMutation.mutate(activityIds, {
        onSuccess: (success) => resolve(success),
        onError: () => resolve(false),
      });
    });
  };

  const loadMoreWishlist = () => {
    if (hasMore && !isLoading) {
      setPage(prev => prev + 1);
    }
  };

  const refreshWishlist = () => {
    setPage(0);
    refetch();
  };

  const contextValue: WishlistContextType = {
    wishlist,
    wishlistCount,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    isInWishlist,
    bulkAddToWishlist,
    bulkRemoveFromWishlist,
    loadMoreWishlist,
    refreshWishlist,
  };

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

export default WishlistContext;