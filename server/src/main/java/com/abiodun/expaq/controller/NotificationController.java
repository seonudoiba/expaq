//package com.abiodun.expaq.controller;
//
//import com.abiodun.expaq.dto.NotificationDTO;
//import com.abiodun.expaq.service.INotificationService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.http.ResponseEntity;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.web.bind.annotation.*;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.UUID;
//
//@RestController
//@RequestMapping("/api/notifications")
//@RequiredArgsConstructor
//public class NotificationController {
//
//    private final INotificationService notificationService;
//    private final SimpMessagingTemplate messagingTemplate;
//
//    @GetMapping
//    public ResponseEntity<Page<NotificationDTO>> getUserNotifications(
//            @RequestAttribute("userId") UUID userId,
//            Pageable pageable) {
//        return ResponseEntity.ok(notificationService.getUserNotifications(userId, pageable));
//    }
//
//    @GetMapping("/unread")
//    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications(
//            @RequestAttribute("userId") UUID userId) {
//        return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));
//    }
//
//    @GetMapping("/unread/count")
//    public ResponseEntity<Long> getUnreadNotificationCount(
//            @RequestAttribute("userId") UUID userId) {
//        return ResponseEntity.ok(notificationService.getUnreadNotificationCount(userId));
//    }
//
//    @PutMapping("/{notificationId}/read")
//    public ResponseEntity<Void> markNotificationAsRead(
//            @RequestAttribute("userId") UUID userId,
//            @PathVariable UUID notificationId) {
//        notificationService.markNotificationAsRead(notificationId, userId);
//        return ResponseEntity.ok().build();
//    }
//
//    @PutMapping("/read-all")
//    public ResponseEntity<Void> markAllNotificationsAsRead(
//            @RequestAttribute("userId") UUID userId) {
//        notificationService.markAllNotificationsAsRead(userId);
//        return ResponseEntity.ok().build();
//    }
//
//    @DeleteMapping("/{notificationId}")
//    public ResponseEntity<Void> deleteNotification(
//            @RequestAttribute("userId") UUID userId,
//            @PathVariable UUID notificationId) {
//        notificationService.deleteNotification(notificationId, userId);
//        return ResponseEntity.ok().build();
//    }
//
//    @DeleteMapping("/clear-all")
//    public ResponseEntity<Void> clearAllNotifications(
//            @RequestAttribute("userId") UUID userId) {
//        notificationService.clearAllNotifications(userId);
//        return ResponseEntity.ok().build();
//    }
//
//    @GetMapping("/type/{type}")
//    public ResponseEntity<Page<NotificationDTO>> getNotificationsByType(
//            @RequestAttribute("userId") UUID userId,
//            @PathVariable String type,
//            Pageable pageable) {
//        return ResponseEntity.ok(notificationService.getNotificationsByType(userId, type, pageable));
//    }
//
//    @GetMapping("/date-range")
//    public ResponseEntity<Page<NotificationDTO>> getNotificationsByDateRange(
//            @RequestAttribute("userId") UUID userId,
//            @RequestParam LocalDateTime start,
//            @RequestParam LocalDateTime end,
//            Pageable pageable) {
//        return ResponseEntity.ok(notificationService.getNotificationsByDateRange(userId, start, end, pageable));
//    }
//
//    @GetMapping("/recent")
//    public ResponseEntity<List<NotificationDTO>> getRecentNotifications(
//            @RequestAttribute("userId") UUID userId,
//            @RequestParam(defaultValue = "10") int limit) {
//        return ResponseEntity.ok(notificationService.getRecentNotifications(userId, limit));
//    }
//
//    @PutMapping("/preferences")
//    public ResponseEntity<Void> updateNotificationPreferences(
//            @RequestAttribute("userId") UUID userId,
//            @RequestParam String type,
//            @RequestParam boolean enabled) {
//        notificationService.updateNotificationPreferences(userId, type, enabled);
//        return ResponseEntity.ok().build();
//    }
//
//    @GetMapping("/preferences")
//    public ResponseEntity<Object> getNotificationPreferences(
//            @RequestAttribute("userId") UUID userId) {
//        return ResponseEntity.ok(notificationService.getNotificationPreferences(userId));
//    }
//
//    @PostMapping("/test")
//    public ResponseEntity<Void> sendTestNotification(
//            @RequestAttribute("userId") UUID userId,
//            @RequestParam String type) {
//        notificationService.sendTestNotification(userId, type);
//        return ResponseEntity.ok().build();
//    }
//}