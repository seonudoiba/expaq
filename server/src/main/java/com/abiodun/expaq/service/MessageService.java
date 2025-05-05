package com.abiodun.expaq.service;

import com.abiodun.expaq.dto.MessageDTO;
import com.abiodun.expaq.dto.CreateMessageRequest;
import com.abiodun.expaq.model.MessageType;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface MessageService {
    MessageDTO sendMessage(CreateMessageRequest request, UUID senderId);
    void markMessageAsRead(UUID messageId, UUID userId);
    void markAllMessagesAsRead(UUID userId, UUID conversationPartnerId);
    List<MessageDTO> getConversation(UUID userId1, UUID userId2, Pageable pageable);
    List<MessageDTO> getActivityMessages(UUID activityId, Pageable pageable);
    List<MessageDTO> getUnreadMessages(UUID userId);
    List<MessageDTO> getMessagesByType(MessageType type);
    List<MessageDTO> getRecentMessages(UUID userId, LocalDateTime since);
    List<MessageDTO> searchMessages(UUID userId, String query);
    List<UUID> getConversationParticipants(UUID userId);
    List<MessageDTO> getLatestMessagesPerConversation(UUID userId);
    List<MessageDTO> getMessagesByDateRange(UUID userId, LocalDateTime start, LocalDateTime end);
    long countUnreadMessages(UUID userId);
    long countMessagesInPeriod(UUID userId, LocalDateTime start, LocalDateTime end);
} 