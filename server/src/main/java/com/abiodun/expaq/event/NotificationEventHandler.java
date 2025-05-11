package com.abiodun.expaq.event;

import com.abiodun.expaq.dto.NotificationDTO;
import com.abiodun.expaq.service.INotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class NotificationEventHandler {

    private final SimpMessagingTemplate messagingTemplate;
    private final INotificationService notificationService;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        SimpMessageHeaderAccessor headers = SimpMessageHeaderAccessor.wrap(event.getMessage());
        String userId = headers.getUser().getName();
        if (userId != null) {
            // Send unread notifications count to the connected user
            Long unreadCount = notificationService.getUnreadNotificationCount(UUID.fromString(userId));
            messagingTemplate.convertAndSendToUser(
                userId,
                "/queue/notifications/count",
                unreadCount
            );
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        // Handle disconnect if needed
    }

    public void sendNotification(NotificationDTO notification) {
        messagingTemplate.convertAndSendToUser(
            notification.getUserId().toString(),
            "/queue/notifications",
            notification
        );
    }

    public void sendUnreadCount(UUID userId, Long count) {
        messagingTemplate.convertAndSendToUser(
            userId.toString(),
            "/queue/notifications/count",
            count
        );
    }
} 