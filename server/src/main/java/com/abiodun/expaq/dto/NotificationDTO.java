package com.abiodun.expaq.dto;

import com.abiodun.expaq.model.Notification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private UUID id;
    private String title;
    private String message;
    private boolean isRead;
    private Notification.NotificationType type;
    private String actionUrl;
    private LocalDateTime createdAt;

    public static NotificationDTO fromNotification(Notification notification) {
        return NotificationDTO.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .isRead(notification.isRead())
                .type(notification.getType())
                .actionUrl(notification.getActionUrl())
                .createdAt(notification.getCreatedAt())
                .build();
    }
} 