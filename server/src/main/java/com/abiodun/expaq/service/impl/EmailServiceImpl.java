package com.abiodun.expaq.service.impl;

import com.abiodun.expaq.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendVerificationEmail(String email, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Verify your email address");
        message.setText("Please click the following link to verify your email address: "
                + "http://localhost:8080/api/auth/verify-email?token=" + token);
        mailSender.send(message);
    }

    @Override
    public void sendPasswordResetEmail(String email, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Reset your password");
        message.setText("Please click the following link to reset your password: "
                + "http://localhost:8080/api/auth/reset-password?token=" + token);
        mailSender.send(message);
    }

    @Override
    public void sendWelcomeEmail(String email, String username) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Welcome to Expaq!");
        message.setText("Hello " + username + ",\n\nWelcome to Expaq! We're excited to have you on board.");
        mailSender.send(message);
    }

    @Override
    public void sendBookingConfirmationEmail(String email, String bookingId) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Booking Confirmation");
        message.setText("Your booking has been confirmed. Booking ID: " + bookingId);
        mailSender.send(message);
    }

    @Override
    public void sendActivityCancellationEmail(String email, String activityId) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Activity Cancellation");
        message.setText("The activity with ID " + activityId + " has been cancelled.");
        mailSender.send(message);
    }
} 