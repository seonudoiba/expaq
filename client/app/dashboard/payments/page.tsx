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
import { PaymentAnalytics } from '@/components/payments/PaymentAnalytics';
import { PaymentList } from '@/components/payments/PaymentList';
import { PaymentChart } from '@/components/payments/PaymentChart';
import { PaymentStats } from '@/components/payments/PaymentStats';
import { PaymentFilters } from '@/components/payments/PaymentFilters';
import { useToast } from '@/components/ui/use-toast';

export default function PaymentsPage() {
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() });
  const [paymentMethod, setPaymentMethod] = useState('all');
  const [currency, setCurrency] = useState('all');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, paymentMethod, currency]);

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
      setAnalytics(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch payment analytics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Payment Dashboard</h1>
        <div className="flex gap-4">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PaymentStats analytics={analytics} loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentChart
              data={analytics?.revenueByTimePeriod}
              loading={loading}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentChart
              data={analytics?.revenueByPaymentMethod}
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
          <PaymentAnalytics analytics={analytics} loading={loading} />
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