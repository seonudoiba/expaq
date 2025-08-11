package com.abiodun.expaq.service;

import com.abiodun.expaq.model.SupportTicket;
import com.abiodun.expaq.model.SupportTicketMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

public interface ISupportService {
    
    /**
     * Create a new support ticket
     */
    SupportTicket createTicket(UUID userId, String subject, String description, 
                              SupportTicket.TicketCategory category, 
                              SupportTicket.TicketPriority priority,
                              UUID relatedBookingId, UUID relatedActivityId);
    
    /**
     * Create ticket from guest user (no account)
     */
    SupportTicket createGuestTicket(String customerEmail, String customerName, 
                                   String subject, String description,
                                   SupportTicket.TicketCategory category);
    
    /**
     * Get ticket by ID
     */
    Optional<SupportTicket> getTicketById(UUID ticketId);
    
    /**
     * Get ticket by ticket number
     */
    Optional<SupportTicket> getTicketByNumber(String ticketNumber);
    
    /**
     * Get user's tickets
     */
    Page<SupportTicket> getUserTickets(UUID userId, Pageable pageable);
    
    /**
     * Get assigned tickets for agent
     */
    Page<SupportTicket> getAgentTickets(UUID agentId, Pageable pageable);
    
    /**
     * Get all tickets with filters
     */
    Page<SupportTicket> getAllTickets(SupportTicket.TicketStatus status, 
                                     SupportTicket.TicketPriority priority,
                                     SupportTicket.TicketCategory category,
                                     Pageable pageable);
    
    /**
     * Search tickets
     */
    Page<SupportTicket> searchTickets(String searchTerm, Pageable pageable);
    
    /**
     * Assign ticket to agent
     */
    SupportTicket assignTicket(UUID ticketId, UUID agentId);
    
    /**
     * Auto-assign ticket to available agent
     */
    SupportTicket autoAssignTicket(UUID ticketId);
    
    /**
     * Update ticket status
     */
    SupportTicket updateTicketStatus(UUID ticketId, SupportTicket.TicketStatus status);
    
    /**
     * Update ticket priority
     */
    SupportTicket updateTicketPriority(UUID ticketId, SupportTicket.TicketPriority priority);
    
    /**
     * Escalate ticket
     */
    SupportTicket escalateTicket(UUID ticketId, String reason);
    
    /**
     * Resolve ticket
     */
    SupportTicket resolveTicket(UUID ticketId, String resolutionNotes);
    
    /**
     * Close ticket
     */
    SupportTicket closeTicket(UUID ticketId);
    
    /**
     * Reopen ticket
     */
    SupportTicket reopenTicket(UUID ticketId);
    
    /**
     * Add message to ticket
     */
    SupportTicketMessage addMessage(UUID ticketId, UUID senderId, String message, 
                                   SupportTicketMessage.MessageType messageType, 
                                   boolean isInternal);
    
    /**
     * Add auto-generated message
     */
    SupportTicketMessage addAutoMessage(UUID ticketId, String message, 
                                       SupportTicketMessage.MessageType messageType);
    
    /**
     * Get ticket messages
     */
    List<SupportTicketMessage> getTicketMessages(UUID ticketId, boolean includeInternal);
    
    /**
     * Mark messages as read
     */
    void markMessagesAsRead(UUID ticketId, UUID userId, boolean isCustomer);
    
    /**
     * Add attachment to ticket
     */
    void addAttachment(UUID ticketId, UUID messageId, UUID uploadedById, 
                      MultipartFile file);
    
    /**
     * Get ticket analytics
     */
    Map<String, Object> getTicketAnalytics();
    
    /**
     * Get agent performance metrics
     */
    Map<String, Object> getAgentPerformanceMetrics();
    
    /**
     * Get customer satisfaction metrics
     */
    Map<String, Object> getCustomerSatisfactionMetrics();
    
    /**
     * Get SLA compliance metrics
     */
    Map<String, Object> getSLAComplianceMetrics();
    
    /**
     * Process overdue tickets
     */
    void processOverdueTickets();
    
    /**
     * Send escalation notifications
     */
    void sendEscalationNotifications();
    
    /**
     * Get unassigned tickets
     */
    List<SupportTicket> getUnassignedTickets();
    
    /**
     * Get overdue tickets
     */
    List<SupportTicket> getOverdueTickets();
    
    /**
     * Get escalated tickets
     */
    List<SupportTicket> getEscalatedTickets();
    
    /**
     * Get tickets awaiting first response
     */
    List<SupportTicket> getTicketsAwaitingFirstResponse();
    
    /**
     * Add tags to ticket
     */
    SupportTicket addTicketTags(UUID ticketId, List<String> tags);
    
    /**
     * Remove tags from ticket
     */
    SupportTicket removeTicketTags(UUID ticketId, List<String> tags);
    
    /**
     * Set customer satisfaction
     */
    SupportTicket setCustomerSatisfaction(UUID ticketId, int rating, String feedback);
    
    /**
     * Get common issues / FAQ suggestions
     */
    List<Map<String, Object>> getCommonIssues(SupportTicket.TicketCategory category);
    
    /**
     * Get suggested responses
     */
    List<String> getSuggestedResponses(UUID ticketId);
    
    /**
     * Auto-categorize ticket
     */
    SupportTicket.TicketCategory autoCategorizeTicket(String subject, String description);
    
    /**
     * Auto-prioritize ticket
     */
    SupportTicket.TicketPriority autoPrioritizeTicket(UUID userId, String subject, String description);
    
    /**
     * Send ticket notifications
     */
    void sendTicketNotification(UUID ticketId, String notificationType);
    
    /**
     * Get agent workload
     */
    Map<String, Object> getAgentWorkload(UUID agentId);
    
    /**
     * Get customer history
     */
    List<SupportTicket> getCustomerHistory(UUID customerId);
    
    /**
     * Generate ticket report
     */
    Map<String, Object> generateTicketReport(String period, String groupBy);
    
    /**
     * Export tickets to CSV
     */
    byte[] exportTicketsToCSV(List<UUID> ticketIds);
    
    /**
     * Process ticket webhook
     */
    void processWebhook(String source, Map<String, Object> data);
    
    /**
     * Merge tickets
     */
    SupportTicket mergeTickets(UUID primaryTicketId, List<UUID> secondaryTicketIds);
    
    /**
     * Split ticket
     */
    SupportTicket splitTicket(UUID ticketId, String newSubject, String newDescription);
}