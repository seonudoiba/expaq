package com.abiodun.expaq.service;

import com.abiodun.expaq.dto.PaymentAnalyticsDTO;
import com.abiodun.expaq.model.Payment.PaymentStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public interface IPaymentAnalyticsService {
    PaymentAnalyticsDTO getOverallAnalytics();
    PaymentAnalyticsDTO getAnalyticsByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    PaymentAnalyticsDTO getUserAnalytics(UUID userId);
    PaymentAnalyticsDTO getBookingAnalytics(UUID bookingId);
    PaymentAnalyticsDTO getAnalyticsByStatus(PaymentStatus status);
    PaymentAnalyticsDTO getAnalyticsByPaymentMethod(String paymentMethod);
    PaymentAnalyticsDTO getAnalyticsByCurrency(String currency);
    PaymentAnalyticsDTO getAnalyticsByTimePeriod(String timePeriod); // daily, weekly, monthly, yearly
}