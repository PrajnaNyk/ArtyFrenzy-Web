package com.art.artyfrenzy.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handles your custom business logic errors (e.g., "You have already reviewed this artwork!", "Razorpay Error: ...")
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", ex.getMessage()));
    }

    // Handles cases where a user is logged in but tries to do an ADMIN-only action
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleAccessDeniedException(AccessDeniedException ex) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "You do not have permission to perform this action."));
    }

    // Handles cases where a user tries to submit a review/make a payment with an expired/missing JWT token
    @ExceptionHandler(InsufficientAuthenticationException.class)
    public ResponseEntity<Map<String, String>> handleInsufficientAuthenticationException(InsufficientAuthenticationException ex) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Your session has expired. Please log in again."));
    }
    
    // Catch-all for any other unexpected server errors (NullPointerExceptions, Razorpay API errors, etc.)
    // UPDATED: Appends the actual exception message so you can debug easily from the frontend
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Server Error: " + ex.getMessage()));
    }
}