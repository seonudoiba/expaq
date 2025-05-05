package com.abiodun.expaq.service;

public interface EmailService {
    void sendVerificationEmail(String email, String token);
    void sendPasswordResetEmail(String email, String token);
    void sendWelcomeEmail(String email, String username);
    void sendBookingConfirmationEmail(String email, String bookingId);
    void sendActivityCancellationEmail(String email, String activityId);
} 