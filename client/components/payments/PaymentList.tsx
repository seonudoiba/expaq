import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Payment } from '@/types/payments';



export function PaymentList() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPayments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/payments/recent');
      if (!response.ok) throw new Error('Failed to fetch payments');
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error('Error fetching recent payments:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch recent payments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCEEDED':
        return 'bg-green-500';
      case 'PENDING':
        return 'bg-yellow-500';
      case 'FAILED':
        return 'bg-red-500';
      case 'REFUNDED':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-muted animate-pulse rounded" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{payment.customerName}</div>
                  <div className="text-sm text-muted-foreground">
                    {payment.customerEmail}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {formatCurrency(payment.amount, payment.currency)}
              </TableCell>
              <TableCell className="capitalize">
                {payment.method.toLowerCase()}
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(payment.status)}>
                  {payment.status}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(payment.createdAt)}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.href = `/payments/${payment.id}`}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 