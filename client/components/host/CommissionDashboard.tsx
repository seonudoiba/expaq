"use client";

import React, { useState } from 'react';
import { useCommission } from '@/contexts/CommissionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { DollarSign, TrendingUp, Clock, CheckCircle, Download, Plus } from 'lucide-react';
import { format } from 'date-fns';

export function CommissionDashboard() {
  const {
    hostCommissions,
    hostCommissionSummary,
    hostEarnings,
    isLoadingHostCommissions,
    isLoadingHostSummary,
    createWithdrawalRequest,
    refreshHostData,
  } = useCommission();

  const [withdrawalDialogOpen, setWithdrawalDialogOpen] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalMethod, setWithdrawalMethod] = useState('');
  const [withdrawalDetails, setWithdrawalDetails] = useState('');
  const [isCreatingWithdrawal, setIsCreatingWithdrawal] = useState(false);

  const handleCreateWithdrawal = async () => {
    if (!withdrawalAmount || !withdrawalMethod || !withdrawalDetails) {
      return;
    }

    setIsCreatingWithdrawal(true);
    const success = await createWithdrawalRequest(
      parseFloat(withdrawalAmount),
      withdrawalMethod,
      withdrawalDetails
    );

    if (success) {
      setWithdrawalDialogOpen(false);
      setWithdrawalAmount('');
      setWithdrawalMethod('');
      setWithdrawalDetails('');
    }
    setIsCreatingWithdrawal(false);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { label: 'Pending', variant: 'secondary' as const },
      PROCESSED: { label: 'Ready for Payout', variant: 'default' as const },
      PAID_OUT: { label: 'Paid Out', variant: 'secondary' as const },
      CANCELLED: { label: 'Cancelled', variant: 'destructive' as const },
      DISPUTED: { label: 'Disputed', variant: 'destructive' as const },
      ON_HOLD: { label: 'On Hold', variant: 'secondary' as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoadingHostSummary) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${hostCommissionSummary?.totalEarnings?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              From {hostCommissionSummary?.totalCommissions || 0} commissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Earnings</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${hostCommissionSummary?.pendingEarnings?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              From {hostCommissionSummary?.pendingCommissions || 0} commissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Out</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${hostCommissionSummary?.paidOutEarnings?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              From {hostCommissionSummary?.paidCommissions || 0} commissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${hostCommissionSummary?.recentEarnings?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Dialog open={withdrawalDialogOpen} onOpenChange={setWithdrawalDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Request Withdrawal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Withdrawal</DialogTitle>
              <DialogDescription>
                Request a withdrawal from your available earnings (${hostCommissionSummary?.pendingEarnings?.toFixed(2) || '0.00'} available)
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  className="col-span-3"
                  placeholder="0.00"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="method" className="text-right">
                  Method
                </Label>
                <Select value={withdrawalMethod} onValueChange={setWithdrawalMethod}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select withdrawal method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="stripe">Stripe Connect</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="details" className="text-right">
                  Details
                </Label>
                <Textarea
                  id="details"
                  value={withdrawalDetails}
                  onChange={(e) => setWithdrawalDetails(e.target.value)}
                  className="col-span-3"
                  placeholder="Bank account details, PayPal email, etc."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleCreateWithdrawal}
                disabled={isCreatingWithdrawal || !withdrawalAmount || !withdrawalMethod || !withdrawalDetails}
              >
                {isCreatingWithdrawal && <LoadingSpinner className="mr-2 h-4 w-4" />}
                Create Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button variant="outline" onClick={refreshHostData}>
          Refresh Data
        </Button>
      </div>

      {/* Commission History */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Commissions</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processed">Ready for Payout</TabsTrigger>
          <TabsTrigger value="paid_out">Paid Out</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <CommissionList commissions={hostCommissions} isLoading={isLoadingHostCommissions} />
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <CommissionList 
            commissions={hostCommissions.filter(c => c.status === 'PENDING')} 
            isLoading={isLoadingHostCommissions} 
          />
        </TabsContent>

        <TabsContent value="processed" className="space-y-4">
          <CommissionList 
            commissions={hostCommissions.filter(c => c.status === 'PROCESSED')} 
            isLoading={isLoadingHostCommissions} 
          />
        </TabsContent>

        <TabsContent value="paid_out" className="space-y-4">
          <CommissionList 
            commissions={hostCommissions.filter(c => c.status === 'PAID_OUT')} 
            isLoading={isLoadingHostCommissions} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface CommissionListProps {
  commissions: any[];
  isLoading: boolean;
}

function CommissionList({ commissions, isLoading }: CommissionListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <LoadingSpinner />
      </div>
    );
  }

  if (commissions.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">No commissions found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {commissions.map((commission) => (
        <Card key={commission.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{commission.activity.title}</CardTitle>
              {commission.status && (
                <Badge variant={commission.status === 'PAID_OUT' ? 'secondary' : 'default'}>
                  {commission.status.replace('_', ' ')}
                </Badge>
              )}
            </div>
            <CardDescription>{commission.activity.location}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Booking Amount</p>
                <p className="font-semibold">${commission.bookingAmount?.toFixed(2) || '0.00'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Commission Rate</p>
                <p className="font-semibold">{((commission.commissionRate || 0) * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Earnings</p>
                <p className="font-semibold text-green-600">${commission.hostEarnings?.toFixed(2) || '0.00'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-semibold">{format(new Date(commission.createdAt), 'MMM dd, yyyy')}</p>
              </div>
            </div>
            {commission.paymentReference && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Payment Reference: {commission.paymentReference}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}