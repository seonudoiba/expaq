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
    // Revenue Metrics
    private BigDecimal totalRevenue;
    private BigDecimal totalRefunds;
    private BigDecimal netRevenue;
    private Map<String, BigDecimal> revenueByPaymentMethod;
    private Map<String, BigDecimal> revenueByCurrency;
    private Map<String, BigDecimal> revenueByTimePeriod;
    
    // Transaction Metrics
    private Map<String, Long> paymentCountByStatus;
    private Map<String, Long> paymentCountByTimePeriod;
    private Map<String, BigDecimal> averageTransactionValue;
    private Map<String, BigDecimal> refundRateByPaymentMethod;
    
    // Success Rate Metrics
    private BigDecimal overallSuccessRate;
    private Map<String, BigDecimal> successRateByPaymentMethod;
    private Map<String, BigDecimal> successRateByCurrency;
    private Map<String, BigDecimal> successRateByTimePeriod;
    
    // Fraud Detection Metrics
    private Map<String, Long> suspiciousTransactions;
    private Map<String, BigDecimal> fraudRateByPaymentMethod;
    private Map<String, BigDecimal> fraudRateByCurrency;
    private Map<String, BigDecimal> fraudRateByTimePeriod;
    
    // Risk Metrics
    private Map<String, BigDecimal> riskScoreByPaymentMethod;
    private Map<String, BigDecimal> riskScoreByCurrency;
    private Map<String, BigDecimal> riskScoreByTimePeriod;
    
    // Performance Metrics
    private Map<String, BigDecimal> averageProcessingTime;
    private Map<String, BigDecimal> failureRateByPaymentMethod;
    private Map<String, BigDecimal> failureRateByCurrency;
    private Map<String, BigDecimal> failureRateByTimePeriod;
} 