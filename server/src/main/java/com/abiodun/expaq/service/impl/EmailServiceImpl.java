package com.abiodun.expaq.service.impl;

import com.abiodun.expaq.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;


@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${app.base-url}")
    private String baseUrl;

    @Value("${app.email.logo-path:classpath:/static/images/expaqlogo.png}")
    private String logoPath;


//    @Override
//    public void sendVerificationEmail(String email, String token) {
//        String verifyLink = baseUrl + "/api/auth/verify-email?token=" + token;
//
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo(email);
//        message.setSubject("Verify your email address");
//        message.setText("Hi" + "Please click the following link to verify your email address: " + verifyLink);
//        mailSender.send(message);
//    }


    @Override
    public void sendVerificationEmail(String email, String token) {
        String verificationUrl = baseUrl + "/api/auth/verify-email?token=" + token;

        // Prepare the evaluation context
        Context context = new Context();
        context.setVariable("name", email.split("@")[0]); // Use the part before @ as name
        context.setVariable("verificationUrl", verificationUrl);
        context.setVariable("logoUrl", "cid:logoImage");

        // Create HTML content using Thymeleaf
        String htmlContent = templateEngine.process("emails/verify-email", context);

        // Prepare email using MimeMessage
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper;
        try {
            helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(email);
            helper.setSubject("Verify your email address");
            helper.setText(htmlContent, true); // true = isHtml

            // Add logo as inline image
            ClassPathResource logo = new ClassPathResource(logoPath.replace("classpath:", ""));
            helper.addInline("logoImage", logo);

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            // In a production app, you should log this error
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    public void sendPasswordResetEmail(String email, String token) {
        String resetUrl = baseUrl + "/api/auth/reset-password?token=" + token;

        // Prepare the evaluation context
        Context context = new Context();
        context.setVariable("name", email.split("@")[0]);
        context.setVariable("resetUrl", resetUrl);
        context.setVariable("logoUrl", "cid:logoImage");

        // Create HTML content using Thymeleaf
        String htmlContent = templateEngine.process("emails/password-reset", context);

        // Prepare email using MimeMessage
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper;
        try {
            helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(email);
            helper.setSubject("Reset your Password");
            helper.setText(htmlContent, true); // true = isHtml

            // Add logo as inline image
            ClassPathResource logo = new ClassPathResource(logoPath.replace("classpath:", ""));
            helper.addInline("logoImage", logo);

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            // In a production app, you should log this error
            throw new RuntimeException("Failed to send reset password email", e);
        }
    }
//    @Override
//    public void sendPasswordResetEmail(String email, String token) {
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo(email);
//        message.setSubject("Reset your password");
//        message.setText("Please click the following link to reset your password: "
//                + "http://localhost:8080/api/auth/reset-password?token=" + token);
//        mailSender.send(message);
//    }

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

    @Override
    public void sendPasswordChangeNotification(String email, String fullName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Password Change Notification");
        message.setText("Hello " + fullName + ",\n\nYour password has been changed successfully.");
        mailSender.send(message);
    }

    @Override
    public void sendAccountActivatedNotification(String email, String fullName, String fullName1) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Account Activated Notification");
        message.setText("Hello " + fullName + ",\n\nYour account has been activated by " + fullName1 + ".");
        mailSender.send(message);
    }

    @Override
    public void sendAccountDeletedNotification(String email, String fullName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Account Deleted Notification");
        message.setText("Hello " + fullName + ",\n\nYour account has been deleted.");
        mailSender.send(message);
    }
} 