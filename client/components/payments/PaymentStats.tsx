import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';
import { PaymentAnalyticsProps } from '@/types/payments';
// import { PaymentAnalyticsProps } from '@/types';


export function PaymentStats({ analytics, loading }: PaymentAnalyticsProps) {
  if (loading) {
    return (
      <>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[120px]" />
            </CardContent>
          </Card>
        ))}
      </>
    );
  }

  const stats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(analytics?.totalRevenue || 0),
      description: `${analytics?.revenueGrowthRate || 0}% from last period`,
    },
    {
      title: 'Success Rate',
      value: `${analytics?.overallSuccessRate || 0}%`,
      description: `${analytics?.successRateGrowth || 0}% from last period`,
    },
    {
      title: 'Average Transaction',
      value: formatCurrency(analytics?.averageTransactionAmount || 0),
      description: `${analytics?.averageTransactionGrowth || 0}% from last period`,
    },
    {
      title: 'Fraud Rate',
      value: `${analytics?.fraudRate || 0}%`,
      description: `${analytics?.fraudRateChange || 0}% from last period`,
      isNegative: true,
    },
  ];

  return (
    <>
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className={`text-xs ${stat.isNegative ? 'text-red-500' : 'text-green-500'}`}>
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  );
} 