package com.abiodun.expaq.controller;

import com.abiodun.expaq.dto.AuthResponse;
import com.abiodun.expaq.dto.LoginRequest;
import com.abiodun.expaq.dto.RegisterRequest;
import com.abiodun.expaq.dto.UserDTO;
import com.abiodun.expaq.exception.ErrorResponse;
import com.abiodun.expaq.model.ExpaqUserDetails;
import com.abiodun.expaq.model.Role;
import com.abiodun.expaq.repository.RoleRepository;
import com.abiodun.expaq.service.IAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final IAuthService authService;
    private final RoleRepository roleRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Authentication failed: " + e.getMessage()));
        }
    }
    @PostMapping("/become-host")
    public ResponseEntity<?> becomeHost(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.becomeHost(request);
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Authentication failed: " + e.getMessage()));
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), "Invalid email or password"));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Authentication failed: " + e.getMessage()));
        }
    }
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getMe(
//            @RequestAttribute("userId") UUID userId
            @AuthenticationPrincipal ExpaqUserDetails currentUser
            ) {
        if (currentUser == null ) {
            return null;
        }
        UUID userId = currentUser.getId();
        return ResponseEntity.ok(authService.getMe(userId));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<Void> verifyEmail(@RequestParam String token) {
        authService.verifyEmail(token);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users-by-role")
    public Page<UserDTO> getUsersByRole(@RequestParam String roleName, Pageable pageable) {
        Role role = roleRepository.findByName(roleName);
        return authService.getHosts(role, pageable);
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