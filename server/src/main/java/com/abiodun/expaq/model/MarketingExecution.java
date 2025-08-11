package com.abiodun.expaq.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "marketing_executions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarketingExecution {
    
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(updatable = false, nullable = false)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id", nullable = false)
    private MarketingCampaign campaign;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(name = "execution_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private ExecutionType executionType;
    
    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private ExecutionStatus status;
    
    @Column(name = "recipient_email")
    private String recipientEmail;
    
    @Column(name = "recipient_name")
    private String recipientName;
    
    @Column(name = "subject_line")
    private String subjectLine;
    
    @Column(name = "message_content", columnDefinition = "TEXT")
    private String messageContent;
    
    @Column(name = "personalization_data", columnDefinition = "TEXT")
    private String personalizationData; // JSON string with personalized data
    
    @Column(name = "trigger_event")
    private String triggerEvent;
    
    @Column(name = "trigger_data", columnDefinition = "TEXT")
    private String triggerData; // JSON string with trigger context
    
    @Column(name = "scheduled_at")
    private LocalDateTime scheduledAt;
    
    @Column(name = "sent_at")
    private LocalDateTime sentAt;
    
    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;
    
    @Column(name = "opened_at")
    private LocalDateTime openedAt;
    
    @Column(name = "clicked_at")
    private LocalDateTime clickedAt;
    
    @Column(name = "converted_at")
    private LocalDateTime convertedAt;
    
    @Column(name = "bounced_at")
    private LocalDateTime bouncedAt;
    
    @Column(name = "unsubscribed_at")
    private LocalDateTime unsubscribedAt;
    
    @Column(name = "error_message")
    private String errorMessage;
    
    @Column(name = "retry_count", nullable = false)
    private Integer retryCount = 0;
    
    @Column(name = "max_retries", nullable = false)
    private Integer maxRetries = 3;
    
    @Column(name = "cost", precision = 19, scale = 4)
    private java.math.BigDecimal cost;
    
    @Column(name = "revenue", precision = 19, scale = 2)
    private java.math.BigDecimal revenue;
    
    @Column(name = "conversion_value", precision = 19, scale = 2)
    private java.math.BigDecimal conversionValue;
    
    @Column(name = "external_id")
    private String externalId; // ID from email service provider
    
    @Column(name = "tracking_code")
    private String trackingCode;
    
    @Column(name = "utm_parameters", columnDefinition = "TEXT")
    private String utmParameters; // JSON string with UTM parameters
    
    @Column(name = "recipient_count")
    private Long recipientCount;
    
    @Column(name = "engagement_count")
    private Long engagementCount;
    
    @Column(name = "conversion_count")
    private Long conversionCount;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        
        if (status == null) {
            status = ExecutionStatus.PENDING;
        }
        
        if (trackingCode == null) {
            trackingCode = generateTrackingCode();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum ExecutionType {
        EMAIL("Email"),
        SMS("SMS"),
        PUSH_NOTIFICATION("Push Notification"),
        IN_APP_MESSAGE("In-App Message"),
        WEB_PUSH("Web Push"),
        WEBHOOK("Webhook"),
        API_CALL("API Call");
        
        private final String displayName;
        
        ExecutionType(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public enum ExecutionStatus {
        PENDING("Pending"),
        SCHEDULED("Scheduled"),
        SENDING("Sending"),
        SENT("Sent"),
        DELIVERED("Delivered"),
        OPENED("Opened"),
        CLICKED("Clicked"),
        CONVERTED("Converted"),
        BOUNCED("Bounced"),
        FAILED("Failed"),
        CANCELLED("Cancelled"),
        UNSUBSCRIBED("Unsubscribed");
        
        private final String displayName;
        
        ExecutionStatus(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
        
        public boolean isSuccess() {
            return this == SENT || this == DELIVERED || this == OPENED || 
                   this == CLICKED || this == CONVERTED;
        }
        
        public boolean isFinal() {
            return this == DELIVERED || this == BOUNCED || this == FAILED || 
                   this == CANCELLED || this == CONVERTED || this == UNSUBSCRIBED;
        }
        
        public boolean canRetry() {
            return this == FAILED || this == BOUNCED;
        }
    }
    
    // Helper methods
    
    public void markAsSent() {
        this.status = ExecutionStatus.SENT;
        this.sentAt = LocalDateTime.now();
    }
    
    public void markAsDelivered() {
        this.status = ExecutionStatus.DELIVERED;
        this.deliveredAt = LocalDateTime.now();
    }
    
    public void markAsOpened() {
        if (this.status.ordinal() < ExecutionStatus.OPENED.ordinal()) {
            this.status = ExecutionStatus.OPENED;
            this.openedAt = LocalDateTime.now();
        }
    }
    
    public void markAsClicked() {
        if (this.status.ordinal() < ExecutionStatus.CLICKED.ordinal()) {
            this.status = ExecutionStatus.CLICKED;
            this.clickedAt = LocalDateTime.now();
        }
    }
    
    public void markAsConverted(java.math.BigDecimal value) {
        this.status = ExecutionStatus.CONVERTED;
        this.convertedAt = LocalDateTime.now();
        this.conversionValue = value;
    }
    
    public void markAsBounced(String reason) {
        this.status = ExecutionStatus.BOUNCED;
        this.bouncedAt = LocalDateTime.now();
        this.errorMessage = reason;
    }
    
    public void markAsFailed(String reason) {
        this.status = ExecutionStatus.FAILED;
        this.errorMessage = reason;
    }
    
    public void markAsUnsubscribed() {
        this.status = ExecutionStatus.UNSUBSCRIBED;
        this.unsubscribedAt = LocalDateTime.now();
    }
    
    public boolean canRetry() {
        return status.canRetry() && retryCount < maxRetries;
    }
    
    public void incrementRetryCount() {
        this.retryCount++;
    }
    
    public boolean isEngaged() {
        return openedAt != null || clickedAt != null;
    }
    
    public boolean isConverted() {
        return convertedAt != null;
    }
    
    public long getTimeToOpen() {
        if (sentAt == null || openedAt == null) return -1;
        return java.time.Duration.between(sentAt, openedAt).toMinutes();
    }
    
    public long getTimeToClick() {
        if (sentAt == null || clickedAt == null) return -1;
        return java.time.Duration.between(sentAt, clickedAt).toMinutes();
    }
    
    public long getTimeToConvert() {
        if (sentAt == null || convertedAt == null) return -1;
        return java.time.Duration.between(sentAt, convertedAt).toHours();
    }
    
    public double getROI() {
        if (cost == null || cost.compareTo(java.math.BigDecimal.ZERO) == 0) {
            return revenue != null && revenue.compareTo(java.math.BigDecimal.ZERO) > 0 ? Double.MAX_VALUE : 0.0;
        }
        
        if (revenue == null) return -100.0;
        
        return revenue.subtract(cost).divide(cost, 4, java.math.RoundingMode.HALF_UP)
                .multiply(new java.math.BigDecimal("100")).doubleValue();
    }
    
    private String generateTrackingCode() {
        return "TRK_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
    }
    
    public void schedule(LocalDateTime scheduledTime) {
        this.status = ExecutionStatus.SCHEDULED;
        this.scheduledAt = scheduledTime;
    }
    
    public boolean isScheduledForExecution() {
        return status == ExecutionStatus.SCHEDULED && 
               scheduledAt != null && 
               scheduledAt.isBefore(LocalDateTime.now());
    }
    
    public String getTrackingUrl(String baseUrl) {
        return baseUrl + "/marketing/track/" + trackingCode;
    }
    
    public void updateEngagementMetrics() {
        if (isEngaged()) {
            this.engagementCount = 1L;
        }
        
        if (isConverted()) {
            this.conversionCount = 1L;
        }
    }
}