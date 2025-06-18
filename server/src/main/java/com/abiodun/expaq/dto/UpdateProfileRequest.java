package com.abiodun.expaq.dto;

import com.abiodun.expaq.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

@Data
public class UpdateProfileRequest {

    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String displayName;

    private String firstName;

    private String lastName;

    @Email(message = "Invalid email format")
    private String email;

    private Set<Role> roles; // TOURIST or HOST

    private String profilePictureUrl;

    private String phoneNumber;

    private String bio;

} 