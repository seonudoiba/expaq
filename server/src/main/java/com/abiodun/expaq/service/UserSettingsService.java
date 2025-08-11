package com.abiodun.expaq.service;

import com.abiodun.expaq.dto.UserPreferencesDTO;
import com.abiodun.expaq.model.ExpaqUserDetails;
import com.abiodun.expaq.model.User;
import com.abiodun.expaq.model.UserPreferences;
import com.abiodun.expaq.repository.UserRepository;
import com.abiodun.expaq.repository.UserSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserSettingsService {
    private final UserRepository userRepository;
    private final UserSettingsRepository settingsRepository;
    
    private User getCurrentUser() {
        ExpaqUserDetails userDetails = (ExpaqUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UUID userId = userDetails.getId();
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional(readOnly = true)
    public UserPreferencesDTO getUserPreferences() {
        User currentUser = getCurrentUser();
        UserPreferences settings = settingsRepository.findByUserId(currentUser.getId())
                .orElseGet(() -> createDefaultSettings(currentUser));

        return UserPreferencesDTO.builder()
                .profilePublic(settings.isShowProfileToPublic())
                .showEmail(settings.isShowEmailToPublic())
                .showPhone(settings.isShowPhoneToPublic())
                .showActivityHistory(settings.isShowActivityHistory())
                .showReviews(settings.isShowReviews())
                .showBookings(settings.isShowBookings())
                .emailNotifications(settings.isEmailNotifications())
                .pushNotifications(settings.isPushNotifications())
                .smsNotifications(settings.isSmsNotifications())
                .marketingEmails(settings.isMarketingEmails())
                .darkMode(settings.isDarkMode())
                .language(settings.getLanguage())
                .currency(settings.getCurrency())
                .timeZone(settings.getTimeZone())
                .preferredActivityTypes(settings.getPreferredActivityTypes())
                .preferredLocations(settings.getPreferredLocations())
                .maxPriceRange(settings.getMaxPriceRange())
                .minPriceRange(settings.getMinPriceRange())
                .dietaryRestrictions(settings.getDietaryRestrictions())
                .accessibilityNeeds(settings.getAccessibilityNeeds())
                .build();
    }

    @Transactional
    public UserPreferencesDTO updatePreferences(UserPreferencesDTO preferencesDTO) {
        User currentUser = getCurrentUser();
        UserPreferences settings = settingsRepository.findByUserId(currentUser.getId())
                .orElseGet(() -> createDefaultSettings(currentUser));

        updateSettingsFromDTO(settings, preferencesDTO);
        settings = settingsRepository.save(settings);

        return getUserPreferences();
    }

    @Transactional
    public void updateSecuritySettings(boolean twoFactorEnabled, String twoFactorMethod) {
        User currentUser = getCurrentUser();
        UserPreferences settings = settingsRepository.findByUserId(currentUser.getId())
                .orElseGet(() -> createDefaultSettings(currentUser));

        // Security settings would be handled in a separate security preferences entity
        settingsRepository.save(settings);
    }

    @Transactional
    public void updateNotificationSettings(UserPreferencesDTO preferencesDTO) {
        User currentUser = getCurrentUser();
        UserPreferences settings = settingsRepository.findByUserId(currentUser.getId())
                .orElseGet(() -> createDefaultSettings(currentUser));

        settings.setEmailNotifications(preferencesDTO.isEmailNotifications());
        settings.setPushNotifications(preferencesDTO.isPushNotifications());
        settings.setSmsNotifications(preferencesDTO.isSmsNotifications());
        settings.setMarketingEmails(preferencesDTO.isMarketingEmails());

        settingsRepository.save(settings);
    }

    private UserPreferences createDefaultSettings(User user) {
        UserPreferences settings = new UserPreferences();
        settings.setUser(user);
        return settingsRepository.save(settings);
    }

    private void updateSettingsFromDTO(UserPreferences settings, UserPreferencesDTO dto) {
        // Privacy settings
        settings.setShowProfileToPublic(dto.isProfilePublic());
        settings.setShowEmailToPublic(dto.isShowEmail());
        settings.setShowPhoneToPublic(dto.isShowPhone());
        settings.setShowActivityHistory(dto.isShowActivityHistory());
        settings.setShowReviews(dto.isShowReviews());
        settings.setShowBookings(dto.isShowBookings());
        
        // Notification settings
        settings.setEmailNotifications(dto.isEmailNotifications());
        settings.setPushNotifications(dto.isPushNotifications());
        settings.setSmsNotifications(dto.isSmsNotifications());
        settings.setMarketingEmails(dto.isMarketingEmails());
        
        // Display settings
        settings.setDarkMode(dto.isDarkMode());
        if (dto.getLanguage() != null) {
            settings.setLanguage(dto.getLanguage());
        }
        if (dto.getCurrency() != null) {
            settings.setCurrency(dto.getCurrency());
        }
        if (dto.getTimeZone() != null) {
            settings.setTimeZone(dto.getTimeZone());
        }
        
        // Activity preferences
        if (dto.getPreferredActivityTypes() != null) {
            settings.setPreferredActivityTypes(dto.getPreferredActivityTypes());
        }
        if (dto.getPreferredLocations() != null) {
            settings.setPreferredLocations(dto.getPreferredLocations());
        }
        if (dto.getMaxPriceRange() != null) {
            settings.setMaxPriceRange(dto.getMaxPriceRange());
        }
        if (dto.getMinPriceRange() != null) {
            settings.setMinPriceRange(dto.getMinPriceRange());
        }
        if (dto.getDietaryRestrictions() != null) {
            settings.setDietaryRestrictions(dto.getDietaryRestrictions());
        }
        if (dto.getAccessibilityNeeds() != null) {
            settings.setAccessibilityNeeds(dto.getAccessibilityNeeds());
        }
    }
}
