package com.abiodun.expaq.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDTO {
    private String paymentIntentId;
    private String clientSecret;
    private String redirectUrl;
    private String status;
    private String message;
    private String access_code;
    private String provider;
    private String authorizationUrl;  // Added for Paystack redirect URL
    private String accessCode;

}
