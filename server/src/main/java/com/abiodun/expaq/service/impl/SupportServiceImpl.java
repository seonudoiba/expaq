package com.abiodun.expaq.service.impl;

import com.abiodun.expaq.model.*;
import com.abiodun.expaq.repository.*;
import com.abiodun.expaq.service.EmailService;
import com.abiodun.expaq.service.INotificationService;
import com.abiodun.expaq.service.ISupportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class SupportServiceImpl implements ISupportService {
    
    private final SupportTicketRepository supportTicketRepository;
    private final SupportTicketMessageRepository messageRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final ActivityRepository activityRepository;
    private final EmailService emailService;
    private final INotificationService notificationService;

    @Override
    public SupportTicket createTicket(UUID userId, String subject, String description,
                                     SupportTicket.TicketCategory category,
                                     SupportTicket.TicketPriority priority,
                                     UUID relatedBookingId, UUID relatedActivityId) {
        log.info("Creating support ticket for user: {}", userId);
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        
        SupportTicket ticket = new SupportTicket();
        ticket.setUser(user);
        ticket.setSubject(subject);
        ticket.setDescription(description);
        ticket.setCategory(category);
        ticket.setPriority(priority != null ? priority : autoPrioritizeTicket(userId, subject, description));
        ticket.setCustomerEmail(user.getEmail());
        ticket.setCustomerName(user.getFirstName() + " " + user.getLastName());
        
        // Set related entities
        if (relatedBookingId != null) {
            bookingRepository.findById(relatedBookingId)
                .ifPresent(ticket::setRelatedBooking);
        }
        
        if (relatedActivityId != null) {
            activityRepository.findById(relatedActivityId)
                .ifPresent(ticket::setRelatedActivity);
        }
        
        ticket = supportTicketRepository.save(ticket);
        
        // Add initial auto-generated message
        addAutoMessage(ticket.getId(), 
            "Thank you for contacting Expaq support. We have received your request and will respond as soon as possible.",
            SupportTicketMessage.MessageType.AUTO_RESPONSE);
        
        // Auto-assign if possible
        try {
            autoAssignTicket(ticket.getId());
        } catch (Exception e) {
            log.warn("Could not auto-assign ticket {}: {}", ticket.getId(), e.getMessage());
        }
        
        // Send notification email
        sendTicketNotification(ticket.getId(), "CREATED");
        
        log.info("Support ticket created: {}", ticket.getTicketNumber());
        return ticket;
    }
    
    @Override
    public SupportTicket createGuestTicket(String customerEmail, String customerName,
                                          String subject, String description,
                                          SupportTicket.TicketCategory category) {
        log.info("Creating guest support ticket for: {}", customerEmail);

        // Validate required fields
        validateGuestTicketInput(customerEmail, customerName, subject, description, category);

        // Create a temporary user for guest tickets
        User guestUser = userRepository.findByEmail(customerEmail)
            .orElseGet(() -> {
                User newGuest = new User();
                newGuest.setEmail(customerEmail.trim().toLowerCase());
                newGuest.setFirstName(customerName.trim());
                newGuest.setActive(false); // Mark as inactive guest user
                newGuest.setLastActive(LocalDateTime.now());
                newGuest.setStatus(User.UserStatus.INACTIVE);
                return userRepository.save(newGuest);
            });

        SupportTicket ticket = new SupportTicket();
        ticket.setUser(guestUser);
        ticket.setSubject(subject.trim());
        ticket.setDescription(description.trim());
        ticket.setCategory(category);
        ticket.setPriority(SupportTicket.TicketPriority.MEDIUM);
        ticket.setCustomerEmail(customerEmail.trim().toLowerCase());
        ticket.setCustomerName(customerName.trim());
        ticket.setStatus(SupportTicket.TicketStatus.OPEN);
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setSource(SupportTicket.TicketSource.WEB);
        ticket.setNeedsFollowUp(true); // Guest tickets need follow up by default

        ticket = supportTicketRepository.save(ticket);
        
        // Add initial auto-generated message
        addAutoMessage(ticket.getId(),
            "Thank you for contacting Expaq support. We have received your request and will respond via email shortly.",
            SupportTicketMessage.MessageType.AUTO_RESPONSE);
        
        // Send confirmation email
        try {
            notificationService.sendSupportTicketConfirmation(customerEmail, ticket);
        } catch (Exception e) {
            log.error("Failed to send support ticket confirmation email: {}", e.getMessage());
        }

        return ticket;
    }

    private void validateGuestTicketInput(String customerEmail, String customerName,
                                        String subject, String description,
                                        SupportTicket.TicketCategory category) {
        if (customerEmail == null || customerEmail.trim().isEmpty()) {
            throw new IllegalArgumentException("Customer email is required");
        }
        if (customerName == null || customerName.trim().isEmpty()) {
            throw new IllegalArgumentException("Customer name is required");
        }
        if (subject == null || subject.trim().isEmpty()) {
            throw new IllegalArgumentException("Ticket subject is required");
        }
        if (description == null || description.trim().isEmpty()) {
            throw new IllegalArgumentException("Ticket description is required");
        }
        if (category == null) {
            throw new IllegalArgumentException("Ticket category is required");
        }
    }

    @Override
    public Optional<SupportTicket> getTicketById(UUID ticketId) {
        return supportTicketRepository.findById(ticketId);
    }
    
    @Override
    public Optional<SupportTicket> getTicketByNumber(String ticketNumber) {
        return supportTicketRepository.findByTicketNumber(ticketNumber);
    }
    
    @Override
    public Page<SupportTicket> getUserTickets(UUID userId, Pageable pageable) {
        return supportTicketRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }
    
    @Override
    public Page<SupportTicket> getAgentTickets(UUID agentId, Pageable pageable) {
        return supportTicketRepository.findByAssignedAgentIdOrderByCreatedAtDesc(agentId, pageable);
    }
    
    @Override
    public Page<SupportTicket> getAllTickets(SupportTicket.TicketStatus status,
                                            SupportTicket.TicketPriority priority,
                                            SupportTicket.TicketCategory category,
                                            Pageable pageable) {
        if (status != null) {
            return supportTicketRepository.findByStatusOrderByCreatedAtDesc(status, pageable);
        } else if (priority != null) {
            return supportTicketRepository.findByPriorityOrderByCreatedAtDesc(priority, pageable);
        } else if (category != null) {
            return supportTicketRepository.findByCategoryOrderByCreatedAtDesc(category, pageable);
        } else {
            return supportTicketRepository.findOpenTickets(pageable);
        }
    }
    
    @Override
    public Page<SupportTicket> searchTickets(String searchTerm, Pageable pageable) {
        return supportTicketRepository.searchTickets(searchTerm, pageable);
    }
    
    @Override
    public SupportTicket assignTicket(UUID ticketId, UUID agentId) {
        log.info("Assigning ticket {} to agent {}", ticketId, agentId);
        
        SupportTicket ticket = getTicketById(ticketId)
            .orElseThrow(() -> new IllegalArgumentException("Ticket not found: " + ticketId));
        
        User agent = userRepository.findById(agentId)
            .orElseThrow(() -> new IllegalArgumentException("Agent not found: " + agentId));
        
        ticket.assignTo(agent);
        ticket = supportTicketRepository.save(ticket);
        
        // Add internal note
        addAutoMessage(ticketId,
            "Ticket assigned to " + agent.getFirstName() + " " + agent.getLastName(),
            SupportTicketMessage.MessageType.STATUS_UPDATE);
        
        // Send notification
        sendTicketNotification(ticketId, "ASSIGNED");
        
        log.info("Ticket {} assigned to agent {}", ticketId, agentId);
        return ticket;
    }
    
    @Override
    public SupportTicket autoAssignTicket(UUID ticketId) {
        log.info("Auto-assigning ticket {}", ticketId);
        
        // Get agent workload distribution
        List<Object[]> workload = supportTicketRepository.getAgentWorkloadDistribution();
        
        if (workload.isEmpty()) {
            log.warn("No agents available for auto-assignment");
            return getTicketById(ticketId).orElse(null);
        }
        
        // Assign to agent with least workload
        Object[] leastBusyAgent = workload.get(0);
        UUID agentId = ((User) leastBusyAgent[0]).getId();
        
        return assignTicket(ticketId, agentId);
    }
    
    @Override
    public SupportTicket updateTicketStatus(UUID ticketId, SupportTicket.TicketStatus status) {
        log.info("Updating ticket {} status to {}", ticketId, status);
        
        SupportTicket ticket = getTicketById(ticketId)
            .orElseThrow(() -> new IllegalArgumentException("Ticket not found: " + ticketId));
        
        SupportTicket.TicketStatus oldStatus = ticket.getStatus();
        ticket.setStatus(status);
        ticket = supportTicketRepository.save(ticket);
        
        // Add status update message
        addAutoMessage(ticketId,
            "Status changed from " + oldStatus.getDisplayName() + " to " + status.getDisplayName(),
            SupportTicketMessage.MessageType.STATUS_UPDATE);
        
        // Send notification
        sendTicketNotification(ticketId, "STATUS_UPDATED");
        
        return ticket;
    }
    
    @Override
    public SupportTicket updateTicketPriority(UUID ticketId, SupportTicket.TicketPriority priority) {
        log.info("Updating ticket {} priority to {}", ticketId, priority);
        
        SupportTicket ticket = getTicketById(ticketId)
            .orElseThrow(() -> new IllegalArgumentException("Ticket not found: " + ticketId));
        
        SupportTicket.TicketPriority oldPriority = ticket.getPriority();
        ticket.setPriority(priority);
        ticket = supportTicketRepository.save(ticket);
        
        // Add priority update message
        addAutoMessage(ticketId,
            "Priority changed from " + oldPriority.getDisplayName() + " to " + priority.getDisplayName(),
            SupportTicketMessage.MessageType.STATUS_UPDATE);
        
        return ticket;
    }
    
    @Override
    public SupportTicket escalateTicket(UUID ticketId, String reason) {
        log.info("Escalating ticket {} with reason: {}", ticketId, reason);
        
        SupportTicket ticket = getTicketById(ticketId)
            .orElseThrow(() -> new IllegalArgumentException("Ticket not found: " + ticketId));
        
        ticket.escalate(reason);
        ticket = supportTicketRepository.save(ticket);
        
        // Add escalation note
        addAutoMessage(ticketId,
            "Ticket escalated. Reason: " + reason,
            SupportTicketMessage.MessageType.ESCALATION_NOTE);
        
        // Send escalation notification
        sendTicketNotification(ticketId, "ESCALATED");
        
        return ticket;
    }
    
    @Override
    public SupportTicket resolveTicket(UUID ticketId, String resolutionNotes) {
        log.info("Resolving ticket {} with notes: {}", ticketId, resolutionNotes);
        
        SupportTicket ticket = getTicketById(ticketId)
            .orElseThrow(() -> new IllegalArgumentException("Ticket not found: " + ticketId));
        
        ticket.resolve(resolutionNotes);
        ticket = supportTicketRepository.save(ticket);
        
        // Add resolution message
        addAutoMessage(ticketId,
            "Ticket resolved. " + resolutionNotes,
            SupportTicketMessage.MessageType.RESOLUTION_NOTE);
        
        // Send resolution notification
        sendTicketNotification(ticketId, "RESOLVED");
        
        return ticket;
    }
    
    @Override
    public SupportTicket closeTicket(UUID ticketId) {
        log.info("Closing ticket {}", ticketId);
        
        SupportTicket ticket = getTicketById(ticketId)
            .orElseThrow(() -> new IllegalArgumentException("Ticket not found: " + ticketId));
        
        ticket.close();
        ticket = supportTicketRepository.save(ticket);
        
        // Add closure message
        addAutoMessage(ticketId,
            "Ticket closed.",
            SupportTicketMessage.MessageType.STATUS_UPDATE);
        
        // Send closure notification
        sendTicketNotification(ticketId, "CLOSED");
        
        return ticket;
    }
    
    @Override
    public SupportTicket reopenTicket(UUID ticketId) {
        log.info("Reopening ticket {}", ticketId);
        
        SupportTicket ticket = getTicketById(ticketId)
            .orElseThrow(() -> new IllegalArgumentException("Ticket not found: " + ticketId));
        
        ticket.reopen();
        ticket = supportTicketRepository.save(ticket);
        
        // Add reopen message
        addAutoMessage(ticketId,
            "Ticket reopened.",
            SupportTicketMessage.MessageType.STATUS_UPDATE);
        
        return ticket;
    }
    
    @Override
    public SupportTicketMessage addMessage(UUID ticketId, UUID senderId, String message,
                                          SupportTicketMessage.MessageType messageType,
                                          boolean isInternal) {
        log.info("Adding message to ticket {} from user {}", ticketId, senderId);
        
        SupportTicket ticket = getTicketById(ticketId)
            .orElseThrow(() -> new IllegalArgumentException("Ticket not found: " + ticketId));
        
        User sender = userRepository.findById(senderId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + senderId));
        
        SupportTicketMessage ticketMessage = new SupportTicketMessage();
        ticketMessage.setSupportTicket(ticket);
        ticketMessage.setSender(sender);
        ticketMessage.setMessage(message);
        ticketMessage.setMessageType(messageType);
        ticketMessage.setIsInternal(isInternal);
        
        ticketMessage = messageRepository.save(ticketMessage);
        
        // Mark first response time if this is the first agent response
        if (ticket.getFirstResponseAt() == null && !ticketMessage.isFromCustomer()) {
            ticket.markFirstResponse();
            supportTicketRepository.save(ticket);
        }
        
        // Send notification for new message
        sendTicketNotification(ticketId, "NEW_MESSAGE");
        
        return ticketMessage;
    }
    
    @Override
    public SupportTicketMessage addAutoMessage(UUID ticketId, String message,
                                              SupportTicketMessage.MessageType messageType) {
        SupportTicket ticket = getTicketById(ticketId)
            .orElseThrow(() -> new IllegalArgumentException("Ticket not found: " + ticketId));
        
        SupportTicketMessage autoMessage = new SupportTicketMessage();
        autoMessage.setSupportTicket(ticket);
        autoMessage.setMessage(message);
        autoMessage.setMessageType(messageType);
        autoMessage.setIsAutoGenerated(true);
        autoMessage.setIsInternal(messageType == SupportTicketMessage.MessageType.INTERNAL_NOTE);
        
        // Set system user as sender (you might want to create a system user)
        // For now, we'll leave sender as null for auto-generated messages
        
        return messageRepository.save(autoMessage);
    }
    
    @Override
    public List<SupportTicketMessage> getTicketMessages(UUID ticketId, boolean includeInternal) {
        if (includeInternal) {
            return messageRepository.findBySupportTicketIdOrderByCreatedAtAsc(ticketId);
        } else {
            return messageRepository.findVisibleMessagesByTicketId(ticketId);
        }
    }
    
    @Override
    public void markMessagesAsRead(UUID ticketId, UUID userId, boolean isCustomer) {
        List<SupportTicketMessage> unreadMessages;
        
        if (isCustomer) {
            unreadMessages = messageRepository.findUnreadCustomerMessages(ticketId, userId);
        } else {
            SupportTicket ticket = getTicketById(ticketId).orElse(null);
            if (ticket == null) return;
            unreadMessages = messageRepository.findUnreadAgentMessages(ticketId, ticket.getUser().getId());
        }
        
        for (SupportTicketMessage message : unreadMessages) {
            message.markAsRead(isCustomer);
            messageRepository.save(message);
        }
    }
    
    @Override
    public void addAttachment(UUID ticketId, UUID messageId, UUID uploadedById, MultipartFile file) {
        // Implementation for file attachment would go here
        // This would involve storing the file and creating a SupportTicketAttachment record
        log.info("Adding attachment to ticket {}: {}", ticketId, file.getOriginalFilename());
    }
    
    @Override
    public Map<String, Object> getTicketAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        // Basic counts
        analytics.put("totalTickets", supportTicketRepository.count());
        analytics.put("openTickets", supportTicketRepository.countByStatus(SupportTicket.TicketStatus.OPEN));
        analytics.put("inProgressTickets", supportTicketRepository.countByStatus(SupportTicket.TicketStatus.IN_PROGRESS));
        analytics.put("resolvedTickets", supportTicketRepository.countByStatus(SupportTicket.TicketStatus.RESOLVED));
        analytics.put("closedTickets", supportTicketRepository.countByStatus(SupportTicket.TicketStatus.CLOSED));
        
        // Category distribution
        List<Object[]> categoryData = supportTicketRepository.getTicketCountByCategory();
        Map<String, Long> categoryDistribution = categoryData.stream()
            .collect(Collectors.toMap(
                arr -> arr[0].toString(),
                arr -> (Long) arr[1]
            ));
        analytics.put("categoryDistribution", categoryDistribution);
        
        // Priority distribution
        List<Object[]> priorityData = supportTicketRepository.getTicketCountByPriority();
        Map<String, Long> priorityDistribution = priorityData.stream()
            .collect(Collectors.toMap(
                arr -> arr[0].toString(),
                arr -> (Long) arr[1]
            ));
        analytics.put("priorityDistribution", priorityDistribution);
        
        // Performance metrics
        analytics.put("averageFirstResponseTimeHours", supportTicketRepository.getAverageFirstResponseTimeHours());
        analytics.put("averageResolutionTimeHours", supportTicketRepository.getAverageResolutionTimeHours());
        analytics.put("averageCustomerSatisfactionRating", supportTicketRepository.getAverageCustomerSatisfactionRating());
        
        return analytics;
    }
    
    @Override
    public Map<String, Object> getAgentPerformanceMetrics() {
        List<Object[]> performanceData = supportTicketRepository.getAgentPerformanceMetrics();
        
        Map<String, Object> metrics = new HashMap<>();
        List<Map<String, Object>> agentMetrics = new ArrayList<>();
        
        for (Object[] data : performanceData) {
            Map<String, Object> agentData = new HashMap<>();
            agentData.put("agent", data[0]);
            agentData.put("ticketCount", data[1]);
            agentData.put("avgFirstResponseTime", data[2]);
            agentData.put("avgResolutionTime", data[3]);
            agentData.put("avgSatisfactionRating", data[4]);
            agentMetrics.add(agentData);
        }
        
        metrics.put("agentMetrics", agentMetrics);
        return metrics;
    }
    
    @Override
    public Map<String, Object> getCustomerSatisfactionMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        
        Double avgRating = supportTicketRepository.getAverageCustomerSatisfactionRating();
        metrics.put("averageRating", avgRating != null ? avgRating : 0.0);
        
        // Low satisfaction tickets
        List<SupportTicket> lowSatisfactionTickets = supportTicketRepository.findTicketsWithLowSatisfaction(3);
        metrics.put("lowSatisfactionTickets", lowSatisfactionTickets.size());
        
        return metrics;
    }
    
    @Override
    public Map<String, Object> getSLAComplianceMetrics() {
        List<Object[]> slaData = supportTicketRepository.getSLAComplianceMetrics();
        
        Map<String, Object> metrics = new HashMap<>();
        
        if (!slaData.isEmpty()) {
            Object[] data = slaData.get(0);
            long onTimeFirstResponse = (Long) data[0];
            long totalWithFirstResponse = (Long) data[1];
            long onTimeResolution = (Long) data[2];
            long totalResolved = (Long) data[3];
            
            double firstResponseSLA = totalWithFirstResponse > 0 ? 
                (double) onTimeFirstResponse / totalWithFirstResponse * 100 : 0.0;
            double resolutionSLA = totalResolved > 0 ? 
                (double) onTimeResolution / totalResolved * 100 : 0.0;
            
            metrics.put("firstResponseSLAPercentage", firstResponseSLA);
            metrics.put("resolutionSLAPercentage", resolutionSLA);
            metrics.put("onTimeFirstResponse", onTimeFirstResponse);
            metrics.put("totalWithFirstResponse", totalWithFirstResponse);
            metrics.put("onTimeResolution", onTimeResolution);
            metrics.put("totalResolved", totalResolved);
        }
        
        return metrics;
    }
    
    @Override
    public void processOverdueTickets() {
        log.info("Processing overdue tickets");
        
        List<SupportTicket> overdueTickets = supportTicketRepository.findOverdueTickets(LocalDateTime.now());
        
        for (SupportTicket ticket : overdueTickets) {
            // Escalate if not already escalated
            if (ticket.getStatus() != SupportTicket.TicketStatus.ESCALATED) {
                escalateTicket(ticket.getId(), "Ticket overdue - automated escalation");
            }
        }
        
        log.info("Processed {} overdue tickets", overdueTickets.size());
    }
    
    @Override
    public void sendEscalationNotifications() {
        List<SupportTicket> escalatedTickets = getEscalatedTickets();
        
        for (SupportTicket ticket : escalatedTickets) {
            sendTicketNotification(ticket.getId(), "ESCALATION_REMINDER");
        }
    }
    
    @Override
    public List<SupportTicket> getUnassignedTickets() {
        return supportTicketRepository.findUnassignedTickets();
    }
    
    @Override
    public List<SupportTicket> getOverdueTickets() {
        return supportTicketRepository.findOverdueTickets(LocalDateTime.now());
    }
    
    @Override
    public List<SupportTicket> getEscalatedTickets() {
        return supportTicketRepository.findEscalatedTickets();
    }
    
    @Override
    public List<SupportTicket> getTicketsAwaitingFirstResponse() {
        return supportTicketRepository.findTicketsAwaitingFirstResponse();
    }
    
    @Override
    public SupportTicket addTicketTags(UUID ticketId, List<String> tags) {
        SupportTicket ticket = getTicketById(ticketId)
            .orElseThrow(() -> new IllegalArgumentException("Ticket not found: " + ticketId));
        
        for (String tag : tags) {
            ticket.addTag(tag);
        }
        
        return supportTicketRepository.save(ticket);
    }
    
    @Override
    public SupportTicket removeTicketTags(UUID ticketId, List<String> tags) {
        SupportTicket ticket = getTicketById(ticketId)
            .orElseThrow(() -> new IllegalArgumentException("Ticket not found: " + ticketId));
        
        for (String tag : tags) {
            ticket.removeTag(tag);
        }
        
        return supportTicketRepository.save(ticket);
    }
    
    @Override
    public SupportTicket setCustomerSatisfaction(UUID ticketId, int rating, String feedback) {
        SupportTicket ticket = getTicketById(ticketId)
            .orElseThrow(() -> new IllegalArgumentException("Ticket not found: " + ticketId));
        
        ticket.setCustomerSatisfaction(rating, feedback);
        ticket = supportTicketRepository.save(ticket);
        
        // Add feedback message
        addAutoMessage(ticketId,
            "Customer satisfaction rating: " + rating + "/5. Feedback: " + feedback,
            SupportTicketMessage.MessageType.CUSTOMER_FEEDBACK);
        
        return ticket;
    }
    
    @Override
    public List<Map<String, Object>> getCommonIssues(SupportTicket.TicketCategory category) {
        // This would typically query a knowledge base
        // For now, return static common issues
        List<Map<String, Object>> commonIssues = new ArrayList<>();
        
        Map<String, Object> issue1 = new HashMap<>();
        issue1.put("title", "How to cancel a booking");
        issue1.put("description", "Steps to cancel your booking and refund policy");
        issue1.put("category", category.name());
        commonIssues.add(issue1);
        
        return commonIssues;
    }
    
    @Override
    public List<String> getSuggestedResponses(UUID ticketId) {
        // This would use AI/ML to suggest responses based on ticket content
        // For now, return static suggestions
        return List.of(
            "Thank you for contacting us. We're looking into this issue.",
            "I understand your concern and will escalate this to our technical team.",
            "Your refund has been processed and should appear in 3-5 business days."
        );
    }
    
    @Override
    public SupportTicket.TicketCategory autoCategorizeTicket(String subject, String description) {
        // Simple keyword-based categorization
        String content = (subject + " " + description).toLowerCase();
        
        if (content.contains("payment") || content.contains("refund") || content.contains("charge")) {
            return SupportTicket.TicketCategory.PAYMENT_PROBLEM;
        } else if (content.contains("booking") || content.contains("reservation")) {
            return SupportTicket.TicketCategory.BOOKING_ISSUE;
        } else if (content.contains("bug") || content.contains("error") || content.contains("broken")) {
            return SupportTicket.TicketCategory.BUG_REPORT;
        } else if (content.contains("account") || content.contains("login") || content.contains("password")) {
            return SupportTicket.TicketCategory.ACCOUNT_ISSUE;
        } else {
            return SupportTicket.TicketCategory.GENERAL_INQUIRY;
        }
    }
    
    @Override
    public SupportTicket.TicketPriority autoPrioritizeTicket(UUID userId, String subject, String description) {
        String content = (subject + " " + description).toLowerCase();
        
        // Check if user is premium
        User user = userRepository.findById(userId).orElse(null);
        boolean isPremiumUser = user != null && 
            user.getRoles().stream().anyMatch(role -> 
                role.getName().contains("PREMIUM") || role.getName().contains("ENTERPRISE"));
        
        // High priority keywords
        if (content.contains("urgent") || content.contains("critical") || content.contains("emergency")) {
            return SupportTicket.TicketPriority.HIGH;
        }
        
        // Payment/refund issues are medium-high priority
        if (content.contains("payment") || content.contains("refund") || content.contains("charge")) {
            return isPremiumUser ? SupportTicket.TicketPriority.HIGH : SupportTicket.TicketPriority.MEDIUM;
        }
        
        // Premium users get higher priority
        if (isPremiumUser) {
            return SupportTicket.TicketPriority.MEDIUM;
        }
        
        return SupportTicket.TicketPriority.LOW;
    }
    
    @Override
    public void sendTicketNotification(UUID ticketId, String notificationType) {
        SupportTicket ticket = getTicketById(ticketId).orElse(null);
        if (ticket == null) return;
        
        try {
            switch (notificationType) {
                case "CREATED":
                    emailService.sendTicketCreatedEmail(ticket.getCustomerEmail(), ticket);
                    break;
                case "ASSIGNED":
                    emailService.sendTicketAssignedEmail(ticket.getCustomerEmail(), ticket);
                    break;
                case "STATUS_UPDATED":
                    emailService.sendTicketStatusUpdateEmail(ticket.getCustomerEmail(), ticket);
                    break;
                case "NEW_MESSAGE":
                    emailService.sendTicketNewMessageEmail(ticket.getCustomerEmail(), ticket);
                    break;
                case "RESOLVED":
                    emailService.sendTicketResolvedEmail(ticket.getCustomerEmail(), ticket);
                    break;
                case "CLOSED":
                    emailService.sendTicketClosedEmail(ticket.getCustomerEmail(), ticket);
                    break;
            }
        } catch (Exception e) {
            log.error("Failed to send ticket notification: {}", e.getMessage());
        }
    }
    
    @Override
    public Map<String, Object> getAgentWorkload(UUID agentId) {
        Map<String, Object> workload = new HashMap<>();
        
        long activeTickets = supportTicketRepository.findByAssignedAgentIdOrderByCreatedAtDesc(agentId, 
            PageRequest.of(0, Integer.MAX_VALUE)).getTotalElements();
        
        workload.put("activeTickets", activeTickets);
        return workload;
    }
    
    @Override
    public List<SupportTicket> getCustomerHistory(UUID customerId) {
        Pageable pageable = PageRequest.of(0, 50); // Last 50 tickets
        return supportTicketRepository.findCustomerHistory(customerId, pageable);
    }
    
    @Override
    public Map<String, Object> generateTicketReport(String period, String groupBy) {
        LocalDateTime startDate;
        switch (period.toLowerCase()) {
            case "week":
                startDate = LocalDateTime.now().minus(1, ChronoUnit.WEEKS);
                break;
            case "year":
                startDate = LocalDateTime.now().minus(1, ChronoUnit.YEARS);
                break;
            default:
                startDate = LocalDateTime.now().minus(1, ChronoUnit.MONTHS);
                break;
        }
        
        Map<String, Object> report = new HashMap<>();
        
        List<Object[]> monthlyTrends = supportTicketRepository.getMonthlyTicketTrends(startDate);
        report.put("trends", monthlyTrends);
        
        return report;
    }
    
    @Override
    public byte[] exportTicketsToCSV(List<UUID> ticketIds) {
        // Implementation for CSV export would go here
        return new byte[0];
    }
    
    @Override
    public void processWebhook(String source, Map<String, Object> data) {
        // Implementation for webhook processing would go here
        log.info("Processing webhook from {}: {}", source, data);
    }
    
    @Override
    public SupportTicket mergeTickets(UUID primaryTicketId, List<UUID> secondaryTicketIds) {
        // Implementation for ticket merging would go here
        log.info("Merging tickets: primary={}, secondary={}", primaryTicketId, secondaryTicketIds);
        return getTicketById(primaryTicketId).orElse(null);
    }
    
    @Override
    public SupportTicket splitTicket(UUID ticketId, String newSubject, String newDescription) {
        // Implementation for ticket splitting would go here
        log.info("Splitting ticket {} into new ticket with subject: {}", ticketId, newSubject);
        return getTicketById(ticketId).orElse(null);
    }
}
