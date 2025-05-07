package com.abiodun.expaq.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "account_preferences")
@AllArgsConstructor
@NoArgsConstructor
public class UserPreferences {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private boolean emailNotifications = true;

    @Column(nullable = false)
    private boolean pushNotifications = true;

    @Column(nullable = false)
    private boolean smsNotifications = false;

    @Column(nullable = false)
    private boolean marketingEmails = false;

    @Column(nullable = false)
    private boolean darkMode = false;

    @Column(nullable = false)
    private String language = "en";

    @Column(nullable = false)
    private String currency = "USD";

    @Column(nullable = false)
    private String timeZone = "UTC";

    @Column
    private String preferredActivityTypes;

    @Column
    private String preferredLocations;

    @Column
    private Integer maxPriceRange;

    @Column
    private Integer minPriceRange;

    @Column
    private String dietaryRestrictions;

    @Column
    private String accessibilityNeeds;

    @Column
    private boolean showProfileToPublic = true;

    @Column
    private boolean showEmailToPublic = false;

    @Column
    private boolean showPhoneToPublic = false;

    @Column
    private boolean showActivityHistory = true;

    @Column
    private boolean showReviews = true;

    @Column
    private boolean showBookings = false;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public void updateNotificationPreferences(boolean email, boolean push, boolean sms, boolean marketing) {
        this.emailNotifications = email;
        this.pushNotifications = push;
        this.smsNotifications = sms;
        this.marketingEmails = marketing;
        this.updatedAt = LocalDateTime.now();
    }

    public void updateDisplayPreferences(boolean darkMode, String language) {
        this.darkMode = darkMode;
        this.language = language;
        this.updatedAt = LocalDateTime.now();
    }

    public void updatePrivacySettings(boolean showProfile, boolean showEmail, boolean showPhone, 
                                    boolean showHistory, boolean showReviews, boolean showBookings) {
        this.showProfileToPublic = showProfile;
        this.showEmailToPublic = showEmail;
        this.showPhoneToPublic = showPhone;
        this.showActivityHistory = showHistory;
        this.showReviews = showReviews;
        this.showBookings = showBookings;
        this.updatedAt = LocalDateTime.now();
    }
} 