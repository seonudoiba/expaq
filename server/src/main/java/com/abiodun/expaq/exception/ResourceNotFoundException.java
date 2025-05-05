// File: c:\Users\Starr\Desktop\projects\expaq\server\src\main\java\com\abiodun\expaq\exception\ResourceNotFoundException.java
package com.abiodun.expaq.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}