package com.abiodun.expaq.repository;

import com.abiodun.expaq.model.MarketingCampaign;
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
public interface MarketingCampaignRepository extends JpaRepository<MarketingCampaign, UUID> {
    
    List<MarketingCampaign> findByStatus(MarketingCampaign.CampaignStatus status);
    
    List<MarketingCampaign> findByStatusAndStartDateBefore(
        MarketingCampaign.CampaignStatus status, 
        LocalDateTime date
    );
    
    List<MarketingCampaign> findByStatusAndEndDateAfter(
        MarketingCampaign.CampaignStatus status, 
        LocalDateTime date
    );
    
    Page<MarketingCampaign> findByCreatedById(UUID createdById, Pageable pageable);
    
    List<MarketingCampaign> findByCampaignType(MarketingCampaign.CampaignType campaignType);
    
    @Query("SELECT c FROM MarketingCampaign c WHERE c.status = :status AND " +
           "(c.startDate IS NULL OR c.startDate <= :now) AND " +
           "(c.endDate IS NULL OR c.endDate > :now)")
    List<MarketingCampaign> findActiveCampaigns(
        @Param("status") MarketingCampaign.CampaignStatus status,
        @Param("now") LocalDateTime now
    );
    
    @Query("SELECT c FROM MarketingCampaign c WHERE c.status = 'SCHEDULED' AND " +
           "c.startDate <= :executionTime")
    List<MarketingCampaign> findCampaignsReadyForExecution(@Param("executionTime") LocalDateTime executionTime);
    
    @Query("SELECT c FROM MarketingCampaign c WHERE c.budgetLimit IS NOT NULL AND " +
           "(SELECT COALESCE(SUM(e.cost), 0) FROM MarketingExecution e WHERE e.campaign = c) >= c.budgetLimit")
    List<MarketingCampaign> findCampaignsOverBudget();
    
    @Query("SELECT c FROM MarketingCampaign c WHERE c.autoOptimize = true AND " +
           "c.status = 'ACTIVE' AND c.lastExecutedAt < :cutoffTime")
    List<MarketingCampaign> findCampaignsForOptimization(@Param("cutoffTime") LocalDateTime cutoffTime);
    
    @Query("SELECT c, COUNT(e) as executionCount FROM MarketingCampaign c " +
           "LEFT JOIN MarketingExecution e ON e.campaign = c " +
           "WHERE c.createdAt >= :startDate AND c.createdAt <= :endDate " +
           "GROUP BY c ORDER BY executionCount DESC")
    List<Object[]> findCampaignPerformanceStats(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT c.campaignType, COUNT(c), AVG(SIZE(c.executions)) FROM MarketingCampaign c " +
           "WHERE c.createdAt >= :startDate GROUP BY c.campaignType")
    List<Object[]> findCampaignTypeStats(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT c FROM MarketingCampaign c WHERE " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<MarketingCampaign> searchCampaigns(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT DISTINCT c.campaignType FROM MarketingCampaign c")
    List<MarketingCampaign.CampaignType> findDistinctCampaignTypes();
    
    @Query("SELECT c FROM MarketingCampaign c WHERE c.priority >= :minPriority " +
           "ORDER BY c.priority DESC, c.createdAt DESC")
    List<MarketingCampaign> findHighPriorityCampaigns(@Param("minPriority") Integer minPriority);
    
    @Query("SELECT COUNT(c) FROM MarketingCampaign c WHERE c.status = :status")
    Long countByStatus(@Param("status") MarketingCampaign.CampaignStatus status);
    
    @Query("SELECT c FROM MarketingCampaign c WHERE c.trackingEnabled = true AND " +
           "c.status IN ('ACTIVE', 'COMPLETED') ORDER BY c.lastExecutedAt DESC")
    List<MarketingCampaign> findCampaignsWithTracking();
    
    @Query("SELECT c FROM MarketingCampaign c WHERE c.endDate < :now AND c.status = 'ACTIVE'")
    List<MarketingCampaign> findExpiredActiveCampaigns(@Param("now") LocalDateTime now);
}