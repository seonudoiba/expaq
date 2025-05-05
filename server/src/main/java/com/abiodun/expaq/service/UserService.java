package com.abiodun.expaq.service;

import com.abiodun.expaq.exception.UserAlreadyExistsException;
import com.abiodun.expaq.model.ExpaqUserDetails;
import com.abiodun.expaq.model.User;
import com.abiodun.expaq.repository.UserRepository;
import com.abiodun.expaq.request.LoginRequest;
import com.abiodun.expaq.response.AuthResponse;
import com.abiodun.expaq.dto.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder, AuthenticationManager authenticationManager, JwtService jwtService) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public AuthResponse register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new UserAlreadyExistsException(user.getEmail() + " already exists");
        }
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new UserAlreadyExistsException(user.getUsername() + " already exists");
        }

        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        user.setRoles(Collections.singletonList(User.UserRole.TOURIST));
        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(savedUser);
        return new AuthResponse(savedUser.getUsername(), token, List.of("TOURIST"));
    }

    public AuthResponse verify(LoginRequest user) {
        Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getUserName(),
                        user.getPassword()
                )
        );

        if (authenticate.isAuthenticated()) {
            User authenticatedUser = userRepository.findByUserName(user.getUserName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String token = jwtService.generateToken(authenticatedUser);
            ExpaqUserDetails userPrincipal = (ExpaqUserDetails) authenticate.getPrincipal();
            List<String> roles = userPrincipal.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .toList();

            return new AuthResponse(authenticatedUser.getUsername(), token, roles);
        }

        throw new RuntimeException("Authentication failed");
    }

    public UserDTO getCurrentUser(ExpaqUserDetails currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToDTO(user);
    }

    public AuthResponse handleGoogleLogin(String idToken) {
        throw new UnsupportedOperationException("Google login not implemented yet");
    }

    public UserDTO getUserById(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToDTO(user);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .toList();
    }

    public UserDTO updateUser(UUID userId, User updatedUserData) {
        // Fetch the existing user by ID
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update the fields of the existing user
        existingUser.setUsername(updatedUserData.getUsername());
        existingUser.setEmail(updatedUserData.getEmail());
        existingUser.setFirstName(updatedUserData.getFirstName());
        existingUser.setLastName(updatedUserData.getLastName());
        existingUser.setBio(updatedUserData.getBio());

        // Update the password if provided
        if (updatedUserData.getPassword() != null && !updatedUserData.getPassword().isEmpty()) {
            existingUser.setPassword(bCryptPasswordEncoder.encode(updatedUserData.getPassword()));
        }

        // Save the updated user
        User updatedUser = userRepository.save(existingUser);

        // Convert to UserDTO and return
        return convertToUserDTO(updatedUser);
    }

    private UserDTO convertToUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .userName(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .bio(user.getBio())
                .build();
    }

    public void deleteUser(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(userId);
    }

    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToDTO(user);
    }

    public UserDTO getUserByUsername(String username) {
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToDTO(user);
    }

    public void updateUserProfile(UUID userId, UserDTO userDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setBio(userDTO.getBio());

        userRepository.save(user);
    }

    public void updateUserPassword(UUID userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!bCryptPasswordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(bCryptPasswordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    private UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .userName(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .bio(user.getBio())
                .profilePicture(user.getProfilePictureUrl())
                .roles(Collections.singletonList(User.UserRole.valueOf(user.getRole().name())))
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
