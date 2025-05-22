package com.abiodun.expaq.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when a service layer operation fails.
 * This is a runtime exception that will result in a 500 Internal Server Error response.
 */
@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class ServiceException extends RuntimeException {

    /**
     * Constructs a new service exception with the specified detail message.
     *
     * @param message the detail message
     */
    public ServiceException(String message) {
        super(message);
    }

    /**
     * Constructs a new service exception with the specified detail message and cause.
     *
     * @param message the detail message
     * @param cause the cause (which is saved for later retrieval)
     */
    public ServiceException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * Constructs a new service exception with the specified cause.
     *
     * @param cause the cause (which is saved for later retrieval)
     */
    public ServiceException(Throwable cause) {
        super(cause);
    }
}
