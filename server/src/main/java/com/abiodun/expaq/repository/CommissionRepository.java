package com.abiodun.expaq.repository;

import com.abiodun.expaq.model.Commission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CommissionRepository extends JpaRepository<Commission, UUID> {
    
    // Find commissions by host ID
    Page<Commission> findByHostIdOrderByCreatedAtDesc(UUID hostId, Pageable pageable);
    
    // Find commissions by host ID and status
    Page<Commission> findByHostIdAndStatus(UUID hostId, Commission.CommissionStatus status, Pageable pageable);
    
    // Find commissions by status
    Page<Commission> findByStatusOrderByCreatedAtDesc(Commission.CommissionStatus status, Pageable pageable);
    
    // Find all commissions ordered by creation date
    Page<Commission> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    // Find commission by booking ID
    Optional<Commission> findByBookingId(UUID bookingId);
    
    // Check if commission exists for booking
    boolean existsByBookingId(UUID bookingId);
    
    // Find commissions by activity ID
    List<Commission> findByActivityId(UUID activityId);
    
    // Host commission summaries
    @Query("SELECT SUM(c.hostEarnings) FROM Commission c WHERE c.host.id = :hostId AND c.status = :status")
    BigDecimal sumHostEarningsByStatus(@Param("hostId") UUID hostId, @Param("status") Commission.CommissionStatus status);
    
    @Query("SELECT SUM(c.hostEarnings) FROM Commission c WHERE c.host.id = :hostId")
    BigDecimal sumTotalHostEarnings(@Param("hostId") UUID hostId);
    
    @Query("SELECT COUNT(c) FROM Commission c WHERE c.host.id = :hostId AND c.status = :status")
    long countByHostIdAndStatus(@Param("hostId") UUID hostId, @Param("status") Commission.CommissionStatus status);
    
    // Platform commission summaries
    @Query("SELECT SUM(c.commissionAmount) FROM Commission c WHERE c.status = :status")
    BigDecimal sumPlatformCommissionByStatus(@Param("status") Commission.CommissionStatus status);
    
    @Query("SELECT SUM(c.commissionAmount) FROM Commission c")
    BigDecimal sumTotalPlatformCommission();
    
    @Query("SELECT COUNT(c) FROM Commission c WHERE c.status = :status")
    long countByStatus(@Param("status") Commission.CommissionStatus status);
    
    // Time-based queries
    @Query("SELECT c FROM Commission c WHERE c.createdAt >= :startDate AND c.createdAt <= :endDate ORDER BY c.createdAt DESC")
    List<Commission> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT SUM(c.commissionAmount) FROM Commission c WHERE c.createdAt >= :startDate AND c.createdAt <= :endDate")
    BigDecimal sumCommissionAmountByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT SUM(c.hostEarnings) FROM Commission c WHERE c.host.id = :hostId AND c.createdAt >= :startDate AND c.createdAt <= :endDate")
    BigDecimal sumHostEarningsByDateRange(@Param("hostId") UUID hostId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Monthly/yearly analytics
    @Query("SELECT FUNCTION('YEAR', c.createdAt) as year, FUNCTION('MONTH', c.createdAt) as month, " +
           "SUM(c.commissionAmount) as totalCommission, SUM(c.hostEarnings) as totalHostEarnings, COUNT(c) as count " +
           "FROM Commission c " +
           "WHERE c.createdAt >= :startDate " +
           "GROUP BY FUNCTION('YEAR', c.createdAt), FUNCTION('MONTH', c.createdAt) " +
           "ORDER BY year DESC, month DESC")
    List<Object[]> getMonthlyCommissionAnalytics(@Param("startDate") LocalDateTime startDate);
    
    // Top earning hosts
    @Query("SELECT c.host, SUM(c.hostEarnings) as totalEarnings, COUNT(c) as commissionCount " +
           "FROM Commission c " +
           "WHERE c.status = 'PAID_OUT' " +
           "GROUP BY c.host " +
           "ORDER BY totalEarnings DESC")
    List<Object[]> getTopEarningHosts(Pageable pageable);
    
    // Recent commission activities
    @Query("SELECT c FROM Commission c WHERE c.updatedAt >= :since ORDER BY c.updatedAt DESC")
    List<Commission> findRecentCommissionActivities(@Param("since") LocalDateTime since, Pageable pageable);
    
    // Commissions ready for payout
    @Query("SELECT c FROM Commission c WHERE c.status = 'PROCESSED' ORDER BY c.processedAt ASC")
    List<Commission> findCommissionsReadyForPayout(Pageable pageable);
    
    // Overdue commissions (processed more than X days ago but not paid)
    @Query("SELECT c FROM Commission c WHERE c.status = 'PROCESSED' AND c.processedAt < :cutoffDate ORDER BY c.processedAt ASC")
    List<Commission> findOverdueCommissions(@Param("cutoffDate") LocalDateTime cutoffDate);
    
    // Commission statistics
    @Query("SELECT " +
           "COUNT(c) as totalCommissions, " +
           "SUM(c.commissionAmount) as totalCommissionAmount, " +
           "SUM(c.hostEarnings) as totalHostEarnings, " +
           "AVG(c.commissionRate) as avgCommissionRate " +
           "FROM Commission c")
    List<Object[]> getCommissionStatistics();
    
    // Host performance metrics
    @Query("SELECT " +
           "c.host, " +
           "COUNT(c) as totalCommissions, " +
           "SUM(c.hostEarnings) as totalEarnings, " +
           "AVG(c.commissionRate) as avgCommissionRate, " +
           "MAX(c.createdAt) as lastCommissionDate " +
           "FROM Commission c " +
           "WHERE c.host.id = :hostId " +
           "GROUP BY c.host")
    List<Object[]> getHostPerformanceMetrics(@Param("hostId") UUID hostId);
    
    // Activity commission performance
    @Query("SELECT " +
           "c.activity, " +
           "COUNT(c) as commissionCount, " +
           "SUM(c.commissionAmount) as totalCommission, " +
           "SUM(c.hostEarnings) as totalHostEarnings " +
           "FROM Commission c " +
           "WHERE c.activity.id = :activityId " +
           "GROUP BY c.activity")
    List<Object[]> getActivityCommissionMetrics(@Param("activityId") UUID activityId);
}