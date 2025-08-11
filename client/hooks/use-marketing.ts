'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  marketingService, 
  MarketingCampaign, 
  MarketingExecution, 
  CampaignStatus, 
  CampaignType, 
  ExecutionStatus 
} from '@/services/marketing-service';

// Query Keys
export const marketingKeys = {
  all: ['marketing'] as const,
  campaigns: () => [...marketingKeys.all, 'campaigns'] as const,
  campaign: (id: string) => [...marketingKeys.campaigns(), id] as const,
  campaignPerformance: (id: string, startDate?: string, endDate?: string) => 
    [...marketingKeys.campaign(id), 'performance', startDate, endDate] as const,
  campaignMetrics: (id: string) => [...marketingKeys.campaign(id), 'metrics'] as const,
  campaignBudget: (id: string) => [...marketingKeys.campaign(id), 'budget'] as const,
  campaignExecutions: (id: string) => [...marketingKeys.campaign(id), 'executions'] as const,
  campaignsByStatus: (status: CampaignStatus) => 
    [...marketingKeys.campaigns(), 'status', status] as const,
  campaignsByType: (type: CampaignType) => 
    [...marketingKeys.campaigns(), 'type', type] as const,
  searchCampaigns: (query: string) => 
    [...marketingKeys.campaigns(), 'search', query] as const,
  executions: () => [...marketingKeys.all, 'executions'] as const,
  execution: (id: string) => [...marketingKeys.executions(), id] as const,
  executionsByStatus: (status: ExecutionStatus) => 
    [...marketingKeys.executions(), 'status', status] as const,
  dashboard: () => [...marketingKeys.all, 'dashboard'] as const,
  campaignDashboard: (id: string) => [...marketingKeys.dashboard(), 'campaign', id] as const,
  performance: () => [...marketingKeys.all, 'performance'] as const,
  overallPerformance: (startDate: string, endDate: string) => 
    [...marketingKeys.performance(), 'overall', startDate, endDate] as const,
  campaignTypePerformance: () => [...marketingKeys.performance(), 'campaign-types'] as const,
  systemHealth: () => [...marketingKeys.all, 'system', 'health'] as const,
  campaignsOverBudget: () => [...marketingKeys.campaigns(), 'over-budget'] as const,
};

// Campaign Hooks
export function useCampaigns(page = 0, size = 20, sortBy = 'createdAt', sortDir = 'desc') {
  return useQuery({
    queryKey: [...marketingKeys.campaigns(), page, size, sortBy, sortDir],
    queryFn: () => marketingService.getAllCampaigns(page, size, sortBy, sortDir),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCampaign(campaignId: string, enabled = true) {
  return useQuery({
    queryKey: marketingKeys.campaign(campaignId),
    queryFn: () => marketingService.getCampaignById(campaignId),
    enabled: enabled && !!campaignId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useCampaignsByStatus(status: CampaignStatus) {
  return useQuery({
    queryKey: marketingKeys.campaignsByStatus(status),
    queryFn: () => marketingService.getCampaignsByStatus(status),
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useCampaignsByType(type: CampaignType) {
  return useQuery({
    queryKey: marketingKeys.campaignsByType(type),
    queryFn: () => marketingService.getCampaignsByType(type),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSearchCampaigns(query: string, page = 0, size = 20, enabled = true) {
  return useQuery({
    queryKey: [...marketingKeys.searchCampaigns(query), page, size],
    queryFn: () => marketingService.searchCampaigns(query, page, size),
    enabled: enabled && query.length > 0,
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useCampaignsOverBudget() {
  return useQuery({
    queryKey: marketingKeys.campaignsOverBudget(),
    queryFn: () => marketingService.getCampaignsOverBudget(),
    staleTime: 60 * 1000, // 1 minute
  });
}

// Campaign Mutations
export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (campaign: Omit<MarketingCampaign, 'id' | 'createdAt' | 'updatedAt'>) =>
      marketingService.createCampaign(campaign),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketingKeys.campaigns() });
      toast.success('Campaign created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create campaign: ${error.message}`);
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ campaignId, campaign }: { campaignId: string; campaign: Partial<MarketingCampaign> }) =>
      marketingService.updateCampaign(campaignId, campaign),
    onSuccess: (_, { campaignId }) => {
      queryClient.invalidateQueries({ queryKey: marketingKeys.campaign(campaignId) });
      queryClient.invalidateQueries({ queryKey: marketingKeys.campaigns() });
      toast.success('Campaign updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update campaign: ${error.message}`);
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (campaignId: string) => marketingService.deleteCampaign(campaignId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketingKeys.campaigns() });
      toast.success('Campaign deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete campaign: ${error.message}`);
    },
  });
}

// Campaign Lifecycle Mutations
export function useActivateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (campaignId: string) => marketingService.activateCampaign(campaignId),
    onSuccess: (_, campaignId) => {
      queryClient.invalidateQueries({ queryKey: marketingKeys.campaign(campaignId) });
      queryClient.invalidateQueries({ queryKey: marketingKeys.campaigns() });
      toast.success('Campaign activated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to activate campaign: ${error.message}`);
    },
  });
}

export function usePauseCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (campaignId: string) => marketingService.pauseCampaign(campaignId),
    onSuccess: (_, campaignId) => {
      queryClient.invalidateQueries({ queryKey: marketingKeys.campaign(campaignId) });
      queryClient.invalidateQueries({ queryKey: marketingKeys.campaigns() });
      toast.success('Campaign paused successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to pause campaign: ${error.message}`);
    },
  });
}

export function useCompleteCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (campaignId: string) => marketingService.completeCampaign(campaignId),
    onSuccess: (_, campaignId) => {
      queryClient.invalidateQueries({ queryKey: marketingKeys.campaign(campaignId) });
      queryClient.invalidateQueries({ queryKey: marketingKeys.campaigns() });
      toast.success('Campaign completed successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to complete campaign: ${error.message}`);
    },
  });
}

export function useCancelCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (campaignId: string) => marketingService.cancelCampaign(campaignId),
    onSuccess: (_, campaignId) => {
      queryClient.invalidateQueries({ queryKey: marketingKeys.campaign(campaignId) });
      queryClient.invalidateQueries({ queryKey: marketingKeys.campaigns() });
      toast.success('Campaign cancelled successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to cancel campaign: ${error.message}`);
    },
  });
}

export function useScheduleCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ campaignId, scheduledTime }: { campaignId: string; scheduledTime: string }) =>
      marketingService.scheduleCampaign(campaignId, scheduledTime),
    onSuccess: (_, { campaignId }) => {
      queryClient.invalidateQueries({ queryKey: marketingKeys.campaign(campaignId) });
      queryClient.invalidateQueries({ queryKey: marketingKeys.campaigns() });
      toast.success('Campaign scheduled successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to schedule campaign: ${error.message}`);
    },
  });
}

// Execution Hooks
export function useCampaignExecutions(campaignId: string, page = 0, size = 20, enabled = true) {
  return useQuery({
    queryKey: [...marketingKeys.campaignExecutions(campaignId), page, size],
    queryFn: () => marketingService.getExecutionsByCampaign(campaignId, page, size),
    enabled: enabled && !!campaignId,
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useExecution(executionId: string, enabled = true) {
  return useQuery({
    queryKey: marketingKeys.execution(executionId),
    queryFn: () => marketingService.getExecutionById(executionId),
    enabled: enabled && !!executionId,
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useExecutionsByStatus(status: ExecutionStatus) {
  return useQuery({
    queryKey: marketingKeys.executionsByStatus(status),
    queryFn: () => marketingService.getExecutionsByStatus(status),
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Execution Mutations
export function useCreateExecution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (execution: Omit<MarketingExecution, 'id' | 'createdAt' | 'updatedAt'>) =>
      marketingService.createExecution(execution),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: marketingKeys.campaignExecutions(data.campaignId) });
      toast.success('Execution created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create execution: ${error.message}`);
    },
  });
}

export function useSendExecution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (executionId: string) => marketingService.sendExecution(executionId),
    onSuccess: (_, executionId) => {
      queryClient.invalidateQueries({ queryKey: marketingKeys.execution(executionId) });
      toast.success('Execution sent successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to send execution: ${error.message}`);
    },
  });
}

// Analytics & Performance Hooks
export function useCampaignPerformance(
  campaignId: string, 
  startDate?: string, 
  endDate?: string, 
  enabled = true
) {
  return useQuery({
    queryKey: marketingKeys.campaignPerformance(campaignId, startDate, endDate),
    queryFn: () => marketingService.getCampaignPerformance(campaignId, startDate, endDate),
    enabled: enabled && !!campaignId,
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useOverallPerformance(startDate: string, endDate: string, enabled = true) {
  return useQuery({
    queryKey: marketingKeys.overallPerformance(startDate, endDate),
    queryFn: () => marketingService.getOverallPerformance(startDate, endDate),
    enabled: enabled && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCampaignTypePerformance() {
  return useQuery({
    queryKey: marketingKeys.campaignTypePerformance(),
    queryFn: () => marketingService.getCampaignTypePerformance(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCampaignROI(campaignId: string, enabled = true) {
  return useQuery({
    queryKey: [...marketingKeys.campaign(campaignId), 'roi'],
    queryFn: () => marketingService.getCampaignROI(campaignId),
    enabled: enabled && !!campaignId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useCampaignMetrics(campaignId: string, enabled = true) {
  return useQuery({
    queryKey: marketingKeys.campaignMetrics(campaignId),
    queryFn: () => marketingService.getCampaignMetrics(campaignId),
    enabled: enabled && !!campaignId,
    staleTime: 60 * 1000, // 1 minute
  });
}

// Dashboard Hooks
export function useMarketingDashboard() {
  return useQuery({
    queryKey: marketingKeys.dashboard(),
    queryFn: () => marketingService.getDashboardData(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}

export function useCampaignDashboard(campaignId: string, enabled = true) {
  return useQuery({
    queryKey: marketingKeys.campaignDashboard(campaignId),
    queryFn: () => marketingService.getCampaignDashboard(campaignId),
    enabled: enabled && !!campaignId,
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Budget Management Hooks
export function useCampaignBudget(campaignId: string, enabled = true) {
  return useQuery({
    queryKey: marketingKeys.campaignBudget(campaignId),
    queryFn: () => marketingService.getCampaignBudget(campaignId),
    enabled: enabled && !!campaignId,
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useUpdateCampaignBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ campaignId, budget }: { campaignId: string; budget: number }) =>
      marketingService.updateCampaignBudget(campaignId, budget),
    onSuccess: (_, { campaignId }) => {
      queryClient.invalidateQueries({ queryKey: marketingKeys.campaignBudget(campaignId) });
      queryClient.invalidateQueries({ queryKey: marketingKeys.campaign(campaignId) });
      toast.success('Budget updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update budget: ${error.message}`);
    },
  });
}

// System Management Hooks
export function useSystemHealth() {
  return useQuery({
    queryKey: marketingKeys.systemHealth(),
    queryFn: () => marketingService.getSystemHealth(),
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

export function useProcessScheduled() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => marketingService.processScheduled(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketingKeys.campaigns() });
      queryClient.invalidateQueries({ queryKey: marketingKeys.executions() });
      toast.success('Scheduled items processed successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to process scheduled items: ${error.message}`);
    },
  });
}

export function useRetryFailed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => marketingService.retryFailed(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketingKeys.executions() });
      toast.success('Failed executions retried successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to retry executions: ${error.message}`);
    },
  });
}

export function useOptimizeCampaigns() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => marketingService.optimizeCampaigns(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketingKeys.campaigns() });
      toast.success('Campaigns optimized successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to optimize campaigns: ${error.message}`);
    },
  });
}

// Tracking Mutations
export function useTrackConversion() {
  return useMutation({
    mutationFn: ({ trackingCode, event, value }: { 
      trackingCode: string; 
      event: string; 
      value?: number 
    }) => marketingService.trackConversion(trackingCode, event, value),
    onError: (error: any) => {
      console.error('Failed to track conversion:', error.message);
    },
  });
}

export function useTrackUnsubscribe() {
  return useMutation({
    mutationFn: ({ trackingCode, reason }: { 
      trackingCode: string; 
      reason?: string 
    }) => marketingService.trackUnsubscribe(trackingCode, reason),
    onError: (error: any) => {
      console.error('Failed to track unsubscribe:', error.message);
    },
  });
}

// Utility hook for real-time updates
export function useMarketingRealTime() {
  const queryClient = useQueryClient();

  const refreshDashboard = () => {
    queryClient.invalidateQueries({ queryKey: marketingKeys.dashboard() });
  };

  const refreshCampaign = (campaignId: string) => {
    queryClient.invalidateQueries({ queryKey: marketingKeys.campaign(campaignId) });
    queryClient.invalidateQueries({ queryKey: marketingKeys.campaignPerformance(campaignId) });
  };

  const refreshExecution = (executionId: string) => {
    queryClient.invalidateQueries({ queryKey: marketingKeys.execution(executionId) });
  };

  return {
    refreshDashboard,
    refreshCampaign,
    refreshExecution,
  };
}