package com.abiodun.expaq.controller;

import com.abiodun.expaq.dto.AuthResponse;
import com.abiodun.expaq.dto.LoginRequest;
import com.abiodun.expaq.dto.RegisterRequest;
import com.abiodun.expaq.dto.UserDTO;
import com.abiodun.expaq.service.IAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final IAuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getMe(@RequestAttribute("userId") UUID userId) {
        return ResponseEntity.ok(authService.getMe(userId));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<Void> verifyEmail(@RequestParam String token) {
        authService.verifyEmail(token);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<Void> resendVerificationEmail(@RequestParam String email) {
        authService.resendVerificationEmail(email);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/request-password-reset")
    public ResponseEntity<Void> requestPasswordReset(@RequestParam String email) {
        authService.requestPasswordReset(email);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(
            @RequestParam String token,
            @RequestParam String newPassword) {
        authService.resetPassword(token, newPassword);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/oauth2/{provider}")
    public ResponseEntity<AuthResponse> handleOAuth2Login(
            @PathVariable String provider,
            @RequestParam String providerId,
            @RequestParam String email,
            @RequestParam String name) {
        return ResponseEntity.ok(authService.handleOAuth2Login(provider, providerId, email, name));
    }
}