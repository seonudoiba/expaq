package com.abiodun.expaq.dto;

import com.abiodun.expaq.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UUID userId;
    private String userName;
    private User.UserRole role;
    private UserDTO user;

    // Constructor for the full UserDTO response
    public AuthResponse(String token, UserDTO user) {
        this.token = token;
        this.user = user;
    }

    // Constructor for the minimal response
    public AuthResponse(String token, UUID userId, String userName, User.UserRole role) {
        this.token = token;
        this.userId = userId;
        this.userName = userName;
        this.role = role;
    }
}