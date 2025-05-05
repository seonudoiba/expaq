package com.abiodun.expaq.dto;

import com.abiodun.expaq.model.MessageType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateMessageRequest {
    @NotNull(message = "Receiver ID is required")
    private UUID receiverId;

    @NotNull(message = "Message type is required")
    private MessageType type;

    @NotBlank(message = "Message content is required")
    private String content;

    private UUID activityId;
} 