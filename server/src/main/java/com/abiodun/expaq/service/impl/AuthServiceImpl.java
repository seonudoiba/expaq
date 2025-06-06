package com.abiodun.expaq.service.impl;

import com.abiodun.expaq.dto.*;
import com.abiodun.expaq.exception.ResourceNotFoundException;
import com.abiodun.expaq.exception.RoleNotFoundException;
import com.abiodun.expaq.exception.UnauthorizedException;
import com.abiodun.expaq.exception.UserAlreadyExistsException;
import com.abiodun.expaq.model.Booking;
import com.abiodun.expaq.model.Role;
import com.abiodun.expaq.model.TokenBlacklist;
import com.abiodun.expaq.model.User;
import com.abiodun.expaq.repository.*;
import com.abiodun.expaq.service.EmailService;
import com.abiodun.expaq.service.IAuthService;
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
import java.util.*;
import java.util.stream.Collectors;

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
    
    // Role names
    private static final String ROLE_USER = "USER";
    private static final String ROLE_HOST = "HOST";
    private static final String ROLE_ADMIN = "ADMIN";
    private static final String ROLE_GUEST = "GUEST";
    private static final String ROLE_MODERATOR = "MODERATOR";

    @Override
    @Transactional
    public void updateUserPassword(UUID userId, UpdatePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new UnauthorizedException("Current password is incorrect");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordUpdatedAt(LocalDateTime.now());
        userRepository.save(user);


        // Send email notification
        emailService.sendPasswordChangeNotification(user.getEmail(), user.getFullName());
    }

    @Override
    @Transactional
    public void updateUserPreferences(UUID userId, UpdatePreferencesRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Update user preferences
        user.setPreferredLanguage(request.getPreferredLanguage());
        user.setPreferredCurrency(request.getPreferredCurrency());
        user.setTimeZone(request.getTimeZone());
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);

        // Log the preference update
        log.info("User {} updated preferences: language={}, currency={}, timezone={}",
                user.getEmail(), request.getPreferredLanguage(), 
                request.getPreferredCurrency(), request.getTimeZone());
    }

    @Override
    @Transactional
    public void uploadProfilePicture(UUID userId, String imageUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Update profile picture URL
        user.setProfilePictureUrl(imageUrl);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        log.info("Profile picture updated for user: {}", user.getEmail());
    }

    @Override
    @Transactional
    public void deleteProfilePicture(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Remove profile picture URL
        user.setProfilePictureUrl(null);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        log.info("Profile picture removed for user: {}", user.getEmail());
    }

//    @Override
//    @Transactional(readOnly = true)
//    public Page<UserDTO> searchUsers(String query, Pageable pageable) {
//        // Search users by email, username, first name, or last name
//        return userRepository.findByEmailContainingIgnoreCaseOrUsernameContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
//                query, query, query, query, pageable)
//                .map(this::mapToUserDTO);
//    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserDTO> getAllUsers(Pageable pageable) {
        // In a real application, you might want to add filtering, sorting, and access control
        return userRepository.findAll(pageable)
                .map(this::mapToUserDTO);
    }


    // Helper method to check if a user has admin role
    private boolean isAdmin(User user) {
        return user.getRoles().stream()
                .anyMatch(role -> ROLE_ADMIN.equals(role.getName()));
    }

    @Override
    @Transactional
    public void activateUser(UUID userId, UUID adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + adminId));

        if (!isAdmin(admin)) {
            throw new UnauthorizedException("Only admins can activate users");
        }


        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Check if user is already active
        if (user.isActive()) {
            throw new IllegalStateException("User is already active");
        }

        // Activate the user
        user.setActive(true);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        // Send activation notification
        emailService.sendAccountActivatedNotification(
            user.getEmail(),
            user.getFullName(),
            admin.getFullName()
        );

        log.info("User {} activated by admin {}", user.getEmail(), admin.getEmail());
    }

    @Override
    @Transactional
    public void deleteUser(UUID userId, UUID adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + adminId));

        if (!isAdmin(admin)) {
            throw new UnauthorizedException("Only admins can delete users");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Prevent deleting self or other admins
        if (user.getId().equals(adminId)) {
            throw new IllegalArgumentException("Cannot delete your own account");
        }
        
        if (isAdmin(user) && !isSuperAdmin(admin)) {
            throw new UnauthorizedException("Only super admins can delete other admins");
        }

        // Log the deletion (you might want to archive instead of delete)
        log.warn("User {} deleted by admin {}", user.getEmail(), admin.getEmail());
        
        // In a real application, you might want to soft delete or archive the user
        // For this example, we'll do a hard delete
        userRepository.delete(user);
        
        // Send account deletion notification (optional)
        emailService.sendAccountDeletedNotification(
            user.getEmail(),
            user.getFullName()
        );
    }

    // Helper method to check if a user is a super admin
    private boolean isSuperAdmin(User user) {
        return user.getRoles().stream()
                .anyMatch(role -> "SUPER_ADMIN".equals(role.getName()));
    }

    /**
     * Converts a User entity to a UserDTO
     * @param user the User entity to convert
     * @return the converted UserDTO
     */
    private UserDTO mapToUserDTO(User user) {
        if (user == null) {
            return null;
        }

        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .userName(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFullName())
                .profilePictureUrl(user.getProfilePictureUrl())
                .bio(user.getBio())
                .phoneNumber(user.getPhoneNumber())
                .preferredLanguage(user.getPreferredLanguage())
                .preferredCurrency(user.getPreferredCurrency())
                .timeZone(user.getTimeZone())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
//                .roles(user.getRoles().stream()
//                        .map(Role::getName)
//                        .collect(Collectors.toSet()))
                .build();
    }

    /**
     * Helper method to generate a username from an email address
     * @param email the email address to generate a username from
     * @return a unique username based on the email address
     */
    private String generateUsername(String email) {
        String baseUsername = email.split("@")[0];
        String username = baseUsername;
        int counter = 1;
        
        while (userRepository.existsByUsername(username)) {
            username = baseUsername + counter;
            counter++;
        }
        
        return username;
    }

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
        user.setBio(request.getBio());
        user.setProfilePictureUrl(request.getProfilePictureUrl());
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

        // Use the constructor that includes the full UserDTO
        return new AuthResponse(token, UserDTO.fromUser(user));
    }

    public UserDTO becomeHost(UUID userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if user is the host
        boolean isHost = user.getRoles().stream()
                .anyMatch(role -> "HOST".equals(role.getName()));
        if (!isHost) {
            try{
                Role hostRole = roleRepository.findByName("HOST");
                // Set the HOST role to the user
                user.setRoles(Collections.singleton(hostRole));
            } catch (Exception e) {
                throw  new RoleNotFoundException("HOST  role not found in the database");
            }
        } else {
            throw new UnauthorizedException("User is already a host");
        }
        UserDTO userDto = mapToUserDTO(user);
        return userDto;
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

        // Check if account is verified
        if (!user.isVerified()){
            throw new UnauthorizedException("Account is not verified");
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

        // Use the constructor that includes the full UserDTO
        return new AuthResponse(token, UserDTO.fromUser(user));
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

//    @Override
//    public Page<UserDTO> searchUsers(String query, Pageable pageable) {
//        return userRepository.searchUsers(query, pageable)
//                .map(UserDTO::fromUser);
//    }

    @Override
    public Page<UserDTO> getHosts(Role role, Pageable pageable){
        return userRepository.findByRole(role, pageable).map(UserDTO::fromUser);
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
    
    @Override
    @Transactional
    public UserDTO updateUserProfile(UUID userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Update user details if provided
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getProfilePictureUrl() != null) {
            user.setProfilePictureUrl(request.getProfilePictureUrl());
        }
        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            user.setRoles(request.getRoles());
        }
        if (request.getUserName() != null && !request.getUserName().equals(user.getUsername())) {
            if (userRepository.existsByUsername(request.getUserName())) {
                throw new UserAlreadyExistsException("Username is already taken");
            }
            user.setUsername(request.getUserName());
        }
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new UserAlreadyExistsException("Email is already in use");
            }
            user.setEmail(request.getEmail());
            user.setVerified(false);
            // Generate new verification token
            String verificationToken = UUID.randomUUID().toString();
            user.setVerificationToken(verificationToken);
            user.setVerificationTokenExpiry(LocalDateTime.now().plusHours(24));
            emailService.sendVerificationEmail(user.getEmail(), verificationToken);
        }

        user.setUpdatedAt(LocalDateTime.now());
        user = userRepository.save(user);

        return UserDTO.fromUser(user);
    }
}

