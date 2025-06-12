package com.abiodun.expaq.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentAnalyticsDTO {
    private BigDecimal totalRevenue;
    private BigDecimal totalRefunds;
    private BigDecimal netRevenue;
    private Map<String, BigDecimal> revenueByPaymentMethod;
    private Map<String, Long> paymentCountByStatus;
    private Map<String, BigDecimal> revenueByCurrency;
    private Map<String, BigDecimal> revenueByTimePeriod;
    private Map<String, BigDecimal> averageTransactionValue;
    private Map<String, Long> paymentCountByTimePeriod;
    private Map<String, BigDecimal> refundRateByPaymentMethod;
} 