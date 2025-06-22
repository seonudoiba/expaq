package com.abiodun.expaq.service.impl;

import com.abiodun.expaq.model.Payment;
import com.abiodun.expaq.model.Payment.PaymentMethod;
import com.abiodun.expaq.model.Payment.PaymentStatus;
import com.abiodun.expaq.repository.PaymentRepository;
import com.abiodun.expaq.service.IFraudDetectionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FraudDetectionServiceImpl implements IFraudDetectionService {

    private final PaymentRepository paymentRepository;
    private static final BigDecimal HIGH_RISK_THRESHOLD = new BigDecimal("0.7");
    private static final BigDecimal MEDIUM_RISK_THRESHOLD = new BigDecimal("0.4");

    @Override
    public BigDecimal calculateRiskScore(Payment payment) {
        List<BigDecimal> riskFactors = new ArrayList<>();

        // Amount-based risk
        riskFactors.add(calculateAmountRisk(payment.getAmount()));

        // Time-based risk
        riskFactors.add(calculateTimeRisk(payment.getCreatedAt()));

        // User history risk
        riskFactors.add(calculateUserHistoryRisk(payment.getUser().getId()));

        // Payment method risk
        riskFactors.add(calculatePaymentMethodRisk(payment.getPaymentMethod()));

        // Currency risk
        riskFactors.add(calculateCurrencyRisk(String.valueOf(payment.getCurrency())));

        // Calculate weighted average of risk factors
        return riskFactors.stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(new BigDecimal(riskFactors.size()), 2, RoundingMode.HALF_UP);
    }

    @Override
    public boolean isSuspiciousTransaction(Payment payment) {
        return calculateRiskScore(payment).compareTo(HIGH_RISK_THRESHOLD) >= 0;
    }

    @Override
    public Map<String, BigDecimal> getFraudRatesByPaymentMethod() {
        List<Payment> allPayments = paymentRepository.findAll();
        return calculateFraudRates(allPayments, p -> p.getPaymentMethod().name());
    }

    @Override
    public Map<String, BigDecimal> getFraudRatesByCurrency() {
        List<Payment> allPayments = paymentRepository.findAll();
        return calculateFraudRates(allPayments, Payment::getCurrency);
    }

    @Override
    public Map<String, BigDecimal> getFraudRatesByTimePeriod() {
        List<Payment> allPayments = paymentRepository.findAll();
        return calculateFraudRates(allPayments, 
            p -> p.getCreatedAt().truncatedTo(ChronoUnit.DAYS).toString());
    }

    @Override
    public Map<String, BigDecimal> getRiskScoresByPaymentMethod() {
        List<Payment> allPayments = paymentRepository.findAll();
        return calculateAverageRiskScores(allPayments, p -> p.getPaymentMethod().name());
    }

    @Override
    public Map<String, BigDecimal> getRiskScoresByCurrency() {
        List<Payment> allPayments = paymentRepository.findAll();
        return calculateAverageRiskScores(allPayments, Payment::getCurrency);
    }

    @Override
    public Map<String, BigDecimal> getRiskScoresByTimePeriod() {
        List<Payment> allPayments = paymentRepository.findAll();
        return calculateAverageRiskScores(allPayments,
            p -> p.getCreatedAt().truncatedTo(ChronoUnit.DAYS).toString());
    }

    private BigDecimal calculateAmountRisk(BigDecimal amount) {
        // Higher amounts have higher risk
        if (amount.compareTo(new BigDecimal("1000")) > 0) {
            return new BigDecimal("0.8");
        } else if (amount.compareTo(new BigDecimal("500")) > 0) {
            return new BigDecimal("0.6");
        } else if (amount.compareTo(new BigDecimal("100")) > 0) {
            return new BigDecimal("0.4");
        }
        return new BigDecimal("0.2");
    }

    private BigDecimal calculateTimeRisk(LocalDateTime paymentTime) {
        // Transactions during unusual hours have higher risk
        int hour = paymentTime.getHour();
        if (hour >= 23 || hour <= 4) {
            return new BigDecimal("0.7");
        } else if (hour >= 21 || hour <= 6) {
            return new BigDecimal("0.5");
        }
        return new BigDecimal("0.2");
    }

    private BigDecimal calculateUserHistoryRisk(UUID userId) {
        List<Payment> userPayments = paymentRepository.findByUserId(userId);
        if (userPayments.isEmpty()) {
            return new BigDecimal("0.6"); // New users have higher risk
        }

        long failedPayments = userPayments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.FAILED)
                .count();

        return new BigDecimal(failedPayments)
                .divide(new BigDecimal(userPayments.size()), 2, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("0.8"));
    }

    private BigDecimal calculatePaymentMethodRisk(PaymentMethod method) {
        return switch (method) {
            case CREDIT_CARD -> new BigDecimal("0.3");
            case DEBIT_CARD -> new BigDecimal("0.4");
            case BANK_TRANSFER -> new BigDecimal("0.5");
            case WALLET -> new BigDecimal("0.6");
            default -> new BigDecimal("0.7");
        };
    }

    private BigDecimal calculateCurrencyRisk(String currency) {
        return switch (currency.toUpperCase()) {
            case "USD", "EUR", "GBP" -> new BigDecimal("0.3");
            case "JPY", "CAD", "AUD" -> new BigDecimal("0.4");
            default -> new BigDecimal("0.6");
        };
    }

    private <T> Map<String, BigDecimal> calculateFraudRates(List<Payment> payments, 
            java.util.function.Function<Payment, T> groupingFunction) {
        Map<T, List<Payment>> groupedPayments = payments.stream()
                .collect(Collectors.groupingBy(groupingFunction));

        return groupedPayments.entrySet().stream()
                .collect(Collectors.toMap(
                        e -> e.getKey().toString(),
                        e -> {
                            List<Payment> methodPayments = e.getValue();
                            long suspiciousCount = methodPayments.stream()
                                    .filter(this::isSuspiciousTransaction)
                                    .count();
                            return new BigDecimal(suspiciousCount)
                                    .divide(new BigDecimal(methodPayments.size()), 4, RoundingMode.HALF_UP)
                                    .multiply(new BigDecimal("100"));
                        }
                ));
    }

    private <T> Map<String, BigDecimal> calculateAverageRiskScores(List<Payment> payments,
            java.util.function.Function<Payment, T> groupingFunction) {
        Map<T, List<Payment>> groupedPayments = payments.stream()
                .collect(Collectors.groupingBy(groupingFunction));

        return groupedPayments.entrySet().stream()
                .collect(Collectors.toMap(
                        e -> e.getKey().toString(),
                        e -> {
                            List<Payment> methodPayments = e.getValue();
                            BigDecimal totalRisk = methodPayments.stream()
                                    .map(this::calculateRiskScore)
                                    .reduce(BigDecimal.ZERO, BigDecimal::add);
                            return totalRisk.divide(new BigDecimal(methodPayments.size()), 2, RoundingMode.HALF_UP);
                        }
                ));
    }
} 