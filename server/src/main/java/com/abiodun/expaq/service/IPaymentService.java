package com.abiodun.expaq.service;

import com.abiodun.expaq.dto.PaymentDTO;
import com.abiodun.expaq.model.Payment.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface IPaymentService {
    PaymentDTO createPayment(UUID bookingId, UUID userId, String paymentMethod);
    PaymentDTO getPayment(UUID paymentId);
    List<PaymentDTO> getUserPayments(UUID userId);
    List<PaymentDTO> getBookingPayments(UUID bookingId);
    PaymentDTO updatePaymentStatus(UUID paymentId, PaymentStatus status, String transactionId);
    PaymentDTO processRefund(UUID paymentId, String reason);
    List<PaymentDTO> getPaymentsByDateRange(UUID userId, LocalDateTime startDate, LocalDateTime endDate);
    Page<PaymentDTO> getUserPaymentsPaginated(UUID userId, Pageable pageable);
    BigDecimal getTotalAmountByUserAndStatus(UUID userId, PaymentStatus status);
    void cancelPayment(UUID paymentId);
    PaymentDTO getPaymentByBookingAndStatus(UUID bookingId, PaymentStatus status);
} 