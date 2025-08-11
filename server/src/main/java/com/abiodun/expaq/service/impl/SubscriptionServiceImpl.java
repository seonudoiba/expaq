package com.abiodun.expaq.service.impl;

import com.abiodun.expaq.model.Subscription;
import com.abiodun.expaq.model.User;
import com.abiodun.expaq.repository.ActivityRepository;
import com.abiodun.expaq.repository.SubscriptionRepository;
import com.abiodun.expaq.repository.UserRepository;
import com.abiodun.expaq.service.ISubscriptionService;
import com.abiodun.expaq.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class SubscriptionServiceImpl implements ISubscriptionService {
    
    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;
    private final EmailService emailService;
    
    @Override
    public Subscription createSubscription(UUID userId, Subscription.PlanType planType, 
                                         Subscription.BillingCycle billingCycle, String paymentMethodId) {
        log.info("Creating subscription for user: {}, plan: {}, billing: {}", userId, planType, billingCycle);
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        
        // Check if user already has an active subscription
        Optional<Subscription> activeSubscription = getUserActiveSubscription(userId);
        if (activeSubscription.isPresent()) {
            throw new IllegalStateException("User already has an active subscription");
        }
        
        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setPlanType(planType);
        subscription.setBillingCycle(billingCycle);
        subscription.setPrice(planType.getMonthlyPrice());
        subscription.setStatus(Subscription.SubscriptionStatus.PENDING);
        
        // Set price based on billing cycle
        if (billingCycle == Subscription.BillingCycle.YEARLY) {
            subscription.setPrice(planType.getYearlyPrice());
        }
        
        subscription = subscriptionRepository.save(subscription);
        
        // In a real implementation, this would integrate with Stripe/Paystack
        // For now, we'll simulate payment processing
        simulatePaymentProcessing(subscription, paymentMethodId);
        
        log.info("Subscription created successfully: {}", subscription.getId());
        return subscription;
    }
    
    @Override
    public Optional<Subscription> getUserActiveSubscription(UUID userId) {
        return subscriptionRepository.findActiveSubscriptionByUserId(userId, LocalDateTime.now());
    }
    
    @Override
    public List<Subscription> getUserSubscriptionHistory(UUID userId) {
        return subscriptionRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    @Override
    public Subscription changeSubscriptionPlan(UUID userId, Subscription.PlanType newPlanType) {
        log.info("Changing subscription plan for user: {} to plan: {}", userId, newPlanType);
        
        Subscription activeSubscription = getUserActiveSubscription(userId)
            .orElseThrow(() -> new IllegalStateException("No active subscription found"));
        
        // Cancel current subscription
        activeSubscription.cancel("Plan change");
        subscriptionRepository.save(activeSubscription);
        
        // Create new subscription with new plan
        return createSubscription(userId, newPlanType, activeSubscription.getBillingCycle(), null);
    }
    
    @Override
    public void cancelSubscription(UUID userId, String reason) {
        log.info("Cancelling subscription for user: {}, reason: {}", userId, reason);
        
        Subscription activeSubscription = getUserActiveSubscription(userId)
            .orElseThrow(() -> new IllegalStateException("No active subscription found"));
        
        activeSubscription.cancel(reason);
        subscriptionRepository.save(activeSubscription);
        
        // Send cancellation email
        try {
            emailService.sendSubscriptionCancellationEmail(activeSubscription.getUser().getEmail(), reason);
        } catch (Exception e) {
            log.error("Failed to send cancellation email", e);
        }
        
        log.info("Subscription cancelled successfully: {}", activeSubscription.getId());
    }
    
    @Override
    public Subscription reactivateSubscription(UUID userId, String paymentMethodId) {
        log.info("Reactivating subscription for user: {}", userId);
        
        List<Subscription> subscriptionHistory = getUserSubscriptionHistory(userId);
        Subscription lastSubscription = subscriptionHistory.stream()
            .filter(s -> s.getStatus() == Subscription.SubscriptionStatus.CANCELLED)
            .findFirst()
            .orElseThrow(() -> new IllegalStateException("No cancelled subscription found"));
        
        return createSubscription(userId, lastSubscription.getPlanType(), 
                                lastSubscription.getBillingCycle(), paymentMethodId);
    }
    
    @Override
    public void processBilling(UUID subscriptionId) {
        log.info("Processing billing for subscription: {}", subscriptionId);
        
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
            .orElseThrow(() -> new IllegalArgumentException("Subscription not found: " + subscriptionId));
        
        if (!subscription.getAutoRenew() || subscription.getStatus() != Subscription.SubscriptionStatus.ACTIVE) {
            log.warn("Subscription {} is not eligible for billing", subscriptionId);
            return;
        }
        
        try {
            // In a real implementation, this would charge the payment method
            boolean paymentSuccess = simulatePaymentCharge(subscription);
            
            if (paymentSuccess) {
                subscription.renewSubscription();
                subscriptionRepository.save(subscription);
                log.info("Billing processed successfully for subscription: {}", subscriptionId);
                
                // Send billing success email
                emailService.sendBillingSuccessEmail(subscription.getUser().getEmail(), subscription);
            } else {
                subscription.markPastDue();
                subscriptionRepository.save(subscription);
                log.warn("Payment failed for subscription: {}", subscriptionId);
                
                // Send payment failure email
                emailService.sendPaymentFailureEmail(subscription.getUser().getEmail(), subscription);
            }
        } catch (Exception e) {
            log.error("Error processing billing for subscription: {}", subscriptionId, e);
            subscription.markPastDue();
            subscriptionRepository.save(subscription);
        }
    }
    
    @Override
    public Map<String, Object> processAllBilling() {
        log.info("Processing billing for all due subscriptions");
        
        LocalDateTime now = LocalDateTime.now();
        List<Subscription> dueSubscriptions = subscriptionRepository.findSubscriptionsDueForBilling(now);
        
        int processed = 0;
        int successful = 0;
        int failed = 0;
        
        for (Subscription subscription : dueSubscriptions) {
            try {
                Subscription.SubscriptionStatus originalStatus = subscription.getStatus();
                processBilling(subscription.getId());
                
                // Refresh subscription to check new status
                subscription = subscriptionRepository.findById(subscription.getId()).orElse(subscription);
                
                if (subscription.getStatus() == Subscription.SubscriptionStatus.ACTIVE) {
                    successful++;
                } else {
                    failed++;
                }
                processed++;
                
            } catch (Exception e) {
                log.error("Failed to process billing for subscription: {}", subscription.getId(), e);
                failed++;
            }
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("totalDue", dueSubscriptions.size());
        result.put("processed", processed);
        result.put("successful", successful);
        result.put("failed", failed);
        
        log.info("Billing processing completed: {}", result);
        return result;
    }
    
    @Override
    public void handlePaymentSuccess(String paymentIntentId, String subscriptionId) {
        log.info("Handling payment success for subscription: {}", subscriptionId);
        
        // Implementation would update subscription status based on payment success
        // This is a placeholder for payment provider integration
    }
    
    @Override
    public void handlePaymentFailure(String paymentIntentId, String subscriptionId, String failureReason) {
        log.info("Handling payment failure for subscription: {}, reason: {}", subscriptionId, failureReason);
        
        // Implementation would handle payment failure
        // This is a placeholder for payment provider integration
    }
    
    @Override
    public Map<String, Object> getSubscriptionAnalytics() {
        log.info("Getting subscription analytics");
        
        Map<String, Object> analytics = new HashMap<>();
        
        // Basic counts
        analytics.put("totalSubscriptions", subscriptionRepository.count());
        analytics.put("activeSubscriptions", subscriptionRepository.countByStatus(Subscription.SubscriptionStatus.ACTIVE));
        analytics.put("cancelledSubscriptions", subscriptionRepository.countByStatus(Subscription.SubscriptionStatus.CANCELLED));
        analytics.put("pastDueSubscriptions", subscriptionRepository.countByStatus(Subscription.SubscriptionStatus.PAST_DUE));
        
        // Revenue metrics
        analytics.put("totalActiveRevenue", subscriptionRepository.getTotalActiveRevenue());
        analytics.put("monthlyRecurringRevenue", subscriptionRepository.getMonthlyRecurringRevenue());
        analytics.put("yearlyRecurringRevenue", subscriptionRepository.getYearlyRecurringRevenue());
        
        // Plan distribution
        List<Object[]> planDistribution = subscriptionRepository.getActiveSubscriptionsByPlanType();
        Map<String, Long> planCounts = planDistribution.stream()
            .collect(Collectors.toMap(
                arr -> arr[0].toString(),
                arr -> (Long) arr[1]
            ));
        analytics.put("planDistribution", planCounts);
        
        return analytics;
    }
    
    @Override
    public Map<String, Object> getRevenueAnalytics(String period) {
        log.info("Getting revenue analytics for period: {}", period);
        
        LocalDateTime startDate = switch (period.toLowerCase()) {
            case "week" -> LocalDateTime.now().minus(1, ChronoUnit.WEEKS);
            case "year" -> LocalDateTime.now().minus(1, ChronoUnit.YEARS);
            default -> LocalDateTime.now().minus(1, ChronoUnit.MONTHS);
        };
        
        Map<String, Object> analytics = new HashMap<>();
        
        List<Object[]> monthlyRevenue = subscriptionRepository.getMonthlyRevenueAnalytics(startDate);
        analytics.put("monthlyRevenue", monthlyRevenue);
        
        List<Object[]> subscriptionTrends = subscriptionRepository.getSubscriptionTrends(startDate);
        analytics.put("subscriptionTrends", subscriptionTrends);
        
        List<Object[]> cancellationTrends = subscriptionRepository.getCancellationTrends(startDate);
        analytics.put("cancellationTrends", cancellationTrends);
        
        return analytics;
    }
    
    @Override
    public List<Map<String, Object>> getPlanComparison() {
        List<Map<String, Object>> plans = new ArrayList<>();
        
        for (Subscription.PlanType planType : Subscription.PlanType.values()) {
            Map<String, Object> plan = new HashMap<>();
            plan.put("type", planType);
            plan.put("name", planType.getDisplayName());
            plan.put("description", planType.getDescription());
            plan.put("monthlyPrice", planType.getMonthlyPrice());
            plan.put("yearlyPrice", planType.getYearlyPrice());
            
            // Add features
            Map<String, Object> features = new HashMap<>();
            features.put("maxActivities", getMaxActivitiesForPlan(planType));
            features.put("maxPhotos", getMaxPhotosForPlan(planType));
            features.put("commissionRate", getCommissionRateForPlan(planType));
            features.put("featuredListings", planType != Subscription.PlanType.BASIC);
            features.put("advancedAnalytics", planType == Subscription.PlanType.PROFESSIONAL || planType == Subscription.PlanType.ENTERPRISE);
            features.put("prioritySupport", planType == Subscription.PlanType.PROFESSIONAL || planType == Subscription.PlanType.ENTERPRISE);
            features.put("customBranding", planType == Subscription.PlanType.ENTERPRISE);
            
            plan.put("features", features);
            plans.add(plan);
        }
        
        return plans;
    }
    
    @Override
    public boolean hasFeatureAccess(UUID userId, String featureName) {
        Optional<Subscription> subscription = getUserActiveSubscription(userId);
        
        if (subscription.isEmpty()) {
            // User has basic (free) access
            return switch (featureName.toLowerCase()) {
                case "create_activities", "manage_bookings", "basic_analytics" -> true;
                default -> false;
            };
        }
        
        return subscription.get().hasFeature(featureName);
    }
    
    @Override
    public Map<String, Object> getUserSubscriptionLimits(UUID userId) {
        Map<String, Object> limits = new HashMap<>();
        
        Optional<Subscription> subscription = getUserActiveSubscription(userId);
        
        if (subscription.isEmpty()) {
            // Free tier limits
            limits.put("maxActivities", 5);
            limits.put("maxPhotosPerActivity", 5);
            limits.put("commissionRate", new BigDecimal("0.10"));
            limits.put("hasAdvancedAnalytics", false);
            limits.put("hasPrioritySupport", false);
        } else {
            Subscription sub = subscription.get();
            limits.put("maxActivities", sub.getMaxActivities());
            limits.put("maxPhotosPerActivity", sub.getMaxPhotosPerActivity());
            limits.put("commissionRate", sub.getCommissionRate());
            limits.put("hasAdvancedAnalytics", sub.hasFeature("detailed_analytics"));
            limits.put("hasPrioritySupport", sub.hasFeature("priority_support"));
        }
        
        // Add current usage
        long currentActivities = activityRepository.countByUserId(userId);
        limits.put("currentActivities", currentActivities);
        
        return limits;
    }
    
    @Override
    public BigDecimal getUserCommissionRate(UUID userId) {
        Optional<Subscription> subscription = getUserActiveSubscription(userId);
        return subscription.map(Subscription::getCommissionRate)
                          .orElse(new BigDecimal("0.10")); // Default 10%
    }
    
    @Override
    public void expireOverdueSubscriptions() {
        log.info("Expiring overdue subscriptions");
        
        List<Subscription> expiredSubscriptions = subscriptionRepository.findExpiredSubscriptions(LocalDateTime.now());
        
        for (Subscription subscription : expiredSubscriptions) {
            subscription.expire();
            subscriptionRepository.save(subscription);
            
            // Send expiration email
            try {
                emailService.sendSubscriptionExpiredEmail(subscription.getUser().getEmail(), subscription);
            } catch (Exception e) {
                log.error("Failed to send expiration email for subscription: {}", subscription.getId(), e);
            }
        }
        
        log.info("Expired {} subscriptions", expiredSubscriptions.size());
    }
    
    @Override
    public void sendBillingReminders() {
        log.info("Sending billing reminders");
        
        LocalDateTime threeDaysFromNow = LocalDateTime.now().plusDays(3);
        List<Subscription> upcomingBilling = subscriptionRepository.findSubscriptionsDueForBilling(threeDaysFromNow);
        
        for (Subscription subscription : upcomingBilling) {
            try {
                emailService.sendBillingReminderEmail(subscription.getUser().getEmail(), subscription);
            } catch (Exception e) {
                log.error("Failed to send billing reminder for subscription: {}", subscription.getId(), e);
            }
        }
        
        log.info("Sent {} billing reminders", upcomingBilling.size());
    }
    
    @Override
    public Optional<Subscription> getByPaymentId(String paymentId, String provider) {
        return switch (provider.toLowerCase()) {
            case "stripe" -> subscriptionRepository.findByStripeSubscriptionIdIsNotNull().stream()
                    .filter(s -> paymentId.equals(s.getStripeSubscriptionId()))
                    .findFirst();
            case "paystack" -> subscriptionRepository.findByPaystackSubscriptionCodeIsNotNull().stream()
                    .filter(s -> paymentId.equals(s.getPaystackSubscriptionCode()))
                    .findFirst();
            default -> Optional.empty();
        };
    }
    
    @Override
    public void updateSubscriptionStatus(UUID subscriptionId, Subscription.SubscriptionStatus status) {
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
            .orElseThrow(() -> new IllegalArgumentException("Subscription not found: " + subscriptionId));
        
        subscription.setStatus(status);
        subscriptionRepository.save(subscription);
    }
    
    @Override
    public Map<String, Object> getCustomerLifetimeValueAnalytics() {
        Pageable topCustomers = PageRequest.of(0, 100);
        List<Object[]> clvData = subscriptionRepository.getCustomerLifetimeValue(topCustomers);
        
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("topCustomers", clvData);
        
        // Calculate average CLV
        double avgClv = clvData.stream()
            .mapToDouble(arr -> ((BigDecimal) arr[1]).doubleValue())
            .average()
            .orElse(0.0);
        analytics.put("averageLifetimeValue", avgClv);
        
        return analytics;
    }
    
    @Override
    public Map<String, Object> getChurnAnalytics() {
        LocalDateTime lastMonth = LocalDateTime.now().minus(1, ChronoUnit.MONTHS);
        List<Object[]> churnData = subscriptionRepository.getChurnAnalytics(lastMonth);
        
        Map<String, Object> analytics = new HashMap<>();
        if (!churnData.isEmpty()) {
            Object[] data = churnData.get(0);
            long cancellations = (Long) data[0];
            long activeSubscriptions = (Long) data[1];
            
            double churnRate = activeSubscriptions > 0 ? 
                (double) cancellations / activeSubscriptions * 100 : 0.0;
            
            analytics.put("churnRate", churnRate);
            analytics.put("cancellations", cancellations);
            analytics.put("activeSubscriptions", activeSubscriptions);
        }
        
        return analytics;
    }
    
    @Override
    public Map<String, Object> generateInvoice(UUID subscriptionId) {
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
            .orElseThrow(() -> new IllegalArgumentException("Subscription not found: " + subscriptionId));
        
        Map<String, Object> invoice = new HashMap<>();
        invoice.put("subscriptionId", subscription.getId());
        invoice.put("userEmail", subscription.getUser().getEmail());
        invoice.put("planType", subscription.getPlanType().getDisplayName());
        invoice.put("amount", subscription.getCurrentPrice());
        invoice.put("billingCycle", subscription.getBillingCycle().getDisplayName());
        invoice.put("nextBillingDate", subscription.getNextBillingDate());
        invoice.put("status", subscription.getStatus());
        
        return invoice;
    }
    
    @Override
    public void applyDiscount(UUID subscriptionId, String discountCode) {
        // Implementation for discount system
        log.info("Applying discount {} to subscription {}", discountCode, subscriptionId);
    }
    
    @Override
    public void removeDiscount(UUID subscriptionId) {
        // Implementation for removing discount
        log.info("Removing discount from subscription {}", subscriptionId);
    }
    
    @Override
    public List<Subscription> getAllActiveSubscriptions() {
        return subscriptionRepository.findAllActiveSubscriptions(LocalDateTime.now());
    }
    
    @Override
    public boolean canCreateActivity(UUID userId) {
        Map<String, Object> limits = getUserSubscriptionLimits(userId);
        int maxActivities = (Integer) limits.get("maxActivities");
        long currentActivities = (Long) limits.get("currentActivities");
        
        return maxActivities == -1 || currentActivities < maxActivities;
    }
    
    @Override
    public boolean canUploadPhotos(UUID userId, int photoCount) {
        Map<String, Object> limits = getUserSubscriptionLimits(userId);
        int maxPhotos = (Integer) limits.get("maxPhotosPerActivity");
        
        return maxPhotos == -1 || photoCount <= maxPhotos;
    }
    
    @Override
    public Map<String, Map<String, Object>> getFeatureMatrix() {
        Map<String, Map<String, Object>> matrix = new HashMap<>();
        
        for (Subscription.PlanType planType : Subscription.PlanType.values()) {
            Map<String, Object> features = new HashMap<>();
            
            // Mock subscription to check features
            Subscription mockSubscription = new Subscription();
            mockSubscription.setPlanType(planType);
            mockSubscription.setStatus(Subscription.SubscriptionStatus.ACTIVE);
            
            features.put("createActivities", mockSubscription.hasFeature("create_activities"));
            features.put("featuredListings", mockSubscription.hasFeature("featured_listings"));
            features.put("advancedAnalytics", mockSubscription.hasFeature("detailed_analytics"));
            features.put("prioritySupport", mockSubscription.hasFeature("priority_support"));
            features.put("customBranding", mockSubscription.hasFeature("custom_branding"));
            features.put("maxActivities", mockSubscription.getMaxActivities());
            features.put("maxPhotos", mockSubscription.getMaxPhotosPerActivity());
            features.put("commissionRate", mockSubscription.getCommissionRate());
            
            matrix.put(planType.name(), features);
        }
        
        return matrix;
    }
    
    // Helper methods
    
    private void simulatePaymentProcessing(Subscription subscription, String paymentMethodId) {
        // In a real implementation, this would integrate with Stripe/Paystack
        // For now, we'll just activate the subscription
        subscription.activate();
        subscriptionRepository.save(subscription);
    }
    
    private boolean simulatePaymentCharge(Subscription subscription) {
        // Simulate payment success/failure (90% success rate)
        return Math.random() > 0.1;
    }
    
    private int getMaxActivitiesForPlan(Subscription.PlanType planType) {
        return switch (planType) {
            case BASIC -> 5;
            case PREMIUM -> 25;
            case PROFESSIONAL -> 100;
            case ENTERPRISE -> -1; // Unlimited
        };
    }
    
    private int getMaxPhotosForPlan(Subscription.PlanType planType) {
        return switch (planType) {
            case BASIC -> 5;
            case PREMIUM -> 15;
            case PROFESSIONAL -> 30;
            case ENTERPRISE -> 50;
        };
    }
    
    private BigDecimal getCommissionRateForPlan(Subscription.PlanType planType) {
        return switch (planType) {
            case BASIC -> new BigDecimal("0.10");
            case PREMIUM -> new BigDecimal("0.08");
            case PROFESSIONAL -> new BigDecimal("0.06");
            case ENTERPRISE -> new BigDecimal("0.04");
        };
    }
}