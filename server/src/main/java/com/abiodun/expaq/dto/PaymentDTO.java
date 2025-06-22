package com.abiodun.expaq.dto;

import com.abiodun.expaq.model.Payment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    private UUID id;
    private UUID bookingId;
    private UUID userId;
    private BigDecimal amount;
    private String currency;
    private String status;
    private String paymentMethod;
    private String transactionId;
    private String paymentProvider;
    private String paymentIntentId;          // Added this field
    private String paymentProviderReference;
    private String errorMessage;
    private String receiptUrl;
    private String clientSecret;
    private String redirectUrl;
    private String message;
    private Map<String, Object> metadata; // Added metadata field
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String authorizationUrl;  // Added for Paystack redirect URL
    private String access_code;      // Added for Paystack access code

    public static PaymentDTO fromPayment(Payment payment) {
        if (payment == null) {
            return null;
        }

        return PaymentDTO.builder()
                .id(payment.getId())
                .bookingId(payment.getBooking() != null ? payment.getBooking().getId() : null)
                .userId(payment.getUser() != null ? payment.getUser().getId() : null)
                .amount(payment.getAmount())
                .currency(payment.getCurrency().name())
                .status(payment.getStatus().name())
                .paymentMethod(payment.getPaymentMethod().name())
                .transactionId(payment.getTransactionId())
                .paymentProvider(payment.getPaymentProvider())
                .paymentIntentId(payment.getPaymentProviderReference())  // Map to paymentIntentId
                .paymentProviderReference(payment.getPaymentProviderReference())
                .errorMessage(payment.getErrorMessage())
                .receiptUrl(payment.getReceiptUrl())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
}
