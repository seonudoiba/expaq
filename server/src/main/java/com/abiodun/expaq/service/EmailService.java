package com.abiodun.expaq.service;

import com.abiodun.expaq.model.Subscription;
import com.abiodun.expaq.model.SupportTicket;

public interface EmailService {
    void sendVerificationEmail(String email, String token);
    void sendPasswordResetEmail(String email, String token);
    void sendWelcomeEmail(String email, String username);
    void sendBookingConfirmationEmail(String email, String bookingId);
    void sendActivityCancellationEmail(String email, String activityId);

    void sendPasswordChangeNotification(String email, String fullName);

    void sendAccountActivatedNotification(String email, String fullName, String fullName1);

    void sendAccountDeletedNotification(String email, String fullName);
    
    // Marketing emails
    void sendMarketingEmail(String email, String subject, String content);
    
    // Subscription emails
    void sendSubscriptionCancellationEmail(String email, String subscriptionId);
    void sendBillingSuccessEmail(String email, Subscription subscription);
    void sendPaymentFailureEmail(String email, Subscription subscription);
    void sendSubscriptionExpiredEmail(String email, Subscription subscription);
    void sendBillingReminderEmail(String email, Subscription subscription);
    
    // Support ticket emails
    void sendTicketCreatedEmail(String email, SupportTicket ticket);
    void sendTicketAssignedEmail(String email, SupportTicket ticket);
    void sendTicketStatusUpdateEmail(String email, SupportTicket ticket);
    void sendTicketNewMessageEmail(String email, SupportTicket ticket);
    void sendTicketResolvedEmail(String email, SupportTicket ticket);
    void sendTicketClosedEmail(String email, SupportTicket ticket);
} 