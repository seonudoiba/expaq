package com.abiodun.expaq.service;

import com.abiodun.expaq.model.Commission;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface CommissionService {
    Commission processBookingCommission(UUID bookingId);
    Map<String, Object> getHostCommissionSummary(UUID hostId);
    Map<String, Object> getPlatformCommissionSummary(String period);
    void markCommissionAsPaid(UUID commissionId);
    int processBulkPayout(List<UUID> commissionIds);
    Map<String, BigDecimal> getCommissionRates();
    void updateCommissionRates(Map<String, BigDecimal> rates);
    Map<String, Object> getCommissionAnalytics(String period, String groupBy);
    Map<String, Object> getHostEarnings(UUID hostId, String period);
    void createWithdrawalRequest(UUID hostId, BigDecimal amount, String method, String details);
    List<Map<String, Object>> getHostWithdrawals(UUID hostId);
    Map<String, BigDecimal> calculateCommission(BigDecimal bookingAmount, String activityType);
    List<Commission> getCommissionsReadyForPayout(int limit);
    List<Commission> getOverdueCommissions(int daysCutoff);
    void disputeCommission(UUID commissionId, String reason);
    void resolveDisputedCommission(UUID commissionId, String resolution);
}
