//package com.abiodun.expaq.service;
//
//import com.abiodun.expaq.dto.NotificationDTO;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//
//import java.util.UUID;
//
//public interface NotificationService {
//    NotificationDTO createNotification(UUID userId, String title, String message,
//                                       Notification.NotificationType type, String actionUrl);
//    Page<NotificationDTO> getUserNotifications(UUID userId, Pageable pageable);
//    long getUnreadNotificationCount(UUID userId);
//    void markNotificationAsRead(UUID notificationId);
//    void markAllNotificationsAsRead(UUID userId);
//    void deleteNotification(UUID notificationId);
//    void deleteAllUserNotifications(UUID userId);
//}