package com.abiodun.expaq.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "subscriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Subscription {
    
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(updatable = false, nullable = false)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "plan_type", nullable = false)
    private PlanType planType;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private SubscriptionStatus status;
    
    @Column(name = "price", nullable = false, precision = 19, scale = 2)
    private BigDecimal price;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "billing_cycle", nullable = false)
    private BillingCycle billingCycle;
    
    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;
    
    @Column(name = "end_date")
    private LocalDateTime endDate;
    
    @Column(name = "next_billing_date")
    private LocalDateTime nextBillingDate;
    
    @Column(name = "auto_renew", nullable = false)
    private Boolean autoRenew = true;
    
    @Column(name = "stripe_subscription_id")
    private String stripeSubscriptionId;
    
    @Column(name = "paystack_subscription_code")
    private String paystackSubscriptionCode;
    
    @Column(name = "cancellation_reason")
    private String cancellationReason;
    
    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = SubscriptionStatus.PENDING;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum PlanType {
        BASIC("Basic Host", "Basic host features with standard commission rates", new BigDecimal("0.00")),
        PREMIUM("Premium Host", "Enhanced features with reduced commission rates", new BigDecimal("29.99")),
        PROFESSIONAL("Professional Host", "Advanced analytics and priority support", new BigDecimal("99.99")),
        ENTERPRISE("Enterprise Host", "Full feature set with dedicated support", new BigDecimal("299.99"));
        
        private final String displayName;
        private final String description;
        private final BigDecimal monthlyPrice;
        
        PlanType(String displayName, String description, BigDecimal monthlyPrice) {
            this.displayName = displayName;
            this.description = description;
            this.monthlyPrice = monthlyPrice;
        }
        
        public String getDisplayName() { return displayName; }
        public String getDescription() { return description; }
        public BigDecimal getMonthlyPrice() { return monthlyPrice; }
        public BigDecimal getYearlyPrice() { return monthlyPrice.multiply(new BigDecimal("10")); } // 2 months free
    }
    
    public enum SubscriptionStatus {
        PENDING,     // Subscription created but payment not confirmed
        ACTIVE,      // Subscription active and current
        PAST_DUE,    // Payment failed, grace period
        CANCELLED,   // User cancelled subscription
        EXPIRED,     // Subscription ended without renewal
        SUSPENDED    // Admin suspended subscription
    }
    
    public enum BillingCycle {
        MONTHLY("Monthly", 1),
        YEARLY("Yearly", 12);
        
        private final String displayName;
        private final int months;
        
        BillingCycle(String displayName, int months) {
            this.displayName = displayName;
            this.months = months;
        }
        
        public String getDisplayName() { return displayName; }
        public int getMonths() { return months; }
    }
    
    // Helper methods
    public boolean isActive() {
        return status == SubscriptionStatus.ACTIVE && 
               (endDate == null || endDate.isAfter(LocalDateTime.now()));
    }
    
    public boolean isPremium() {
        return planType != PlanType.BASIC && isActive();
    }
    
    public boolean hasFeature(String featureName) {
        if (!isActive()) return false;
        
        return switch (planType) {
            case BASIC -> hasBasicFeature(featureName);
            case PREMIUM -> hasBasicFeature(featureName) || hasPremiumFeature(featureName);
            case PROFESSIONAL -> hasBasicFeature(featureName) || hasPremiumFeature(featureName) || 
                               hasProfessionalFeature(featureName);
            case ENTERPRISE -> true; // All features
        };
    }
    
    private boolean hasBasicFeature(String feature) {
        return switch (feature.toLowerCase()) {
            case "create_activities", "manage_bookings", "basic_analytics", "standard_support" -> true;
            default -> false;
        };
    }
    
    private boolean hasPremiumFeature(String feature) {
        return switch (feature.toLowerCase()) {
            case "featured_listings", "reduced_commission", "advanced_calendar", "priority_search" -> true;
            default -> false;
        };
    }
    
    private boolean hasProfessionalFeature(String feature) {
        return switch (feature.toLowerCase()) {
            case "detailed_analytics", "custom_branding", "bulk_operations", "priority_support" -> true;
            default -> false;
        };
    }
    
    public BigDecimal getCommissionRate() {
        if (!isActive()) return new BigDecimal("0.10"); // Default 10%
        
        return switch (planType) {
            case BASIC -> new BigDecimal("0.10");        // 10%
            case PREMIUM -> new BigDecimal("0.08");      // 8%
            case PROFESSIONAL -> new BigDecimal("0.06"); // 6%
            case ENTERPRISE -> new BigDecimal("0.04");   // 4%
        };
    }
    
    public int getMaxActivities() {
        if (!isActive()) return 5; // Basic limit
        
        return switch (planType) {
            case BASIC -> 5;
            case PREMIUM -> 25;
            case PROFESSIONAL -> 100;
            case ENTERPRISE -> -1; // Unlimited
        };
    }
    
    public int getMaxPhotosPerActivity() {
        if (!isActive()) return 5;
        
        return switch (planType) {
            case BASIC -> 5;
            case PREMIUM -> 15;
            case PROFESSIONAL -> 30;
            case ENTERPRISE -> 50;
        };
    }
    
    public void activate() {
        this.status = SubscriptionStatus.ACTIVE;
        this.startDate = LocalDateTime.now();
        calculateNextBillingDate();
    }
    
    public void cancel(String reason) {
        this.status = SubscriptionStatus.CANCELLED;
        this.cancellationReason = reason;
        this.cancelledAt = LocalDateTime.now();
        this.autoRenew = false;
    }
    
    public void suspend() {
        this.status = SubscriptionStatus.SUSPENDED;
    }
    
    public void markPastDue() {
        this.status = SubscriptionStatus.PAST_DUE;
    }
    
    public void expire() {
        this.status = SubscriptionStatus.EXPIRED;
        this.endDate = LocalDateTime.now();
    }
    
    private void calculateNextBillingDate() {
        if (billingCycle == BillingCycle.MONTHLY) {
            this.nextBillingDate = LocalDateTime.now().plusMonths(1);
        } else {
            this.nextBillingDate = LocalDateTime.now().plusYears(1);
        }
    }
    
    public void renewSubscription() {
        this.status = SubscriptionStatus.ACTIVE;
        calculateNextBillingDate();
    }
    
    public BigDecimal getCurrentPrice() {
        return billingCycle == BillingCycle.YEARLY ? 
               planType.getYearlyPrice() : planType.getMonthlyPrice();
    }
}