package com.abiodun.expaq.dto;

import com.abiodun.expaq.model.NotificationType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class NotificationDTO {
    private UUID id;
    private UUID userId;
    private String title;
    private String message;
    private NotificationType type;
    private Object data;
    private boolean read;
    private LocalDateTime readAt;
    private LocalDateTime createdAt;
} 