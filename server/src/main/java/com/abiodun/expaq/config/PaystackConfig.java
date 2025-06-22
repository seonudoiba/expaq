package com.abiodun.expaq.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "paystack")
@Getter
@Setter
public class PaystackConfig {
    private String secretKey;
    private String publicKey;
    private String baseUrl = "https://api.paystack.co";
    private String callbackUrl;  // URL where Paystack will redirect after payment
    private String webhookUrl;   // URL for Paystack webhook notifications
}
