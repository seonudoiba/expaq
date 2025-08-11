package com.abiodun.expaq.controller;

import com.abiodun.expaq.model.MarketingCampaign;
import com.abiodun.expaq.model.MarketingExecution;
import com.abiodun.expaq.model.MarketingMetric;
import com.abiodun.expaq.service.IMarketingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/marketing")
@RequiredArgsConstructor
@Slf4j
@Validated
@Tag(name = "Marketing Automation", description = "Marketing campaign and automation management")
public class MarketingController {
    
    private final IMarketingService marketingService;
    
    // Campaign Management Endpoints
    
    @PostMapping("/campaigns")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MARKETING_MANAGER')")
    @Operation(summary = "Create new marketing campaign")
    public ResponseEntity<MarketingCampaign> createCampaign(@Valid @RequestBody MarketingCampaign campaign) {
        try {
            MarketingCampaign created = marketingService.createCampaign(campaign);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("Error creating campaign: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    @GetMapping("/campaigns")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MARKETING_MANAGER') or hasRole('MARKETING_USER')")
    @Operation(summary = "Get all marketing campaigns")
    public ResponseEntity<Page<MarketingCampaign>> getAllCampaigns(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<MarketingCampaign> campaigns = marketingService.getAllCampaigns(pageable);
        return ResponseEntity.ok(campaigns);
    }
    
    @GetMapping("/campaigns/{campaignId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MARKETING_MANAGER') or hasRole('MARKETING_USER')")
    @Operation(summary = "Get campaign by ID")
    public ResponseEntity<MarketingCampaign> getCampaignById(@PathVariable UUID campaignId) {
        Optional<MarketingCampaign> campaign = marketingService.getCampaignById(campaignId);
        return campaign.map(ResponseEntity::ok)
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PutMapping("/campaigns/{campaignId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MARKETING_MANAGER')")
    @Operation(summary = "Update marketing campaign")
    public ResponseEntity<MarketingCampaign> updateCampaign(
            @PathVariable UUID campaignId, 
            @Valid @RequestBody MarketingCampaign campaign) {
        try {
            MarketingCampaign updated = marketingService.updateCampaign(campaignId, campaign);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            log.error("Error updating campaign {}: {}", campaignId, e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    @DeleteMapping("/campaigns/{campaignId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete marketing campaign")
    public ResponseEntity<Void> deleteCampaign(@PathVariable UUID campaignId) {
        try {
            marketingService.deleteCampaign(campaignId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            log.error("Error deleting campaign {}: {}", campaignId, e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    @GetMapping("/campaigns/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MARKETING_MANAGER') or hasRole('MARKETING_USER')")
    @Operation(summary = "Search marketing campaigns")
    public ResponseEntity<Page<MarketingCampaign>> searchCampaigns(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<MarketingCampaign> campaigns = marketingService.searchCampaigns(query, pageable);
        return ResponseEntity.ok(campaigns);
    }
    
    @GetMapping("/campaigns/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MARKETING_MANAGER') or hasRole('MARKETING_USER')")
    @Operation(summary = "Get campaigns by status")
    public ResponseEntity<List<MarketingCampaign>> getCampaignsByStatus(
            @PathVariable MarketingCampaign.CampaignStatus status) {
        List<MarketingCampaign> campaigns = marketingService.getCampaignsByStatus(status);
        return ResponseEntity.ok(campaigns);
    }
    
    @GetMapping("/campaigns/type/{type}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MARKETING_MANAGER') or hasRole('MARKETING_USER')")
    @Operation(summary = "Get campaigns by type")
    public ResponseEntity<List<MarketingCampaign>> getCampaignsByType(
            @PathVariable MarketingCampaign.CampaignType type) {
        List<MarketingCampaign> campaigns = marketingService.getCampaignsByType(type);
        return ResponseEntity.ok(campaigns);
    }
    
    // Campaign Lifecycle Endpoints
    
    @PostMapping("/campaigns/{campaignId}/activate")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MARKETING_MANAGER')")
    @Operation(summary = "Activate campaign")
    public ResponseEntity<Void> activateCampaign(@PathVariable UUID campaignId) {
        try {
            marketingService.activateCampaign(campaignId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error activating campaign {}: {}", campaignId, e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    @PostMapping("/campaigns/{campaignId}/pause")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MARKETING_MANAGER')")
    @Operation(summary = "Pause campaign")
    public ResponseEntity<Void> pauseCampaign(@PathVariable UUID campaignId) {
        try {
            marketingService.pauseCampaign(campaignId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error pausing campaign {}: {}", campaignId, e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    @PostMapping("/campaigns/{campaignId}/complete")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MARKETING_MANAGER')")
    @Operation(summary = "Complete campaign")
    public ResponseEntity<Void> completeCampaign(@PathVariable UUID campaignId) {
        try {
            marketingService.completeCampaign(campaignId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error completing campaign {}: {}", campaignId, e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    @PostMapping("/campaigns/{campaignId}/cancel")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MARKETING_MANAGER')")
    @Operation(summary = "Cancel campaign")
    public ResponseEntity<Void> cancelCampaign(@PathVariable UUID campaignId) {
        try {
            marketingService.cancelCampaign(campaignId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error cancelling campaign {}: {}", campaignId, e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    @PostMapping("/campaigns/{campaignId}/schedule")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MARKETING_MANAGER')")
    @Operation(summary = "Schedule campaign")
    public ResponseEntity<Void> scheduleCampaign(
            @PathVariable UUID campaignId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime scheduledTime) {
        try {
            marketingService.scheduleCampaign(campaignId, scheduledTime);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error scheduling campaign {}: {}", campaignId, e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    // Execution Management Endpoints
    
    @PostMapping("/executions")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MARKETING_MANAGER')")
    @Operation(summary = "Create marketing execution")
    public ResponseEntity<MarketingExecution> createExecution(@Valid @RequestBody MarketingExecution execution) {
        try {
            MarketingExecution created = marketingService.createExecution(execution);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("Error creating execution: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    @GetMapping("/campaigns/{campaignId}/executions")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MARKETING_MANAGER') or hasRole('MARKETING_USER')")
    @Operation(summary = "Get executions for campaign")
    public ResponseEntity<Page<MarketingExecution>> getExecutionsByCampaign(
            @PathVariable UUID campaignId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<MarketingExecution> executions = marketingService.getExecutionsByCampaign(campaignId, pageable);
        return ResponseEntity.ok(executions);
    }
    
    @GetMapping("/executions/{executionId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MARKETING_MANAGER') or hasRole('MARKETING_USER')")
    @Operation(summary = "Get execution by ID")
    public ResponseEntity<MarketingExecution> getExecutionById(@PathVariable UUID executionId) {
        Optional<MarketingExecution> execution = marketingService.getExecutionById(executionId);
        return execution.map(ResponseEntity::ok)
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @GetMapping("/executions/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MARKETING_MANAGER')")
    @Operation(summary = "Get executions by status")
    public ResponseEntity<List<MarketingExecution>> getExecutionsByStatus(
            @PathVariable MarketingExecution.ExecutionStatus status) {
        List<MarketingExecution> executions = marketingService.getExecutionsByStatus(status);
        return ResponseEntity.ok(executions);
    }
    
    @PostMapping("/executions/{executionId}/send")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MARKETING_MANAGER')")
    @Operation(summary = "Send execution")
    public ResponseEntity<Void> sendExecution(@PathVariable UUID executionId) {
        try {
            marketingService.sendExecution(executionId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error sending execution {}: {}", executionId, e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    // Tracking Endpoints (Public - no authentication required)
    
    @GetMapping("/track/open/{trackingCode}")
    @Operation(summary = "Track email open")
    public ResponseEntity<byte[]> trackEmailOpen(
            @PathVariable String trackingCode,
            HttpServletRequest request) {
        try {
            String userAgent = request.getHeader("User-Agent");
            String ipAddress = request.getRemoteAddr();
            
            marketingService.trackEmailOpen(trackingCode, userAgent, ipAddress);
            
            // Return 1x1 transparent pixel
            byte[] pixel = {(byte) 0x47, (byte) 0x49, (byte) 0x46, (byte) 0x38, (byte) 0x39, (byte) 0x61,
                           (byte) 0x01, (byte) 0x00, (byte) 0x01, (byte) 0x00, (byte) 0x80, (byte) 0x00,
                           (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0xff, (byte) 0xff,
                           (byte) 0xff, (byte) 0x21, (byte) 0xf9, (byte) 0x04, (byte) 0x01, (byte) 0x00,
                           (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x2c, (byte) 0x00, (byte) 0x00,
                           (byte) 0x00, (byte) 0x00, (byte) 0x01, (byte) 0x00, (byte) 0x01, (byte) 0x00,
                           (byte) 0x00, (byte) 0x02, (byte) 0x02, (byte) 0x04, (byte) 0x01, (byte) 0x00,
                           (byte) 0x3b};
            
            return ResponseEntity.ok()
                .header("Content-Type", "image/gif")
                .header("Cache-Control", "no-cache, no-store, must-revalidate")
                .body(pixel);
        } catch (Exception e) {
            log.error("Error tracking email open for {}: {}", trackingCode, e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    @GetMapping("/track/click/{trackingCode}")
    @Operation(summary = "Track email click")
    public ResponseEntity<Void> trackEmailClick(
            @PathVariable String trackingCode,
            @RequestParam String url,
            HttpServletRequest request) {
        try {
            String userAgent = request.getHeader("User-Agent");
            String ipAddress = request.getRemoteAddr();
            
            marketingService.trackEmailClick(trackingCode, url, userAgent, ipAddress);
            
            return ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", url)
                .build();
        } catch (Exception e) {
            log.error("Error tracking email click for {}: {}", trackingCode, e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    @PostMapping("/track/conversion/{trackingCode}")
    @Operation(summary = "Track conversion")
    public ResponseEntity<Void> trackConversion(
            @PathVariable String trackingCode,
            @RequestParam String event,
            @RequestParam(required = false) BigDecimal value) {
        try {
            marketingService.trackConversion(trackingCode, event, value);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error tracking conversion for {}: {}", trackingCode, e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    @PostMapping("/track/unsubscribe/{trackingCode}")
    @Operation(summary = "Track unsubscribe")
    public ResponseEntity<Void> trackUnsubscribe(
            @PathVariable String trackingCode,
            @RequestParam(required = false) String reason) {
        try {
            marketingService.trackUnsubscribe(trackingCode, reason);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error tracking unsubscribe for {}: {}", trackingCode, e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    // Analytics & Reporting Endpoints
    
    @GetMapping("/campaigns/{campaignId}/performance")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MARKETING_MANAGER') or hasRole('MARKETING_USER')")
    @Operation(summary = "Get campaign performance report")
    public ResponseEntity<Map<String, Object>> getCampaignPerformance(
            @PathVariable UUID campaignId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        
        Map<String, Object> performance = startDate != null && endDate != null ?
            marketingService.getCampaignPerformanceReport(campaignId, startDate, endDate) :
            marketingService.getCampaignPerformanceReport(campaignId);
            
        return ResponseEntity.ok(performance);
    }
    
    @GetMapping("/performance/overall")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MARKETING_MANAGER')")
    @Operation(summary = "Get overall performance report")
    public ResponseEntity<Map<String, Object>> getOverallPerformance(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        
        Map<String, Object> performance = marketingService.getOverallPerformanceReport(startDate, endDate);
        return ResponseEntity.ok(performance);
    }
    
    @GetMapping("/performance/campaign-types")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MARKETING_MANAGER')")
    @Operation(summary = "Get campaign type performance")
    public ResponseEntity<Map<String, Object>> getCampaignTypePerformance() {
        Map<String, Object> performance = marketingService.getCampaignTypePerformance();
        return ResponseEntity.ok(performance);
    }
    
    @GetMapping("/campaigns/{campaignId}/roi")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MARKETING_MANAGER')")
    @Operation(summary = "Get campaign ROI")
    public ResponseEntity<BigDecimal> getCampaignROI(@PathVariable UUID campaignId) {
        BigDecimal roi = marketingService.calculateCampaignROI(campaignId);
        return ResponseEntity.ok(roi);
    }
    
    @GetMapping("/campaigns/{campaignId}/metrics")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MARKETING_MANAGER') or hasRole('MARKETING_USER')")
    @Operation(summary = "Get campaign metrics")
    public ResponseEntity<List<MarketingMetric>> getCampaignMetrics(@PathVariable UUID campaignId) {
        List<MarketingMetric> metrics = marketingService.getMetricsByCampaign(campaignId);
        return ResponseEntity.ok(metrics);
    }
    
    // Dashboard Endpoints
    
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MARKETING_MANAGER') or hasRole('MARKETING_USER')")
    @Operation(summary = "Get marketing dashboard data")
    public ResponseEntity<Map<String, Object>> getDashboardData() {
        Map<String, Object> dashboard = marketingService.getDashboardData();
        return ResponseEntity.ok(dashboard);
    }
    
    @GetMapping("/campaigns/{campaignId}/dashboard")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MARKETING_MANAGER') or hasRole('MARKETING_USER')")
    @Operation(summary = "Get campaign dashboard data")
    public ResponseEntity<Map<String, Object>> getCampaignDashboard(@PathVariable UUID campaignId) {
        Map<String, Object> dashboard = marketingService.getCampaignDashboardData(campaignId);
        return ResponseEntity.ok(dashboard);
    }
    
    // Budget Management Endpoints
    
    @GetMapping("/campaigns/{campaignId}/budget")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MARKETING_MANAGER')")
    @Operation(summary = "Get campaign budget info")
    public ResponseEntity<Map<String, Object>> getCampaignBudget(@PathVariable UUID campaignId) {
        Map<String, Object> budget = Map.of(
            "hasBudgetRemaining", marketingService.hasBudgetRemaining(campaignId),
            "remainingBudget", marketingService.getRemainingBudget(campaignId),
            "totalCost", marketingService.calculateCampaignCost(campaignId)
        );
        return ResponseEntity.ok(budget);
    }
    
    @PutMapping("/campaigns/{campaignId}/budget")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MARKETING_MANAGER')")
    @Operation(summary = "Update campaign budget")
    public ResponseEntity<Void> updateCampaignBudget(
            @PathVariable UUID campaignId,
            @RequestParam BigDecimal budget) {
        try {
            marketingService.updateCampaignBudget(campaignId, budget);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error updating budget for campaign {}: {}", campaignId, e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    @GetMapping("/campaigns/over-budget")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MARKETING_MANAGER')")
    @Operation(summary = "Get campaigns over budget")
    public ResponseEntity<List<MarketingCampaign>> getCampaignsOverBudget() {
        List<MarketingCampaign> campaigns = marketingService.getCampaignsOverBudget();
        return ResponseEntity.ok(campaigns);
    }
    
    // System Management Endpoints
    
    @PostMapping("/system/process-scheduled")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Process scheduled campaigns and executions")
    public ResponseEntity<Void> processScheduled() {
        marketingService.processScheduledCampaigns();
        marketingService.processScheduledExecutions();
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @PostMapping("/system/retry-failed")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Retry failed executions")
    public ResponseEntity<Void> retryFailed() {
        marketingService.retryFailedExecutions();
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @PostMapping("/system/optimize")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Optimize campaigns")
    public ResponseEntity<Void> optimizeCampaigns() {
        marketingService.optimizeCampaigns();
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @GetMapping("/system/health")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get system health")
    public ResponseEntity<Map<String, Object>> getSystemHealth() {
        Map<String, Object> health = marketingService.getSystemHealth();
        return ResponseEntity.ok(health);
    }
}