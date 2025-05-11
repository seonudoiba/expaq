package com.abiodun.expaq.service.impl;

import com.abiodun.expaq.dto.*;
import com.abiodun.expaq.exception.ResourceNotFoundException;
import com.abiodun.expaq.exception.RoleNotFoundException;
import com.abiodun.expaq.exception.UnauthorizedException;
import com.abiodun.expaq.exception.UserAlreadyExistsException;
import com.abiodun.expaq.model.*;
import com.abiodun.expaq.repository.*;
import com.abiodun.expaq.service.IAuthService;
import com.abiodun.expaq.service.EmailService;
import com.abiodun.expaq.service.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements IAuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final RoleRepository roleRepository;
    private final ActivityRepository activityRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;
    private final TokenBlacklistRepository tokenBlacklistRepository;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if email or username already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email already in use");

        }
        if (userRepository.existsByUsername((request.getUserName()))) {
            throw new UserAlreadyExistsException("Username already taken");
        }

        // Create new user
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setUsername(request.getUserName());
        System.out.println(user.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        // Find the TOURIST role
        try{
            Role guestRole = roleRepository.findByName("GUEST");

            // Set the TOURIST role to the user
            user.setRoles(Collections.singleton(guestRole));
        } catch (Exception e) {
            throw  new RoleNotFoundException("GUEST  role not found in the database");

        }
        user.setVerified(false);
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setLastLoginAt(LocalDateTime.now()); // Ensure lastLoginAt is set

        // Generate verification token
        String verificationToken = UUID.randomUUID().toString();
        user.setVerificationToken(verificationToken);
        user.setVerificationTokenExpiry(LocalDateTime.now().plusHours(24));

        // Save user
        user = userRepository.save(user);

        // Send verification email
        emailService.sendVerificationEmail(user.getEmail(), verificationToken);

        // Generate JWT token
        String token = jwtService.generateToken(user);

//        return new AuthResponse(token, UserDTO.fromUser(user));
        return new AuthResponse(token, UserDTO.fromUser(user).getId() , UserDTO.fromUser(user).getUserName(), UserDTO.fromUser(user).getRoles());

    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Get user details
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if account is active
        if (!user.isActive()) {
            throw new UnauthorizedException("Account is deactivated");
        }

        // Check if password is correct
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        // Update last login
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        // Generate JWT token
        String token = jwtService.generateToken(user);

        return new AuthResponse(token, UserDTO.fromUser(user).getId() , UserDTO.fromUser(user).getUserName(), UserDTO.fromUser(user).getRoles());
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getMe(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserDTO.fromUser(user);
    }

    @Override
    @Transactional
    public void verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid verification token"));

        // Check if token is expired
        if (user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Verification token has expired");
        }

        // Verify email
        user.setVerified(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiry(null);
        userRepository.save(user);
    }

    @Transactional
    @Override
    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Generate new verification token
        String verificationToken = UUID.randomUUID().toString();
        user.setVerificationToken(verificationToken);
        user.setVerificationTokenExpiry(LocalDateTime.now().plusHours(24));
        userRepository.save(user);

        // Send verification email
        emailService.sendVerificationEmail(user.getEmail(), verificationToken);
    }

    @Override
    @Transactional
    public void requestPasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Generate password reset token
        String resetToken = UUID.randomUUID().toString();
        user.setResetPasswordToken(resetToken);
        user.setResetPasswordTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        // Send password reset email
        emailService.sendPasswordResetEmail(user.getEmail(), resetToken);
    }

    @Transactional
    @Override
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetPasswordToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid password reset token"));

        // Check if token is expired
        if (user.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Password reset token has expired");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);
        user.setPasswordUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    @Transactional
    @Override
    public AuthResponse handleOAuth2Login(String provider, String providerId, String email, String name) {
        // Check if user exists with OAuth2 provider
        User user = userRepository.findByProviderAndProviderId(provider, providerId)
                .orElseGet(() -> {
                    // If not, check if user exists with email
                    return userRepository.findByEmail(email)
                            .map(existingUser -> {
                                // Link OAuth2 account to existing user
                                existingUser.setOAuth2Provider(provider);
                                existingUser.setOAuth2ProviderId(providerId);
                                return existingUser;
                            })
                            .orElseGet(() -> {
                                // Create new user
                                User newUser = new User();
                                newUser.setEmail(email);
                                newUser.setFirstName(name);
                                newUser.setOAuth2Provider(provider);
                                newUser.setOAuth2ProviderId(providerId);
                                // Find the USER role
                                try{
                                    Role userRole = roleRepository.findByName("USER");

                                    newUser.setRoles(Collections.singleton(userRole));
                                } catch (Exception e) {
                                    throw  new RuntimeException("USER role not found in the database");

                                }
                                newUser.setEmailVerified(true);
                                newUser.setActive(true);
                                newUser.setCreatedAt(LocalDateTime.now());
                                newUser.setLastLoginAt(LocalDateTime.now()); // Ensure lastLoginAt is set
                                return newUser;
                            });
                });

        // Update last login
        user.setLastLoginAt(LocalDateTime.now());
        user = userRepository.save(user);

        // Generate JWT token
        String token = jwtService.generateToken(user);

        return new AuthResponse(token, UserDTO.fromUser(user));
    }

    @Override
    public Page<UserDTO> searchUsers(String query, Pageable pageable) {
        return userRepository.searchUsers(query, pageable)
                .map(UserDTO::fromUser);
    }



    @Override
    public void logout(UUID userId) {
        // Find the user by ID
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Create a token blacklist entry
        String currentToken = SecurityContextHolder.getContext().getAuthentication().getCredentials().toString();

        // Add token to blacklist with expiration
        // You'll need to create a TokenBlacklist entity and repository
        TokenBlacklist blacklistToken = new TokenBlacklist();
        blacklistToken.setToken(currentToken);
        blacklistToken.setUserId(userId);
        blacklistToken.setExpirationDate(jwtService.getExpirationDateFromToken(currentToken));
        blacklistToken.setBlacklistedAt(LocalDateTime.now());

        tokenBlacklistRepository.save(blacklistToken);

        // Clear security context
        SecurityContextHolder.clearContext();

        // Log the logout action
        // Log the logout action using UserActivityHistory
//        activityRepository.save(new UserActivityHistory(
//                UUID.randomUUID(),
//                user,
//                UserActivityHistory.ActivityType.LOGOUT,
//                null,
//                "User logged out",
//                null,
//                null,
//                null,
//                null,
//                LocalDateTime.now()
//        ));
    }

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
    @Override
    public UserStatisticsDTO getUserStatistics(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // TODO: Implement user statistics calculation
        return new UserStatisticsDTO();
    }
    @Override
    public HostStatisticsDTO getHostStatistics(UUID hostId) {
        User host = userRepository.findById(hostId)
                .orElseThrow(() -> new ResourceNotFoundException("Host not found"));

        // Check if user has the HOST role
        boolean isHost = host.getRoles().stream()
                .anyMatch(role -> "HOST".equals(role.getName()));

        if (!isHost) {
            throw new RuntimeException("User is not a host");
        }

        // Calculate host statistics
        HostStatisticsDTO statistics = new HostStatisticsDTO();

        // Assuming you have repositories for listings, bookings, reviews
        int totalListings = (int) activityRepository.countByHostId(hostId);
        long activeListings = activityRepository.countByHostIdAndIsActive(hostId, host.isEnabled());
        long totalBookings = bookingRepository.countByHostId(hostId);
        long completedBookings = bookingRepository.countByHostIdAndStatus(hostId, Booking.BookingStatus.COMPLETED);
        double averageRating = reviewRepository.getAverageRatingByHostId(hostId);
        double totalRevenue = bookingRepository.getTotalRevenueByHostId(hostId);

        // Populate the statistics DTO
        statistics.setTotalActivities(totalListings);
        statistics.setActiveActivities((int) activeListings);
        statistics.setTotalBookings((int) totalBookings);
        statistics.setCompletedBookings((int) completedBookings);
        statistics.setAverageRating(averageRating);
        statistics.setTotalEarnings((int) totalRevenue);
        statistics.setLastUpdated(LocalDateTime.now());

        return statistics;
    }
}


