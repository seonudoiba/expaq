package com.abiodun.expaq.service;

import com.abiodun.expaq.dto.*;
import com.abiodun.expaq.model.Role;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

public interface IAuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserDTO getMe(UUID userId);
    UserDTO getUser(UUID userId);
    void verifyEmail(String token);
    void resendVerificationEmail(String email);
    void requestPasswordReset(String email);
    void resetPassword(String token, String newPassword);
    AuthResponse handleOAuth2Login(String provider, String providerId, String email, String name);

    Page<UserDTO> getHosts(Role role, Pageable pageable);

    void logout(UUID userId);

    @Transactional
    UserDTO updateUserProfile(UUID userId, UpdateProfileRequest request);

    UserStatisticsDTO getUserStatistics(UUID userId);

    HostStatisticsDTO getHostStatistics(UUID hostId);

    UserDTO becomeHost(UUID userId);

    void updateUserPassword(UUID userId, UpdatePasswordRequest request);
    
    void updateUserPreferences(UUID userId, UpdatePreferencesRequest request);
    
    void uploadProfilePicture(UUID userId, String imageUrl);
    
    void deleteProfilePicture(UUID userId);

    void activateUser(UUID userId, UUID adminId);
    
    void deleteUser(UUID userId, UUID adminId);
    
    Page<UserDTO> getAllUsers(Pageable pageable);
}
