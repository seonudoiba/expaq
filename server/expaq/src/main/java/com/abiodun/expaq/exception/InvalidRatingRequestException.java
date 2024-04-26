package com.abiodun.expaq.exception;



public class InvalidRatingRequestException extends RuntimeException {
    public InvalidRatingRequestException(String message) {
        super(message);
    }
}
