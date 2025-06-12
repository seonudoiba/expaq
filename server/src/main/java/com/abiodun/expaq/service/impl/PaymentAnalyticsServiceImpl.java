package com.abiodun.expaq.service.impl;

import com.abiodun.expaq.dto.PaymentAnalyticsDTO;
import com.abiodun.expaq.model.Payment;
import com.abiodun.expaq.model.Payment.PaymentMethod;
import com.abiodun.expaq.model.Payment.PaymentStatus;
import com.abiodun.expaq.repository.PaymentRepository;
import com.abiodun.expaq.service.IPaymentAnalyticsService;
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
public class PaymentAnalyticsServiceImpl implements IPaymentAnalyticsService {

    private final PaymentRepository paymentRepository;

    @Override
    public PaymentAnalyticsDTO getOverallAnalytics() {
        List<Payment> allPayments = paymentRepository.findAll();
        return calculateAnalytics(allPayments);
    }

    @Override
    public PaymentAnalyticsDTO getAnalyticsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        List<Payment> payments = paymentRepository.findByDateRange(startDate, endDate);
        return calculateAnalytics(payments);
    }

    @Override
    public PaymentAnalyticsDTO getUserAnalytics(UUID userId) {
        List<Payment> userPayments = paymentRepository.findByUserId(userId);
        return calculateAnalytics(userPayments);
    }

    @Override
    public PaymentAnalyticsDTO getBookingAnalytics(UUID bookingId) {
        List<Payment> bookingPayments = paymentRepository.findByBookingId(bookingId);
        return calculateAnalytics(bookingPayments);
    }

    @Override
    public PaymentAnalyticsDTO getAnalyticsByStatus(PaymentStatus status) {
        List<Payment> payments = paymentRepository.findByStatus(status);
        return calculateAnalytics(payments);
    }

    @Override
    public PaymentAnalyticsDTO getAnalyticsByPaymentMethod(String paymentMethod) {
        List<Payment> payments = paymentRepository.findByPaymentMethod(PaymentMethod.valueOf(paymentMethod.toUpperCase()));
        return calculateAnalytics(payments);
    }

    @Override
    public PaymentAnalyticsDTO getAnalyticsByCurrency(String currency) {
        List<Payment> payments = paymentRepository.findByCurrency(currency);
        return calculateAnalytics(payments);
    }

    @Override
    public PaymentAnalyticsDTO getAnalyticsByTimePeriod(String timePeriod) {
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = switch (timePeriod.toLowerCase()) {
            case "daily" -> endDate.minusDays(1);
            case "weekly" -> endDate.minusWeeks(1);
            case "monthly" -> endDate.minusMonths(1);
            case "yearly" -> endDate.minusYears(1);
            default -> throw new IllegalArgumentException("Invalid time period: " + timePeriod);
        };
        return getAnalyticsByDateRange(startDate, endDate);
    }

    private PaymentAnalyticsDTO calculateAnalytics(List<Payment> payments) {
        if (payments.isEmpty()) {
            return PaymentAnalyticsDTO.builder().build();
        }

        BigDecimal totalRevenue = calculateTotalRevenue(payments);
        BigDecimal totalRefunds = calculateTotalRefunds(payments);
        BigDecimal netRevenue = totalRevenue.subtract(totalRefunds);

        return PaymentAnalyticsDTO.builder()
                .totalRevenue(totalRevenue)
                .totalRefunds(totalRefunds)
                .netRevenue(netRevenue)
                .revenueByPaymentMethod(calculateRevenueByPaymentMethod(payments))
                .paymentCountByStatus(calculatePaymentCountByStatus(payments))
                .revenueByCurrency(calculateRevenueByCurrency(payments))
                .revenueByTimePeriod(calculateRevenueByTimePeriod(payments))
                .averageTransactionValue(calculateAverageTransactionValue(payments))
                .paymentCountByTimePeriod(calculatePaymentCountByTimePeriod(payments))
                .refundRateByPaymentMethod(calculateRefundRateByPaymentMethod(payments))
                .build();
    }

    private BigDecimal calculateTotalRevenue(List<Payment> payments) {
        return payments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.COMPLETED)
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal calculateTotalRefunds(List<Payment> payments) {
        return payments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.REFUNDED)
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private Map<String, BigDecimal> calculateRevenueByPaymentMethod(List<Payment> payments) {
        return payments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.COMPLETED)
                .collect(Collectors.groupingBy(
                        p -> p.getPaymentMethod().name(),
                        Collectors.reducing(
                                BigDecimal.ZERO,
                                Payment::getAmount,
                                BigDecimal::add
                        )
                ));
    }

    private Map<String, Long> calculatePaymentCountByStatus(List<Payment> payments) {
        return payments.stream()
                .collect(Collectors.groupingBy(
                        p -> p.getStatus().name(),
                        Collectors.counting()
                ));
    }

    private Map<String, BigDecimal> calculateRevenueByCurrency(List<Payment> payments) {
        return payments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.COMPLETED)
                .collect(Collectors.groupingBy(
                        Payment::getCurrency,
                        Collectors.reducing(
                                BigDecimal.ZERO,
                                Payment::getAmount,
                                BigDecimal::add
                        )
                ));
    }

    private Map<String, BigDecimal> calculateRevenueByTimePeriod(List<Payment> payments) {
        return payments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.COMPLETED)
                .collect(Collectors.groupingBy(
                        p -> p.getCreatedAt().truncatedTo(ChronoUnit.DAYS).toString(),
                        Collectors.reducing(
                                BigDecimal.ZERO,
                                Payment::getAmount,
                                BigDecimal::add
                        )
                ));
    }

    private Map<String, BigDecimal> calculateAverageTransactionValue(List<Payment> payments) {
        Map<String, List<Payment>> paymentsByMethod = payments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.COMPLETED)
                .collect(Collectors.groupingBy(p -> p.getPaymentMethod().name()));

        return paymentsByMethod.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        e -> {
                            List<Payment> methodPayments = e.getValue();
                            BigDecimal total = methodPayments.stream()
                                    .map(Payment::getAmount)
                                    .reduce(BigDecimal.ZERO, BigDecimal::add);
                            return total.divide(new BigDecimal(methodPayments.size()), 2, RoundingMode.HALF_UP);
                        }
                ));
    }

    private Map<String, Long> calculatePaymentCountByTimePeriod(List<Payment> payments) {
        return payments.stream()
                .collect(Collectors.groupingBy(
                        p -> p.getCreatedAt().truncatedTo(ChronoUnit.DAYS).toString(),
                        Collectors.counting()
                ));
    }

    private Map<String, BigDecimal> calculateRefundRateByPaymentMethod(List<Payment> payments) {
        Map<String, List<Payment>> paymentsByMethod = payments.stream()
                .collect(Collectors.groupingBy(p -> p.getPaymentMethod().name()));

        return paymentsByMethod.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        e -> {
                            List<Payment> methodPayments = e.getValue();
                            long refundCount = methodPayments.stream()
                                    .filter(p -> p.getStatus() == PaymentStatus.REFUNDED)
                                    .count();
                            return new BigDecimal(refundCount)
                                    .divide(new BigDecimal(methodPayments.size()), 4, RoundingMode.HALF_UP)
                                    .multiply(new BigDecimal("100"));
                        }
                ));
    }
} 