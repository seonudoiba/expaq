package com.abiodun.expaq.controller;

import com.abiodun.expaq.model.ExpaqUserDetails;
import com.abiodun.expaq.model.SupportTicket;
import com.abiodun.expaq.model.SupportTicketMessage;
import com.abiodun.expaq.service.ISupportService;
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
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/support")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Support", description = "Customer support and help desk system")
public class SupportController {
    
    private final ISupportService supportService;
    
    // Public endpoints for creating tickets
    
    @PostMapping("/tickets")
    @Operation(summary = "Create a support ticket")
    public ResponseEntity<Map<String, Object>> createTicket(@RequestBody Map<String, Object> request) {
        try {
            String subject = (String) request.get("subject");
            String description = (String) request.get("description");
            String categoryStr = (String) request.get("category");
            String priorityStr = (String) request.get("priority");
            String relatedBookingIdStr = (String) request.get("relatedBookingId");
            String relatedActivityIdStr = (String) request.get("relatedActivityId");
            
            SupportTicket.TicketCategory category = SupportTicket.TicketCategory.valueOf(categoryStr.toUpperCase());
            SupportTicket.TicketPriority priority = priorityStr != null ? 
                SupportTicket.TicketPriority.valueOf(priorityStr.toUpperCase()) : null;
            
            UUID relatedBookingId = relatedBookingIdStr != null ? UUID.fromString(relatedBookingIdStr) : null;
            UUID relatedActivityId = relatedActivityIdStr != null ? UUID.fromString(relatedActivityIdStr) : null;
            
            SupportTicket ticket;
            
            // Check if user is authenticated
            try {
                ExpaqUserDetails userDetails = (ExpaqUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
                UUID userId = userDetails.getId();
                
                ticket = supportService.createTicket(userId, subject, description, category, priority, 
                                                   relatedBookingId, relatedActivityId);
            } catch (Exception e) {
                // Guest user - create guest ticket
                String customerEmail = (String) request.get("customerEmail");
                String customerName = (String) request.get("customerName");
                
                if (customerEmail == null || customerName == null) {
                    return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Customer email and name are required for guest tickets"
                    ));
                }
                
                ticket = supportService.createGuestTicket(customerEmail, customerName, subject, description, category);
            }
            
            Map<String, Object> response = Map.of(
                "success", true,
                "ticketId", ticket.getId(),
                "ticketNumber", ticket.getTicketNumber(),
                "message", "Support ticket created successfully"
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error creating support ticket: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to create support ticket: " + e.getMessage()
            ));
        }
    }
    
    @GetMapping("/tickets/{ticketNumber}")
    @Operation(summary = "Get ticket by ticket number (public access)")
    public ResponseEntity<Map<String, Object>> getTicketByNumber(@PathVariable String ticketNumber) {
        try {
            SupportTicket ticket = supportService.getTicketByNumber(ticketNumber)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found: " + ticketNumber));
            
            Map<String, Object> response = mapTicketToResponse(ticket);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error fetching ticket: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Ticket not found or access denied"
            ));
        }
    }
    
    // User endpoints
    
    @GetMapping("/my-tickets")
    @Operation(summary = "Get current user's support tickets")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getMyTickets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            ExpaqUserDetails userDetails = (ExpaqUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UUID userId = userDetails.getId();
            
            Pageable pageable = PageRequest.of(page, size);
            Page<SupportTicket> ticketPage = supportService.getUserTickets(userId, pageable);
            
            List<Map<String, Object>> tickets = ticketPage.getContent().stream()
                .map(this::mapTicketToResponse)
                .toList();
            
            Map<String, Object> response = Map.of(
                "tickets", tickets,
                "totalElements", ticketPage.getTotalElements(),
                "totalPages", ticketPage.getTotalPages(),
                "currentPage", page
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error fetching user tickets: {}", e.getMessage());
            return ResponseEntity.ok(Map.of("tickets", List.of(), "totalElements", 0));
        }
    }
    
    @PostMapping("/tickets/{ticketId}/messages")
    @Operation(summary = "Add message to ticket")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> addMessage(
            @PathVariable UUID ticketId,
            @RequestBody Map<String, String> request) {
        try {
            ExpaqUserDetails userDetails = (ExpaqUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UUID userId = userDetails.getId();
            
            String message = request.get("message");
            if (message == null || message.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Message content is required"
                ));
            }
            
            SupportTicketMessage ticketMessage = supportService.addMessage(
                ticketId, userId, message, SupportTicketMessage.MessageType.REPLY, false);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "messageId", ticketMessage.getId(),
                "message", "Message added successfully"
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error adding message to ticket: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to add message: " + e.getMessage()
            ));
        }
    }
    
    @GetMapping("/tickets/{ticketId}/messages")
    @Operation(summary = "Get ticket messages")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Map<String, Object>>> getTicketMessages(@PathVariable UUID ticketId) {
        try {
            List<SupportTicketMessage> messages = supportService.getTicketMessages(ticketId, false);
            
            List<Map<String, Object>> response = messages.stream()
                .map(this::mapMessageToResponse)
                .toList();
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error fetching ticket messages: {}", e.getMessage());
            return ResponseEntity.ok(List.of());
        }
    }
    
    @PostMapping("/tickets/{ticketId}/satisfaction")
    @Operation(summary = "Set customer satisfaction rating")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> setCustomerSatisfaction(
            @PathVariable UUID ticketId,
            @RequestBody Map<String, Object> request) {
        try {
            Integer rating = (Integer) request.get("rating");
            String feedback = (String) request.get("feedback");
            
            if (rating == null || rating < 1 || rating > 5) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Rating must be between 1 and 5"
                ));
            }
            
            supportService.setCustomerSatisfaction(ticketId, rating, feedback);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Satisfaction rating recorded successfully"
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error setting customer satisfaction: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to record satisfaction rating: " + e.getMessage()
            ));
        }
    }
    
    // Admin endpoints
    
    @GetMapping("/admin/tickets")
    @Operation(summary = "Get all support tickets (admin only)")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPPORT_AGENT')")
    public ResponseEntity<Map<String, Object>> getAllTickets(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<SupportTicket> ticketPage;
            
            if (search != null && !search.trim().isEmpty()) {
                ticketPage = supportService.searchTickets(search, pageable);
            } else {
                SupportTicket.TicketStatus ticketStatus = status != null ? 
                    SupportTicket.TicketStatus.valueOf(status.toUpperCase()) : null;
                SupportTicket.TicketPriority ticketPriority = priority != null ? 
                    SupportTicket.TicketPriority.valueOf(priority.toUpperCase()) : null;
                SupportTicket.TicketCategory ticketCategory = category != null ? 
                    SupportTicket.TicketCategory.valueOf(category.toUpperCase()) : null;
                
                ticketPage = supportService.getAllTickets(ticketStatus, ticketPriority, ticketCategory, pageable);
            }
            
            List<Map<String, Object>> tickets = ticketPage.getContent().stream()
                .map(this::mapTicketToResponse)
                .toList();
            
            Map<String, Object> response = Map.of(
                "tickets", tickets,
                "totalElements", ticketPage.getTotalElements(),
                "totalPages", ticketPage.getTotalPages(),
                "currentPage", page
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error fetching all tickets: {}", e.getMessage());
            return ResponseEntity.ok(Map.of("tickets", List.of(), "totalElements", 0));
        }
    }
    
    @PostMapping("/admin/tickets/{ticketId}/assign")
    @Operation(summary = "Assign ticket to agent (admin only)")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPPORT_AGENT')")
    public ResponseEntity<Map<String, Object>> assignTicket(
            @PathVariable UUID ticketId,
            @RequestBody Map<String, String> request) {
        try {
            String agentIdStr = request.get("agentId");
            
            SupportTicket ticket;
            if (agentIdStr != null && !agentIdStr.equals("auto")) {
                UUID agentId = UUID.fromString(agentIdStr);
                ticket = supportService.assignTicket(ticketId, agentId);
            } else {
                ticket = supportService.autoAssignTicket(ticketId);
            }
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Ticket assigned successfully",
                "assignedAgent", ticket.getAssignedAgent() != null ? 
                    ticket.getAssignedAgent().getFirstName() + " " + ticket.getAssignedAgent().getLastName() : "Auto-assigned"
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error assigning ticket: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to assign ticket: " + e.getMessage()
            ));
        }
    }
    
    @PostMapping("/admin/tickets/{ticketId}/status")
    @Operation(summary = "Update ticket status (admin only)")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPPORT_AGENT')")
    public ResponseEntity<Map<String, Object>> updateTicketStatus(
            @PathVariable UUID ticketId,
            @RequestBody Map<String, String> request) {
        try {
            String statusStr = request.get("status");
            SupportTicket.TicketStatus status = SupportTicket.TicketStatus.valueOf(statusStr.toUpperCase());
            
            SupportTicket ticket = supportService.updateTicketStatus(ticketId, status);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Ticket status updated successfully",
                "newStatus", ticket.getStatus()
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error updating ticket status: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to update ticket status: " + e.getMessage()
            ));
        }
    }
    
    @PostMapping("/admin/tickets/{ticketId}/escalate")
    @Operation(summary = "Escalate ticket (admin only)")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPPORT_AGENT')")
    public ResponseEntity<Map<String, Object>> escalateTicket(
            @PathVariable UUID ticketId,
            @RequestBody Map<String, String> request) {
        try {
            String reason = request.get("reason");
            if (reason == null || reason.trim().isEmpty()) {
                reason = "Escalated by support agent";
            }
            
            SupportTicket ticket = supportService.escalateTicket(ticketId, reason);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Ticket escalated successfully",
                "escalationReason", ticket.getEscalationReason()
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error escalating ticket: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to escalate ticket: " + e.getMessage()
            ));
        }
    }
    
    @PostMapping("/admin/tickets/{ticketId}/resolve")
    @Operation(summary = "Resolve ticket (admin only)")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPPORT_AGENT')")
    public ResponseEntity<Map<String, Object>> resolveTicket(
            @PathVariable UUID ticketId,
            @RequestBody Map<String, String> request) {
        try {
            String resolutionNotes = request.get("resolutionNotes");
            if (resolutionNotes == null || resolutionNotes.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Resolution notes are required"
                ));
            }
            
            SupportTicket ticket = supportService.resolveTicket(ticketId, resolutionNotes);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Ticket resolved successfully",
                "resolvedAt", ticket.getResolvedAt()
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error resolving ticket: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to resolve ticket: " + e.getMessage()
            ));
        }
    }
    
    @GetMapping("/admin/analytics")
    @Operation(summary = "Get support analytics (admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getSupportAnalytics() {
        try {
            Map<String, Object> analytics = supportService.getTicketAnalytics();
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            log.error("Error fetching support analytics: {}", e.getMessage());
            return ResponseEntity.ok(Map.of());
        }
    }
    
    @GetMapping("/admin/agent-performance")
    @Operation(summary = "Get agent performance metrics (admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAgentPerformance() {
        try {
            Map<String, Object> performance = supportService.getAgentPerformanceMetrics();
            return ResponseEntity.ok(performance);
        } catch (Exception e) {
            log.error("Error fetching agent performance: {}", e.getMessage());
            return ResponseEntity.ok(Map.of());
        }
    }
    
    @GetMapping("/admin/sla-compliance")
    @Operation(summary = "Get SLA compliance metrics (admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getSLACompliance() {
        try {
            Map<String, Object> sla = supportService.getSLAComplianceMetrics();
            return ResponseEntity.ok(sla);
        } catch (Exception e) {
            log.error("Error fetching SLA compliance: {}", e.getMessage());
            return ResponseEntity.ok(Map.of());
        }
    }
    
    @GetMapping("/admin/queue")
    @Operation(summary = "Get support queue status (admin only)")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPPORT_AGENT')")
    public ResponseEntity<Map<String, Object>> getSupportQueue() {
        try {
            List<SupportTicket> unassigned = supportService.getUnassignedTickets();
            List<SupportTicket> overdue = supportService.getOverdueTickets();
            List<SupportTicket> escalated = supportService.getEscalatedTickets();
            List<SupportTicket> awaitingFirstResponse = supportService.getTicketsAwaitingFirstResponse();
            
            Map<String, Object> queue = Map.of(
                "unassignedTickets", unassigned.size(),
                "overdueTickets", overdue.size(),
                "escalatedTickets", escalated.size(),
                "awaitingFirstResponse", awaitingFirstResponse.size(),
                "unassignedDetails", unassigned.stream().limit(10).map(this::mapTicketToResponse).toList(),
                "overdueDetails", overdue.stream().limit(10).map(this::mapTicketToResponse).toList()
            );
            
            return ResponseEntity.ok(queue);
        } catch (Exception e) {
            log.error("Error fetching support queue: {}", e.getMessage());
            return ResponseEntity.ok(Map.of());
        }
    }
    
    @PostMapping("/admin/tickets/{ticketId}/attachment")
    @Operation(summary = "Add attachment to ticket (admin only)")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPPORT_AGENT')")
    public ResponseEntity<Map<String, Object>> addAttachment(
            @PathVariable UUID ticketId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String messageId) {
        try {
            ExpaqUserDetails userDetails = (ExpaqUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UUID uploadedById = userDetails.getId();
            
            UUID messageUuid = messageId != null ? UUID.fromString(messageId) : null;
            
            supportService.addAttachment(ticketId, messageUuid, uploadedById, file);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Attachment uploaded successfully",
                "filename", file.getOriginalFilename()
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error adding attachment: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to upload attachment: " + e.getMessage()
            ));
        }
    }
    
    // Helper methods
    
    private Map<String, Object> mapTicketToResponse(SupportTicket ticket) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", ticket.getId());
        response.put("ticketNumber", ticket.getTicketNumber());
        response.put("subject", ticket.getSubject());
        response.put("description", ticket.getDescription());
        response.put("category", ticket.getCategory());
        response.put("priority", ticket.getPriority());
        response.put("status", ticket.getStatus());
        response.put("customerEmail", ticket.getCustomerEmail());
        response.put("customerName", ticket.getCustomerName());
        response.put("assignedAgent", ticket.getAssignedAgent() != null ? 
            Map.of("id", ticket.getAssignedAgent().getId(),
                   "name", ticket.getAssignedAgent().getFirstName() + " " + ticket.getAssignedAgent().getLastName()) : null);
        response.put("createdAt", ticket.getCreatedAt());
        response.put("updatedAt", ticket.getUpdatedAt());
        response.put("dueDate", ticket.getDueDate());
        response.put("resolvedAt", ticket.getResolvedAt());
        response.put("isOverdue", ticket.isOverdue());
        response.put("tags", ticket.getTagsArray());
        response.put("customerSatisfactionRating", ticket.getCustomerSatisfactionRating());
        
        return response;
    }
    
    private Map<String, Object> mapMessageToResponse(SupportTicketMessage message) {
        Map<String, Object> response = Map.of(
            "id", message.getId(),
            "message", message.getMessage(),
            "messageType", message.getMessageType(),
            "isInternal", message.getIsInternal(),
            "isAutoGenerated", message.getIsAutoGenerated(),
            "sender", message.getSender() != null ? 
                Map.of("id", message.getSender().getId(),
                       "name", message.getSender().getFirstName() + " " + message.getSender().getLastName(),
                       "isCustomer", message.isFromCustomer()) : null,
            "createdAt", message.getCreatedAt(),
            "readByCustomer", message.getReadByCustomer(),
            "readByAgent", message.getReadByAgent()
        );
        
        return response;
    }
}