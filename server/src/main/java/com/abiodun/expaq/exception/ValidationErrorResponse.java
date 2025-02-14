package com.abiodun.expaq.exception;

import java.time.LocalDateTime;
import java.util.List;

public class ValidationErrorResponse {
    private final List<String> errors;
    private final LocalDateTime timestamp;

    public ValidationErrorResponse(List<String> errors) {
        this.errors = errors;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and setters
    public List<String> getErrors() { return errors; }
    public LocalDateTime getTimestamp() { return timestamp; }
}
