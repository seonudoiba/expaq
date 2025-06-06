package com.abiodun.expaq.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Helper method to create a standard error response body
    private ResponseEntity<Object> buildErrorResponse(HttpStatus status, String message, WebRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", new Date());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        body.put("path", request.getDescription(false).substring(4)); // Remove "uri=" prefix
        return new ResponseEntity<>(body, status);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.NOT_FOUND, ex.getMessage(), request);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<Object> handleUnauthorizedException(UnauthorizedException ex, WebRequest request) {
        // Consider if 401 Unauthorized or 403 Forbidden is more appropriate
        return buildErrorResponse(HttpStatus.FORBIDDEN, ex.getMessage(), request);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<Object> handleUserAlreadyExistsException(UserAlreadyExistsException ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.CONFLICT, ex.getMessage(), request); // 409 Conflict is suitable
    }

    @ExceptionHandler(RoleAlreadyExistException.class)
    public ResponseEntity<Object> handleRoleAlreadyExistException(RoleAlreadyExistException ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.CONFLICT, ex.getMessage(), request); // 409 Conflict is suitable
    }

    @ExceptionHandler(InvalidBookingRequestException.class)
    public ResponseEntity<Object> handleInvalidBookingRequestException(InvalidBookingRequestException ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), request); // 400 Bad Request is suitable
    }

    @ExceptionHandler(InternalServerException.class)
    public ResponseEntity<Object> handleInternalServerException(InternalServerException ex, WebRequest request) {
        // Log the original exception cause for debugging
        if (ex.getCause() instanceof IOException) {
            // Log IOException specifically if needed
            System.err.println("IOException occurred: " + ex.getCause().getMessage());
        } else if (ex.getCause() != null) {
            System.err.println("Internal server error cause: " + ex.getCause().getMessage());
        }
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "An internal server error occurred. Please try again later.", request);
    }

    // Optional: Add a fallback handler for any other RuntimeExceptions
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Object> handleGenericRuntimeException(RuntimeException ex, WebRequest request) {
        // Log the generic exception
        System.err.println("Unhandled runtime exception: " + ex.getMessage());
        ex.printStackTrace(); // Print stack trace for debugging
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred.", request);
    }

    // Optional: Handle specific Spring exceptions like MethodArgumentNotValidException for @Valid failures
    // @ExceptionHandler(MethodArgumentNotValidException.class)
    // public ResponseEntity<Object> handleValidationExceptions(MethodArgumentNotValidException ex, WebRequest request) {
    //     Map<String, String> errors = new HashMap<>();
    //     ex.getBindingResult().getAllErrors().forEach((error) -> {
    //         String fieldName = ((FieldError) error).getField();
    //         String errorMessage = error.getDefaultMessage();
    //         errors.put(fieldName, errorMessage);
    //     });
    //     // Customize the response body for validation errors
    //     Map<String, Object> body = new HashMap<>();
    //     body.put("timestamp", new Date());
    //     body.put("status", HttpStatus.BAD_REQUEST.value());
    //     body.put("error", "Validation Failed");
    //     body.put("errors", errors);
    //     body.put("path", request.getDescription(false).substring(4));
    //     return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    // }
}