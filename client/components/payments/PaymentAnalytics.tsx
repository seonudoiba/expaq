import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';

interface AnalyticsItem {
  label: string;
  value: string | number;
  percentage: number;
  isNegative?: boolean;
}

interface PaymentAnalyticsProps {
  analytics: {
    revenueByPaymentMethod?: Array<{
      name: string;
      value: number;
      percentage: number;
    }>;
    overallSuccessRate: number;
    successRateGrowth: number;
    stripeSuccessRate: number;
    stripeSuccessRateGrowth: number;
    paystackSuccessRate: number;
    paystackSuccessRateGrowth: number;
    fraudRate: number;
    fraudRateChange: number;
    highRiskTransactions: number;
    highRiskTransactionsChange: number;
    averageRiskScore: number;
    riskScoreChange: number;
    averageTransactionTime: number;
    transactionTimeChange: number;
    paymentProcessingRate: number;
    processingRateChange: number;
    errorRate: number;
    errorRateChange: number;
  };
  loading: boolean;
}

export function PaymentAnalytics({ analytics, loading }: PaymentAnalyticsProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center text-muted-foreground">
        No analytics data available
      </div>
    );
  }

  const sections = [
    {
      title: 'Payment Methods',
      data: analytics.revenueByPaymentMethod?.map((method: { name: string; value: number; percentage: number }) => ({
        label: method.name,
        value: formatCurrency(method.value),
        percentage: method.percentage,
      })),
    },
    {
      title: 'Success Rates',
      data: [
        {
          label: 'Overall Success Rate',
          value: `${analytics.overallSuccessRate}%`,
          percentage: analytics.successRateGrowth,
        },
        {
          label: 'Stripe Success Rate',
          value: `${analytics.stripeSuccessRate}%`,
          percentage: analytics.stripeSuccessRateGrowth,
        },
        {
          label: 'Paystack Success Rate',
          value: `${analytics.paystackSuccessRate}%`,
          percentage: analytics.paystackSuccessRateGrowth,
        },
      ],
    },
    {
      title: 'Fraud Detection',
      data: [
        {
          label: 'Fraud Rate',
          value: `${analytics.fraudRate}%`,
          percentage: analytics.fraudRateChange,
          isNegative: true,
        },
        {
          label: 'High Risk Transactions',
          value: analytics.highRiskTransactions,
          percentage: analytics.highRiskTransactionsChange,
          isNegative: true,
        },
        {
          label: 'Average Risk Score',
          value: analytics.averageRiskScore,
          percentage: analytics.riskScoreChange,
          isNegative: true,
        },
      ],
    },
    {
      title: 'Performance Metrics',
      data: [
        {
          label: 'Average Transaction Time',
          value: `${analytics.averageTransactionTime}s`,
          percentage: analytics.transactionTimeChange,
          isNegative: true,
        },
        {
          label: 'Payment Processing Rate',
          value: `${analytics.paymentProcessingRate}/min`,
          percentage: analytics.processingRateChange,
        },
        {
          label: 'Error Rate',
          value: `${analytics.errorRate}%`,
          percentage: analytics.errorRateChange,
          isNegative: true,
        },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {sections.map((section, index) => (
        <div key={index} className="space-y-4">
          <h3 className="text-lg font-semibold">{section.title}</h3>
          <div className="space-y-2">
            {(section.data ?? []).map((item: AnalyticsItem, itemIndex: number) => (
              <div
                key={itemIndex}
                className="flex items-center justify-between p-4 bg-muted rounded-lg"
              >
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.value}
                  </div>
                </div>
                <div
                  className={`text-sm ${
                    item.isNegative
                      ? item.percentage < 0
                        ? 'text-green-500'
                        : 'text-red-500'
                      : item.percentage > 0
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {item.percentage > 0 ? '+' : ''}
                  {item.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 