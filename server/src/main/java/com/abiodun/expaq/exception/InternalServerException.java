package com.abiodun.expaq.exception;


import java.io.IOException;

public class InternalServerException extends RuntimeException {
    public InternalServerException(String message, IOException e) {
        super(message, e); // Pass the cause 'e' to the superclass constructor
    }
}
