package com.abiodun.expaq.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@Slf4j
@RequiredArgsConstructor
public class CurrencyConversionService {
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${exchange.api.key}")
    private String apiKey;

    @Value("${exchange.api.url:https://api.exchangerate-api.com/v4/latest/USD}")
    private String exchangeApiUrl;

    public BigDecimal convertUSDToNGN(BigDecimal usdAmount) {
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(exchangeApiUrl, String.class);
            JsonNode rates = objectMapper.readTree(response.getBody()).get("rates");
            BigDecimal ngnRate = BigDecimal.valueOf(rates.get("NGN").asDouble());

            return usdAmount.multiply(ngnRate).setScale(2, RoundingMode.HALF_UP);
        } catch (Exception e) {
            log.error("Error converting USD to NGN: {}", e.getMessage());
            throw new RuntimeException("Failed to convert currency: " + e.getMessage());
        }
    }
}
