package com.abiodun.expaq.repository;

import com.abiodun.expaq.model.Message;
import com.abiodun.expaq.model.MessageType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {
    List<Message> findByReceiverIdAndSenderIdAndIsReadFalse(UUID receiverId, UUID senderId);
    
    @Query("SELECT m FROM Message m WHERE (m.sender.id = :userId1 AND m.receiver.id = :userId2) OR (m.sender.id = :userId2 AND m.receiver.id = :userId1) ORDER BY m.createdAt DESC")
    List<Message> findConversation(@Param("userId1") UUID userId1, @Param("userId2") UUID userId2, Pageable pageable);
    
    List<Message> findByActivityId(UUID activityId, Pageable pageable);
    
    List<Message> findByReceiverIdAndIsReadFalse(UUID receiverId);
    
    List<Message> findByType(MessageType type);
    
    @Query("SELECT m FROM Message m WHERE m.receiver.id = :userId AND m.createdAt > :since ORDER BY m.createdAt DESC")
    List<Message> findRecentMessages(@Param("userId") UUID userId, @Param("since") LocalDateTime since);
    
    @Query("SELECT m FROM Message m WHERE m.receiver.id = :userId AND LOWER(m.content) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY m.createdAt DESC")
    List<Message> searchMessages(@Param("userId") UUID userId, @Param("query") String query);
    
    @Query("SELECT DISTINCT CASE WHEN m.sender.id = :userId THEN m.receiver.id ELSE m.sender.id END FROM Message m WHERE m.sender.id = :userId OR m.receiver.id = :userId")
    List<UUID> findConversationParticipants(@Param("userId") UUID userId);
    
    @Query("SELECT m FROM Message m WHERE m.id IN (SELECT MAX(m2.id) FROM Message m2 WHERE (m2.sender.id = :userId OR m2.receiver.id = :userId) GROUP BY CASE WHEN m2.sender.id = :userId THEN m2.receiver.id ELSE m2.sender.id END) ORDER BY m.createdAt DESC")
    List<Message> findLatestMessagesPerConversation(@Param("userId") UUID userId);
    
    @Query("SELECT m FROM Message m WHERE m.receiver.id = :userId AND m.createdAt BETWEEN :start AND :end ORDER BY m.createdAt DESC")
    List<Message> findMessagesByDateRange(@Param("userId") UUID userId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    long countByReceiverIdAndIsReadFalse(UUID receiverId);
    
    @Query("SELECT COUNT(m) FROM Message m WHERE m.receiver.id = :userId AND m.createdAt BETWEEN :start AND :end")
    long countMessagesInPeriod(@Param("userId") UUID userId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
