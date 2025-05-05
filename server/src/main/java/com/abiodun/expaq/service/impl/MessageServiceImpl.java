package com.abiodun.expaq.service.impl;

import com.abiodun.expaq.dto.MessageDTO;
import com.abiodun.expaq.dto.CreateMessageRequest;
import com.abiodun.expaq.exception.ResourceNotFoundException;
import com.abiodun.expaq.model.Activity;
import com.abiodun.expaq.model.Message;
import com.abiodun.expaq.model.MessageType;
import com.abiodun.expaq.model.User;
import com.abiodun.expaq.repository.ActivityRepository;
import com.abiodun.expaq.repository.MessageRepository;
import com.abiodun.expaq.repository.UserRepository;
import com.abiodun.expaq.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;

    @Override
    @Transactional
    public MessageDTO sendMessage(CreateMessageRequest request, UUID senderId) {
        // Get sender and receiver
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));
        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found"));

        // Create message
        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(request.getContent());
        message.setType(request.getType());
        message.setIsRead(false);
        message.setCreatedAt(LocalDateTime.now());

        // If activity is specified, set it
        if (request.getActivityId() != null) {
            Activity activity = activityRepository.findById(request.getActivityId())
                    .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));
            message.setActivity(activity);
        }

        // Save message
        message = messageRepository.save(message);

        return MessageDTO.fromMessage(message);
    }

    @Override
    @Transactional
    public void markMessageAsRead(UUID messageId, UUID userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found"));

        // Check if user is the receiver
        if (!message.getReceiver().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to mark this message as read");
        }

        message.setIsRead(true);
        message.setReadAt(LocalDateTime.now());
        messageRepository.save(message);
    }

    @Override
    @Transactional
    public void markAllMessagesAsRead(UUID userId, UUID conversationPartnerId) {
        List<Message> unreadMessages = messageRepository.findByReceiverIdAndSenderIdAndIsReadFalse(
            userId, conversationPartnerId);
        
        for (Message message : unreadMessages) {
            message.setIsRead(true);
            message.setReadAt(LocalDateTime.now());
        }
        
        messageRepository.saveAll(unreadMessages);
    }

    @Override
    public List<MessageDTO> getConversation(UUID userId1, UUID userId2, Pageable pageable) {
        return messageRepository.findConversation(userId1, userId2, pageable)
                .stream()
                .map(MessageDTO::fromMessage)
                .collect(Collectors.toList());
    }

    @Override
    public List<MessageDTO> getActivityMessages(UUID activityId, Pageable pageable) {
        return messageRepository.findByActivityId(activityId, pageable)
                .stream()
                .map(MessageDTO::fromMessage)
                .collect(Collectors.toList());
    }

    @Override
    public List<MessageDTO> getUnreadMessages(UUID userId) {
        return messageRepository.findByReceiverIdAndIsReadFalse(userId)
                .stream()
                .map(MessageDTO::fromMessage)
                .collect(Collectors.toList());
    }

    @Override
    public List<MessageDTO> getMessagesByType(MessageType type) {
        return messageRepository.findByType(type)
                .stream()
                .map(MessageDTO::fromMessage)
                .collect(Collectors.toList());
    }

    @Override
    public List<MessageDTO> getRecentMessages(UUID userId, LocalDateTime since) {
        return messageRepository.findRecentMessages(userId, since)
                .stream()
                .map(MessageDTO::fromMessage)
                .collect(Collectors.toList());
    }

    @Override
    public List<MessageDTO> searchMessages(UUID userId, String query) {
        return messageRepository.searchMessages(userId, query)
                .stream()
                .map(MessageDTO::fromMessage)
                .collect(Collectors.toList());
    }

    @Override
    public List<UUID> getConversationParticipants(UUID userId) {
        return messageRepository.findConversationParticipants(userId);
    }

    @Override
    public List<MessageDTO> getLatestMessagesPerConversation(UUID userId) {
        return messageRepository.findLatestMessagesPerConversation(userId)
                .stream()
                .map(MessageDTO::fromMessage)
                .collect(Collectors.toList());
    }

    @Override
    public List<MessageDTO> getMessagesByDateRange(
            UUID userId, LocalDateTime start, LocalDateTime end) {
        return messageRepository.findMessagesByDateRange(userId, start, end)
                .stream()
                .map(MessageDTO::fromMessage)
                .collect(Collectors.toList());
    }

    @Override
    public long countUnreadMessages(UUID userId) {
        return messageRepository.countByReceiverIdAndIsReadFalse(userId);
    }

    @Override
    public long countMessagesInPeriod(UUID userId, LocalDateTime start, LocalDateTime end) {
        return messageRepository.countMessagesInPeriod(userId, start, end);
    }
}
