package com.abiodun.expaq.response;

import lombok.Getter;

import java.util.List;
@Getter
public class AuthResponse {
    private String username;
    private String token;
    private List<String> roles;

    public AuthResponse(String username, String token, List<String> roles) {
        this.username = username;
        this.token = token;
        this.roles = roles;
    }
}

