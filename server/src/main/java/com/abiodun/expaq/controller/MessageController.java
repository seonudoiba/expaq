package com.abiodun.expaq.controller;

import com.abiodun.expaq.dto.CreateMessageRequest;
import com.abiodun.expaq.dto.MessageDTO;
import com.abiodun.expaq.model.MessageType;
import com.abiodun.expaq.security.ExpaqUserDetails;
import com.abiodun.expaq.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
// Add CORS configuration if needed, e.g. @CrossOrigin(origins = "http://localhost:3000")
public class MessageController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping
    public ResponseEntity<MessageDTO> sendMessage(
            @Valid @RequestBody CreateMessageRequest request,
            @AuthenticationPrincipal ExpaqUserDetails userDetails) {
        MessageDTO message = messageService.sendMessage(request, userDetails.getId());
        messagingTemplate.convertAndSendToUser(
            request.getReceiverId().toString(),
            "/queue/messages",
            message
        );
        return ResponseEntity.ok(message);
    }

    @MessageMapping("/chat")
    public void handleChatMessage(@Payload CreateMessageRequest request) {
        // WebSocket message handling will be implemented here
        // This is a placeholder for real-time messaging
    }

    @GetMapping("/conversation/{userId}")
    public ResponseEntity<List<MessageDTO>> getConversation(
            @AuthenticationPrincipal ExpaqUserDetails userDetails,
            @PathVariable UUID userId,
            Pageable pageable) {
        return ResponseEntity.ok(messageService.getConversation(userDetails.getId(), userId, pageable));
    }

    @GetMapping("/activity/{activityId}")
    public ResponseEntity<List<MessageDTO>> getActivityMessages(
            @PathVariable UUID activityId,
            Pageable pageable) {
        return ResponseEntity.ok(messageService.getActivityMessages(activityId, pageable));
    }

    @GetMapping("/unread")
    public ResponseEntity<List<MessageDTO>> getUnreadMessages(
            @AuthenticationPrincipal ExpaqUserDetails userDetails) {
        return ResponseEntity.ok(messageService.getUnreadMessages(userDetails.getId()));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<MessageDTO>> getMessagesByType(
            @PathVariable MessageType type) {
        return ResponseEntity.ok(messageService.getMessagesByType(type));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<MessageDTO>> getRecentMessages(
            @AuthenticationPrincipal ExpaqUserDetails userDetails,
            @RequestParam LocalDateTime since) {
        return ResponseEntity.ok(messageService.getRecentMessages(userDetails.getId(), since));
    }

    @GetMapping("/search")
    public ResponseEntity<List<MessageDTO>> searchMessages(
            @AuthenticationPrincipal ExpaqUserDetails userDetails,
            @RequestParam String query) {
        return ResponseEntity.ok(messageService.searchMessages(userDetails.getId(), query));
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<UUID>> getConversationParticipants(
            @AuthenticationPrincipal ExpaqUserDetails userDetails) {
        return ResponseEntity.ok(messageService.getConversationParticipants(userDetails.getId()));
    }

    @GetMapping("/conversations/latest")
    public ResponseEntity<List<MessageDTO>> getLatestMessagesPerConversation(
            @AuthenticationPrincipal ExpaqUserDetails userDetails) {
        return ResponseEntity.ok(messageService.getLatestMessagesPerConversation(userDetails.getId()));
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<MessageDTO>> getMessagesByDateRange(
            @AuthenticationPrincipal ExpaqUserDetails userDetails,
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end) {
        return ResponseEntity.ok(messageService.getMessagesByDateRange(userDetails.getId(), start, end));
    }

    @PutMapping("/read/conversation/{partnerId}")
    public ResponseEntity<Void> markAllMessagesAsRead(
            @PathVariable UUID partnerId,
            @AuthenticationPrincipal ExpaqUserDetails userDetails) {
        messageService.markAllMessagesAsRead(userDetails.getId(), partnerId);
        return ResponseEntity.ok().build();
    }

    // @GetMapping("/unread/count")
    // public ResponseEntity<UUID> countUnreadMessages(
    //         @AuthenticationPrincipal ExpaqUserDetails userDetails) {
    //     return ResponseEntity.ok(UUID.fromString(messageService.countUnreadMessages(userDetails.getId()).toString()));
    // }

    // @GetMapping("/count")
    // public ResponseEntity<UUID> countMessagesInPeriod(
    //         @AuthenticationPrincipal ExpaqUserDetails userDetails,
    //         @RequestParam LocalDateTime start,
    //         @RequestParam LocalDateTime end) {
    //     return ResponseEntity.ok(messageService.countMessagesInPeriod(userDetails.getId(), start, end));
    // }
}
