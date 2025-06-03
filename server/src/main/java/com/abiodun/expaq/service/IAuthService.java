package com.abiodun.expaq.service;

import com.abiodun.expaq.dto.*;
import com.abiodun.expaq.model.Role;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    Page<UserDTO> searchUsers(String query, Pageable pageable);

    Page<UserDTO> getHosts(Role role, Pageable pageable);

    void logout(UUID userId);

    UserStatisticsDTO getUserStatistics(UUID userId);

    HostStatisticsDTO getHostStatistics(UUID hostId);

    AuthResponse becomeHost(@Valid RegisterRequest request);
}
