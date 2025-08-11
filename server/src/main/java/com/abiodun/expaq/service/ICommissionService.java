package com.abiodun.expaq.service;

import com.abiodun.expaq.model.Commission;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface ICommissionService {
    
    /**
     * Process commission for a completed booking
     */
    Commission processCommissionForBooking(UUID bookingId);
    
    /**
     * Get host commission summary
     */
    Map<String, Object> getHostCommissionSummary(UUID hostId);
    
    /**
     * Get platform commission summary
     */
    Map<String, Object> getPlatformCommissionSummary(String period);
    
    /**
     * Mark commission as paid out
     */
    void markCommissionAsPaid(UUID commissionId);
    
    /**
     * Process bulk payout for multiple commissions
     */
    int processBulkPayout(List<UUID> commissionIds);
    
    /**
     * Get current commission rates
     */
    Map<String, BigDecimal> getCommissionRates();
    
    /**
     * Update commission rates
     */
    void updateCommissionRates(Map<String, BigDecimal> rates);
    
    /**
     * Get commission analytics
     */
    Map<String, Object> getCommissionAnalytics(String period, String groupBy);
    
    /**
     * Get host earnings breakdown
     */
    Map<String, Object> getHostEarnings(UUID hostId, String period);
    
    /**
     * Create withdrawal request for host
     */
    void createWithdrawalRequest(UUID hostId, BigDecimal amount, String method, String details);
    
    /**
     * Get host withdrawal history
     */
    List<Map<String, Object>> getHostWithdrawals(UUID hostId);
    
    /**
     * Calculate commission for a booking amount
     */
    Map<String, BigDecimal> calculateCommission(BigDecimal bookingAmount, String activityType);
    
    /**
     * Get commissions ready for payout
     */
    List<Commission> getCommissionsReadyForPayout(int limit);
    
    /**
     * Get overdue commissions
     */
    List<Commission> getOverdueCommissions(int daysCutoff);
    
    /**
     * Dispute a commission
     */
    void disputeCommission(UUID commissionId, String reason);
    
    /**
     * Resolve a disputed commission
     */
    void resolveDisputedCommission(UUID commissionId, String resolution);
}