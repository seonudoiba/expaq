package com.abiodun.expaq.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;

@Service
public class CurrencyExchangeService {

    @Value("${exchange.api.key:}")
    private String exchangeApiKey;

    private final WebClient.Builder webClientBuilder;

    public CurrencyExchangeService(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }

    public BigDecimal convertToNaira(BigDecimal amount, String fromCurrency) {
        if ("NGN".equals(fromCurrency)) {
            return amount;
        }

        WebClient client = webClientBuilder.baseUrl("https://api.exchangerate-api.com/v4/latest")
                .build();

        try {
            Map response = client.get()
                    .uri("/" + fromCurrency)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response != null && response.containsKey("rates")) {
                Map<String, Double> rates = (Map<String, Double>) response.get("rates");
                Double ngnRate = rates.get("NGN");

                if (ngnRate != null) {
                    return amount.multiply(BigDecimal.valueOf(ngnRate))
                            .setScale(2, RoundingMode.HALF_UP);
                }
            }
            throw new RuntimeException("Failed to get exchange rate");
        } catch (Exception e) {
            throw new RuntimeException("Currency conversion failed: " + e.getMessage(), e);
        }
    }
}
