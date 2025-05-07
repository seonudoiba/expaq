package com.abiodun.expaq.service.impl;

import com.abiodun.expaq.dto.AuthResponse;
import com.abiodun.expaq.dto.LoginRequest;
import com.abiodun.expaq.dto.RegisterRequest;
import com.abiodun.expaq.dto.UserDTO;
import com.abiodun.expaq.exception.ResourceNotFoundException;
import com.abiodun.expaq.model.Role;
import com.abiodun.expaq.model.User;
import com.abiodun.expaq.repository.RoleRepository;
import com.abiodun.expaq.repository.UserRepository;
import com.abiodun.expaq.security.JwtTokenProvider;
import com.abiodun.expaq.service.IAuthService;
import com.abiodun.expaq.service.EmailService;
import lombok.RequiredArgsConstructor;
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

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements IAuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;
    private final RoleRepository roleRepository;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if email or username already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }
        if (userRepository.existsByUsername((request.getUserName()))) {
            throw new RuntimeException("Username is already taken");
        }

        // Create new user
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setUsername(request.getUserName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        // Find the TOURIST role
        try{
            Role guestRole = roleRepository.findByName("GUEST");

            // Set the TOURIST role to the user
            user.setRoles(Collections.singleton(guestRole));
        } catch (Exception e) {
            throw  new RuntimeException("GUEST  role not found in the database");

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
        String token = jwtTokenProvider.generateToken(user);

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
            throw new RuntimeException("Account is deactivated");
        }

        // Update last login
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(user);

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

                                    // Set the USER role to the user
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
        String token = jwtTokenProvider.generateToken(user);

        return new AuthResponse(token, UserDTO.fromUser(user));
    }
}