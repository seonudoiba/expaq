//package com.abiodun.expaq.service;
//
//import com.abiodun.expaq.dto.UserDTO;
//import com.abiodun.expaq.dto.UserPreferencesDTO;
//import com.abiodun.expaq.model.User;
//import com.abiodun.expaq.repository.UserRepository;
//import com.abiodun.expaq.service.impl.AuthServiceImpl;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//@Service
//@RequiredArgsConstructor
//public class UserSettingsService {
//    private final UserRepository userRepository;
//    private final AuthServiceImpl userService;
//
//    @Transactional(readOnly = true)
//    public UserPreferencesDTO getUserPreferences() {
//        User currentUser = userService.getCurrentUser();
//        User settings = userRepository.findByUserId(currentUser.getId())
//                .orElseGet(() -> createDefaultSettings(currentUser));
//
//        return UserPreferencesDTO.builder()
//                .profilePublic(settings.isProfilePublic())
//                .showEmail(settings.isShowEmail())
//                .showPhone(settings.isShowPhone())
//                .emailNotifications(settings.isEmailNotifications())
//                .pushNotifications(settings.isPushNotifications())
//                .bookingNotifications(settings.isBookingNotifications())
//                .marketingEmails(settings.isMarketingEmails())
//                .emailFrequency(settings.getEmailFrequency())
//                .twoFactorEnabled(settings.isTwoFactorEnabled())
//                .twoFactorMethod(settings.getTwoFactorMethod())
//                .shareActivityData(settings.isShareActivityData())
//                .shareProfileData(settings.isShareProfileData())
//                .build();
//    }
//
//    @Transactional
//    public UserPreferencesDTO updatePreferences(UserPreferencesDTO preferencesDTO) {
//        User currentUser = userService.getCurrentUser();
//        UserSettings settings = settingsRepository.findByUserId(currentUser.getId())
//                .orElseGet(() -> createDefaultSettings(currentUser));
//
//        updateSettingsFromDTO(settings, preferencesDTO);
//        settings = settingsRepository.save(settings);
//
//        return getUserPreferences();
//    }
//
//    @Transactional
//    public void updateSecuritySettings(boolean twoFactorEnabled, String twoFactorMethod) {
//        User currentUser = userService.getCurrentUser();
//        UserSettings settings = settingsRepository.findByUserId(currentUser.getId())
//                .orElseGet(() -> createDefaultSettings(currentUser));
//
//        settings.setTwoFactorEnabled(twoFactorEnabled);
//        settings.setTwoFactorMethod(twoFactorMethod);
//        settingsRepository.save(settings);
//    }
//
//    @Transactional
//    public void updateNotificationSettings(UserPreferencesDTO preferencesDTO) {
//        User currentUser = userService.getCurrentUser();
//        UserSettings settings = settingsRepository.findByUserId(currentUser.getId())
//                .orElseGet(() -> createDefaultSettings(currentUser));
//
//        settings.setEmailNotifications(preferencesDTO.isEmailNotifications());
//        settings.setPushNotifications(preferencesDTO.isPushNotifications());
//        settings.setBookingNotifications(preferencesDTO.isBookingNotifications());
//        settings.setMarketingEmails(preferencesDTO.isMarketingEmails());
//        settings.setEmailFrequency(preferencesDTO.getEmailFrequency());
//
//        settingsRepository.save(settings);
//    }
//
//    private UserSettings createDefaultSettings(User user) {
//        UserSettings settings = new UserSettings();
//        settings.setUser(user);
//        return settingsRepository.save(settings);
//    }
//
//    private void updateSettingsFromDTO(UserSettings settings, UserPreferencesDTO dto) {
//        settings.setProfilePublic(dto.isProfilePublic());
//        settings.setShowEmail(dto.isShowEmail());
//        settings.setShowPhone(dto.isShowPhone());
//        settings.setEmailNotifications(dto.isEmailNotifications());
//        settings.setPushNotifications(dto.isPushNotifications());
//        settings.setBookingNotifications(dto.isBookingNotifications());
//        settings.setMarketingEmails(dto.isMarketingEmails());
//        settings.setEmailFrequency(dto.getEmailFrequency());
//        settings.setTwoFactorEnabled(dto.isTwoFactorEnabled());
//        settings.setTwoFactorMethod(dto.getTwoFactorMethod());
//        settings.setShareActivityData(dto.isShareActivityData());
//        settings.setShareProfileData(dto.isShareProfileData());
//    }
//}
