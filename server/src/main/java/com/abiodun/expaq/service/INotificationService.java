package com.abiodun.expaq.service;

import com.abiodun.expaq.dto.NotificationDTO;
import com.abiodun.expaq.model.NotificationType;
import com.abiodun.expaq.model.SupportTicket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface INotificationService {
    NotificationDTO createNotification(UUID userId, String title, String message, NotificationType type, Object data);
    Page<NotificationDTO> getUserNotifications(UUID userId, Pageable pageable);
    List<NotificationDTO> getUnreadNotifications(UUID userId);
    Long getUnreadNotificationCount(UUID userId);
    void markNotificationAsRead(UUID notificationId, UUID userId);
    void markAllNotificationsAsRead(UUID userId);
    void deleteNotification(UUID notificationId, UUID userId);
    void deleteAllNotifications(UUID userId);
    void updateNotificationPreferences(UUID userId, NotificationType type, boolean enabled);
    void sendSupportTicketConfirmation(String email, SupportTicket ticket);
} 