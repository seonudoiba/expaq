package com.abiodun.expaq.service;

import com.abiodun.expaq.model.MarketingCampaign;
import com.abiodun.expaq.model.MarketingExecution;
import com.abiodun.expaq.model.MarketingMetric;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

public interface IMarketingService {
    
    // Campaign Management
    MarketingCampaign createCampaign(MarketingCampaign campaign);
    MarketingCampaign updateCampaign(UUID campaignId, MarketingCampaign campaign);
    void deleteCampaign(UUID campaignId);
    Optional<MarketingCampaign> getCampaignById(UUID campaignId);
    Page<MarketingCampaign> getAllCampaigns(Pageable pageable);
    Page<MarketingCampaign> getCampaignsByCreator(UUID creatorId, Pageable pageable);
    List<MarketingCampaign> getCampaignsByStatus(MarketingCampaign.CampaignStatus status);
    List<MarketingCampaign> getCampaignsByType(MarketingCampaign.CampaignType type);
    Page<MarketingCampaign> searchCampaigns(String searchTerm, Pageable pageable);
    
    // Campaign Lifecycle
    void activateCampaign(UUID campaignId);
    void pauseCampaign(UUID campaignId);
    void completeCampaign(UUID campaignId);
    void cancelCampaign(UUID campaignId);
    void scheduleCampaign(UUID campaignId, LocalDateTime scheduledTime);
    
    // Execution Management
    MarketingExecution createExecution(MarketingExecution execution);
    MarketingExecution updateExecution(UUID executionId, MarketingExecution execution);
    Optional<MarketingExecution> getExecutionById(UUID executionId);
    Page<MarketingExecution> getExecutionsByCampaign(UUID campaignId, Pageable pageable);
    List<MarketingExecution> getExecutionsByStatus(MarketingExecution.ExecutionStatus status);
    List<MarketingExecution> getExecutionsByUser(UUID userId);
    MarketingExecution getExecutionByTrackingCode(String trackingCode);
    
    // Execution Lifecycle
    void sendExecution(UUID executionId);
    void markExecutionDelivered(UUID executionId);
    void markExecutionOpened(String trackingCode);
    void markExecutionClicked(String trackingCode);
    void markExecutionConverted(String trackingCode, BigDecimal conversionValue);
    void markExecutionBounced(UUID executionId, String reason);
    void markExecutionFailed(UUID executionId, String reason);
    void markExecutionUnsubscribed(String trackingCode);
    
    // Automation & Processing
    void processScheduledCampaigns();
    void processScheduledExecutions();
    void retryFailedExecutions();
    void optimizeCampaigns();
    void processExpiredCampaigns();
    
    // Metrics & Analytics
    MarketingMetric createMetric(MarketingMetric metric);
    List<MarketingMetric> getMetricsByCampaign(UUID campaignId);
    List<MarketingMetric> getMetricsByExecution(UUID executionId);
    List<MarketingMetric> getMetricsByType(MarketingMetric.MetricType metricType);
    void calculateCampaignMetrics(UUID campaignId);
    void calculateExecutionMetrics(UUID executionId);
    
    // Performance Reports
    Map<String, Object> getCampaignPerformanceReport(UUID campaignId);
    Map<String, Object> getCampaignPerformanceReport(UUID campaignId, LocalDateTime startDate, LocalDateTime endDate);
    Map<String, Object> getOverallPerformanceReport(LocalDateTime startDate, LocalDateTime endDate);
    Map<String, Object> getCampaignTypePerformance();
    Map<String, Object> getExecutionTypePerformance(LocalDateTime startDate, LocalDateTime endDate);
    
    // ROI & Financial
    BigDecimal calculateCampaignROI(UUID campaignId);
    BigDecimal calculateCampaignCost(UUID campaignId);
    BigDecimal calculateCampaignRevenue(UUID campaignId);
    Map<String, BigDecimal> getFinancialSummary(LocalDateTime startDate, LocalDateTime endDate);
    
    // Audience & Targeting
    boolean canSendToCampaignAudience(UUID campaignId, UUID userId);
    List<UUID> getTargetAudienceForCampaign(UUID campaignId);
    void updateCampaignAudience(UUID campaignId, String audienceCriteria);
    
    // A/B Testing
    void setupABTest(UUID campaignId, String testConfig);
    Map<String, Object> getABTestResults(UUID campaignId);
    void selectWinningVariant(UUID campaignId, String variantId);
    
    // Personalization
    String personalizeContent(String template, Map<String, Object> personalizationData);
    Map<String, Object> getUserPersonalizationData(UUID userId);
    
    // Budget Management
    boolean hasBudgetRemaining(UUID campaignId);
    BigDecimal getRemainingBudget(UUID campaignId);
    void updateCampaignBudget(UUID campaignId, BigDecimal newBudget);
    List<MarketingCampaign> getCampaignsOverBudget();
    
    // Frequency Management
    boolean canSendToUser(UUID userId, UUID campaignId);
    void updateFrequencyRules(UUID campaignId, String frequencyRules);
    Map<String, Object> getUserFrequencyData(UUID userId);
    
    // Tracking & Events
    void trackEmailOpen(String trackingCode, String userAgent, String ipAddress);
    void trackEmailClick(String trackingCode, String clickedUrl, String userAgent, String ipAddress);
    void trackConversion(String trackingCode, String conversionEvent, BigDecimal value);
    void trackUnsubscribe(String trackingCode, String reason);
    
    // Dashboard Data
    Map<String, Object> getDashboardData();
    Map<String, Object> getCampaignDashboardData(UUID campaignId);
    List<Map<String, Object>> getTopPerformingCampaigns(int limit);
    List<Map<String, Object>> getRecentExecutions(int limit);
    
    // Health & Monitoring
    Map<String, Object> getSystemHealth();
    List<String> getSystemAlerts();
    void cleanupOldData(LocalDateTime cutoffDate);
    
    // Bulk Operations
    void bulkUpdateCampaignStatus(List<UUID> campaignIds, MarketingCampaign.CampaignStatus status);
    void bulkDeleteCampaigns(List<UUID> campaignIds);
    List<MarketingExecution> bulkCreateExecutions(List<MarketingExecution> executions);
    
    // Import/Export
    void importCampaignsFromCSV(String csvData);
    String exportCampaignsToCSV(List<UUID> campaignIds);
    void exportMetricsToCSV(UUID campaignId, String filePath);
}