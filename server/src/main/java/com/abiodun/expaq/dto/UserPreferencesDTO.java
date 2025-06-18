package com.abiodun.expaq.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPreferencesDTO {
    // Privacy settings
    private boolean profilePublic;
    private boolean showEmail;
    private boolean showPhone;

    // Notification settings
    private boolean emailNotifications;
    private boolean pushNotifications;
    private boolean bookingNotifications;
    private boolean marketingEmails;
    private String emailFrequency;

    // Security settings
    private boolean twoFactorEnabled;
    private String twoFactorMethod;

    // Data sharing
    private boolean shareActivityData;
    private boolean shareProfileData;
}
