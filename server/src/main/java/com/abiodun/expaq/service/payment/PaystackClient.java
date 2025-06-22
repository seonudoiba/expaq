package com.abiodun.expaq.service.payment;

import com.abiodun.expaq.config.PaystackConfig;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class PaystackClient {
    private final PaystackConfig paystackConfig;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Data
    public static class PaymentInitResponse {
        private String reference;
        private String authorizationUrl;
        private String accessCode;
    }

    public PaymentInitResponse initializePayment(String email, BigDecimal amount, String currency, Map<String, String> metadata) {
        try {
            if (email == null || email.trim().isEmpty()) {
                throw new RuntimeException("Email address is required");
            }

            log.info("Initializing Paystack payment with email: {}, amount: {}, currency: {}",
                    email, amount, currency);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + paystackConfig.getSecretKey());
            headers.set("Cache-Control", "no-cache");

            // Convert amount to kobo (multiply by 100)
            int amountInKobo = amount.multiply(new BigDecimal("100")).intValue();

            Map<String, Object> body = new HashMap<>();
            body.put("email", email);
            body.put("amount", String.valueOf(amountInKobo));
            body.put("currency", currency);
            body.put("metadata", metadata);
            body.put("callback_url", paystackConfig.getCallbackUrl());

            log.debug("Request body: {}", body);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                paystackConfig.getBaseUrl() + "/transaction/initialize",
                request,
                String.class
            );

            log.debug("Paystack response: {}", response.getBody());

            JsonNode jsonResponse = objectMapper.readTree(response.getBody());

            if (!jsonResponse.get("status").asBoolean()) {
                String errorMessage = jsonResponse.get("message").asText();
                log.error("Paystack initialization failed: {}", errorMessage);
                throw new RuntimeException("Failed to initialize payment: " + errorMessage);
            }

            JsonNode data = jsonResponse.get("data");
            PaymentInitResponse initResponse = new PaymentInitResponse();
            initResponse.setReference(data.get("reference").asText());
            initResponse.setAuthorizationUrl(data.get("authorization_url").asText());
            initResponse.setAccessCode(data.get("access_code").asText());

            return initResponse;
        } catch (Exception e) {
            log.error("Error initializing payment: {}", e.getMessage());
            throw new RuntimeException("Error initializing payment: " + e.getMessage(), e);
        }
    }

    public void verifyPayment(String reference) {
        try {
            HttpHeaders headers = createHeaders();
            HttpEntity<?> request = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                paystackConfig.getBaseUrl() + "/transaction/verify/" + reference,
                HttpMethod.GET,
                request,
                String.class
            );

            JsonNode jsonResponse = objectMapper.readTree(response.getBody());
            if (!jsonResponse.get("status").asBoolean() ||
                !jsonResponse.get("data").get("status").asText().equals("success")) {
                throw new RuntimeException("Payment verification failed");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error verifying payment: " + e.getMessage(), e);
        }
    }

    public void refundPayment(String reference, BigDecimal amount) {
        try {
            HttpHeaders headers = createHeaders();
            
            Map<String, Object> body = new HashMap<>();
            body.put("transaction", reference);
            body.put("amount", amount.multiply(new BigDecimal("100")).intValue()); // Convert to kobo

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(
                paystackConfig.getBaseUrl() + "/refund",
                request,
                String.class
            );

            JsonNode jsonResponse = objectMapper.readTree(response.getBody());
            if (!jsonResponse.get("status").asBoolean()) {
                throw new RuntimeException("Refund failed: " + jsonResponse.get("message").asText());
            }
        } catch (Exception e) {
            throw new RuntimeException("Error processing refund: " + e.getMessage(), e);
        }
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + paystackConfig.getSecretKey());
        return headers;
    }
}
