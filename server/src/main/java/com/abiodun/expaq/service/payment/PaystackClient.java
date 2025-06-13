package com.abiodun.expaq.service.payment;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class PaystackClient {
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${paystack.secret.key}")
    private String secretKey;

    private static final String BASE_URL = "https://api.paystack.co";
    private static final String INITIALIZE_PAYMENT = "/transaction/initialize";
    private static final String VERIFY_PAYMENT = "/transaction/verify/";
    private static final String REFUND_PAYMENT = "/refund";

    public String initializePayment(String email, BigDecimal amount, String currency, Map<String, String> metadata) {
        try {
            HttpHeaders headers = createHeaders();
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("email", email);
            requestBody.put("amount", amount.multiply(new BigDecimal("100")).intValue()); // Convert to kobo/cents
            requestBody.put("currency", currency);
            requestBody.put("metadata", metadata);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(
                BASE_URL + INITIALIZE_PAYMENT,
                request,
                Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> data = (Map<String, Object>) response.getBody().get("data");
                return (String) data.get("reference");
            }
            
            throw new PaymentException("Failed to initialize payment");
        } catch (Exception e) {
            log.error("Error initializing Paystack payment", e);
            throw new PaymentException("Failed to initialize payment: " + e.getMessage());
        }
    }

    public void verifyPayment(String reference) {
        try {
            HttpHeaders headers = createHeaders();
            HttpEntity<?> request = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                BASE_URL + VERIFY_PAYMENT + reference,
                HttpMethod.GET,
                request,
                Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> data = (Map<String, Object>) response.getBody().get("data");
                String status = (String) data.get("status");
                
                if (!"success".equals(status)) {
                    throw new PaymentException("Payment verification failed: " + status);
                }
            } else {
                throw new PaymentException("Failed to verify payment");
            }
        } catch (Exception e) {
            log.error("Error verifying Paystack payment", e);
            throw new PaymentException("Failed to verify payment: " + e.getMessage());
        }
    }

    public void refundPayment(String transactionId, BigDecimal amount) {
        try {
            HttpHeaders headers = createHeaders();
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("transaction", transactionId);
            if (amount != null) {
                requestBody.put("amount", amount.multiply(new BigDecimal("100")).intValue());
            }

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(
                BASE_URL + REFUND_PAYMENT,
                request,
                Map.class
            );

            if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
                throw new PaymentException("Failed to process refund");
            }
        } catch (Exception e) {
            log.error("Error processing Paystack refund", e);
            throw new PaymentException("Failed to process refund: " + e.getMessage());
        }
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + secretKey);
        return headers;
    }
} 