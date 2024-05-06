package com.abiodun.expaq.exception;

public class RatingNotFoundException extends RuntimeException {
    private static final long serialVerisionUID = 2;
    public RatingNotFoundException(String message) {
        super(message);
    }
}
