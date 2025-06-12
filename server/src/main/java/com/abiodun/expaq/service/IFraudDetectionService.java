package com.abiodun.expaq.service;

import com.abiodun.expaq.model.Payment;

import java.math.BigDecimal;
import java.util.Map;

public interface IFraudDetectionService {
    BigDecimal calculateRiskScore(Payment payment);
    boolean isSuspiciousTransaction(Payment payment);
    Map<String, BigDecimal> getFraudRatesByPaymentMethod();
    Map<String, BigDecimal> getFraudRatesByCurrency();
    Map<String, BigDecimal> getFraudRatesByTimePeriod();
    Map<String, BigDecimal> getRiskScoresByPaymentMethod();
    Map<String, BigDecimal> getRiskScoresByCurrency();
    Map<String, BigDecimal> getRiskScoresByTimePeriod();
} 