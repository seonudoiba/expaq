"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { commissionService, Commission, CommissionSummary } from '@/services/commission-service';
import { useAuthStore } from '@/lib/store/auth';
import { toast } from '@/components/ui/use-toast';

interface CommissionContextType {
  // Host functions
  hostCommissions: Commission[];
  hostCommissionSummary: CommissionSummary | null;
  hostEarnings: any;
  isLoadingHostCommissions: boolean;
  isLoadingHostSummary: boolean;
  
  // Actions
  createWithdrawalRequest: (amount: number, method: string, details: string) => Promise<boolean>;
  refreshHostData: () => void;
  
  // Admin functions (only available for admin users)
  allCommissions: Commission[];
  platformSummary: any;
  commissionAnalytics: any;
  isLoadingAdminData: boolean;
  
  // Admin actions
  processCommission: (bookingId: string) => Promise<boolean>;
  markAsPaidOut: (commissionId: string) => Promise<boolean>;
  processBulkPayout: (commissionIds: string[]) => Promise<boolean>;
  updateCommissionRates: (rates: Record<string, number>) => Promise<boolean>;
}

const CommissionContext = createContext<CommissionContextType | undefined>(undefined);

interface CommissionProviderProps {
  children: ReactNode;
}

export function CommissionProvider({ children }: CommissionProviderProps) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  
  const isHost = user?.roles?.some(role => role.name === 'HOST');
  const isAdmin = user?.roles?.some(role => role.name === 'ADMIN');

  // Host Queries
  const { data: hostCommissions = [], isLoading: isLoadingHostCommissions } = useQuery({
    queryKey: ['host-commissions'],
    queryFn: () => commissionService.getHostCommissions().then(response => response.content),
    enabled: !!user && isHost,
    refetchInterval: 60000, // Refetch every minute
  });

  const { data: hostCommissionSummary = null, isLoading: isLoadingHostSummary } = useQuery({
    queryKey: ['host-commission-summary'],
    queryFn: commissionService.getHostCommissionSummary,
    enabled: !!user && isHost,
    refetchInterval: 60000,
  });

  const { data: hostEarnings = null } = useQuery({
    queryKey: ['host-earnings'],
    queryFn: () => commissionService.getHostEarnings('month'),
    enabled: !!user && isHost,
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  // Admin Queries
  const { data: allCommissions = [], isLoading: isLoadingAdminData } = useQuery({
    queryKey: ['all-commissions'],
    queryFn: () => commissionService.getAllCommissions().then(response => response.content),
    enabled: !!user && isAdmin,
    refetchInterval: 60000,
  });

  const { data: platformSummary = null } = useQuery({
    queryKey: ['platform-commission-summary'],
    queryFn: () => commissionService.getPlatformCommissionSummary('monthly'),
    enabled: !!user && isAdmin,
    refetchInterval: 300000,
  });

  const { data: commissionAnalytics = null } = useQuery({
    queryKey: ['commission-analytics'],
    queryFn: () => commissionService.getCommissionAnalytics('monthly', 'month'),
    enabled: !!user && isAdmin,
    refetchInterval: 300000,
  });

  // Withdrawal request mutation
  const withdrawalMutation = useMutation({
    mutationFn: ({ amount, method, details }: { amount: number; method: string; details: string }) =>
      commissionService.createWithdrawalRequest(amount, method, details),
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['host-commission-summary'] });
        queryClient.invalidateQueries({ queryKey: ['host-withdrawals'] });
        
        toast({
          title: "Withdrawal Request Created",
          description: "Your withdrawal request has been submitted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create withdrawal request",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create withdrawal request",
        variant: "destructive",
      });
    },
  });

  // Process commission mutation (admin)
  const processCommissionMutation = useMutation({
    mutationFn: commissionService.processCommission,
    onSuccess: (success, bookingId) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['all-commissions'] });
        queryClient.invalidateQueries({ queryKey: ['platform-commission-summary'] });
        
        toast({
          title: "Commission Processed",
          description: `Commission for booking ${bookingId} has been processed`,
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process commission",
        variant: "destructive",
      });
    },
  });

  // Mark as paid out mutation (admin)
  const paidOutMutation = useMutation({
    mutationFn: commissionService.markAsPaidOut,
    onSuccess: (success, commissionId) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['all-commissions'] });
        queryClient.invalidateQueries({ queryKey: ['platform-commission-summary'] });
        
        toast({
          title: "Commission Paid Out",
          description: `Commission ${commissionId} has been marked as paid out`,
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark commission as paid out",
        variant: "destructive",
      });
    },
  });

  // Bulk payout mutation (admin)
  const bulkPayoutMutation = useMutation({
    mutationFn: commissionService.processBulkPayout,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['all-commissions'] });
        queryClient.invalidateQueries({ queryKey: ['platform-commission-summary'] });
        
        toast({
          title: "Bulk Payout Processed",
          description: result.message,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process bulk payout",
        variant: "destructive",
      });
    },
  });

  // Update rates mutation (admin)
  const updateRatesMutation = useMutation({
    mutationFn: commissionService.updateCommissionRates,
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['commission-rates'] });
        
        toast({
          title: "Commission Rates Updated",
          description: "Commission rates have been updated successfully",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update commission rates",
        variant: "destructive",
      });
    },
  });

  const createWithdrawalRequest = async (amount: number, method: string, details: string): Promise<boolean> => {
    if (!user || !isHost) {
      toast({
        title: "Access Denied",
        description: "Only hosts can create withdrawal requests",
        variant: "destructive",
      });
      return false;
    }
    
    return new Promise((resolve) => {
      withdrawalMutation.mutate({ amount, method, details }, {
        onSuccess: (success) => resolve(success),
        onError: () => resolve(false),
      });
    });
  };

  const processCommission = async (bookingId: string): Promise<boolean> => {
    if (!user || !isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can process commissions",
        variant: "destructive",
      });
      return false;
    }
    
    return new Promise((resolve) => {
      processCommissionMutation.mutate(bookingId, {
        onSuccess: (success) => resolve(success),
        onError: () => resolve(false),
      });
    });
  };

  const markAsPaidOut = async (commissionId: string): Promise<boolean> => {
    if (!user || !isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can mark commissions as paid out",
        variant: "destructive",
      });
      return false;
    }
    
    return new Promise((resolve) => {
      paidOutMutation.mutate(commissionId, {
        onSuccess: (success) => resolve(success),
        onError: () => resolve(false),
      });
    });
  };

  const processBulkPayout = async (commissionIds: string[]): Promise<boolean> => {
    if (!user || !isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can process bulk payouts",
        variant: "destructive",
      });
      return false;
    }
    
    return new Promise((resolve) => {
      bulkPayoutMutation.mutate(commissionIds, {
        onSuccess: (result) => resolve(result.success),
        onError: () => resolve(false),
      });
    });
  };

  const updateCommissionRates = async (rates: Record<string, number>): Promise<boolean> => {
    if (!user || !isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can update commission rates",
        variant: "destructive",
      });
      return false;
    }
    
    return new Promise((resolve) => {
      updateRatesMutation.mutate(rates, {
        onSuccess: (success) => resolve(success),
        onError: () => resolve(false),
      });
    });
  };

  const refreshHostData = () => {
    queryClient.invalidateQueries({ queryKey: ['host-commissions'] });
    queryClient.invalidateQueries({ queryKey: ['host-commission-summary'] });
    queryClient.invalidateQueries({ queryKey: ['host-earnings'] });
  };

  const contextValue: CommissionContextType = {
    // Host data
    hostCommissions,
    hostCommissionSummary,
    hostEarnings,
    isLoadingHostCommissions,
    isLoadingHostSummary,
    
    // Host actions
    createWithdrawalRequest,
    refreshHostData,
    
    // Admin data
    allCommissions,
    platformSummary,
    commissionAnalytics,
    isLoadingAdminData,
    
    // Admin actions
    processCommission,
    markAsPaidOut,
    processBulkPayout,
    updateCommissionRates,
  };

  return (
    <CommissionContext.Provider value={contextValue}>
      {children}
    </CommissionContext.Provider>
  );
}

export function useCommission() {
  const context = useContext(CommissionContext);
  if (context === undefined) {
    throw new Error('useCommission must be used within a CommissionProvider');
  }
  return context;
}

export default CommissionContext;