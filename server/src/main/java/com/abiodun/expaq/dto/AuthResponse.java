package com.abiodun.expaq.dto;

import com.abiodun.expaq.model.Role;
import com.abiodun.expaq.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collections;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UUID userId;
    private String userName;
    private Set<Role> roles;
    private UserDTO user;

    // Constructor for the full UserDTO response
    public AuthResponse(String token, UserDTO user) {
        this.token = token;
        this.user = user;
    }


    public AuthResponse(String token, UUID id, String userName, Set<Role> roles) {
        this.token = token;
        this.userId = id;
        this.userName = userName;
        this.roles = roles;
    }
}