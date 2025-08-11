package com.abiodun.expaq.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "support_tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupportTicket {
    
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(updatable = false, nullable = false)
    private UUID id;
    
    @Column(name = "ticket_number", unique = true, nullable = false)
    private String ticketNumber;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_agent_id")
    private User assignedAgent;
    
    @Column(name = "subject", nullable = false)
    private String subject;
    
    @Column(name = "description", columnDefinition = "TEXT", nullable = false)
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private TicketCategory category;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private TicketPriority priority;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TicketStatus status;
    
    @Column(name = "tags")
    private String tags; // Comma-separated tags
    
    @Column(name = "customer_email", nullable = false)
    private String customerEmail;
    
    @Column(name = "customer_name")
    private String customerName;
    
    @Column(name = "phone_number")
    private String phoneNumber;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "related_booking_id")
    private Booking relatedBooking;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "related_activity_id")
    private Activity relatedActivity;
    
    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;
    
    @Column(name = "customer_satisfaction_rating")
    private Integer customerSatisfactionRating; // 1-5 scale
    
    @Column(name = "customer_feedback", columnDefinition = "TEXT")
    private String customerFeedback;
    
    @Column(name = "first_response_at")
    private LocalDateTime firstResponseAt;
    
    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
    
    @Column(name = "closed_at")
    private LocalDateTime closedAt;
    
    @Column(name = "due_date")
    private LocalDateTime dueDate;
    
    @Column(name = "escalated_at")
    private LocalDateTime escalatedAt;
    
    @Column(name = "escalation_reason")
    private String escalationReason;
    
    @Column(name = "needs_follow_up")
    private boolean needsFollowUp = false;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "source")
    private TicketSource source = TicketSource.WEB;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "supportTicket", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<SupportTicketMessage> messages = new ArrayList<>();
    
    @OneToMany(mappedBy = "supportTicket", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<SupportTicketAttachment> attachments = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        
        if (status == null) {
            status = TicketStatus.OPEN;
        }
        
        if (priority == null) {
            priority = TicketPriority.MEDIUM;
        }
        
        if (ticketNumber == null) {
            generateTicketNumber();
        }
        
        calculateDueDate();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }


    public enum TicketCategory {
        GENERAL_INQUIRY("General Inquiry"),
        BOOKING_ISSUE("Booking Issue"),
        PAYMENT_PROBLEM("Payment Problem"),
        ACTIVITY_CONCERN("Activity Concern"),
        ACCOUNT_ISSUE("Account Issue"),
        TECHNICAL_SUPPORT("Technical Support"),
        REFUND_REQUEST("Refund Request"),
        DISPUTE_RESOLUTION("Dispute Resolution"),
        SAFETY_CONCERN("Safety Concern"),
        FEATURE_REQUEST("Feature Request"),
        BUG_REPORT("Bug Report"),
        HOST_SUPPORT("Host Support"),
        COMMISSION_INQUIRY("Commission Inquiry"),
        SUBSCRIPTION_ISSUE("Subscription Issue"),
        OTHER("Other");
        
        private final String displayName;
        
        TicketCategory(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public enum TicketPriority {
        LOW("Low", 5),
        MEDIUM("Medium", 3),
        HIGH("High", 1),
        URGENT("Urgent", 0),
        CRITICAL("Critical", 0);
        
        private final String displayName;
        private final int responseDays;
        
        TicketPriority(String displayName, int responseDays) {
            this.displayName = displayName;
            this.responseDays = responseDays;
        }
        
        public String getDisplayName() {
            return displayName;
        }
        
        public int getResponseDays() {
            return responseDays;
        }
    }
    
    public enum TicketSource {
        WEB("Web"),
        EMAIL("Email"),
        PHONE("Phone"),
        CHAT("Chat"),
        MOBILE_APP("Mobile App"),
        API("API"),
        SOCIAL_MEDIA("Social Media"),
        INTERNAL("Internal");
        
        private final String displayName;
        
        TicketSource(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public enum TicketStatus {
        OPEN("Open"),
        IN_PROGRESS("In Progress"),
        PENDING_CUSTOMER("Pending Customer Response"),
        PENDING_INTERNAL("Pending Internal Review"),
        ESCALATED("Escalated"),
        RESOLVED("Resolved"),
        CLOSED("Closed"),
        CANCELLED("Cancelled");
        
        private final String displayName;
        
        TicketStatus(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
        
        public boolean isClosed() {
            return this == RESOLVED || this == CLOSED || this == CANCELLED;
        }
        
        public boolean isActive() {
            return !isClosed();
        }
    }
    
    // Helper methods
    
    private void generateTicketNumber() {
        // Generate ticket number in format: EXP-YYYY-NNNNNN
        String year = String.valueOf(LocalDateTime.now().getYear());
        String randomSuffix = String.format("%06d", (int) (Math.random() * 1000000));
        this.ticketNumber = "EXP-" + year + "-" + randomSuffix;
    }
    
    private void calculateDueDate() {
        if (priority != null) {
            int responseDays = priority.getResponseDays();
            if (responseDays > 0) {
                this.dueDate = LocalDateTime.now().plusDays(responseDays);
            } else {
                // For urgent/critical - due within 4 hours
                this.dueDate = LocalDateTime.now().plusHours(4);
            }
        }
    }
    
    public void assignTo(User agent) {
        this.assignedAgent = agent;
        if (this.status == TicketStatus.OPEN) {
            this.status = TicketStatus.IN_PROGRESS;
        }
    }
    
    public void escalate(String reason) {
        this.status = TicketStatus.ESCALATED;
        this.escalatedAt = LocalDateTime.now();
        this.escalationReason = reason;
        
        // Increase priority if not already critical
        if (this.priority != TicketPriority.CRITICAL) {
            this.priority = TicketPriority.HIGH;
        }
    }
    
    public void markFirstResponse() {
        if (this.firstResponseAt == null) {
            this.firstResponseAt = LocalDateTime.now();
        }
    }
    
    public void resolve(String resolutionNotes) {
        this.status = TicketStatus.RESOLVED;
        this.resolvedAt = LocalDateTime.now();
        this.resolutionNotes = resolutionNotes;
    }
    
    public void close() {
        this.status = TicketStatus.CLOSED;
        this.closedAt = LocalDateTime.now();
    }
    
    public void reopen() {
        if (this.status.isClosed()) {
            this.status = TicketStatus.IN_PROGRESS;
            this.resolvedAt = null;
            this.closedAt = null;
        }
    }
    
    public boolean isOverdue() {
        return dueDate != null && LocalDateTime.now().isAfter(dueDate) && status.isActive();
    }
    
    public long getResponseTimeHours() {
        if (firstResponseAt == null) {
            return -1; // No response yet
        }
        return java.time.Duration.between(createdAt, firstResponseAt).toHours();
    }
    
    public long getResolutionTimeHours() {
        if (resolvedAt == null) {
            return -1; // Not resolved yet
        }
        return java.time.Duration.between(createdAt, resolvedAt).toHours();
    }
    
    public void addTag(String tag) {
        if (tags == null || tags.isEmpty()) {
            tags = tag;
        } else if (!tags.contains(tag)) {
            tags += "," + tag;
        }
    }
    
    public void removeTag(String tag) {
        if (tags != null && tags.contains(tag)) {
            tags = tags.replace(tag, "").replace(",,", ",");
            if (tags.startsWith(",")) tags = tags.substring(1);
            if (tags.endsWith(",")) tags = tags.substring(0, tags.length() - 1);
        }
    }
    
    public String[] getTagsArray() {
        if (tags == null || tags.isEmpty()) {
            return new String[0];
        }
        return tags.split(",");
    }
    
    public boolean isPriorityUser() {
        // Check if user has premium subscription or high-value customer
        return user != null && 
               (user.getRoles().stream().anyMatch(role -> role.getName().equals("PREMIUM_HOST")) ||
                user.getRoles().stream().anyMatch(role -> role.getName().equals("ENTERPRISE_HOST")));
    }
    
    public void setCustomerSatisfaction(int rating, String feedback) {
        this.customerSatisfactionRating = rating;
        this.customerFeedback = feedback;
    }
}