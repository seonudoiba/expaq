package com.abiodun.expaq.dto;

import com.abiodun.expaq.model.Role;
import com.abiodun.expaq.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private UUID id;
    private String email;
    private String firstName;
    private String userName;
    private String lastName;
    private String profilePicture;
    private String phoneNumber;
    private String bio;
    private Set<Role> roles;
    private boolean verified;
    private boolean active;
    private String preferredLanguage;
    private String preferredCurrency;
    private String timeZone;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static UserDTO fromUser(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .userName(user.getUsername())
                .profilePicture(user.getProfilePicture())
                .phoneNumber(user.getPhoneNumber())
                .bio(user.getBio())
                .roles(user.getRoles())
                .verified(user.isVerified())
                .active(user.isActive())
                .preferredLanguage(user.getPreferredLanguage())
                .preferredCurrency(user.getPreferredCurrency())
                .timeZone(user.getTimeZone())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
