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
    void verifyEmail(String token);
    void resendVerificationEmail(String email);
    void requestPasswordReset(String email);
    void resetPassword(String token, String newPassword);
    AuthResponse handleOAuth2Login(String provider, String providerId, String email, String name);

    @Transactional
    UserDTO updateProfile(UUID userId, UpdateProfileRequest request);

    @Transactional(readOnly = true)
    List<String> getUserRoles();

    @Transactional(readOnly = true)
    UserDTO getUserById(UUID userId);

    Page<UserDTO> searchUsers(String query, Pageable pageable);

    Page<UserDTO> getHosts(Role role, Pageable pageable);

    void logout(UUID userId);

    @Transactional
    UserDTO updateUserProfile(UUID userId, UpdateProfileRequest request);

    UserStatisticsDTO getUserStatistics(UUID userId);

    HostStatisticsDTO getHostStatistics(UUID hostId);

    AuthResponse becomeHost(@Valid RegisterRequest request);

    void updateUserPassword(UUID userId, UpdatePasswordRequest request);
    
    void updateUserPreferences(UUID userId, UpdatePreferencesRequest request);
    
    void uploadProfilePicture(UUID userId, String imageUrl);
    
    void deleteProfilePicture(UUID userId);
    
    UserDTO applyForHost(UUID userId, HostApplicationRequest request);
    
    void approveHost(UUID userId, UUID adminId);
    
    void rejectHost(UUID userId, UUID adminId, String reason);
    
    List<UserDTO> getPendingHostApplications();
    
    List<UserDTO> getApprovedHosts();
    
    UserDTO createAdmin(UUID adminId, CreateAdminRequest request);
    
    void deactivateUser(UUID userId, UUID adminId);
    
    void activateUser(UUID userId, UUID adminId);
    
    void deleteUser(UUID userId, UUID adminId);
    
    Page<UserDTO> getAllUsers(Pageable pageable);
}
