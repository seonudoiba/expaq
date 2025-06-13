package com.abiodun.expaq.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;


@Configuration
public class PaymentConfig {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @Value("${paystack.secret.key}")
    private String paystackSecretKey;

    @PostConstruct
    public void initStripe() {
        Stripe.apiKey = stripeApiKey;
    }

    public String getStripeApiKey() {
        return stripeApiKey;
    }

    public String getPaystackSecretKey() {
        return paystackSecretKey;
    }
} 