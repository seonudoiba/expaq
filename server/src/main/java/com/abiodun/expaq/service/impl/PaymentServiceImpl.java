package com.abiodun.expaq.service.impl;

import com.abiodun.expaq.dto.PaymentDTO;
import com.abiodun.expaq.exception.ResourceNotFoundException;
import com.abiodun.expaq.model.Booking;
import com.abiodun.expaq.model.Payment;
import com.abiodun.expaq.model.Payment.PaymentMethod;
import com.abiodun.expaq.model.Payment.PaymentStatus;
import com.abiodun.expaq.model.User;
import com.abiodun.expaq.repository.BookingRepository;
import com.abiodun.expaq.repository.PaymentRepository;
import com.abiodun.expaq.repository.UserRepository;
import com.abiodun.expaq.service.IPaymentService;
import com.abiodun.expaq.service.payment.PaymentProvider;
import com.abiodun.expaq.service.payment.PaystackClient;
import com.abiodun.expaq.service.payment.StripePaymentProvider;
import com.abiodun.expaq.service.payment.PaystackPaymentProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentServiceImpl implements IPaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final StripePaymentProvider stripePaymentProvider;
    private final PaystackPaymentProvider paystackPaymentProvider;

    private boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        // Basic email format validation
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        return email.matches(emailRegex);
    }

    @Override
    @Transactional
    public PaymentDTO createPayment(UUID bookingId, UUID userId, String paymentMethod) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        
        // Use the new query to ensure email is properly loaded
        User user = userRepository.findByIdForPayment(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        log.info("Creating payment for user: {}, email: {}", user.getId(), user.getEmail());

        // Validate user email for Paystack payments
        if (paymentMethod.equalsIgnoreCase("PAYSTACK")) {
            if (!isValidEmail(user.getEmail())) {
                log.error("Invalid email format for user: {}, email: {}", user.getId(), user.getEmail());
                throw new IllegalArgumentException("A valid email address is required for Paystack payments");
            }
            log.info("Using email: {} for Paystack payment", user.getEmail());
        }

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setUser(user);
        payment.setAmount(booking.getTotalPrice());
        payment.setPaymentMethod(PaymentMethod.valueOf(paymentMethod.toUpperCase()));
        payment.setStatus(PaymentStatus.PENDING);  // Set initial status to PENDING

        // Set currency based on payment provider
        if (paymentMethod.equalsIgnoreCase("PAYSTACK")) {
            payment.setCurrency(Payment.Currency.NGN);
        } else {
            payment.setCurrency(Payment.Currency.USD);
        }

        try {
            PaystackClient.PaymentInitResponse paystackResponse = null;
            if (paymentMethod.equalsIgnoreCase("STRIPE")) {
                payment.setPaymentProvider("STRIPE");
                String stripePaymentIntentId = stripePaymentProvider.createPaymentIntent(payment);
                payment.setPaymentProviderReference(stripePaymentIntentId);
            } else if (paymentMethod.equalsIgnoreCase("PAYSTACK")) {
                payment.setPaymentProvider("PAYSTACK");
                paystackResponse = paystackPaymentProvider.createPaymentIntent(payment);
                payment.setPaymentProviderReference(paystackResponse.getReference());
            } else {
                throw new IllegalArgumentException("Unsupported payment method: " + paymentMethod);
            }

            Payment savedPayment = paymentRepository.save(payment);
            PaymentDTO paymentDTO = PaymentDTO.fromPayment(savedPayment);

            // Set the authorization URL if it's a Paystack payment
            if (paystackResponse != null) {
                paymentDTO.setAuthorizationUrl(paystackResponse.getAuthorizationUrl());
                paymentDTO.setAccess_code(paystackResponse.getAccessCode());
            }

            log.info("Created payment for booking {} by user {} with provider {}",
                    bookingId, userId, paymentMethod);
            
            return paymentDTO;
        } catch (PaymentProvider.PaymentException e) {
            log.error("Error creating payment", e);
            payment.setStatus(PaymentStatus.FAILED);
            payment.setErrorMessage(e.getMessage());
            paymentRepository.save(payment);
            throw new RuntimeException("Failed to create payment: " + e.getMessage());
        }
    }

    @Override
    public PaymentDTO getPayment(UUID paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        return PaymentDTO.fromPayment(payment);
    }

    @Override
    public List<PaymentDTO> getUserPayments(UUID userId) {
        return paymentRepository.findByUserId(userId).stream()
                .map(PaymentDTO::fromPayment)
                .collect(Collectors.toList());
    }

    @Override
    public List<PaymentDTO> getBookingPayments(UUID bookingId) {
        return paymentRepository.findByBookingId(bookingId).stream()
                .map(PaymentDTO::fromPayment)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PaymentDTO updatePaymentStatus(UUID paymentId, PaymentStatus status, String transactionId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        try {
            if (status == PaymentStatus.COMPLETED) {
                if ("STRIPE".equals(payment.getPaymentProvider())) {
                    stripePaymentProvider.confirmPayment(payment.getPaymentProviderReference());
                } else if ("PAYSTACK".equals(payment.getPaymentProvider())) {
                    System.out.println("Confirming Paystack payment with reference: " + payment.getPaymentProviderReference());
                    paystackPaymentProvider.confirmPayment(payment.getPaymentProviderReference());
                }
                payment.getBooking().confirm();
                bookingRepository.save(payment.getBooking());
            }

            payment.setStatus(status);
            payment.setTransactionId(transactionId);
            Payment updatedPayment = paymentRepository.save(payment);
            log.info("Updated payment {} status to {}", paymentId, status);
            
            return PaymentDTO.fromPayment(updatedPayment);
        } catch (PaymentProvider.PaymentException e) {
            log.error("Error updating payment status", e);
            throw new RuntimeException("Failed to update payment status: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public PaymentDTO processRefund(UUID paymentId, String reason) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        try {
            if ("STRIPE".equals(payment.getPaymentProvider())) {
                stripePaymentProvider.refundPayment(payment.getPaymentProviderReference(), payment.getAmount());
            } else if ("PAYSTACK".equals(payment.getPaymentProvider())) {
                paystackPaymentProvider.refundPayment(payment.getPaymentProviderReference(), payment.getAmount());
            }

            payment.setStatus(PaymentStatus.REFUNDED);
            payment.setErrorMessage(reason);
            Payment updatedPayment = paymentRepository.save(payment);
            log.info("Processed refund for payment {}", paymentId);
            
            return PaymentDTO.fromPayment(updatedPayment);
        } catch (PaymentProvider.PaymentException e) {
            log.error("Error processing refund", e);
            throw new RuntimeException("Failed to process refund: " + e.getMessage());
        }
    }

    @Override
    public List<PaymentDTO> getPaymentsByDateRange(UUID userId, LocalDateTime startDate, LocalDateTime endDate) {
        return paymentRepository.findByUserIdAndDateRange(userId, startDate, endDate).stream()
                .map(PaymentDTO::fromPayment)
                .collect(Collectors.toList());
    }

    @Override
    public Page<PaymentDTO> getUserPaymentsPaginated(UUID userId, Pageable pageable) {
        return paymentRepository.findByUserId(userId, pageable)
                .map(PaymentDTO::fromPayment);
    }

    @Override
    public BigDecimal getTotalAmountByUserAndStatus(UUID userId, PaymentStatus status) {
        return paymentRepository.getTotalAmountByUserIdAndStatus(userId, status);
    }

    @Override
    @Transactional
    public void cancelPayment(UUID paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        payment.setStatus(PaymentStatus.CANCELLED);
        paymentRepository.save(payment);
        log.info("Cancelled payment {}", paymentId);
    }

    @Override
    public PaymentDTO getPaymentByBookingAndStatus(UUID bookingId, PaymentStatus status) {
        Payment payment = paymentRepository.findByBookingIdAndStatus(bookingId, status);
        if (payment == null) {
            throw new ResourceNotFoundException("Payment not found for booking " + bookingId + " with status " + status);
        }
        return PaymentDTO.fromPayment(payment);
    }
}
