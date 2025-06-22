package com.abiodun.expaq.service.payment;

import com.abiodun.expaq.model.Payment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class PaystackPaymentProvider implements PaymentProvider {
    private final PaystackClient paystackClient;

    @Override
    public PaystackClient.PaymentInitResponse createPaymentIntent(Payment payment) throws PaymentException {
        try {
            String userEmail = payment.getUser().getEmail();
            log.info("Creating Paystack payment intent for user: {}, email: {}, amount: {}",
                    payment.getUser().getId(), userEmail, payment.getAmount());

            if (userEmail == null || userEmail.trim().isEmpty()) {
                log.error("User email is missing for payment creation. User ID: {}", payment.getUser().getId());
                throw new PaymentException("User email is required for Paystack payment");
            }

            Map<String, String> metadata = new HashMap<>();
            metadata.put("booking_id", payment.getBooking().getId().toString());
            metadata.put("user_id", payment.getUser().getId().toString());

            return paystackClient.initializePayment(
                userEmail,
                payment.getAmount(),
                payment.getCurrency().toString(),
                metadata
            );
        } catch (Exception e) {
            log.error("Error creating Paystack payment intent for user {}: {}",
                    payment.getUser().getId(), e.getMessage(), e);
            throw new PaymentException("Failed to create payment intent: " + e.getMessage());
        }
    }

    @Override
    public void confirmPayment(String paymentIntentId) throws PaymentException {
        try {
            paystackClient.verifyPayment(paymentIntentId);
        } catch (Exception e) {
            log.error("Error confirming Paystack payment", e);
            throw new PaymentException("Failed to confirm payment: " + e.getMessage());
        }
    }

    @Override
    public void refundPayment(String paymentIntentId, BigDecimal amount) throws PaymentException {
        try {
            paystackClient.refundPayment(paymentIntentId, amount);
        } catch (Exception e) {
            log.error("Error refunding Paystack payment", e);
            throw new PaymentException("Failed to refund payment: " + e.getMessage());
        }
    }

    @Override
    public PaymentStatus getPaymentStatus(String paymentIntentId) throws PaymentException {
        // For Paystack, we need to verify the payment to get its status
        paystackClient.verifyPayment(paymentIntentId);
        return PaymentStatus.SUCCEEDED;
    }
}
