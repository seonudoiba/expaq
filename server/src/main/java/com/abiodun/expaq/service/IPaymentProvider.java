package com.abiodun.expaq.service;

import com.abiodun.expaq.dto.PaymentDTO;
import com.abiodun.expaq.model.Payment;

public interface IPaymentProvider {
    PaymentDTO createPaymentIntent(Payment payment, String callbackUrl);
    PaymentDTO verifyPayment(String paymentIntentId);
}
