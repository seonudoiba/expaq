package com.abiodun.expaq.repository;

import com.abiodun.expaq.model.MarketingExecution;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface MarketingExecutionRepository extends JpaRepository<MarketingExecution, UUID> {
    
    List<MarketingExecution> findByCampaignId(UUID campaignId);
    
    Page<MarketingExecution> findByCampaignId(UUID campaignId, Pageable pageable);
    
    List<MarketingExecution> findByStatus(MarketingExecution.ExecutionStatus status);
    
    List<MarketingExecution> findByStatusAndScheduledAtBefore(
        MarketingExecution.ExecutionStatus status, 
        LocalDateTime scheduledTime
    );
    
    List<MarketingExecution> findByUserId(UUID userId);
    
    List<MarketingExecution> findByRecipientEmail(String email);
    
    @Query("SELECT e FROM MarketingExecution e WHERE e.status IN :statuses AND " +
           "e.retryCount < e.maxRetries")
    List<MarketingExecution> findExecutionsForRetry(@Param("statuses") List<MarketingExecution.ExecutionStatus> statuses);
    
    @Query("SELECT e FROM MarketingExecution e WHERE e.trackingCode = :trackingCode")
    MarketingExecution findByTrackingCode(@Param("trackingCode") String trackingCode);
    
    @Query("SELECT e FROM MarketingExecution e WHERE e.externalId = :externalId")
    MarketingExecution findByExternalId(@Param("externalId") String externalId);
    
    @Query("SELECT e.status, COUNT(e) FROM MarketingExecution e WHERE e.campaign.id = :campaignId " +
           "GROUP BY e.status")
    List<Object[]> getExecutionStatusCounts(@Param("campaignId") UUID campaignId);
    
    @Query("SELECT e.executionType, COUNT(e), AVG(e.conversionValue) FROM MarketingExecution e " +
           "WHERE e.createdAt >= :startDate AND e.createdAt <= :endDate " +
           "GROUP BY e.executionType")
    List<Object[]> getExecutionTypePerformance(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT FUNCTION('DATE', e.sentAt), COUNT(e), " +
           "SUM(CASE WHEN e.openedAt IS NOT NULL THEN 1 ELSE 0 END) as opens, " +
           "SUM(CASE WHEN e.clickedAt IS NOT NULL THEN 1 ELSE 0 END) as clicks, " +
           "SUM(CASE WHEN e.convertedAt IS NOT NULL THEN 1 ELSE 0 END) as conversions " +
           "FROM MarketingExecution e WHERE e.sentAt >= :startDate AND e.sentAt <= :endDate " +
           "GROUP BY FUNCTION('DATE', e.sentAt) ORDER BY FUNCTION('DATE', e.sentAt)")
    List<Object[]> getDailyExecutionMetrics(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT e FROM MarketingExecution e WHERE e.campaign.id = :campaignId AND " +
           "e.sentAt >= :startDate ORDER BY e.sentAt DESC")
    List<MarketingExecution> findRecentExecutions(
        @Param("campaignId") UUID campaignId,
        @Param("startDate") LocalDateTime startDate
    );
    
    @Query("SELECT AVG((EXTRACT(EPOCH FROM e.openedAt) - EXTRACT(EPOCH FROM e.sentAt))/60) FROM MarketingExecution e " +
           "WHERE e.openedAt IS NOT NULL AND e.sentAt IS NOT NULL AND e.campaign.id = :campaignId")
    Double getAverageTimeToOpen(@Param("campaignId") UUID campaignId);
    
    @Query("SELECT AVG((EXTRACT(EPOCH FROM e.clickedAt) - EXTRACT(EPOCH FROM e.sentAt))/60) FROM MarketingExecution e " +
           "WHERE e.clickedAt IS NOT NULL AND e.sentAt IS NOT NULL AND e.campaign.id = :campaignId")
    Double getAverageTimeToClick(@Param("campaignId") UUID campaignId);
    
    @Query("SELECT AVG((EXTRACT(EPOCH FROM e.convertedAt) - EXTRACT(EPOCH FROM e.sentAt))/3600) FROM MarketingExecution e " +
           "WHERE e.convertedAt IS NOT NULL AND e.sentAt IS NOT NULL AND e.campaign.id = :campaignId")
    Double getAverageTimeToConvert(@Param("campaignId") UUID campaignId);
    
    @Query("SELECT SUM(e.revenue), SUM(e.cost), COUNT(e) FROM MarketingExecution e " +
           "WHERE e.campaign.id = :campaignId")
    List<Object[]> getCampaignROIData(@Param("campaignId") UUID campaignId);
    
    @Query("SELECT e FROM MarketingExecution e WHERE e.convertedAt IS NOT NULL AND " +
           "e.campaign.id = :campaignId ORDER BY e.conversionValue DESC")
    List<MarketingExecution> findTopConversions(@Param("campaignId") UUID campaignId, Pageable pageable);
    
    @Query("SELECT COUNT(e) FROM MarketingExecution e WHERE e.status = :status AND " +
           "e.createdAt >= :startDate")
    Long countByStatusSince(@Param("status") MarketingExecution.ExecutionStatus status, 
                           @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT e FROM MarketingExecution e WHERE e.bouncedAt IS NOT NULL AND " +
           "e.campaign.id = :campaignId ORDER BY e.bouncedAt DESC")
    List<MarketingExecution> findBounces(@Param("campaignId") UUID campaignId);
    
    @Query("SELECT e FROM MarketingExecution e WHERE e.unsubscribedAt IS NOT NULL AND " +
           "e.campaign.id = :campaignId ORDER BY e.unsubscribedAt DESC")
    List<MarketingExecution> findUnsubscribes(@Param("campaignId") UUID campaignId);
    
    @Query("SELECT e.recipientEmail FROM MarketingExecution e WHERE e.status = 'BOUNCED' " +
           "GROUP BY e.recipientEmail HAVING COUNT(e) >= :bounceThreshold")
    List<String> findEmailsWithHighBounceRate(@Param("bounceThreshold") Long bounceThreshold);
}