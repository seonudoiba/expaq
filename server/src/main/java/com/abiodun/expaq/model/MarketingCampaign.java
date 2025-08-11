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
@Table(name = "marketing_campaigns")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarketingCampaign {
    
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(updatable = false, nullable = false)
    private UUID id;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "campaign_type", nullable = false)
    private CampaignType campaignType;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private CampaignStatus status;
    
    @Column(name = "start_date")
    private LocalDateTime startDate;
    
    @Column(name = "end_date")
    private LocalDateTime endDate;
    
    @Column(name = "target_audience", columnDefinition = "TEXT")
    private String targetAudience; // JSON string with audience criteria
    
    @Column(name = "email_subject")
    private String emailSubject;
    
    @Column(name = "email_template", columnDefinition = "TEXT")
    private String emailTemplate;
    
    @Column(name = "trigger_conditions", columnDefinition = "TEXT")
    private String triggerConditions; // JSON string with trigger rules
    
    @Column(name = "frequency_rules", columnDefinition = "TEXT")
    private String frequencyRules; // JSON string with frequency limits
    
    @Column(name = "personalization_rules", columnDefinition = "TEXT")
    private String personalizationRules; // JSON string with personalization logic
    
    @Column(name = "a_b_test_config", columnDefinition = "TEXT")
    private String abTestConfig; // JSON string with A/B test configuration
    
    @Column(name = "conversion_goal")
    private String conversionGoal;
    
    @Column(name = "budget_limit", precision = 19, scale = 2)
    private java.math.BigDecimal budgetLimit;
    
    @Column(name = "cost_per_send", precision = 19, scale = 4)
    private java.math.BigDecimal costPerSend;
    
    @Column(name = "priority", nullable = false)
    private Integer priority = 5; // 1-10 scale, 10 being highest
    
    @Column(name = "auto_optimize", nullable = false)
    private Boolean autoOptimize = false;
    
    @Column(name = "tracking_enabled", nullable = false)
    private Boolean trackingEnabled = true;
    
    @Column(name = "created_by_id", nullable = false)
    private UUID createdById;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "last_executed_at")
    private LocalDateTime lastExecutedAt;
    
    @OneToMany(mappedBy = "campaign", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MarketingExecution> executions = new ArrayList<>();
    
    @OneToMany(mappedBy = "campaign", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MarketingMetric> metrics = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        
        if (status == null) {
            status = CampaignStatus.DRAFT;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum CampaignType {
        WELCOME_SERIES("Welcome Series"),
        ABANDONED_BOOKING("Abandoned Booking Recovery"),
        POST_BOOKING("Post-Booking Follow-up"),
        REACTIVATION("User Reactivation"),
        PROMOTIONAL("Promotional Campaign"),
        SEASONAL("Seasonal Campaign"),
        HOST_ONBOARDING("Host Onboarding"),
        REVIEW_REQUEST("Review Request"),
        LOYALTY_REWARD("Loyalty Reward"),
        REFERRAL("Referral Campaign"),
        BIRTHDAY("Birthday Campaign"),
        LOCATION_BASED("Location-Based Campaign"),
        BEHAVIOR_TRIGGERED("Behavior Triggered"),
        WINBACK("Win-Back Campaign"),
        NEWSLETTER("Newsletter"),
        PRODUCT_UPDATE("Product Update");
        
        private final String displayName;
        
        CampaignType(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public enum CampaignStatus {
        DRAFT("Draft"),
        SCHEDULED("Scheduled"),
        ACTIVE("Active"),
        PAUSED("Paused"),
        COMPLETED("Completed"),
        CANCELLED("Cancelled"),
        ARCHIVED("Archived");
        
        private final String displayName;
        
        CampaignStatus(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
        
        public boolean isActive() {
            return this == ACTIVE;
        }
        
        public boolean canExecute() {
            return this == ACTIVE || this == SCHEDULED;
        }
    }
    
    // Helper methods
    
    public boolean isActive() {
        return status == CampaignStatus.ACTIVE && 
               (startDate == null || startDate.isBefore(LocalDateTime.now())) &&
               (endDate == null || endDate.isAfter(LocalDateTime.now()));
    }
    
    public boolean isScheduled() {
        return status == CampaignStatus.SCHEDULED && 
               startDate != null && startDate.isAfter(LocalDateTime.now());
    }
    
    public boolean isExpired() {
        return endDate != null && endDate.isBefore(LocalDateTime.now());
    }
    
    public void activate() {
        if (status == CampaignStatus.DRAFT || status == CampaignStatus.PAUSED) {
            status = CampaignStatus.ACTIVE;
            if (startDate == null) {
                startDate = LocalDateTime.now();
            }
        }
    }
    
    public void pause() {
        if (status == CampaignStatus.ACTIVE) {
            status = CampaignStatus.PAUSED;
        }
    }
    
    public void complete() {
        status = CampaignStatus.COMPLETED;
    }
    
    public void cancel() {
        status = CampaignStatus.CANCELLED;
    }
    
    public void schedule(LocalDateTime scheduledTime) {
        status = CampaignStatus.SCHEDULED;
        startDate = scheduledTime;
    }
    
    public boolean canSendToUser(UUID userId) {
        // Implementation would check frequency rules, user preferences, etc.
        return status.canExecute() && isActive();
    }
    
    public void recordExecution() {
        lastExecutedAt = LocalDateTime.now();
    }
    
    public String getAudienceDescription() {
        // Parse targetAudience JSON and return human-readable description
        return "All users"; // Simplified
    }
    
    public boolean hasBudgetRemaining() {
        if (budgetLimit == null) return true;
        
        // Calculate total cost from executions
        java.math.BigDecimal totalCost = executions.stream()
            .map(execution -> execution.getCost() != null ? execution.getCost() : java.math.BigDecimal.ZERO)
            .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
            
        return totalCost.compareTo(budgetLimit) < 0;
    }
    
    public java.math.BigDecimal getRemainingBudget() {
        if (budgetLimit == null) return null;
        
        java.math.BigDecimal totalCost = executions.stream()
            .map(execution -> execution.getCost() != null ? execution.getCost() : java.math.BigDecimal.ZERO)
            .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
            
        return budgetLimit.subtract(totalCost);
    }
    
    public long getTotalRecipients() {
        return executions.stream()
            .mapToLong(execution -> execution.getRecipientCount() != null ? execution.getRecipientCount() : 0)
            .sum();
    }
    
    public double getEngagementRate() {
        long totalSent = getTotalRecipients();
        if (totalSent == 0) return 0.0;
        
        long totalEngaged = executions.stream()
            .mapToLong(execution -> execution.getEngagementCount() != null ? execution.getEngagementCount() : 0)
            .sum();
            
        return (double) totalEngaged / totalSent * 100;
    }
    
    public double getConversionRate() {
        long totalSent = getTotalRecipients();
        if (totalSent == 0) return 0.0;
        
        long totalConversions = executions.stream()
            .mapToLong(execution -> execution.getConversionCount() != null ? execution.getConversionCount() : 0)
            .sum();
            
        return (double) totalConversions / totalSent * 100;
    }
}