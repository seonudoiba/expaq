package com.abiodun.expaq.service;

import com.abiodun.expaq.dto.AuthResponse;
import com.abiodun.expaq.dto.LoginRequest;
import com.abiodun.expaq.dto.RegisterRequest;
import com.abiodun.expaq.dto.UserDTO; // For getMe
import jakarta.validation.Valid;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

public interface IAuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserDTO getMe(UUID userId);
    void verifyEmail(String token);
    void resendVerificationEmail(String email);
    void requestPasswordReset(String email);
    void resetPassword(String token, String newPassword);
    AuthResponse handleOAuth2Login(String provider, String providerId, String email, String name);
}
