package com.abiodun.expaq.dto;

import com.abiodun.expaq.model.Message;
import com.abiodun.expaq.model.MessageType;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
public class MessageDTO {
    private UUID id;
    private UUID senderId;
    private String senderName;
    private UUID receiverId;
    private String receiverName;
    private UUID activityId;
    private String activityTitle;
    private String content;
    private MessageType type;
    private boolean read;
    private LocalDateTime readAt;
    private LocalDateTime createdAt;

    public static MessageDTO fromMessage(Message message) {
        MessageDTO dto = new MessageDTO();
        dto.setId(message.getId());
        dto.setSenderId(message.getSender().getId());
        dto.setSenderName(message.getSender().getFirstName() + " " + message.getSender().getLastName());
        dto.setReceiverId(message.getReceiver().getId());
        dto.setReceiverName(message.getReceiver().getFirstName() + " " + message.getReceiver().getLastName());
        if (message.getActivity() != null) {
            dto.setActivityId(message.getActivity().getId());
            dto.setActivityTitle(message.getActivity().getTitle());
        }
        dto.setContent(message.getContent());
        dto.setType(message.getType());
        dto.setRead(message.isRead());
        dto.setReadAt(message.getReadAt());
        dto.setCreatedAt(message.getCreatedAt());
        return dto;
    }
}
