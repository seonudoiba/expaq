package com.abiodun.expaq.repository;

import com.abiodun.expaq.model.Subscription;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {
    
    // Find user's current subscription
    Optional<Subscription> findByUserIdAndStatus(UUID userId, Subscription.SubscriptionStatus status);
    
    // Find user's active subscription
    @Query("SELECT s FROM Subscription s WHERE s.user.id = :userId AND s.status = 'ACTIVE' AND (s.endDate IS NULL OR s.endDate > :now)")
    Optional<Subscription> findActiveSubscriptionByUserId(@Param("userId") UUID userId, @Param("now") LocalDateTime now);
    
    // Find all user's subscriptions
    List<Subscription> findByUserIdOrderByCreatedAtDesc(UUID userId);
    
    // Find subscriptions by plan type
    List<Subscription> findByPlanTypeAndStatus(Subscription.PlanType planType, Subscription.SubscriptionStatus status);
    
    // Find subscriptions by status
    Page<Subscription> findByStatusOrderByCreatedAtDesc(Subscription.SubscriptionStatus status, Pageable pageable);
    
    // Find all active subscriptions
    @Query("SELECT s FROM Subscription s WHERE s.status = 'ACTIVE' AND (s.endDate IS NULL OR s.endDate > :now)")
    List<Subscription> findAllActiveSubscriptions(@Param("now") LocalDateTime now);
    
    // Find subscriptions due for billing
    @Query("SELECT s FROM Subscription s WHERE s.status = 'ACTIVE' AND s.nextBillingDate <= :date AND s.autoRenew = true")
    List<Subscription> findSubscriptionsDueForBilling(@Param("date") LocalDateTime date);
    
    // Find expired subscriptions
    @Query("SELECT s FROM Subscription s WHERE s.status = 'ACTIVE' AND s.endDate IS NOT NULL AND s.endDate <= :now")
    List<Subscription> findExpiredSubscriptions(@Param("now") LocalDateTime now);
    
    // Find subscriptions by payment provider
    List<Subscription> findByStripeSubscriptionIdIsNotNull();
    List<Subscription> findByPaystackSubscriptionCodeIsNotNull();
    
    // Analytics queries
    @Query("SELECT COUNT(s) FROM Subscription s WHERE s.status = :status")
    long countByStatus(@Param("status") Subscription.SubscriptionStatus status);
    
    @Query("SELECT s.planType, COUNT(s) FROM Subscription s WHERE s.status = 'ACTIVE' GROUP BY s.planType")
    List<Object[]> getActiveSubscriptionsByPlanType();
    
    @Query("SELECT SUM(s.price) FROM Subscription s WHERE s.status = 'ACTIVE'")
    java.math.BigDecimal getTotalActiveRevenue();
    
    @Query("SELECT SUM(s.price) FROM Subscription s WHERE s.status = 'ACTIVE' AND s.billingCycle = 'MONTHLY'")
    java.math.BigDecimal getMonthlyRecurringRevenue();
    
    @Query("SELECT SUM(s.price) FROM Subscription s WHERE s.status = 'ACTIVE' AND s.billingCycle = 'YEARLY'")
    java.math.BigDecimal getYearlyRecurringRevenue();
    
    // Subscription trends
    @Query("SELECT FUNCTION('DATE', s.createdAt) as date, COUNT(s) as count " +
           "FROM Subscription s " +
           "WHERE s.createdAt >= :startDate " +
           "GROUP BY FUNCTION('DATE', s.createdAt) " +
           "ORDER BY date DESC")
    List<Object[]> getSubscriptionTrends(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT FUNCTION('DATE', s.cancelledAt) as date, COUNT(s) as count " +
           "FROM Subscription s " +
           "WHERE s.cancelledAt >= :startDate " +
           "GROUP BY FUNCTION('DATE', s.cancelledAt) " +
           "ORDER BY date DESC")
    List<Object[]> getCancellationTrends(@Param("startDate") LocalDateTime startDate);
    
    // Revenue analytics
    @Query("SELECT FUNCTION('YEAR', s.createdAt) as year, FUNCTION('MONTH', s.createdAt) as month, " +
           "SUM(s.price) as revenue, COUNT(s) as subscriptions " +
           "FROM Subscription s " +
           "WHERE s.createdAt >= :startDate " +
           "GROUP BY FUNCTION('YEAR', s.createdAt), FUNCTION('MONTH', s.createdAt) " +
           "ORDER BY year DESC, month DESC")
    List<Object[]> getMonthlyRevenueAnalytics(@Param("startDate") LocalDateTime startDate);
    
    // Churn analysis
    @Query("SELECT " +
           "(SELECT COUNT(s1) FROM Subscription s1 WHERE s1.status = 'CANCELLED' AND s1.cancelledAt >= :startDate) as cancellations, " +
           "(SELECT COUNT(s2) FROM Subscription s2 WHERE s2.status = 'ACTIVE') as activeSubscriptions")
    List<Object[]> getChurnAnalytics(@Param("startDate") LocalDateTime startDate);
    
    // Customer lifetime value
    @Query("SELECT s.user, SUM(s.price) as totalRevenue, COUNT(s) as subscriptionCount " +
           "FROM Subscription s " +
           "GROUP BY s.user " +
           "ORDER BY totalRevenue DESC")
    List<Object[]> getCustomerLifetimeValue(Pageable pageable);
    
    // Plan upgrade/downgrade tracking
    @Query("SELECT s1.planType as fromPlan, s2.planType as toPlan, COUNT(*) as count " +
           "FROM Subscription s1, Subscription s2 " +
           "WHERE s1.user.id = s2.user.id " +
           "AND s1.endDate IS NOT NULL " +
           "AND s2.startDate > s1.endDate " +
           "AND s1.planType != s2.planType " +
           "GROUP BY s1.planType, s2.planType")
    List<Object[]> getPlanChangeAnalytics();
    
    // Subscription health metrics
    @Query("SELECT " +
           "AVG(CAST(EXTRACT(EPOCH FROM COALESCE(s.endDate, :now)) - EXTRACT(EPOCH FROM s.startDate) AS DOUBLE) / 86400) as avgLifetimeDays, " +
           "COUNT(CASE WHEN s.status = 'ACTIVE' THEN 1 END) as activeCount, " +
           "COUNT(CASE WHEN s.status = 'CANCELLED' THEN 1 END) as cancelledCount, " +
           "COUNT(CASE WHEN s.status = 'PAST_DUE' THEN 1 END) as pastDueCount " +
           "FROM Subscription s")
    List<Object[]> getSubscriptionHealthMetrics(@Param("now") LocalDateTime now);
    
    // Feature usage by plan type
    @Query("SELECT s.planType, COUNT(DISTINCT a.id) as activityCount " +
           "FROM Subscription s " +
           "LEFT JOIN Activity a ON a.host.id = s.user.id " +
           "WHERE s.status = 'ACTIVE' " +
           "GROUP BY s.planType")
    List<Object[]> getFeatureUsageByPlan();
    
    // Trial conversion rates (if implementing trials)
    @Query("SELECT " +
           "COUNT(CASE WHEN s.planType != 'BASIC' AND s.createdAt >= :startDate THEN 1 END) as paidSubscriptions, " +
           "COUNT(CASE WHEN s.planType = 'BASIC' AND s.createdAt >= :startDate THEN 1 END) as freeUsers " +
           "FROM Subscription s")
    List<Object[]> getConversionMetrics(@Param("startDate") LocalDateTime startDate);
    
    // Payment failure tracking
    @Query("SELECT COUNT(s) FROM Subscription s WHERE s.status = 'PAST_DUE'")
    long countFailedPayments();
    
    // Seasonal trends
    @Query("SELECT FUNCTION('MONTH', s.createdAt) as month, COUNT(s) as count, AVG(s.price) as avgPrice " +
           "FROM Subscription s " +
           "WHERE s.createdAt >= :startDate " +
           "GROUP BY FUNCTION('MONTH', s.createdAt) " +
           "ORDER BY month")
    List<Object[]> getSeasonalTrends(@Param("startDate") LocalDateTime startDate);
}