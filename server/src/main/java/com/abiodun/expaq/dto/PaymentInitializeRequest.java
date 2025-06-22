package com.abiodun.expaq.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class PaymentInitializeRequest {
    private UUID bookingId;
    private String paymentMethod;
}
