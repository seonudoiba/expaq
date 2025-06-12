package com.abiodun.expaq.service.payment;

import com.abiodun.expaq.config.PaymentConfig;
import com.abiodun.expaq.model.Payment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaystackPaymentProvider implements PaymentProvider {

    private final PaymentConfig paymentConfig;
    private final RestTemplate restTemplate;
    private static final String PAYSTACK_API_URL = "https://api.paystack.co";

    @Override
    public String createPaymentIntent(Payment payment) throws PaymentException {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + paymentConfig.getPaystackSecretKey());

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("amount", payment.getAmount().multiply(new BigDecimal("100")).longValue()); // Convert to kobo
            requestBody.put("currency", payment.getCurrency());
            requestBody.put("email", payment.getUser().getEmail());
            requestBody.put("metadata", Map.of(
                "bookingId", payment.getBooking().getId().toString(),
                "userId", payment.getUser().getId().toString()
            ));

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            Map<String, Object> response = restTemplate.postForObject(
                PAYSTACK_API_URL + "/transaction/initialize",
                request,
                Map.class
            );

            if (response != null && response.containsKey("data")) {
                Map<String, Object> data = (Map<String, Object>) response.get("data");
                return (String) data.get("reference");
            }
            throw new PaymentException("Failed to create payment intent");
        } catch (Exception e) {
            log.error("Error creating Paystack payment intent", e);
            throw new PaymentException("Failed to create payment intent", e);
        }
    }

    @Override
    public void confirmPayment(String paymentIntentId) throws PaymentException {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + paymentConfig.getPaystackSecretKey());

            HttpEntity<?> request = new HttpEntity<>(headers);
            Map<String, Object> response = restTemplate.getForObject(
                PAYSTACK_API_URL + "/transaction/verify/" + paymentIntentId,
                Map.class,
                request
            );

            if (response != null && response.containsKey("data")) {
                Map<String, Object> data = (Map<String, Object>) response.get("data");
                String status = (String) data.get("status");
                if (!"success".equals(status)) {
                    throw new PaymentException("Payment not succeeded");
                }
            } else {
                throw new PaymentException("Failed to verify payment");
            }
        } catch (Exception e) {
            log.error("Error confirming Paystack payment", e);
            throw new PaymentException("Failed to confirm payment", e);
        }
    }

    @Override
    public void refundPayment(String paymentIntentId, BigDecimal amount) throws PaymentException {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + paymentConfig.getPaystackSecretKey());

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("transaction", paymentIntentId);
            if (amount != null) {
                requestBody.put("amount", amount.multiply(new BigDecimal("100")).longValue());
            }

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            restTemplate.postForObject(
                PAYSTACK_API_URL + "/refund",
                request,
                Map.class
            );
        } catch (Exception e) {
            log.error("Error refunding Paystack payment", e);
            throw new PaymentException("Failed to refund payment", e);
        }
    }

    @Override
    public PaymentStatus getPaymentStatus(String paymentIntentId) throws PaymentException {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + paymentConfig.getPaystackSecretKey());

            HttpEntity<?> request = new HttpEntity<>(headers);
            Map<String, Object> response = restTemplate.getForObject(
                PAYSTACK_API_URL + "/transaction/" + paymentIntentId,
                Map.class,
                request
            );

            if (response != null && response.containsKey("data")) {
                Map<String, Object> data = (Map<String, Object>) response.get("data");
                String status = (String) data.get("status");
                return switch (status) {
                    case "success" -> PaymentStatus.SUCCEEDED;
                    case "pending" -> PaymentStatus.PENDING;
                    case "failed" -> PaymentStatus.FAILED;
                    case "refunded" -> PaymentStatus.REFUNDED;
                    default -> PaymentStatus.FAILED;
                };
            }
            throw new PaymentException("Failed to get payment status");
        } catch (Exception e) {
            log.error("Error getting Paystack payment status", e);
            throw new PaymentException("Failed to get payment status", e);
        }
    }
} 