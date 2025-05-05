package com.abiodun.expaq.service;

import com.abiodun.expaq.dto.MessageDTO;
import com.abiodun.expaq.dto.UserDTO; // Assuming you have a UserDTO

import java.util.List;
import java.util.UUID;

public interface IMessageService {

    /**
     * Sends a new message.
     *
     * @param messageDTO The message data transfer object.
     * @return The saved message DTO.
     */
    MessageDTO sendMessage(MessageDTO messageDTO);

    /**
     * Retrieves the chat history between the logged-in user and another user.
     *
     * @param userId1 ID of the first user (e.g., logged-in user).
     * @param userId2 ID of the second user.
     * @return A list of messages exchanged between the two users.
     */
    List<MessageDTO> getChatMessages(UUID userId1, UUID userId2);

    /**
     * Retrieves a list of users the logged-in user has had conversations with.
     *
     * @param userId ID of the logged-in user.
     * @return A list of user DTOs representing the conversation partners.
     */
    List<UserDTO> getConversations(UUID userId);
}
