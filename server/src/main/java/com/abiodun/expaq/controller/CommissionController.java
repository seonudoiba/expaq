package com.abiodun.expaq.controller;

import com.abiodun.expaq.model.Commission;
import com.abiodun.expaq.model.ExpaqUserDetails;
import com.abiodun.expaq.repository.CommissionRepository;
import com.abiodun.expaq.service.ICommissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/commissions")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Commission", description = "Commission management and tracking")
public class CommissionController {

    private final ICommissionService commissionService;
    private final CommissionRepository commissionRepository;

    @GetMapping("/host")
    @Operation(summary = "Get commissions for current host")
    @PreAuthorize("hasRole('HOST')")
    public ResponseEntity<Page<Commission>> getHostCommissions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status) {
        
        try {
            ExpaqUserDetails userDetails = (ExpaqUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UUID hostId = userDetails.getId();
            
            Pageable pageable = PageRequest.of(page, size);
            Page<Commission> commissions;
            
            if (status != null && !status.isEmpty()) {
                Commission.CommissionStatus commissionStatus = Commission.CommissionStatus.valueOf(status.toUpperCase());
                commissions = commissionRepository.findByHostIdAndStatus(hostId, commissionStatus, pageable);
            } else {
                commissions = commissionRepository.findByHostIdOrderByCreatedAtDesc(hostId, pageable);
            }
            
            return ResponseEntity.ok(commissions);
            
        } catch (Exception e) {
            log.error("Error fetching host commissions: {}", e.getMessage());
            return ResponseEntity.ok(Page.empty());
        }
    }

    @GetMapping("/host/summary")
    @Operation(summary = "Get commission summary for current host")
    @PreAuthorize("hasRole('HOST')")
    public ResponseEntity<Map<String, Object>> getHostCommissionSummary() {
        try {
            ExpaqUserDetails userDetails = (ExpaqUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UUID hostId = userDetails.getId();
            
            Map<String, Object> summary = commissionService.getHostCommissionSummary(hostId);
            return ResponseEntity.ok(summary);
            
        } catch (Exception e) {
            log.error("Error fetching host commission summary: {}", e.getMessage());
            return ResponseEntity.ok(Map.of());
        }
    }

    @GetMapping("/admin/all")
    @Operation(summary = "Get all commissions (admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<Commission>> getAllCommissions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String hostId) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Commission> commissions;
            
            if (hostId != null && !hostId.isEmpty()) {
                UUID hostUuid = UUID.fromString(hostId);
                if (status != null && !status.isEmpty()) {
                    Commission.CommissionStatus commissionStatus = Commission.CommissionStatus.valueOf(status.toUpperCase());
                    commissions = commissionRepository.findByHostIdAndStatus(hostUuid, commissionStatus, pageable);
                } else {
                    commissions = commissionRepository.findByHostIdOrderByCreatedAtDesc(hostUuid, pageable);
                }
            } else if (status != null && !status.isEmpty()) {
                Commission.CommissionStatus commissionStatus = Commission.CommissionStatus.valueOf(status.toUpperCase());
                commissions = commissionRepository.findByStatusOrderByCreatedAtDesc(commissionStatus, pageable);
            } else {
                commissions = commissionRepository.findAllByOrderByCreatedAtDesc(pageable);
            }
            
            return ResponseEntity.ok(commissions);
            
        } catch (Exception e) {
            log.error("Error fetching all commissions: {}", e.getMessage());
            return ResponseEntity.ok(Page.empty());
        }
    }

    @GetMapping("/admin/summary")
    @Operation(summary = "Get platform commission summary (admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getPlatformCommissionSummary(
            @RequestParam(required = false) String period) {
        
        try {
            Map<String, Object> summary = commissionService.getPlatformCommissionSummary(period);
            return ResponseEntity.ok(summary);
            
        } catch (Exception e) {
            log.error("Error fetching platform commission summary: {}", e.getMessage());
            return ResponseEntity.ok(Map.of());
        }
    }

    @PostMapping("/process/{bookingId}")
    @Operation(summary = "Process commission for a booking (admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> processCommission(@PathVariable UUID bookingId) {
        try {
            commissionService.processCommissionForBooking(bookingId);
            return ResponseEntity.ok("Commission processed successfully");
            
        } catch (Exception e) {
            log.error("Error processing commission: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to process commission: " + e.getMessage());
        }
    }

    @PostMapping("/admin/payout/{commissionId}")
    @Operation(summary = "Mark commission as paid out (admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> markAsPaidOut(@PathVariable UUID commissionId) {
        try {
            commissionService.markCommissionAsPaid(commissionId);
            return ResponseEntity.ok("Commission marked as paid out");
            
        } catch (Exception e) {
            log.error("Error marking commission as paid: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to mark commission as paid: " + e.getMessage());
        }
    }

    @PostMapping("/admin/bulk-payout")
    @Operation(summary = "Process bulk payout for multiple commissions (admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> processBulkPayout(@RequestBody List<UUID> commissionIds) {
        try {
            int processedCount = commissionService.processBulkPayout(commissionIds);
            return ResponseEntity.ok(String.format("Processed payout for %d commissions", processedCount));
            
        } catch (Exception e) {
            log.error("Error processing bulk payout: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to process bulk payout: " + e.getMessage());
        }
    }

    @GetMapping("/rates")
    @Operation(summary = "Get current commission rates")
    public ResponseEntity<Map<String, BigDecimal>> getCommissionRates() {
        try {
            Map<String, BigDecimal> rates = commissionService.getCommissionRates();
            return ResponseEntity.ok(rates);
            
        } catch (Exception e) {
            log.error("Error fetching commission rates: {}", e.getMessage());
            return ResponseEntity.ok(Map.of());
        }
    }

    @PostMapping("/admin/rates")
    @Operation(summary = "Update commission rates (admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updateCommissionRates(@RequestBody Map<String, BigDecimal> rates) {
        try {
            commissionService.updateCommissionRates(rates);
            return ResponseEntity.ok("Commission rates updated successfully");
            
        } catch (Exception e) {
            log.error("Error updating commission rates: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to update commission rates: " + e.getMessage());
        }
    }

    @GetMapping("/admin/analytics")
    @Operation(summary = "Get commission analytics (admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getCommissionAnalytics(
            @RequestParam(required = false) String period,
            @RequestParam(required = false) String groupBy) {
        
        try {
            Map<String, Object> analytics = commissionService.getCommissionAnalytics(period, groupBy);
            return ResponseEntity.ok(analytics);
            
        } catch (Exception e) {
            log.error("Error fetching commission analytics: {}", e.getMessage());
            return ResponseEntity.ok(Map.of());
        }
    }

    @GetMapping("/host/earnings")
    @Operation(summary = "Get host earnings breakdown")
    @PreAuthorize("hasRole('HOST')")
    public ResponseEntity<Map<String, Object>> getHostEarnings(
            @RequestParam(required = false) String period) {
        
        try {
            ExpaqUserDetails userDetails = (ExpaqUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UUID hostId = userDetails.getId();
            
            Map<String, Object> earnings = commissionService.getHostEarnings(hostId, period);
            return ResponseEntity.ok(earnings);
            
        } catch (Exception e) {
            log.error("Error fetching host earnings: {}", e.getMessage());
            return ResponseEntity.ok(Map.of());
        }
    }

    @PostMapping("/host/withdraw-request")
    @Operation(summary = "Create withdrawal request for host")
    @PreAuthorize("hasRole('HOST')")
    public ResponseEntity<String> createWithdrawalRequest(@RequestBody Map<String, Object> request) {
        try {
            ExpaqUserDetails userDetails = (ExpaqUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UUID hostId = userDetails.getId();
            
            BigDecimal amount = new BigDecimal(request.get("amount").toString());
            String method = request.get("method").toString();
            String details = request.get("details").toString();
            
            commissionService.createWithdrawalRequest(hostId, amount, method, details);
            return ResponseEntity.ok("Withdrawal request created successfully");
            
        } catch (Exception e) {
            log.error("Error creating withdrawal request: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to create withdrawal request: " + e.getMessage());
        }
    }

    @GetMapping("/host/withdrawals")
    @Operation(summary = "Get host withdrawal history")
    @PreAuthorize("hasRole('HOST')")
    public ResponseEntity<List<Map<String, Object>>> getHostWithdrawals() {
        try {
            ExpaqUserDetails userDetails = (ExpaqUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UUID hostId = userDetails.getId();
            
            List<Map<String, Object>> withdrawals = commissionService.getHostWithdrawals(hostId);
            return ResponseEntity.ok(withdrawals);
            
        } catch (Exception e) {
            log.error("Error fetching host withdrawals: {}", e.getMessage());
            return ResponseEntity.ok(List.of());
        }
    }
}