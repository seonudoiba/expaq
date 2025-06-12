package com.abiodun.expaq.service.payment;

import com.abiodun.expaq.model.Payment;

import java.math.BigDecimal;

public interface PaymentProvider {
    String createPaymentIntent(Payment payment) throws PaymentException;
    void confirmPayment(String paymentIntentId) throws PaymentException;
    void refundPayment(String paymentIntentId, BigDecimal amount) throws PaymentException;
    PaymentStatus getPaymentStatus(String paymentIntentId) throws PaymentException;
    
    enum PaymentStatus {
        SUCCEEDED,
        PENDING,
        FAILED,
        REFUNDED
    }
    
    class PaymentException extends Exception {
        public PaymentException(String message) {
            super(message);
        }
        
        public PaymentException(String message, Throwable cause) {
            super(message, cause);
        }
    }
} 