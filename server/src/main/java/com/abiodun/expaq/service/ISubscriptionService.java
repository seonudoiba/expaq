package com.abiodun.expaq.service;

import com.abiodun.expaq.model.Subscription;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

public interface ISubscriptionService {
    
    /**
     * Create a new subscription for a user
     */
    Subscription createSubscription(UUID userId, Subscription.PlanType planType, 
                                  Subscription.BillingCycle billingCycle, String paymentMethodId);
    
    /**
     * Get user's active subscription
     */
    Optional<Subscription> getUserActiveSubscription(UUID userId);
    
    /**
     * Get user's subscription history
     */
    List<Subscription> getUserSubscriptionHistory(UUID userId);
    
    /**
     * Upgrade/downgrade subscription
     */
    Subscription changeSubscriptionPlan(UUID userId, Subscription.PlanType newPlanType);
    
    /**
     * Cancel subscription
     */
    void cancelSubscription(UUID userId, String reason);
    
    /**
     * Reactivate cancelled subscription
     */
    Subscription reactivateSubscription(UUID userId, String paymentMethodId);
    
    /**
     * Process subscription billing
     */
    void processBilling(UUID subscriptionId);
    
    /**
     * Process all subscriptions due for billing
     */
    Map<String, Object> processAllBilling();
    
    /**
     * Handle payment success
     */
    void handlePaymentSuccess(String paymentIntentId, String subscriptionId);
    
    /**
     * Handle payment failure
     */
    void handlePaymentFailure(String paymentIntentId, String subscriptionId, String failureReason);
    
    /**
     * Get subscription analytics
     */
    Map<String, Object> getSubscriptionAnalytics();
    
    /**
     * Get revenue analytics
     */
    Map<String, Object> getRevenueAnalytics(String period);
    
    /**
     * Get plan comparison data
     */
    List<Map<String, Object>> getPlanComparison();
    
    /**
     * Check if user has feature access
     */
    boolean hasFeatureAccess(UUID userId, String featureName);
    
    /**
     * Get user's subscription limits
     */
    Map<String, Object> getUserSubscriptionLimits(UUID userId);
    
    /**
     * Get commission rate for user
     */
    BigDecimal getUserCommissionRate(UUID userId);
    
    /**
     * Expire overdue subscriptions
     */
    void expireOverdueSubscriptions();
    
    /**
     * Send billing reminders
     */
    void sendBillingReminders();
    
    /**
     * Get subscription by external payment ID
     */
    Optional<Subscription> getByPaymentId(String paymentId, String provider);
    
    /**
     * Update subscription status
     */
    void updateSubscriptionStatus(UUID subscriptionId, Subscription.SubscriptionStatus status);
    
    /**
     * Get customer lifetime value analytics
     */
    Map<String, Object> getCustomerLifetimeValueAnalytics();
    
    /**
     * Get churn analytics
     */
    Map<String, Object> getChurnAnalytics();
    
    /**
     * Generate subscription invoice
     */
    Map<String, Object> generateInvoice(UUID subscriptionId);
    
    /**
     * Apply discount to subscription
     */
    void applyDiscount(UUID subscriptionId, String discountCode);
    
    /**
     * Remove discount from subscription
     */
    void removeDiscount(UUID subscriptionId);
    
    /**
     * Get all active subscriptions
     */
    List<Subscription> getAllActiveSubscriptions();
    
    /**
     * Validate subscription limits for activity creation
     */
    boolean canCreateActivity(UUID userId);
    
    /**
     * Validate subscription limits for photo upload
     */
    boolean canUploadPhotos(UUID userId, int photoCount);
    
    /**
     * Get subscription feature matrix
     */
    Map<String, Map<String, Object>> getFeatureMatrix();
}