'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { PaymentAnalytics as PaymentAnalyticsComponent } from '@/components/payments/PaymentAnalytics';
import { PaymentList } from '@/components/payments/PaymentList';
import { PaymentChart } from '@/components/payments/PaymentChart';
import { PaymentStats } from '@/components/payments/PaymentStats';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/lib/store/auth';

// Import types
import { PaymentAnalytics } from '@/types/payments';
import { useQuery } from "@tanstack/react-query";
import { PaymentAnalyticsService } from '@/lib/api/payment-service';


export default function PaymentsPage() {
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() });
  const [paymentMethod, setPaymentMethod] = useState('all');
  const [currency, setCurrency] = useState('all');
  const {user} = useAuthStore()
  // const [analytics, setAnalytics] = useState<PaymentAnalytics | null>(null);
  // const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/payments/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: dateRange.from,
          endDate: dateRange.to,
          paymentMethod: paymentMethod !== 'all' ? paymentMethod : undefined,
          currency: currency !== 'all' ? currency : undefined,
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch analytics');
      const data = await response.json();
      setAnalytics(data as PaymentAnalytics);
    } catch (error) {
      console.error('Error fetching payment analytics:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch payment analytics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, paymentMethod, currency]);


    const {
      data: analytics,
      isLoading,
      error,
    } = useQuery({
      queryKey: ["Payment Analytics"],
      queryFn: () => PaymentAnalyticsService.getHostPaymentAnalytics(user?.id),
      
    });
  // Default fallback object for analytics
  const defaultAnalytics: PaymentAnalytics = {
    revenueByTimePeriod: [],
    revenueByPaymentMethod: [],
    overallSuccessRate: 0,
    successRateGrowth: 0,
    stripeSuccessRate: 0,
    stripeSuccessRateGrowth: 0,
    paystackSuccessRate: 0,
    paystackSuccessRateGrowth: 0,
    fraudRate: 0,
    fraudRateChange: 0,
    highRiskTransactions: 0,
    highRiskTransactionsChange: 0,
    averageRiskScore: 0,
    riskScoreChange: 0,
    averageTransactionTime: 0,
    transactionTimeChange: 0,
    paymentProcessingRate: 0,
    processingRateChange: 0,
    errorRate: 0,
    errorRateChange: 0,
    totalRevenue: 0,
    revenueGrowthRate: 0,
    averageTransactionAmount: 0,
    averageTransactionGrowth: 0
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Payment Dashboard</h1>
        <div className="flex gap-4">
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            onUpdate={({ range }) => setDateRange({ 
              from: range.from, 
              to: range.to || new Date() // Fallback to current date if to is undefined
            })}
          />
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="STRIPE">Stripe</SelectItem>
              <SelectItem value="PAYSTACK">Paystack</SelectItem>
            </SelectContent>
          </Select>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Currencies</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
       
        <PaymentStats analytics={analytics ?? defaultAnalytics} loading={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentChart
              data={analytics?.revenueByTimePeriod ?? []}
              loading={loading}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentChart              data={analytics?.revenueByPaymentMethod?.map((item: { name: string; label: string; value: string | number }) => ({
                name: item.name || item.label,
                value: typeof item.value === 'string' ? parseFloat(item.value) : item.value
              })) ?? []}
              loading={loading}
              type="pie"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentAnalyticsComponent analytics={analytics ?? defaultAnalytics} loading={loading} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentList />
        </CardContent>
      </Card>
    </div>
  );
}