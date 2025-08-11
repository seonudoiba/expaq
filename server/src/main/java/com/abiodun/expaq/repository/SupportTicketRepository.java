package com.abiodun.expaq.repository;

import com.abiodun.expaq.model.SupportTicket;
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
public interface SupportTicketRepository extends JpaRepository<SupportTicket, UUID> {
    
    // Find by ticket number
    Optional<SupportTicket> findByTicketNumber(String ticketNumber);
    
    // Find tickets by user
    Page<SupportTicket> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);
    
    // Find tickets by assigned agent
    Page<SupportTicket> findByAssignedAgentIdOrderByCreatedAtDesc(UUID agentId, Pageable pageable);
    
    // Find tickets by status
    Page<SupportTicket> findByStatusOrderByCreatedAtDesc(SupportTicket.TicketStatus status, Pageable pageable);
    
    // Find tickets by priority
    Page<SupportTicket> findByPriorityOrderByCreatedAtDesc(SupportTicket.TicketPriority priority, Pageable pageable);
    
    // Find tickets by category
    Page<SupportTicket> findByCategoryOrderByCreatedAtDesc(SupportTicket.TicketCategory category, Pageable pageable);
    
    // Find open tickets
    @Query("SELECT t FROM SupportTicket t WHERE t.status IN ('OPEN', 'IN_PROGRESS', 'PENDING_CUSTOMER', 'PENDING_INTERNAL', 'ESCALATED') ORDER BY t.priority DESC, t.createdAt ASC")
    Page<SupportTicket> findOpenTickets(Pageable pageable);
    
    // Find unassigned tickets
    @Query("SELECT t FROM SupportTicket t WHERE t.assignedAgent IS NULL AND t.status = 'OPEN' ORDER BY t.priority DESC, t.createdAt ASC")
    List<SupportTicket> findUnassignedTickets();
    
    // Find overdue tickets
    @Query("SELECT t FROM SupportTicket t WHERE t.dueDate < :now AND t.status IN ('OPEN', 'IN_PROGRESS', 'PENDING_CUSTOMER', 'PENDING_INTERNAL') ORDER BY t.dueDate ASC")
    List<SupportTicket> findOverdueTickets(@Param("now") LocalDateTime now);
    
    // Find escalated tickets
    @Query("SELECT t FROM SupportTicket t WHERE t.status = 'ESCALATED' ORDER BY t.escalatedAt ASC")
    List<SupportTicket> findEscalatedTickets();
    
    // Find tickets requiring first response
    @Query("SELECT t FROM SupportTicket t WHERE t.firstResponseAt IS NULL AND t.status != 'CLOSED' ORDER BY t.priority DESC, t.createdAt ASC")
    List<SupportTicket> findTicketsAwaitingFirstResponse();
    
    // Find tickets by date range
    @Query("SELECT t FROM SupportTicket t WHERE t.createdAt >= :startDate AND t.createdAt <= :endDate ORDER BY t.createdAt DESC")
    List<SupportTicket> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Analytics queries
    @Query("SELECT COUNT(t) FROM SupportTicket t WHERE t.status = :status")
    long countByStatus(@Param("status") SupportTicket.TicketStatus status);
    
    @Query("SELECT t.category, COUNT(t) FROM SupportTicket t GROUP BY t.category")
    List<Object[]> getTicketCountByCategory();
    
    @Query("SELECT t.priority, COUNT(t) FROM SupportTicket t GROUP BY t.priority")
    List<Object[]> getTicketCountByPriority();
    
    @Query("SELECT t.status, COUNT(t) FROM SupportTicket t GROUP BY t.status")
    List<Object[]> getTicketCountByStatus();
    
    @Query("SELECT AVG(TIMESTAMPDIFF(HOUR, t.createdAt, t.firstResponseAt)) FROM SupportTicket t WHERE t.firstResponseAt IS NOT NULL")
    Double getAverageFirstResponseTimeHours();
    
    @Query("SELECT AVG(TIMESTAMPDIFF(HOUR, t.createdAt, t.resolvedAt)) FROM SupportTicket t WHERE t.resolvedAt IS NOT NULL")
    Double getAverageResolutionTimeHours();
    
    @Query("SELECT AVG(t.customerSatisfactionRating) FROM SupportTicket t WHERE t.customerSatisfactionRating IS NOT NULL")
    Double getAverageCustomerSatisfactionRating();
    
    // Monthly ticket trends
    @Query("SELECT FUNCTION('YEAR', t.createdAt) as year, FUNCTION('MONTH', t.createdAt) as month, COUNT(t) as count " +
           "FROM SupportTicket t " +
           "WHERE t.createdAt >= :startDate " +
           "GROUP BY FUNCTION('YEAR', t.createdAt), FUNCTION('MONTH', t.createdAt) " +
           "ORDER BY year DESC, month DESC")
    List<Object[]> getMonthlyTicketTrends(@Param("startDate") LocalDateTime startDate);
    
    // Agent performance metrics
    @Query("SELECT t.assignedAgent, COUNT(t) as ticketCount, " +
           "AVG(TIMESTAMPDIFF(HOUR, t.createdAt, t.firstResponseAt)) as avgFirstResponseTime, " +
           "AVG(TIMESTAMPDIFF(HOUR, t.createdAt, t.resolvedAt)) as avgResolutionTime, " +
           "AVG(t.customerSatisfactionRating) as avgSatisfactionRating " +
           "FROM SupportTicket t " +
           "WHERE t.assignedAgent IS NOT NULL " +
           "GROUP BY t.assignedAgent")
    List<Object[]> getAgentPerformanceMetrics();
    
    // Customer metrics
    @Query("SELECT t.user, COUNT(t) as ticketCount, " +
           "AVG(t.customerSatisfactionRating) as avgSatisfactionRating, " +
           "MAX(t.createdAt) as lastTicketDate " +
           "FROM SupportTicket t " +
           "GROUP BY t.user " +
           "ORDER BY ticketCount DESC")
    List<Object[]> getCustomerMetrics(Pageable pageable);
    
    // Resolution statistics
    @Query("SELECT " +
           "COUNT(CASE WHEN t.status = 'RESOLVED' THEN 1 END) as resolvedCount, " +
           "COUNT(CASE WHEN t.status = 'CLOSED' THEN 1 END) as closedCount, " +
           "COUNT(CASE WHEN t.status IN ('OPEN', 'IN_PROGRESS') THEN 1 END) as activeCount, " +
           "COUNT(CASE WHEN t.dueDate < :now AND t.status NOT IN ('RESOLVED', 'CLOSED') THEN 1 END) as overdueCount " +
           "FROM SupportTicket t")
    List<Object[]> getResolutionStatistics(@Param("now") LocalDateTime now);
    
    // Priority distribution over time
    @Query("SELECT FUNCTION('DATE', t.createdAt) as date, t.priority, COUNT(t) as count " +
           "FROM SupportTicket t " +
           "WHERE t.createdAt >= :startDate " +
           "GROUP BY FUNCTION('DATE', t.createdAt), t.priority " +
           "ORDER BY date DESC")
    List<Object[]> getPriorityDistributionOverTime(@Param("startDate") LocalDateTime startDate);
    
    // Search tickets
    @Query("SELECT t FROM SupportTicket t WHERE " +
           "LOWER(t.subject) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(t.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(t.ticketNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(t.customerEmail) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "ORDER BY t.createdAt DESC")
    Page<SupportTicket> searchTickets(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    // Find tickets by tags
    @Query("SELECT t FROM SupportTicket t WHERE t.tags LIKE CONCAT('%', :tag, '%') ORDER BY t.createdAt DESC")
    List<SupportTicket> findByTag(@Param("tag") String tag);
    
    // Find tickets with satisfaction rating below threshold
    @Query("SELECT t FROM SupportTicket t WHERE t.customerSatisfactionRating IS NOT NULL AND t.customerSatisfactionRating <= :threshold ORDER BY t.customerSatisfactionRating ASC")
    List<SupportTicket> findTicketsWithLowSatisfaction(@Param("threshold") Integer threshold);
    
    // Find tickets without first response within SLA
    @Query("SELECT t FROM SupportTicket t WHERE t.firstResponseAt IS NULL AND t.dueDate < :now ORDER BY t.createdAt ASC")
    List<SupportTicket> findTicketsBreachingFirstResponseSLA(@Param("now") LocalDateTime now);
    
    // Find tickets without resolution within SLA
    @Query("SELECT t FROM SupportTicket t WHERE t.resolvedAt IS NULL AND t.dueDate < :now AND t.status != 'PENDING_CUSTOMER' ORDER BY t.createdAt ASC")
    List<SupportTicket> findTicketsBreachingResolutionSLA(@Param("now") LocalDateTime now);
    
    // Workload distribution
    @Query("SELECT t.assignedAgent, COUNT(t) as activeTickets " +
           "FROM SupportTicket t " +
           "WHERE t.assignedAgent IS NOT NULL AND t.status IN ('OPEN', 'IN_PROGRESS', 'PENDING_INTERNAL') " +
           "GROUP BY t.assignedAgent " +
           "ORDER BY activeTickets ASC")
    List<Object[]> getAgentWorkloadDistribution();
    
    // Recent activity
    @Query("SELECT t FROM SupportTicket t WHERE t.updatedAt >= :since ORDER BY t.updatedAt DESC")
    List<SupportTicket> findRecentActivity(@Param("since") LocalDateTime since, Pageable pageable);
    
    // Tickets by related entities
    List<SupportTicket> findByRelatedBookingId(UUID bookingId);
    List<SupportTicket> findByRelatedActivityId(UUID activityId);
    
    // Customer history
    @Query("SELECT t FROM SupportTicket t WHERE t.user.id = :userId ORDER BY t.createdAt DESC")
    List<SupportTicket> findCustomerHistory(@Param("userId") UUID userId, Pageable pageable);
    
    // Escalation patterns
    @Query("SELECT t.category, COUNT(t) as escalationCount " +
           "FROM SupportTicket t " +
           "WHERE t.status = 'ESCALATED' " +
           "GROUP BY t.category " +
           "ORDER BY escalationCount DESC")
    List<Object[]> getEscalationPatternsByCategory();
    
    // SLA compliance
    @Query("SELECT " +
           "COUNT(CASE WHEN t.firstResponseAt IS NOT NULL AND t.firstResponseAt <= t.dueDate THEN 1 END) as onTimeFirstResponse, " +
           "COUNT(CASE WHEN t.firstResponseAt IS NOT NULL THEN 1 END) as totalWithFirstResponse, " +
           "COUNT(CASE WHEN t.resolvedAt IS NOT NULL AND t.resolvedAt <= t.dueDate THEN 1 END) as onTimeResolution, " +
           "COUNT(CASE WHEN t.resolvedAt IS NOT NULL THEN 1 END) as totalResolved " +
           "FROM SupportTicket t")
    List<Object[]> getSLAComplianceMetrics();
}