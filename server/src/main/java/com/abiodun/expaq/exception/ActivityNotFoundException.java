package com.abiodun.expaq.exception;

public class ActivityNotFoundException extends RuntimeException {
    private static final long serialVerisionUID = 1;

    public ActivityNotFoundException(String message) {
        super(message);
    }
}
