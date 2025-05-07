//package com.abiodun.expaq.service.impl;
//
//import com.abiodun.expaq.dto.*;
//import com.abiodun.expaq.exception.ResourceNotFoundException;
//import com.abiodun.expaq.exception.UnauthorizedException;
//import com.abiodun.expaq.model.User;
//import com.abiodun.expaq.repository.UserRepository;
//import com.abiodun.expaq.service.UserService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.UUID;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class UserServiceImpl implements IUserService {
//
//    private final UserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;
//
//    @Override
//    @Transactional
//    public UserDTO registerUser(RegisterUserRequest request) {
//        // Check if email already exists
//        if (userRepository.existsByEmail(request.getEmail())) {
//            throw new RuntimeException("Email already registered");
//        }
//
//        // Create new user
//        User user = new User();
//        user.setEmail(request.getEmail());
//        user.setPassword(passwordEncoder.encode(request.getPassword()));
//        user.setFirstName(request.getFirstName());
//        user.setLastName(request.getLastName());
//        user.setRole(Role
//        user.setCreatedAt(LocalDateTime.now());
//        user.setUpdatedAt(LocalDateTime.now());
//
//        // Generate verification token
//        user.setVerificationToken(UUID.randomUUID().toString());
//        user.setVerificationTokenExpiry(LocalDateTime.now().plusHours(24));
//
//        // Save user
//        user = userRepository.save(user);
//
//        return UserDTO.fromUser(user);
//    }
//
//    @Override
//    @Transactional
//    public UserDTO loginUser(LoginRequest request) {
//        User user = userRepository.findByEmail(request.getEmail())
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//
//        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
//            throw new UnauthorizedException("Invalid credentials");
//        }
//
//        if (!user.isActive()) {
//            throw new UnauthorizedException("Account is deactivated");
//        }
//
//        return UserDTO.fromUser(user);
//    }
//
//    @Override
//    public void logoutUser(UUID userId) {
//        // In a real application, you might want to invalidate the JWT token
//        // or perform other cleanup tasks
//    }
//
//    @Override
//    @Transactional
//    public void verifyEmail(String token) {
//        User user = userRepository.findByVerificationToken(token)
//                .orElseThrow(() -> new ResourceNotFoundException("Invalid verification token"));
//
//        if (user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
//            throw new RuntimeException("Verification token expired");
//        }
//
//        user.verify();
//        userRepository.save(user);
//    }
//
//    @Override
//    @Transactional
//    public void requestPasswordReset(String email) {
//        User user = userRepository.findByEmail(email)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//
//        user.setResetPasswordToken(UUID.randomUUID().toString());
//        user.setResetPasswordTokenExpiry(LocalDateTime.now().plusHours(1));
//        userRepository.save(user);
//
//        // TODO: Send password reset email
//    }
//
//    @Override
//    @Transactional
//    public void resetPassword(ResetPasswordRequest request) {
//        User user = userRepository.findByResetPasswordToken(request.getToken())
//                .orElseThrow(() -> new ResourceNotFoundException("Invalid reset token"));
//
//        if (user.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
//            throw new RuntimeException("Reset token expired");
//        }
//
//        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
//        user.setResetPasswordToken(null);
//        user.setResetPasswordTokenExpiry(null);
//        userRepository.save(user);
//    }
//
//    @Override
//    public UserDTO getUserById(UUID userId) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//        return UserDTO.fromUser(user);
//    }
//
//    @Override
//    @Transactional
//    public UserDTO updateUserProfile(UUID userId, UpdateProfileRequest request) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//
//        user.updateProfile(
//            request.getFirstName(),
//            request.getLastName(),
//            request.getPhoneNumber(),
//            request.getBio()
//        );
//
//        user = userRepository.save(user);
//        return UserDTO.fromUser(user);
//    }
//
//    @Override
//    @Transactional
//    public void updateUserPassword(UUID userId, UpdatePasswordRequest request) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//
//        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
//            throw new UnauthorizedException("Current password is incorrect");
//        }
//
//        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
//        userRepository.save(user);
//    }
//
//    @Override
//    @Transactional
//    public void updateUserPreferences(UUID userId, UpdatePreferencesRequest request) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//
//        user.updatePreferences(
//            request.getPreferredLanguage(),
//            request.getPreferredCurrency(),
//            request.getTimeZone()
//        );
//
//        userRepository.save(user);
//    }
//
//    @Override
//    @Transactional
//    public void uploadProfilePicture(UUID userId, String imageUrl) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//
//        user.setProfilePicture(imageUrl);
//        userRepository.save(user);
//    }
//
//    @Override
//    @Transactional
//    public void deleteProfilePicture(UUID userId) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//
//        user.setProfilePicture(null);
//        userRepository.save(user);
//    }
//
//    @Override
//    @Transactional
//    public UserDTO applyForHost(UUID userId, HostApplicationRequest request) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//
//        if (user.getRole() != Role
//            throw new RuntimeException("Only regular users can apply to become hosts");
//        }
//
//        // TODO: Implement host application logic
//        // This might involve additional verification steps, document uploads, etc.
//
//        return UserDTO.fromUser(user);
//    }
//
//    @Override
//    @Transactional
//    public void approveHost(UUID userId, UUID adminId) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//
//        User admin = userRepository.findById(adminId)
//                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
//
//        if (admin.getRole() != Role
//            throw new UnauthorizedException("Only admins can approve host applications");
//        }
//
//        user.setRole(Role
//        user.setVerified(true);
//        userRepository.save(user);
//    }
//
//    @Override
//    @Transactional
//    public void rejectHost(UUID userId, UUID adminId, String reason) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//
//        User admin = userRepository.findById(adminId)
//                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
//
//        if (admin.getRole() != Role.ADMIN) {
//            throw new UnauthorizedException("Only admins can reject host applications");
//        }
//
//        // TODO: Implement host rejection logic
//        // This might involve sending a notification to the user with the rejection reason
//    }
//
//    @Override
//    public List<UserDTO> getPendingHostApplications() {
//        return userRepository.findByRoleAndIsVerified(Role.HOST, false)
//                .stream()
//                .map(UserDTO::fromUser)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public List<UserDTO> getApprovedHosts() {
//        return userRepository.findByRoleAndIsVerified(Role.HOST, true)
//                .stream()
//                .map(UserDTO::fromUser)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    @Transactional
//    public UserDTO createAdmin(UUID adminId, CreateAdminRequest request) {
//        User admin = userRepository.findById(adminId)
//                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
//
//        if (admin.getRole() != Role.ADMIN) {
//            throw new UnauthorizedException("Only existing admins can create new admins");
//        }
//
//        User newAdmin = new User();
//        newAdmin.setEmail(request.getEmail());
//        newAdmin.setPassword(passwordEncoder.encode(request.getPassword()));
//        newAdmin.setFirstName(request.getFirstName());
//        newAdmin.setLastName(request.getLastName());
//        newAdmin.setRole(Role.ADMIN);
//        newAdmin.setVerified(true);
//        newAdmin.setCreatedAt(LocalDateTime.now());
//        newAdmin.setUpdatedAt(LocalDateTime.now());
//
//        newAdmin = userRepository.save(newAdmin);
//        return UserDTO.fromUser(newAdmin);
//    }
//
//    @Override
//    @Transactional
//    public void deactivateUser(UUID userId, UUID adminId) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//
//        User admin = userRepository.findById(adminId)
//                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
//
//        if (admin.getRole() != Role.ADMIN) {
//            throw new UnauthorizedException("Only admins can deactivate users");
//        }
//
//        user.deactivate();
//        userRepository.save(user);
//    }
//
//    @Override
//    @Transactional
//    public void activateUser(UUID userId, UUID adminId) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//
//        User admin = userRepository.findById(adminId)
//                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
//
//        if (admin.getRole() != Role.ADMIN) {
//            throw new UnauthorizedException("Only admins can activate users");
//        }
//
//        user.activate();
//        userRepository.save(user);
//    }
//
//    @Override
//    @Transactional
//    public void deleteUser(UUID userId, UUID adminId) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//
//        User admin = userRepository.findById(adminId)
//                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
//
//        if (admin.getRole() != Role.ADMIN) {
//            throw new UnauthorizedException("Only admins can delete users");
//        }
//
//        userRepository.delete(user);
//    }
//
//    @Override
//    public Page<UserDTO> getAllUsers(Pageable pageable) {
//        return userRepository.findAll(pageable)
//                .map(UserDTO::fromUser);
//    }
//
//    @Override
//    public Page<UserDTO> searchUsers(String query, Pageable pageable) {
//        return userRepository.searchUsers(query, pageable)
//                .map(UserDTO::fromUser);
//    }
//
//    @Override
//    public UserStatisticsDTO getUserStatistics(UUID userId) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//
//        // TODO: Implement user statistics calculation
//        return new UserStatisticsDTO();
//    }
//
//    @Override
//    public HostStatisticsDTO getHostStatistics(UUID hostId) {
//        User host = userRepository.findById(hostId)
//                .orElseThrow(() -> new ResourceNotFoundException("Host not found"));
//
//        if (host.getRole() != Role.HOST) {
//            throw new RuntimeException("User is not a host");
//        }
//
//        // TODO: Implement host statistics calculation
//        return new HostStatisticsDTO();
//    }
//}