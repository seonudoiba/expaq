package com.abiodun.expaq.repository;

import com.abiodun.expaq.model.MarketingMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface MarketingMetricRepository extends JpaRepository<MarketingMetric, UUID> {
    
    List<MarketingMetric> findByCampaignId(UUID campaignId);
    
    List<MarketingMetric> findByExecutionId(UUID executionId);
    
    List<MarketingMetric> findByMetricType(MarketingMetric.MetricType metricType);
    
    List<MarketingMetric> findByMetricName(String metricName);
    
    List<MarketingMetric> findByCampaignIdAndMetricType(UUID campaignId, MarketingMetric.MetricType metricType);
    
    List<MarketingMetric> findByCampaignIdAndTimePeriod(UUID campaignId, MarketingMetric.TimePeriod timePeriod);
    
    @Query("SELECT m FROM MarketingMetric m WHERE m.campaign.id = :campaignId AND " +
           "m.periodStart >= :startDate AND m.periodEnd <= :endDate")
    List<MarketingMetric> findMetricsInDateRange(
        @Param("campaignId") UUID campaignId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT m FROM MarketingMetric m WHERE m.campaign.id = :campaignId AND " +
           "m.metricName = :metricName ORDER BY m.calculatedAt DESC")
    List<MarketingMetric> findLatestMetricByCampaignAndName(
        @Param("campaignId") UUID campaignId,
        @Param("metricName") String metricName
    );
    
    @Query("SELECT m.metricName, AVG(m.metricValue) FROM MarketingMetric m " +
           "WHERE m.campaign.id = :campaignId AND m.isBenchmark = true " +
           "GROUP BY m.metricName")
    List<Object[]> getBenchmarkMetrics(@Param("campaignId") UUID campaignId);
    
    @Query("SELECT m FROM MarketingMetric m WHERE m.goalValue IS NOT NULL AND " +
           "m.metricValue >= m.goalValue AND m.campaign.id = :campaignId")
    List<MarketingMetric> findMetricsMeetingGoals(@Param("campaignId") UUID campaignId);
    
    @Query("SELECT m.metricType, COUNT(m), AVG(m.metricValue) FROM MarketingMetric m " +
           "WHERE m.calculatedAt >= :startDate GROUP BY m.metricType")
    List<Object[]> getMetricTypeAggregates(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT m FROM MarketingMetric m WHERE m.comparisonValue IS NOT NULL AND " +
           "ABS((m.metricValue - m.comparisonValue) / m.comparisonValue * 100) > :changeThreshold")
    List<MarketingMetric> findSignificantChanges(@Param("changeThreshold") Double changeThreshold);
    
    @Query("SELECT m.dimension1, AVG(m.metricValue) FROM MarketingMetric m " +
           "WHERE m.campaign.id = :campaignId AND m.dimension1 IS NOT NULL AND " +
           "m.metricName = :metricName GROUP BY m.dimension1")
    List<Object[]> getMetricsByDimension1(
        @Param("campaignId") UUID campaignId,
        @Param("metricName") String metricName
    );
    
    @Query("SELECT m.dimension2, AVG(m.metricValue) FROM MarketingMetric m " +
           "WHERE m.campaign.id = :campaignId AND m.dimension2 IS NOT NULL AND " +
           "m.metricName = :metricName GROUP BY m.dimension2")
    List<Object[]> getMetricsByDimension2(
        @Param("campaignId") UUID campaignId,
        @Param("metricName") String metricName
    );
    
    @Query("SELECT FUNCTION('DATE', m.calculatedAt), m.metricName, AVG(m.metricValue) FROM MarketingMetric m " +
           "WHERE m.campaign.id = :campaignId AND m.calculatedAt >= :startDate " +
           "GROUP BY FUNCTION('DATE', m.calculatedAt), m.metricName ORDER BY FUNCTION('DATE', m.calculatedAt)")
    List<Object[]> getDailyMetricTrends(
        @Param("campaignId") UUID campaignId,
        @Param("startDate") LocalDateTime startDate
    );
    
    @Query("SELECT m FROM MarketingMetric m WHERE m.campaign.id = :campaignId AND " +
           "m.metricName = :metricName AND m.timePeriod = :timePeriod " +
           "ORDER BY m.calculatedAt DESC")
    List<MarketingMetric> findMetricHistory(
        @Param("campaignId") UUID campaignId,
        @Param("metricName") String metricName,
        @Param("timePeriod") MarketingMetric.TimePeriod timePeriod
    );
    
    @Query("SELECT COUNT(m) FROM MarketingMetric m WHERE m.campaign.id = :campaignId AND " +
           "m.goalValue IS NOT NULL AND m.metricValue >= m.goalValue")
    Long countGoalsAchieved(@Param("campaignId") UUID campaignId);
    
    @Query("SELECT COUNT(m) FROM MarketingMetric m WHERE m.campaign.id = :campaignId AND " +
           "m.goalValue IS NOT NULL")
    Long countTotalGoals(@Param("campaignId") UUID campaignId);
    
    @Query("SELECT m FROM MarketingMetric m WHERE m.calculatedAt >= :cutoffTime " +
           "ORDER BY m.calculatedAt DESC")
    List<MarketingMetric> findRecentMetrics(@Param("cutoffTime") LocalDateTime cutoffTime);
}