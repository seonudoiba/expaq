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
    private boolean showActivityHistory;
    private boolean showReviews;
    private boolean showBookings;

    // Notification settings
    private boolean emailNotifications;
    private boolean pushNotifications;
    private boolean smsNotifications;
    private boolean marketingEmails;

    // Display settings
    private boolean darkMode;
    private String language;
    private String currency;
    private String timeZone;

    // Activity preferences
    private String preferredActivityTypes;
    private String preferredLocations;
    private Integer maxPriceRange;
    private Integer minPriceRange;
    private String dietaryRestrictions;
    private String accessibilityNeeds;
}
