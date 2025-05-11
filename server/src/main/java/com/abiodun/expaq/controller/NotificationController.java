package com.abiodun.expaq.controller;

import com.abiodun.expaq.dto.NotificationDTO;
import com.abiodun.expaq.model.NotificationType;
import com.abiodun.expaq.service.INotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final INotificationService notificationService;

    @GetMapping
    public ResponseEntity<Page<NotificationDTO>> getNotifications(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        UUID userId = UUID.fromString(userDetails.getUsername());
        return ResponseEntity.ok(notificationService.getUserNotifications(userId, PageRequest.of(page, size)));
    }

    @GetMapping("/unread")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications(
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = UUID.fromString(userDetails.getUsername());
        return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));
    }

    @GetMapping("/unread/count")
    public ResponseEntity<Long> getUnreadNotificationCount(
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = UUID.fromString(userDetails.getUsername());
        return ResponseEntity.ok(notificationService.getUnreadNotificationCount(userId));
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = UUID.fromString(userDetails.getUsername());
        notificationService.markNotificationAsRead(id, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = UUID.fromString(userDetails.getUsername());
        notificationService.markAllNotificationsAsRead(userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = UUID.fromString(userDetails.getUsername());
        notificationService.deleteNotification(id, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAllNotifications(
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = UUID.fromString(userDetails.getUsername());
        notificationService.deleteAllNotifications(userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/preferences/{type}")
    public ResponseEntity<Void> updateNotificationPreferences(
            @PathVariable NotificationType type,
            @RequestParam boolean enabled,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = UUID.fromString(userDetails.getUsername());
        notificationService.updateNotificationPreferences(userId, type, enabled);
        return ResponseEntity.ok().build();
    }

    @MessageMapping("/notifications.send")
    public void sendNotification(@Payload NotificationDTO notification) {
        // This endpoint can be used to send notifications from the client
        // The actual sending is handled by the service layer
    }

    @SubscribeMapping("/user/queue/notifications")
    public void subscribeToNotifications() {
        // This endpoint is used to subscribe to notifications
        // The actual subscription is handled by Spring's WebSocket support
    }
}