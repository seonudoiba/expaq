package com.abiodun.expaq.exception;

public class ReviewValidationException extends ReviewException {
    public ReviewValidationException(String message) {
        super(message);
    }

    public ReviewValidationException(String message, Throwable cause) {
        super(message, cause);
    }
} 