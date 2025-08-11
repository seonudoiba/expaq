import { apiClient } from '@/lib/api/client';

export interface MarketingCampaign {
  id?: string;
  name: string;
  description?: string;
  campaignType: CampaignType;
  status: CampaignStatus;
  startDate?: string;
  endDate?: string;
  targetAudience?: string;
  emailSubject?: string;
  emailTemplate?: string;
  triggerConditions?: string;
  frequencyRules?: string;
  personalizationRules?: string;
  abTestConfig?: string;
  conversionGoal?: string;
  budgetLimit?: number;
  costPerSend?: number;
  priority: number;
  autoOptimize: boolean;
  trackingEnabled: boolean;
  createdById?: string;
  createdAt?: string;
  updatedAt?: string;
  lastExecutedAt?: string;
}

export interface MarketingExecution {
  id?: string;
  campaignId: string;
  userId?: string;
  executionType: ExecutionType;
  status: ExecutionStatus;
  recipientEmail?: string;
  recipientName?: string;
  subjectLine?: string;
  messageContent?: string;
  personalizationData?: string;
  triggerEvent?: string;
  triggerData?: string;
  scheduledAt?: string;
  sentAt?: string;
  deliveredAt?: string;
  openedAt?: string;
  clickedAt?: string;
  convertedAt?: string;
  bouncedAt?: string;
  unsubscribedAt?: string;
  errorMessage?: string;
  retryCount: number;
  maxRetries: number;
  cost?: number;
  revenue?: number;
  conversionValue?: number;
  externalId?: string;
  trackingCode?: string;
  utmParameters?: string;
  recipientCount?: number;
  engagementCount?: number;
  conversionCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MarketingMetric {
  id?: string;
  campaignId: string;
  executionId?: string;
  metricType: MetricType;
  metricName: string;
  metricValue?: number;
  metricCount?: number;
  metricPercentage?: number;
  dimension1?: string;
  dimension2?: string;
  dimension3?: string;
  timePeriod?: TimePeriod;
  periodStart?: string;
  periodEnd?: string;
  comparisonValue?: number;
  comparisonPeriodStart?: string;
  comparisonPeriodEnd?: string;
  goalValue?: number;
  isBenchmark: boolean;
  calculatedAt?: string;
  createdAt?: string;
}

export enum CampaignType {
  WELCOME_SERIES = 'WELCOME_SERIES',
  ABANDONED_BOOKING = 'ABANDONED_BOOKING',
  POST_BOOKING = 'POST_BOOKING',
  REACTIVATION = 'REACTIVATION',
  PROMOTIONAL = 'PROMOTIONAL',
  SEASONAL = 'SEASONAL',
  HOST_ONBOARDING = 'HOST_ONBOARDING',
  REVIEW_REQUEST = 'REVIEW_REQUEST',
  LOYALTY_REWARD = 'LOYALTY_REWARD',
  REFERRAL = 'REFERRAL',
  BIRTHDAY = 'BIRTHDAY',
  LOCATION_BASED = 'LOCATION_BASED',
  BEHAVIOR_TRIGGERED = 'BEHAVIOR_TRIGGERED',
  WINBACK = 'WINBACK',
  NEWSLETTER = 'NEWSLETTER',
  PRODUCT_UPDATE = 'PRODUCT_UPDATE'
}

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ARCHIVED = 'ARCHIVED'
}

export enum ExecutionType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
  IN_APP_MESSAGE = 'IN_APP_MESSAGE',
  WEB_PUSH = 'WEB_PUSH',
  WEBHOOK = 'WEBHOOK',
  API_CALL = 'API_CALL'
}

export enum ExecutionStatus {
  PENDING = 'PENDING',
  SCHEDULED = 'SCHEDULED',
  SENDING = 'SENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  OPENED = 'OPENED',
  CLICKED = 'CLICKED',
  CONVERTED = 'CONVERTED',
  BOUNCED = 'BOUNCED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  UNSUBSCRIBED = 'UNSUBSCRIBED'
}

export enum MetricType {
  DELIVERY = 'DELIVERY',
  ENGAGEMENT = 'ENGAGEMENT',
  CONVERSION = 'CONVERSION',
  REVENUE = 'REVENUE',
  COST = 'COST',
  PERFORMANCE = 'PERFORMANCE',
  AUDIENCE = 'AUDIENCE',
  BEHAVIORAL = 'BEHAVIORAL',
  TEMPORAL = 'TEMPORAL',
  GEOGRAPHIC = 'GEOGRAPHIC',
  DEVICE = 'DEVICE',
  CHANNEL = 'CHANNEL'
}

export enum TimePeriod {
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
  CUSTOM = 'CUSTOM',
  REAL_TIME = 'REAL_TIME'
}

export interface CampaignPerformanceReport {
  campaign: MarketingCampaign;
  totalRecipients: number;
  engagementRate: number;
  conversionRate: number;
  roi: number;
  cost: number;
  revenue: number;
  statusBreakdown: Record<string, number>;
}

export interface MarketingDashboard {
  totalCampaigns: number;
  activeCampaigns: number;
  totalExecutions: number;
  recentExecutions: any[];
  topCampaigns: any[];
}

export interface BudgetInfo {
  hasBudgetRemaining: boolean;
  remainingBudget: number;
  totalCost: number;
}

class MarketingService {
  private baseURL = '/api/marketing';

  // Campaign Management
  async createCampaign(campaign: Omit<MarketingCampaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<MarketingCampaign> {
    const response = await apiClient.post(`${this.baseURL}/campaigns`, campaign);
    return response.data;
  }

  async getAllCampaigns(page = 0, size = 20, sortBy = 'createdAt', sortDir = 'desc'): Promise<{
    content: MarketingCampaign[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  }> {
    const response = await apiClient.get(`${this.baseURL}/campaigns`, {
      params: { page, size, sortBy, sortDir }
    });
    return response.data;
  }

  async getCampaignById(campaignId: string): Promise<MarketingCampaign> {
    const response = await apiClient.get(`${this.baseURL}/campaigns/${campaignId}`);
    return response.data;
  }

  async updateCampaign(campaignId: string, campaign: Partial<MarketingCampaign>): Promise<MarketingCampaign> {
    const response = await apiClient.put(`${this.baseURL}/campaigns/${campaignId}`, campaign);
    return response.data;
  }

  async deleteCampaign(campaignId: string): Promise<void> {
    await apiClient.delete(`${this.baseURL}/campaigns/${campaignId}`);
  }

  async searchCampaigns(query: string, page = 0, size = 20): Promise<{
    content: MarketingCampaign[];
    totalElements: number;
    totalPages: number;
  }> {
    const response = await apiClient.get(`${this.baseURL}/campaigns/search`, {
      params: { query, page, size }
    });
    return response.data;
  }

  async getCampaignsByStatus(status: CampaignStatus): Promise<MarketingCampaign[]> {
    const response = await apiClient.get(`${this.baseURL}/campaigns/status/${status}`);
    return response.data;
  }

  async getCampaignsByType(type: CampaignType): Promise<MarketingCampaign[]> {
    const response = await apiClient.get(`${this.baseURL}/campaigns/type/${type}`);
    return response.data;
  }

  // Campaign Lifecycle
  async activateCampaign(campaignId: string): Promise<void> {
    await apiClient.post(`${this.baseURL}/campaigns/${campaignId}/activate`);
  }

  async pauseCampaign(campaignId: string): Promise<void> {
    await apiClient.post(`${this.baseURL}/campaigns/${campaignId}/pause`);
  }

  async completeCampaign(campaignId: string): Promise<void> {
    await apiClient.post(`${this.baseURL}/campaigns/${campaignId}/complete`);
  }

  async cancelCampaign(campaignId: string): Promise<void> {
    await apiClient.post(`${this.baseURL}/campaigns/${campaignId}/cancel`);
  }

  async scheduleCampaign(campaignId: string, scheduledTime: string): Promise<void> {
    await apiClient.post(`${this.baseURL}/campaigns/${campaignId}/schedule`, null, {
      params: { scheduledTime }
    });
  }

  // Execution Management
  async createExecution(execution: Omit<MarketingExecution, 'id' | 'createdAt' | 'updatedAt'>): Promise<MarketingExecution> {
    const response = await apiClient.post(`${this.baseURL}/executions`, execution);
    return response.data;
  }

  async getExecutionsByCampaign(campaignId: string, page = 0, size = 20): Promise<{
    content: MarketingExecution[];
    totalElements: number;
    totalPages: number;
  }> {
    const response = await apiClient.get(`${this.baseURL}/campaigns/${campaignId}/executions`, {
      params: { page, size }
    });
    return response.data;
  }

  async getExecutionById(executionId: string): Promise<MarketingExecution> {
    const response = await apiClient.get(`${this.baseURL}/executions/${executionId}`);
    return response.data;
  }

  async getExecutionsByStatus(status: ExecutionStatus): Promise<MarketingExecution[]> {
    const response = await apiClient.get(`${this.baseURL}/executions/status/${status}`);
    return response.data;
  }

  async sendExecution(executionId: string): Promise<void> {
    await apiClient.post(`${this.baseURL}/executions/${executionId}/send`);
  }

  // Analytics & Reporting
  async getCampaignPerformance(
    campaignId: string, 
    startDate?: string, 
    endDate?: string
  ): Promise<CampaignPerformanceReport> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await apiClient.get(`${this.baseURL}/campaigns/${campaignId}/performance`, {
      params
    });
    return response.data;
  }

  async getOverallPerformance(startDate: string, endDate: string): Promise<any> {
    const response = await apiClient.get(`${this.baseURL}/performance/overall`, {
      params: { startDate, endDate }
    });
    return response.data;
  }

  async getCampaignTypePerformance(): Promise<Record<string, any>> {
    const response = await apiClient.get(`${this.baseURL}/performance/campaign-types`);
    return response.data;
  }

  async getCampaignROI(campaignId: string): Promise<number> {
    const response = await apiClient.get(`${this.baseURL}/campaigns/${campaignId}/roi`);
    return response.data;
  }

  async getCampaignMetrics(campaignId: string): Promise<MarketingMetric[]> {
    const response = await apiClient.get(`${this.baseURL}/campaigns/${campaignId}/metrics`);
    return response.data;
  }

  // Dashboard
  async getDashboardData(): Promise<MarketingDashboard> {
    const response = await apiClient.get(`${this.baseURL}/dashboard`);
    return response.data;
  }

  async getCampaignDashboard(campaignId: string): Promise<any> {
    const response = await apiClient.get(`${this.baseURL}/campaigns/${campaignId}/dashboard`);
    return response.data;
  }

  // Budget Management
  async getCampaignBudget(campaignId: string): Promise<BudgetInfo> {
    const response = await apiClient.get(`${this.baseURL}/campaigns/${campaignId}/budget`);
    return response.data;
  }

  async updateCampaignBudget(campaignId: string, budget: number): Promise<void> {
    await apiClient.put(`${this.baseURL}/campaigns/${campaignId}/budget`, null, {
      params: { budget }
    });
  }

  async getCampaignsOverBudget(): Promise<MarketingCampaign[]> {
    const response = await apiClient.get(`${this.baseURL}/campaigns/over-budget`);
    return response.data;
  }

  // System Management
  async processScheduled(): Promise<void> {
    await apiClient.post(`${this.baseURL}/system/process-scheduled`);
  }

  async retryFailed(): Promise<void> {
    await apiClient.post(`${this.baseURL}/system/retry-failed`);
  }

  async optimizeCampaigns(): Promise<void> {
    await apiClient.post(`${this.baseURL}/system/optimize`);
  }

  async getSystemHealth(): Promise<any> {
    const response = await apiClient.get(`${this.baseURL}/system/health`);
    return response.data;
  }

  // Tracking (Client-side)
  trackConversion(trackingCode: string, event: string, value?: number): Promise<void> {
    const params: any = { event };
    if (value) params.value = value;

    return apiClient.post(`${this.baseURL}/track/conversion/${trackingCode}`, null, {
      params
    });
  }

  trackUnsubscribe(trackingCode: string, reason?: string): Promise<void> {
    const params: any = {};
    if (reason) params.reason = reason;

    return apiClient.post(`${this.baseURL}/track/unsubscribe/${trackingCode}`, null, {
      params
    });
  }

  // Utility Methods
  getCampaignTypeDisplayName(type: CampaignType): string {
    const displayNames: Record<CampaignType, string> = {
      [CampaignType.WELCOME_SERIES]: 'Welcome Series',
      [CampaignType.ABANDONED_BOOKING]: 'Abandoned Booking Recovery',
      [CampaignType.POST_BOOKING]: 'Post-Booking Follow-up',
      [CampaignType.REACTIVATION]: 'User Reactivation',
      [CampaignType.PROMOTIONAL]: 'Promotional Campaign',
      [CampaignType.SEASONAL]: 'Seasonal Campaign',
      [CampaignType.HOST_ONBOARDING]: 'Host Onboarding',
      [CampaignType.REVIEW_REQUEST]: 'Review Request',
      [CampaignType.LOYALTY_REWARD]: 'Loyalty Reward',
      [CampaignType.REFERRAL]: 'Referral Campaign',
      [CampaignType.BIRTHDAY]: 'Birthday Campaign',
      [CampaignType.LOCATION_BASED]: 'Location-Based Campaign',
      [CampaignType.BEHAVIOR_TRIGGERED]: 'Behavior Triggered',
      [CampaignType.WINBACK]: 'Win-Back Campaign',
      [CampaignType.NEWSLETTER]: 'Newsletter',
      [CampaignType.PRODUCT_UPDATE]: 'Product Update'
    };
    return displayNames[type] || type;
  }

  getCampaignStatusDisplayName(status: CampaignStatus): string {
    const displayNames: Record<CampaignStatus, string> = {
      [CampaignStatus.DRAFT]: 'Draft',
      [CampaignStatus.SCHEDULED]: 'Scheduled',
      [CampaignStatus.ACTIVE]: 'Active',
      [CampaignStatus.PAUSED]: 'Paused',
      [CampaignStatus.COMPLETED]: 'Completed',
      [CampaignStatus.CANCELLED]: 'Cancelled',
      [CampaignStatus.ARCHIVED]: 'Archived'
    };
    return displayNames[status] || status;
  }

  getExecutionStatusDisplayName(status: ExecutionStatus): string {
    const displayNames: Record<ExecutionStatus, string> = {
      [ExecutionStatus.PENDING]: 'Pending',
      [ExecutionStatus.SCHEDULED]: 'Scheduled',
      [ExecutionStatus.SENDING]: 'Sending',
      [ExecutionStatus.SENT]: 'Sent',
      [ExecutionStatus.DELIVERED]: 'Delivered',
      [ExecutionStatus.OPENED]: 'Opened',
      [ExecutionStatus.CLICKED]: 'Clicked',
      [ExecutionStatus.CONVERTED]: 'Converted',
      [ExecutionStatus.BOUNCED]: 'Bounced',
      [ExecutionStatus.FAILED]: 'Failed',
      [ExecutionStatus.CANCELLED]: 'Cancelled',
      [ExecutionStatus.UNSUBSCRIBED]: 'Unsubscribed'
    };
    return displayNames[status] || status;
  }

  getStatusColor(status: CampaignStatus | ExecutionStatus): string {
    const colors: Record<string, string> = {
      // Campaign statuses
      [CampaignStatus.DRAFT]: 'gray',
      [CampaignStatus.SCHEDULED]: 'blue',
      [CampaignStatus.ACTIVE]: 'green',
      [CampaignStatus.PAUSED]: 'yellow',
      [CampaignStatus.COMPLETED]: 'green',
      [CampaignStatus.CANCELLED]: 'red',
      [CampaignStatus.ARCHIVED]: 'gray',
      
      // Execution statuses
      [ExecutionStatus.PENDING]: 'gray',
      [ExecutionStatus.SCHEDULED]: 'blue',
      [ExecutionStatus.SENDING]: 'yellow',
      [ExecutionStatus.SENT]: 'blue',
      [ExecutionStatus.DELIVERED]: 'green',
      [ExecutionStatus.OPENED]: 'green',
      [ExecutionStatus.CLICKED]: 'green',
      [ExecutionStatus.CONVERTED]: 'purple',
      [ExecutionStatus.BOUNCED]: 'red',
      [ExecutionStatus.FAILED]: 'red',
      [ExecutionStatus.CANCELLED]: 'red',
      [ExecutionStatus.UNSUBSCRIBED]: 'orange'
    };
    return colors[status] || 'gray';
  }

  formatMetricValue(metric: MarketingMetric): string {
    if (metric.metricValue === null || metric.metricValue === undefined) return 'N/A';
    
    const value = metric.metricValue;
    const name = metric.metricName.toLowerCase();
    
    if (name.includes('rate') || name.includes('percentage')) {
      return `${value.toFixed(2)}%`;
    }
    
    if (name.includes('revenue') || name.includes('cost')) {
      return `$${value.toFixed(2)}`;
    }
    
    if (name.includes('count')) {
      return value.toFixed(0);
    }
    
    return value.toFixed(2);
  }
}

export const marketingService = new MarketingService();