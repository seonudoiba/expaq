package com.abiodun.expaq.response;

import lombok.Getter;

import java.time.LocalDateTime;

// Custom Error Response Classes
@Getter
public class ErrorResponse {
    // Getters and setters
    private final String message;
    private final LocalDateTime timestamp;

    public ErrorResponse(String message) {
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

}
