package com.abiodun.expaq.service.impl;

import com.abiodun.expaq.dto.NotificationDTO;
import com.abiodun.expaq.model.Notification;
import com.abiodun.expaq.model.NotificationType;
import com.abiodun.expaq.model.User;
import com.abiodun.expaq.repository.NotificationRepository;
import com.abiodun.expaq.repository.UserRepository;
import com.abiodun.expaq.service.INotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements INotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional
    public NotificationDTO createNotification(UUID userId, String title, String message, NotificationType type, Object data) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setData(data);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        Notification savedNotification = notificationRepository.save(notification);
        NotificationDTO notificationDTO = convertToDTO(savedNotification);

        // Send real-time notification
        messagingTemplate.convertAndSendToUser(
            userId.toString(),
            "/queue/notifications",
            notificationDTO
        );

        return notificationDTO;
    }

    @Override
    public Page<NotificationDTO> getUserNotifications(UUID userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::convertToDTO);
    }

    @Override
    public List<NotificationDTO> getUnreadNotifications(UUID userId) {
        return notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Long getUnreadNotificationCount(UUID userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    @Override
    @Transactional
    public void markNotificationAsRead(UUID notificationId, UUID userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to mark this notification as read");
        }

        notification.setRead(true);
        notification.setReadAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void markAllNotificationsAsRead(UUID userId) {
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndReadFalse(userId);
        unreadNotifications.forEach(notification -> {
            notification.setRead(true);
            notification.setReadAt(LocalDateTime.now());
        });
        notificationRepository.saveAll(unreadNotifications);
    }

    @Override
    @Transactional
    public void deleteNotification(UUID notificationId, UUID userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this notification");
        }

        notificationRepository.delete(notification);
    }

    @Override
    @Transactional
    public void deleteAllNotifications(UUID userId) {
        notificationRepository.deleteByUserId(userId);
    }

    @Override
    public void updateNotificationPreferences(UUID userId, NotificationType type, boolean enabled) {
        // Implement notification preferences update logic
        // This could involve updating user preferences in a separate table
    }

    private NotificationDTO convertToDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setUserId(notification.getUser().getId());
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setType(notification.getType());
        dto.setData(notification.getData());
        dto.setRead(notification.isRead());
        dto.setReadAt(notification.getReadAt());
        dto.setCreatedAt(notification.getCreatedAt());
        return dto;
    }
} 