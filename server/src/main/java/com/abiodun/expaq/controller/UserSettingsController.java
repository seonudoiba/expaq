//package com.abiodun.expaq.controller;
//
//import com.abiodun.expaq.dto.UserDTO;
//import com.abiodun.expaq.dto.UserPreferencesDTO;
//import com.abiodun.expaq.service.IAuthService;
//import com.abiodun.expaq.service.UserSettingsService;
//import io.swagger.v3.oas.annotations.Operation;
//import io.swagger.v3.oas.annotations.tags.Tag;
//import jakarta.validation.Valid;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/v1/settings")
//@RequiredArgsConstructor
//@Tag(name = "User Settings", description = "API endpoints for managing user settings and preferences")
//public class UserSettingsController {
//
//    private final UserSettingsService settingsService;
//    private final IAuthService userService;
//
//    @GetMapping("/preferences")
//    @Operation(summary = "Get user preferences and settings")
//    public ResponseEntity<UserPreferencesDTO> getUserPreferences() {
//        return ResponseEntity.ok(settingsService.getUserPreferences());
//    }
//
//    @PutMapping("/preferences")
//    @Operation(summary = "Update user preferences and settings")
//    public ResponseEntity<UserPreferencesDTO> updatePreferences(
//            @Valid @RequestBody UserPreferencesDTO preferencesDTO) {
//        return ResponseEntity.ok(settingsService.updatePreferences(preferencesDTO));
//    }
//
//    @PutMapping("/notifications")
//    @Operation(summary = "Update notification settings")
//    public ResponseEntity<Void> updateNotificationSettings(
//            @Valid @RequestBody UserPreferencesDTO preferencesDTO) {
//        settingsService.updateNotificationSettings(preferencesDTO);
//        return ResponseEntity.ok().build();
//    }
//
//    @PutMapping("/security")
//    @Operation(summary = "Update security settings")
//    public ResponseEntity<Void> updateSecuritySettings(
//            @RequestParam boolean twoFactorEnabled,
//            @RequestParam(required = false) String twoFactorMethod) {
//        settingsService.updateSecuritySettings(twoFactorEnabled, twoFactorMethod);
//        return ResponseEntity.ok().build();
//    }
//}
