/**
 * Payment and analytics related types
 */

export interface ChartData {
  name: string;
  value: number;
}

export interface AnalyticsItem {
  label: string;
  name: string;
  value: string | number;
  percentage: number;
  isNegative?: boolean;
}

export interface PaymentAnalytics {
  revenueByTimePeriod: ChartData[];
  revenueByPaymentMethod: Array<AnalyticsItem>;
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
  totalRevenue: number;
  averageTransactionAmount: number;
  averageTransactionGrowth: number;
  revenueGrowthRate: number;
}


// export interface PaymentAnalyticsProps {
//   analytics: PaymentAnalytics;
//   loading: boolean;
// }

export interface PaymentAnalyticsProps {
  analytics: PaymentAnalytics;
  loading: boolean;
}

export interface PaymentChartProps {
  data: ChartData[];
  loading: boolean;
  type?: 'line' | 'pie';
}

export interface DateRangePickerProps {
  initialDateFrom: Date;
  initialDateTo: Date;
  onUpdate: (data: { range: { from: Date; to?: Date } }) => void;
}

export interface Payment {
  id: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  description: string;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  updatedAt: string;
  activityId?: string;
  bookingId?: string;
}


export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentMethod {
  STRIPE = 'STRIPE',
  PAYSTACK = 'PAYSTACK',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD'
}

export interface PaymentListProps {
  payments: Payment[];
  loading: boolean;
}

export interface PaymentStatsProps {
  analytics: PaymentAnalytics;
  loading: boolean;
}

// Payment filter types
export interface PaymentFilterOptions {
  startDate?: Date;
  endDate?: Date;
  paymentMethod?: PaymentMethod | string;
  currency?: string;
  status?: PaymentStatus | string;
}
