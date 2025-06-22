package com.abiodun.expaq.service.payment;

import com.abiodun.expaq.config.PaymentConfig;
import com.abiodun.expaq.model.Payment;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.RefundCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class StripePaymentProvider implements PaymentProvider {

    private final PaymentConfig paymentConfig;

    @Override
    public String createPaymentIntent(Payment payment) throws PaymentException {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("amount", payment.getAmount().multiply(new BigDecimal("100")).intValue());
            params.put("currency", payment.getCurrency().toString().toLowerCase());
            params.put("payment_method_types", Arrays.asList("card"));
            params.put("metadata", Map.of(
                "booking_id", payment.getBooking().getId().toString(),
                "user_id", payment.getUser().getId().toString()
            ));

            PaymentIntent intent = PaymentIntent.create(params);
            return intent.getId();
        } catch (StripeException e) {
            throw new PaymentException("Failed to create payment intent: " + e.getMessage());
        }
    }

    @Override
    public void confirmPayment(String paymentIntentId) throws PaymentException {
        try {
            PaymentIntent intent = PaymentIntent.retrieve(paymentIntentId);
            if (!"succeeded".equals(intent.getStatus())) {
                throw new PaymentException("Payment not succeeded");
            }
        } catch (StripeException e) {
            log.error("Error confirming Stripe payment", e);
            throw new PaymentException("Failed to confirm payment", e);
        }
    }

    @Override
    public void refundPayment(String paymentIntentId, BigDecimal amount) throws PaymentException {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("payment_intent", paymentIntentId);
            if (amount != null) {
                params.put("amount", amount.multiply(new BigDecimal("100")).longValue());
            }

            Refund.create(params);
        } catch (StripeException e) {
            log.error("Error refunding Stripe payment", e);
            throw new PaymentException("Failed to refund payment", e);
        }
    }

    @Override
    public PaymentStatus getPaymentStatus(String paymentIntentId) throws PaymentException {
        try {
            PaymentIntent intent = PaymentIntent.retrieve(paymentIntentId);
            return switch (intent.getStatus()) {
                case "succeeded" -> PaymentStatus.SUCCEEDED;
                case "requires_payment_method", "requires_confirmation", "requires_action" -> PaymentStatus.PENDING;
                case "canceled" -> PaymentStatus.FAILED;
                default -> PaymentStatus.FAILED;
            };
        } catch (StripeException e) {
            log.error("Error getting Stripe payment status", e);
            throw new PaymentException("Failed to get payment status", e);
        }
    }
}
