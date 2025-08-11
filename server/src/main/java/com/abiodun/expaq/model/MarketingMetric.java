package com.abiodun.expaq.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "marketing_metrics")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarketingMetric {
    
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(updatable = false, nullable = false)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id", nullable = false)
    private MarketingCampaign campaign;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "execution_id")
    private MarketingExecution execution;
    
    @Column(name = "metric_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private MetricType metricType;
    
    @Column(name = "metric_name", nullable = false)
    private String metricName;
    
    @Column(name = "metric_value", precision = 19, scale = 4)
    private java.math.BigDecimal metricValue;
    
    @Column(name = "metric_count")
    private Long metricCount;
    
    @Column(name = "metric_percentage", precision = 7, scale = 4)
    private java.math.BigDecimal metricPercentage;
    
    @Column(name = "dimension_1")
    private String dimension1; // e.g., device_type, location, etc.
    
    @Column(name = "dimension_2")
    private String dimension2;
    
    @Column(name = "dimension_3")
    private String dimension3;
    
    @Column(name = "time_period")
    @Enumerated(EnumType.STRING)
    private TimePeriod timePeriod;
    
    @Column(name = "period_start")
    private LocalDateTime periodStart;
    
    @Column(name = "period_end")
    private LocalDateTime periodEnd;
    
    @Column(name = "comparison_value", precision = 19, scale = 4)
    private java.math.BigDecimal comparisonValue;
    
    @Column(name = "comparison_period_start")
    private LocalDateTime comparisonPeriodStart;
    
    @Column(name = "comparison_period_end")
    private LocalDateTime comparisonPeriodEnd;
    
    @Column(name = "goal_value", precision = 19, scale = 4)
    private java.math.BigDecimal goalValue;
    
    @Column(name = "is_benchmark", nullable = false)
    private Boolean isBenchmark = false;
    
    @Column(name = "calculated_at", nullable = false)
    private LocalDateTime calculatedAt;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        calculatedAt = LocalDateTime.now();
    }
    
    public enum MetricType {
        DELIVERY("Delivery Metrics"),
        ENGAGEMENT("Engagement Metrics"),
        CONVERSION("Conversion Metrics"),
        REVENUE("Revenue Metrics"),
        COST("Cost Metrics"),
        PERFORMANCE("Performance Metrics"),
        AUDIENCE("Audience Metrics"),
        BEHAVIORAL("Behavioral Metrics"),
        TEMPORAL("Temporal Metrics"),
        GEOGRAPHIC("Geographic Metrics"),
        DEVICE("Device Metrics"),
        CHANNEL("Channel Metrics");
        
        private final String displayName;
        
        MetricType(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public enum TimePeriod {
        HOURLY("Hourly"),
        DAILY("Daily"),
        WEEKLY("Weekly"),
        MONTHLY("Monthly"),
        QUARTERLY("Quarterly"),
        YEARLY("Yearly"),
        CUSTOM("Custom"),
        REAL_TIME("Real-time");
        
        private final String displayName;
        
        TimePeriod(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    // Helper methods
    
    public boolean hasImproved() {
        if (comparisonValue == null || metricValue == null) return false;
        
        // For metrics where higher is better (engagement, conversion, revenue)
        if (isPositiveMetric()) {
            return metricValue.compareTo(comparisonValue) > 0;
        }
        
        // For metrics where lower is better (cost, unsubscribe rate)
        return metricValue.compareTo(comparisonValue) < 0;
    }
    
    public java.math.BigDecimal getImprovementPercentage() {
        if (comparisonValue == null || metricValue == null || 
            comparisonValue.compareTo(java.math.BigDecimal.ZERO) == 0) {
            return null;
        }
        
        java.math.BigDecimal difference = metricValue.subtract(comparisonValue);
        return difference.divide(comparisonValue, 4, java.math.RoundingMode.HALF_UP)
                .multiply(new java.math.BigDecimal("100"));
    }
    
    public boolean meetsGoal() {
        if (goalValue == null || metricValue == null) return false;
        
        if (isPositiveMetric()) {
            return metricValue.compareTo(goalValue) >= 0;
        }
        
        return metricValue.compareTo(goalValue) <= 0;
    }
    
    public java.math.BigDecimal getGoalAchievementPercentage() {
        if (goalValue == null || metricValue == null || 
            goalValue.compareTo(java.math.BigDecimal.ZERO) == 0) {
            return null;
        }
        
        return metricValue.divide(goalValue, 4, java.math.RoundingMode.HALF_UP)
                .multiply(new java.math.BigDecimal("100"));
    }
    
    private boolean isPositiveMetric() {
        return metricName.toLowerCase().contains("rate") && 
               (metricName.toLowerCase().contains("open") || 
                metricName.toLowerCase().contains("click") || 
                metricName.toLowerCase().contains("conversion")) ||
               metricName.toLowerCase().contains("revenue") ||
               metricName.toLowerCase().contains("engagement") ||
               metricName.toLowerCase().contains("delivery");
    }
    
    public String getFormattedValue() {
        if (metricValue == null) return "N/A";
        
        if (metricName.toLowerCase().contains("rate") || 
            metricName.toLowerCase().contains("percentage")) {
            return metricValue.setScale(2, java.math.RoundingMode.HALF_UP) + "%";
        }
        
        if (metricName.toLowerCase().contains("revenue") || 
            metricName.toLowerCase().contains("cost")) {
            return "$" + metricValue.setScale(2, java.math.RoundingMode.HALF_UP);
        }
        
        if (metricName.toLowerCase().contains("count")) {
            return metricValue.setScale(0, java.math.RoundingMode.HALF_UP).toString();
        }
        
        return metricValue.setScale(2, java.math.RoundingMode.HALF_UP).toString();
    }
    
    public String getTrendIndicator() {
        if (comparisonValue == null || metricValue == null) return "—";
        
        java.math.BigDecimal improvement = getImprovementPercentage();
        if (improvement == null) return "—";
        
        if (improvement.compareTo(java.math.BigDecimal.ZERO) > 0) {
            return hasImproved() ? "↗" : "↘";
        } else if (improvement.compareTo(java.math.BigDecimal.ZERO) < 0) {
            return hasImproved() ? "↗" : "↘";
        }
        
        return "→";
    }
    
    public String getPerformanceLevel() {
        if (goalValue == null || metricValue == null) return "Unknown";
        
        java.math.BigDecimal achievement = getGoalAchievementPercentage();
        if (achievement == null) return "Unknown";
        
        if (achievement.compareTo(new java.math.BigDecimal("120")) >= 0) return "Excellent";
        if (achievement.compareTo(new java.math.BigDecimal("100")) >= 0) return "Good";
        if (achievement.compareTo(new java.math.BigDecimal("80")) >= 0) return "Fair";
        return "Poor";
    }
    
    public boolean isSignificantChange() {
        java.math.BigDecimal improvement = getImprovementPercentage();
        if (improvement == null) return false;
        
        // Consider changes > 5% as significant
        return improvement.abs().compareTo(new java.math.BigDecimal("5")) > 0;
    }
    
    public void setBenchmarkComparison(java.math.BigDecimal benchmarkValue) {
        this.comparisonValue = benchmarkValue;
        this.isBenchmark = true;
    }
}