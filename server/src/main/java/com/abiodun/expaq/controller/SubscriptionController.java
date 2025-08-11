package com.abiodun.expaq.controller;

import com.abiodun.expaq.model.ExpaqUserDetails;
import com.abiodun.expaq.model.Subscription;
import com.abiodun.expaq.service.ISubscriptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Subscription", description = "Premium subscription management")
public class SubscriptionController {
    
    private final ISubscriptionService subscriptionService;
    
    @GetMapping("/plans")
    @Operation(summary = "Get all available subscription plans")
    public ResponseEntity<List<Map<String, Object>>> getPlans() {
        try {
            List<Map<String, Object>> plans = subscriptionService.getPlanComparison();
            return ResponseEntity.ok(plans);
        } catch (Exception e) {
            log.error("Error fetching subscription plans: {}", e.getMessage());
            return ResponseEntity.ok(List.of());
        }
    }
    
    @GetMapping("/current")
    @Operation(summary = "Get current user's active subscription")
    @PreAuthorize("hasRole('HOST')")
    public ResponseEntity<Map<String, Object>> getCurrentSubscription() {
        try {
            ExpaqUserDetails userDetails = (ExpaqUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UUID userId = userDetails.getId();
            
            Map<String, Object> response = subscriptionService.getUserActiveSubscription(userId)
                .map(this::mapSubscriptionToResponse)
                .orElse(Map.of("planType", "BASIC", "status", "FREE"));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching current subscription: {}", e.getMessage());
            return ResponseEntity.ok(Map.of("planType", "BASIC", "status", "FREE"));
        }
    }
    
    @GetMapping("/history")
    @Operation(summary = "Get user's subscription history")
    @PreAuthorize("hasRole('HOST')")
    public ResponseEntity<List<Map<String, Object>>> getSubscriptionHistory() {
        try {
            ExpaqUserDetails userDetails = (ExpaqUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UUID userId = userDetails.getId();
            
            List<Subscription> history = subscriptionService.getUserSubscriptionHistory(userId);
            List<Map<String, Object>> response = history.stream()
                .map(this::mapSubscriptionToResponse)
                .toList();
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching subscription history: {}", e.getMessage());
            return ResponseEntity.ok(List.of());
        }
    }
    
    @GetMapping("/limits")
    @Operation(summary = "Get user's subscription limits and current usage")
    @PreAuthorize("hasRole('HOST')")
    public ResponseEntity<Map<String, Object>> getSubscriptionLimits() {
        try {
            ExpaqUserDetails userDetails = (ExpaqUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UUID userId = userDetails.getId();
            
            Map<String, Object> limits = subscriptionService.getUserSubscriptionLimits(userId);
            return ResponseEntity.ok(limits);
        } catch (Exception e) {
            log.error("Error fetching subscription limits: {}", e.getMessage());
            return ResponseEntity.ok(Map.of());
        }
    }
    
    @PostMapping("/subscribe")
    @Operation(summary = "Subscribe to a premium plan")
    @PreAuthorize("hasRole('HOST')")
    public ResponseEntity<Map<String, Object>> subscribe(@RequestBody Map<String, Object> request) {
        try {
            ExpaqUserDetails userDetails = (ExpaqUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UUID userId = userDetails.getId();
            
            String planTypeStr = (String) request.get("planType");
            String billingCycleStr = (String) request.get("billingCycle");
            String paymentMethodId = (String) request.get("paymentMethodId");
            
            Subscription.PlanType planType = Subscription.PlanType.valueOf(planTypeStr.toUpperCase());
            Subscription.BillingCycle billingCycle = Subscription.BillingCycle.valueOf(billingCycleStr.toUpperCase());
            
            Subscription subscription = subscriptionService.createSubscription(userId, planType, billingCycle, paymentMethodId);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "subscriptionId", subscription.getId(),
                "status", subscription.getStatus(),
                "message", "Subscription created successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error creating subscription: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to create subscription: " + e.getMessage()
            ));
        }
    }
    
    @PostMapping("/change-plan")
    @Operation(summary = "Change subscription plan")
    @PreAuthorize("hasRole('HOST')")
    public ResponseEntity<Map<String, Object>> changePlan(@RequestBody Map<String, String> request) {
        try {
            ExpaqUserDetails userDetails = (ExpaqUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UUID userId = userDetails.getId();
            
            String newPlanTypeStr = request.get("planType");
            Subscription.PlanType newPlanType = Subscription.PlanType.valueOf(newPlanTypeStr.toUpperCase());
            
            Subscription subscription = subscriptionService.changeSubscriptionPlan(userId, newPlanType);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "subscriptionId", subscription.getId(),
                "newPlan", newPlanType,
                "message", "Plan changed successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error changing subscription plan: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to change plan: " + e.getMessage()
            ));
        }
    }
    
    @PostMapping("/cancel")
    @Operation(summary = "Cancel subscription")
    @PreAuthorize("hasRole('HOST')")
    public ResponseEntity<Map<String, Object>> cancelSubscription(@RequestBody Map<String, String> request) {
        try {
            ExpaqUserDetails userDetails = (ExpaqUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UUID userId = userDetails.getId();
            
            String reason = request.getOrDefault("reason", "User requested");
            
            subscriptionService.cancelSubscription(userId, reason);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Subscription cancelled successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error cancelling subscription: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to cancel subscription: " + e.getMessage()
            ));
        }
    }
    
    @PostMapping("/reactivate")
    @Operation(summary = "Reactivate cancelled subscription")
    @PreAuthorize("hasRole('HOST')")
    public ResponseEntity<Map<String, Object>> reactivateSubscription(@RequestBody Map<String, String> request) {
        try {
            ExpaqUserDetails userDetails = (ExpaqUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UUID userId = userDetails.getId();
            
            String paymentMethodId = request.get("paymentMethodId");
            
            Subscription subscription = subscriptionService.reactivateSubscription(userId, paymentMethodId);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "subscriptionId", subscription.getId(),
                "message", "Subscription reactivated successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error reactivating subscription: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to reactivate subscription: " + e.getMessage()
            ));
        }
    }
    
    @GetMapping("/feature-access/{featureName}")
    @Operation(summary = "Check if user has access to a specific feature")
    @PreAuthorize("hasRole('HOST')")
    public ResponseEntity<Map<String, Object>> checkFeatureAccess(@PathVariable String featureName) {
        try {
            ExpaqUserDetails userDetails = (ExpaqUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UUID userId = userDetails.getId();
            
            boolean hasAccess = subscriptionService.hasFeatureAccess(userId, featureName);
            
            Map<String, Object> response = Map.of(
                "feature", featureName,
                "hasAccess", hasAccess
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error checking feature access: {}", e.getMessage());
            return ResponseEntity.ok(Map.of(
                "feature", featureName,
                "hasAccess", false
            ));
        }
    }
    
    @GetMapping("/can-create-activity")
    @Operation(summary = "Check if user can create more activities")
    @PreAuthorize("hasRole('HOST')")
    public ResponseEntity<Map<String, Object>> canCreateActivity() {
        try {
            ExpaqUserDetails userDetails = (ExpaqUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UUID userId = userDetails.getId();
            
            boolean canCreate = subscriptionService.canCreateActivity(userId);
            Map<String, Object> limits = subscriptionService.getUserSubscriptionLimits(userId);
            
            Map<String, Object> response = Map.of(
                "canCreate", canCreate,
                "currentActivities", limits.get("currentActivities"),
                "maxActivities", limits.get("maxActivities")
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error checking activity creation limit: {}", e.getMessage());
            return ResponseEntity.ok(Map.of("canCreate", false));
        }
    }
    
    @PostMapping("/can-upload-photos")
    @Operation(summary = "Check if user can upload specified number of photos")
    @PreAuthorize("hasRole('HOST')")
    public ResponseEntity<Map<String, Object>> canUploadPhotos(@RequestBody Map<String, Integer> request) {
        try {
            ExpaqUserDetails userDetails = (ExpaqUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UUID userId = userDetails.getId();
            
            int photoCount = request.get("photoCount");
            boolean canUpload = subscriptionService.canUploadPhotos(userId, photoCount);
            
            Map<String, Object> response = Map.of(
                "canUpload", canUpload,
                "requestedPhotos", photoCount,
                "maxPhotosPerActivity", subscriptionService.getUserSubscriptionLimits(userId).get("maxPhotosPerActivity")
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error checking photo upload limit: {}", e.getMessage());
            return ResponseEntity.ok(Map.of("canUpload", false));
        }
    }
    
    @GetMapping("/invoice/{subscriptionId}")
    @Operation(summary = "Generate invoice for subscription")
    @PreAuthorize("hasRole('HOST')")
    public ResponseEntity<Map<String, Object>> generateInvoice(@PathVariable UUID subscriptionId) {
        try {
            ExpaqUserDetails userDetails = (ExpaqUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            
            Map<String, Object> invoice = subscriptionService.generateInvoice(subscriptionId);
            
            // Verify user owns this subscription
            if (!userDetails.getEmail().equals(invoice.get("userEmail"))) {
                return ResponseEntity.status(403).body(Map.of(
                    "error", "You do not have permission to access this invoice"
                ));
            }
            
            return ResponseEntity.ok(invoice);
        } catch (Exception e) {
            log.error("Error generating invoice: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to generate invoice: " + e.getMessage()
            ));
        }
    }
    
    // Admin endpoints
    
    @GetMapping("/admin/analytics")
    @Operation(summary = "Get subscription analytics (admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getSubscriptionAnalytics() {
        try {
            Map<String, Object> analytics = subscriptionService.getSubscriptionAnalytics();
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            log.error("Error fetching subscription analytics: {}", e.getMessage());
            return ResponseEntity.ok(Map.of());
        }
    }
    
    @GetMapping("/admin/revenue-analytics")
    @Operation(summary = "Get revenue analytics (admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getRevenueAnalytics(
            @RequestParam(defaultValue = "month") String period) {
        try {
            Map<String, Object> analytics = subscriptionService.getRevenueAnalytics(period);
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            log.error("Error fetching revenue analytics: {}", e.getMessage());
            return ResponseEntity.ok(Map.of());
        }
    }
    
    @GetMapping("/admin/churn-analytics")
    @Operation(summary = "Get churn analytics (admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getChurnAnalytics() {
        try {
            Map<String, Object> analytics = subscriptionService.getChurnAnalytics();
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            log.error("Error fetching churn analytics: {}", e.getMessage());
            return ResponseEntity.ok(Map.of());
        }
    }
    
    @PostMapping("/admin/process-billing")
    @Operation(summary = "Process all pending billing (admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> processAllBilling() {
        try {
            Map<String, Object> result = subscriptionService.processAllBilling();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error processing billing: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to process billing: " + e.getMessage()
            ));
        }
    }
    
    @PostMapping("/admin/expire-overdue")
    @Operation(summary = "Expire overdue subscriptions (admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> expireOverdueSubscriptions() {
        try {
            subscriptionService.expireOverdueSubscriptions();
            return ResponseEntity.ok("Overdue subscriptions expired successfully");
        } catch (Exception e) {
            log.error("Error expiring overdue subscriptions: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to expire overdue subscriptions: " + e.getMessage());
        }
    }
    
    @PostMapping("/admin/send-reminders")
    @Operation(summary = "Send billing reminders (admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> sendBillingReminders() {
        try {
            subscriptionService.sendBillingReminders();
            return ResponseEntity.ok("Billing reminders sent successfully");
        } catch (Exception e) {
            log.error("Error sending billing reminders: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to send billing reminders: " + e.getMessage());
        }
    }
    
    @GetMapping("/admin/feature-matrix")
    @Operation(summary = "Get feature matrix for all plans (admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Map<String, Object>>> getFeatureMatrix() {
        try {
            Map<String, Map<String, Object>> matrix = subscriptionService.getFeatureMatrix();
            return ResponseEntity.ok(matrix);
        } catch (Exception e) {
            log.error("Error fetching feature matrix: {}", e.getMessage());
            return ResponseEntity.ok(Map.of());
        }
    }
    
    // Helper methods
    
    private Map<String, Object> mapSubscriptionToResponse(Subscription subscription) {
        Map<String, Object> response = Map.of(
            "id", subscription.getId(),
            "planType", subscription.getPlanType(),
            "status", subscription.getStatus(),
            "price", subscription.getPrice(),
            "billingCycle", subscription.getBillingCycle(),
            "startDate", subscription.getStartDate(),
            "endDate", subscription.getEndDate(),
            "nextBillingDate", subscription.getNextBillingDate(),
            "autoRenew", subscription.getAutoRenew(),
            "createdAt", subscription.getCreatedAt()
        );
        
        return response;
    }
}