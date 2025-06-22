package com.abiodun.expaq.dto;

import com.abiodun.expaq.model.Payment.Currency;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class PaymentRequestDTO {
    private String bookingId;
    private String paymentMethod;
    private BigDecimal amount;
    private Currency currency;
    private String email;
    private String callbackUrl;
}
