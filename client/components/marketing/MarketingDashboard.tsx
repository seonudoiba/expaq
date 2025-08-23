'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  useMarketingDashboard, 
  useCampaignsByStatus, 
  useProcessScheduled, 
  useRetryFailed,
  useOptimizeCampaigns 
} from '@/hooks/use-marketing';
import { CampaignStatus, marketingService } from '@/services/marketing-service';
import { formatCurrency } from '@/lib/utils';
import { 
  BarChart, 
  TrendingUp, 
  Mail, 
  DollarSign, 
  Activity,
  PlayCircle,
  RefreshCw,
  Zap
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

interface MarketingDashboardProps {
  className?: string;
}

export function MarketingDashboard({ className }: MarketingDashboardProps) {
  const { data: dashboardData, isLoading: dashboardLoading } = useMarketingDashboard();
  const { data: activeCampaigns } = useCampaignsByStatus(CampaignStatus.ACTIVE);
  
  const processScheduledMutation = useProcessScheduled();
  const retryFailedMutation = useRetryFailed();
  const optimizeCampaignsMutation = useOptimizeCampaigns();

  if (dashboardLoading) {
    return <DashboardSkeleton />;
  }

  const handleProcessScheduled = () => {
    processScheduledMutation.mutate();
  };

  const handleRetryFailed = () => {
    retryFailedMutation.mutate();
  };

  const handleOptimize = () => {
    optimizeCampaignsMutation.mutate();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketing Automation</h1>
          <p className="text-muted-foreground">
            Manage campaigns, track performance, and optimize marketing efforts
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleProcessScheduled}
            disabled={processScheduledMutation.isPending}
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            Process Scheduled
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRetryFailed}
            disabled={retryFailedMutation.isPending}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Failed
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleOptimize}
            disabled={optimizeCampaignsMutation.isPending}
          >
            <Zap className="h-4 w-4 mr-2" />
            Optimize
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Campaigns"
          value={dashboardData?.totalCampaigns || 0}
          icon={<BarChart className="h-4 w-4" />}
          description="All time campaigns"
        />
        <MetricCard
          title="Active Campaigns"
          value={dashboardData?.activeCampaigns || 0}
          icon={<Activity className="h-4 w-4" />}
          description="Currently running"
          trend={activeCampaigns?.length}
        />
        <MetricCard
          title="Total Executions"
          value={dashboardData?.totalExecutions || 0}
          icon={<Mail className="h-4 w-4" />}
          description="Messages sent"
        />
        <MetricCard
          title="Revenue Generated"
          value="$0.00"
          icon={<DollarSign className="h-4 w-4" />}
          description="From campaigns"
          isMonetary
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <CampaignStatusCard activeCampaigns={activeCampaigns} />
            <RecentActivityCard recentExecutions={dashboardData?.recentExecutions} />
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <CampaignManagementSection />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <PerformanceSection />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  trend?: number;
  isMonetary?: boolean;
}

function MetricCard({ title, value, icon, description, trend, isMonetary }: MetricCardProps) {
  const displayValue = isMonetary && typeof value === 'number' 
    ? formatCurrency(value) 
    : typeof value === 'number' 
    ? value.toLocaleString() 
    : value;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{displayValue}</div>
        <p className="text-xs text-muted-foreground">
          {description}
          {trend !== undefined && (
            <span className="ml-1 text-green-600">
              <TrendingUp className="h-3 w-3 inline" />
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  );
}

interface Campaign {
  id: string;
  name?: string;
  status?: string;
}

function CampaignStatusCard({ activeCampaigns }: { activeCampaigns?: Campaign[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Status</CardTitle>
        <CardDescription>Current campaign states</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Badge variant="default" className="bg-green-500">Active</Badge>
              Active Campaigns
            </span>
            <span className="font-semibold">{activeCampaigns?.length || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Badge variant="secondary">Draft</Badge>
              Draft Campaigns
            </span>
            <span className="font-semibold">0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Badge variant="outline">Paused</Badge>
              Paused Campaigns
            </span>
            <span className="font-semibold">0</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface RecentExecution {
  id: string;
  campaignId?: string;
  executedAt?: string;
  status?: string;
}

function RecentActivityCard({ recentExecutions }: { recentExecutions?: RecentExecution[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest campaign executions</CardDescription>
      </CardHeader>
      <CardContent>
        {!recentExecutions || recentExecutions.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentExecutions.slice(0, 5).map((execution, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{execution.campaignName}</p>
                  <p className="text-sm text-muted-foreground">{execution.recipientEmail}</p>
                </div>
                <Badge variant={getStatusVariant(execution.status)}>
                  {marketingService.getExecutionStatusDisplayName(execution.status)}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CampaignManagementSection() {
  return (
    <div className="space-y-4">
      <Alert>
        <BarChart className="h-4 w-4" />
        <AlertDescription>
          Campaign management features are being loaded. You can create, edit, and manage campaigns here.
        </AlertDescription>
      </Alert>
      {/* Campaign list and management will be implemented in separate components */}
    </div>
  );
}

function PerformanceSection() {
  return (
    <div className="space-y-4">
      <Alert>
        <TrendingUp className="h-4 w-4" />
        <AlertDescription>
          Performance analytics and reports will be displayed here.
        </AlertDescription>
      </Alert>
      {/* Performance charts and metrics will be implemented */}
    </div>
  );
}

function AnalyticsSection() {
  return (
    <div className="space-y-4">
      <Alert>
        <BarChart className="h-4 w-4" />
        <AlertDescription>
          Advanced analytics and insights will be available here.
        </AlertDescription>
      </Alert>
      {/* Advanced analytics components will be implemented */}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <Skeleton className="h-10 w-96" />
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-5 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status.toLowerCase()) {
    case 'sent':
    case 'delivered':
    case 'opened':
    case 'clicked':
    case 'converted':
      return 'default';
    case 'pending':
    case 'scheduled':
      return 'secondary';
    case 'failed':
    case 'bounced':
    case 'cancelled':
      return 'destructive';
    default:
      return 'outline';
  }
}