package com.abiodun.expaq.service.impl;

import com.abiodun.expaq.model.Subscription;
import com.abiodun.expaq.model.SupportTicket;
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
    
    // Marketing emails
    @Override
    public void sendMarketingEmail(String email, String subject, String content) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject(subject);
        message.setText(content);
        mailSender.send(message);
    }
    
    // Subscription emails
    @Override
    public void sendSubscriptionCancellationEmail(String email, String subscriptionId) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Subscription Cancelled");
        message.setText("Your subscription has been cancelled. Subscription ID: " + subscriptionId);
        mailSender.send(message);
    }
    
    @Override
    public void sendBillingSuccessEmail(String email, Subscription subscription) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Payment Successful");
        message.setText("Your payment for subscription " + subscription.getId() + " was successful.");
        mailSender.send(message);
    }
    
    @Override
    public void sendPaymentFailureEmail(String email, Subscription subscription) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Payment Failed");
        message.setText("Your payment for subscription " + subscription.getId() + " failed. Please update your payment method.");
        mailSender.send(message);
    }
    
    @Override
    public void sendSubscriptionExpiredEmail(String email, Subscription subscription) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Subscription Expired");
        message.setText("Your subscription " + subscription.getId() + " has expired.");
        mailSender.send(message);
    }
    
    @Override
    public void sendBillingReminderEmail(String email, Subscription subscription) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Billing Reminder");
        message.setText("Your subscription " + subscription.getId() + " will be billed soon.");
        mailSender.send(message);
    }
    
    // Support ticket emails
    @Override
    public void sendTicketCreatedEmail(String email, SupportTicket ticket) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Support Ticket Created: " + ticket.getTicketNumber());
        message.setText("Your support ticket " + ticket.getTicketNumber() + " has been created. We'll get back to you soon.");
        mailSender.send(message);
    }
    
    @Override
    public void sendTicketAssignedEmail(String email, SupportTicket ticket) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Support Ticket Assigned: " + ticket.getTicketNumber());
        message.setText("Your support ticket " + ticket.getTicketNumber() + " has been assigned to an agent.");
        mailSender.send(message);
    }
    
    @Override
    public void sendTicketStatusUpdateEmail(String email, SupportTicket ticket) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Support Ticket Status Update: " + ticket.getTicketNumber());
        message.setText("Your support ticket " + ticket.getTicketNumber() + " status has been updated to: " + ticket.getStatus());
        mailSender.send(message);
    }
    
    @Override
    public void sendTicketNewMessageEmail(String email, SupportTicket ticket) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("New Message on Support Ticket: " + ticket.getTicketNumber());
        message.setText("There's a new message on your support ticket " + ticket.getTicketNumber());
        mailSender.send(message);
    }
    
    @Override
    public void sendTicketResolvedEmail(String email, SupportTicket ticket) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Support Ticket Resolved: " + ticket.getTicketNumber());
        message.setText("Your support ticket " + ticket.getTicketNumber() + " has been resolved.");
        mailSender.send(message);
    }
    
    @Override
    public void sendTicketClosedEmail(String email, SupportTicket ticket) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Support Ticket Closed: " + ticket.getTicketNumber());
        message.setText("Your support ticket " + ticket.getTicketNumber() + " has been closed.");
        mailSender.send(message);
    }
} 