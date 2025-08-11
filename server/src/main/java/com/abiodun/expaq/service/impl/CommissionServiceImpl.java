package com.abiodun.expaq.service.impl;

import com.abiodun.expaq.model.Booking;
import com.abiodun.expaq.model.Commission;
import com.abiodun.expaq.repository.BookingRepository;
import com.abiodun.expaq.repository.CommissionRepository;
import com.abiodun.expaq.service.CommissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommissionServiceImpl implements CommissionService {

    private final CommissionRepository commissionRepository;
    private final BookingRepository bookingRepository;
    
    // Default commission rates (can be made configurable)
    private static final Map<String, BigDecimal> DEFAULT_COMMISSION_RATES = Map.of(
        "STANDARD", new BigDecimal("0.10"), // 10%
        "PREMIUM", new BigDecimal("0.08"),  // 8%
        "LUXURY", new BigDecimal("0.12"),   // 12%
        "ADVENTURE", new BigDecimal("0.09"), // 9%
        "CULTURAL", new BigDecimal("0.08"),  // 8%
        "FOOD", new BigDecimal("0.11"),      // 11%
        "DEFAULT", new BigDecimal("0.10")    // 10% default
    );
    
    @Override
    @Transactional
    public Commission processBookingCommission(UUID bookingId) {
        log.info("Processing commission for booking: {}", bookingId);
        
        // Check if commission already exists
        if (commissionRepository.existsByBookingId(bookingId)) {
            throw new IllegalStateException("Commission already exists for booking: " + bookingId);
        }
        
        // Get booking details
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new IllegalArgumentException("Booking not found: " + bookingId));
        
        // Validate booking is completed
        if (booking.getStatus() != Booking.BookingStatus.COMPLETED) {
            throw new IllegalStateException("Cannot process commission for non-completed booking");
        }
        
        // Calculate commission
        String activityType = booking.getActivity().getActivityType().getName();
        Map<String, BigDecimal> commissionCalculation = calculateCommission(booking.getTotalPrice(), activityType);

        // Create commission record
        Commission commission = new Commission();
        commission.setBooking(booking);
        commission.setHost(booking.getActivity().getHost()); // Get host from activity
        commission.setActivity(booking.getActivity());
        commission.setBookingAmount(booking.getTotalPrice());
        commission.setCommissionRate(commissionCalculation.get("rate"));
        commission.setCommissionAmount(commissionCalculation.get("commission"));
        commission.setHostEarnings(commissionCalculation.get("hostEarnings"));
        commission.setStatus(Commission.CommissionStatus.PROCESSED);
        commission.setProcessedAt(LocalDateTime.now());
        
        commission = commissionRepository.save(commission);
        log.info("Commission processed successfully: {}", commission.getId());
        
        return commission;
    }
    
    @Override
    public Map<String, Object> getHostCommissionSummary(UUID hostId) {
        log.info("Getting commission summary for host: {}", hostId);
        
        Map<String, Object> summary = new HashMap<>();
        
        // Total earnings
        BigDecimal totalEarnings = commissionRepository.sumTotalHostEarnings(hostId);
        summary.put("totalEarnings", totalEarnings != null ? totalEarnings : BigDecimal.ZERO);
        
        // Pending earnings
        BigDecimal pendingEarnings = commissionRepository.sumHostEarningsByStatus(hostId, Commission.CommissionStatus.PROCESSED);
        summary.put("pendingEarnings", pendingEarnings != null ? pendingEarnings : BigDecimal.ZERO);
        
        // Paid out earnings
        BigDecimal paidOutEarnings = commissionRepository.sumHostEarningsByStatus(hostId, Commission.CommissionStatus.PAID_OUT);
        summary.put("paidOutEarnings", paidOutEarnings != null ? paidOutEarnings : BigDecimal.ZERO);
        
        // Commission counts
        summary.put("totalCommissions", commissionRepository.countByHostIdAndStatus(hostId, null));
        summary.put("pendingCommissions", commissionRepository.countByHostIdAndStatus(hostId, Commission.CommissionStatus.PROCESSED));
        summary.put("paidCommissions", commissionRepository.countByHostIdAndStatus(hostId, Commission.CommissionStatus.PAID_OUT));
        
        // Recent activity
        LocalDateTime lastWeek = LocalDateTime.now().minusWeeks(1);
        BigDecimal recentEarnings = commissionRepository.sumHostEarningsByDateRange(hostId, lastWeek, LocalDateTime.now());
        summary.put("recentEarnings", recentEarnings != null ? recentEarnings : BigDecimal.ZERO);
        
        return summary;
    }
    
    @Override
    public Map<String, Object> getPlatformCommissionSummary(String period) {
        log.info("Getting platform commission summary for period: {}", period);
        
        Map<String, Object> summary = new HashMap<>();
        
        // Total platform commission
        BigDecimal totalCommission = commissionRepository.sumTotalPlatformCommission();
        summary.put("totalCommission", totalCommission != null ? totalCommission : BigDecimal.ZERO);
        
        // Commission by status
        for (Commission.CommissionStatus status : Commission.CommissionStatus.values()) {
            BigDecimal statusCommission = commissionRepository.sumPlatformCommissionByStatus(status);
            long statusCount = commissionRepository.countByStatus(status);
            
            summary.put(status.name().toLowerCase() + "Commission", statusCommission != null ? statusCommission : BigDecimal.ZERO);
            summary.put(status.name().toLowerCase() + "Count", statusCount);
        }
        
        // Monthly analytics if period is specified
        if ("monthly".equals(period)) {
            LocalDateTime sixMonthsAgo = LocalDateTime.now().minusMonths(6);
            List<Object[]> monthlyData = commissionRepository.getMonthlyCommissionAnalytics(sixMonthsAgo);
            summary.put("monthlyAnalytics", monthlyData);
        }
        
        return summary;
    }
    
    @Override
    public void markCommissionAsPaid(UUID commissionId) {
        log.info("Marking commission as paid: {}", commissionId);
        
        Commission commission = commissionRepository.findById(commissionId)
            .orElseThrow(() -> new IllegalArgumentException("Commission not found: " + commissionId));
        
        if (!commission.canBePaidOut()) {
            throw new IllegalStateException("Commission cannot be paid out in current status: " + commission.getStatus());
        }
        
        commission.markAsPaidOut();
        commission.setPaymentReference("PAY_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        
        commissionRepository.save(commission);
        log.info("Commission marked as paid: {}", commissionId);
    }
    
    @Override
    public int processBulkPayout(List<UUID> commissionIds) {
        log.info("Processing bulk payout for {} commissions", commissionIds.size());
        
        int processedCount = 0;
        for (UUID commissionId : commissionIds) {
            try {
                markCommissionAsPaid(commissionId);
                processedCount++;
            } catch (Exception e) {
                log.error("Failed to process payout for commission: {}", commissionId, e);
            }
        }
        
        log.info("Successfully processed {} out of {} commissions", processedCount, commissionIds.size());
        return processedCount;
    }
    
    @Override
    public Map<String, BigDecimal> getCommissionRates() {
        log.info("Getting current commission rates");
        // In a real implementation, this might come from database configuration
        return new HashMap<>(DEFAULT_COMMISSION_RATES);
    }
    
    @Override
    public void updateCommissionRates(Map<String, BigDecimal> rates) {
        log.info("Updating commission rates: {}", rates);
        // In a real implementation, this would update database configuration
        // For now, we'll just log the update
        log.info("Commission rates updated successfully");
    }
    
    @Override
    public Map<String, Object> getCommissionAnalytics(String period, String groupBy) {
        log.info("Getting commission analytics for period: {}, groupBy: {}", period, groupBy);
        
        Map<String, Object> analytics = new HashMap<>();
        
        // Basic statistics
        List<Object[]> stats = commissionRepository.getCommissionStatistics();
        if (!stats.isEmpty()) {
            Object[] stat = stats.get(0);
            analytics.put("totalCommissions", stat[0]);
            analytics.put("totalCommissionAmount", stat[1]);
            analytics.put("totalHostEarnings", stat[2]);
            analytics.put("averageCommissionRate", stat[3]);
        }
        
        // Top earning hosts
        Pageable topHostsPageable = PageRequest.of(0, 10);
        List<Object[]> topHosts = commissionRepository.getTopEarningHosts(topHostsPageable);
        analytics.put("topEarningHosts", topHosts);
        
        // Time-based analytics
        if ("monthly".equals(period)) {
            LocalDateTime yearAgo = LocalDateTime.now().minusYears(1);
            List<Object[]> monthlyData = commissionRepository.getMonthlyCommissionAnalytics(yearAgo);
            analytics.put("monthlyData", monthlyData);
        }
        
        return analytics;
    }
    
    @Override
    public Map<String, Object> getHostEarnings(UUID hostId, String period) {
        log.info("Getting host earnings for host: {}, period: {}", hostId, period);
        
        Map<String, Object> earnings = new HashMap<>();
        
        // Host performance metrics
        List<Object[]> metrics = commissionRepository.getHostPerformanceMetrics(hostId);
        if (!metrics.isEmpty()) {
            Object[] metric = metrics.get(0);
            earnings.put("totalCommissions", metric[1]);
            earnings.put("totalEarnings", metric[2]);
            earnings.put("averageCommissionRate", metric[3]);
            earnings.put("lastCommissionDate", metric[4]);
        }
        
        // Period-based earnings
        LocalDateTime startDate = getStartDate(period);
        BigDecimal periodEarnings = commissionRepository.sumHostEarningsByDateRange(hostId, startDate, LocalDateTime.now());
        earnings.put("periodEarnings", periodEarnings != null ? periodEarnings : BigDecimal.ZERO);
        earnings.put("period", period);
        
        return earnings;
    }
    
    @Override
    public void createWithdrawalRequest(UUID hostId, BigDecimal amount, String method, String details) {
        log.info("Creating withdrawal request for host: {}, amount: {}", hostId, amount);
        
        // Check if host has sufficient balance
        BigDecimal availableBalance = commissionRepository.sumHostEarningsByStatus(hostId, Commission.CommissionStatus.PROCESSED);
        if (availableBalance == null || availableBalance.compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient balance for withdrawal");
        }
        
        // In a real implementation, this would create a withdrawal request record
        // For now, we'll just log it
        log.info("Withdrawal request created: Host {}, Amount {}, Method {}, Details {}", 
                hostId, amount, method, details);
    }
    
    @Override
    public List<Map<String, Object>> getHostWithdrawals(UUID hostId) {
        log.info("Getting withdrawal history for host: {}", hostId);
        
        // In a real implementation, this would fetch from withdrawal requests table
        // For now, return empty list
        return new ArrayList<>();
    }
    
    @Override
    public Map<String, BigDecimal> calculateCommission(BigDecimal bookingAmount, String activityType) {
        BigDecimal rate = DEFAULT_COMMISSION_RATES.getOrDefault(activityType.toUpperCase(), 
                                                                DEFAULT_COMMISSION_RATES.get("DEFAULT"));
        
        BigDecimal commissionAmount = bookingAmount.multiply(rate).setScale(2, RoundingMode.HALF_UP);
        BigDecimal hostEarnings = bookingAmount.subtract(commissionAmount).setScale(2, RoundingMode.HALF_UP);
        
        Map<String, BigDecimal> result = new HashMap<>();
        result.put("rate", rate);
        result.put("commission", commissionAmount);
        result.put("hostEarnings", hostEarnings);
        result.put("bookingAmount", bookingAmount);
        
        return result;
    }
    
    @Override
    public List<Commission> getCommissionsReadyForPayout(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return commissionRepository.findCommissionsReadyForPayout(pageable);
    }
    
    @Override
    public List<Commission> getOverdueCommissions(int daysCutoff) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysCutoff);
        return commissionRepository.findOverdueCommissions(cutoffDate);
    }
    
    @Override
    public void disputeCommission(UUID commissionId, String reason) {
        log.info("Disputing commission: {}, reason: {}", commissionId, reason);
        
        Commission commission = commissionRepository.findById(commissionId)
            .orElseThrow(() -> new IllegalArgumentException("Commission not found: " + commissionId));
        
        commission.markAsDisputed();
        commission.setNotes(reason);
        
        commissionRepository.save(commission);
        log.info("Commission disputed: {}", commissionId);
    }
    
    @Override
    public void resolveDisputedCommission(UUID commissionId, String resolution) {
        log.info("Resolving disputed commission: {}, resolution: {}", commissionId, resolution);
        
        Commission commission = commissionRepository.findById(commissionId)
            .orElseThrow(() -> new IllegalArgumentException("Commission not found: " + commissionId));
        
        if (commission.getStatus() != Commission.CommissionStatus.DISPUTED) {
            throw new IllegalStateException("Commission is not in disputed status");
        }
        
        commission.setStatus(Commission.CommissionStatus.PROCESSED);
        commission.setNotes(commission.getNotes() + " | Resolution: " + resolution);
        commission.setProcessedAt(LocalDateTime.now());
        
        commissionRepository.save(commission);
        log.info("Commission dispute resolved: {}", commissionId);
    }

    private LocalDateTime getStartDate(String period) {
        return switch (period != null ? period.toLowerCase() : "month") {
            case "week" -> LocalDateTime.now().minusWeeks(1);
            case "year" -> LocalDateTime.now().minusYears(1);
            default -> LocalDateTime.now().minusMonths(1);
        };
    }
}
