package com.abiodun.expaq.dto;

import com.abiodun.expaq.model.Role;
import com.abiodun.expaq.model.User;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

@Data
public class RegisterRequest {

    @NotBlank(message = "Username cannot be blank")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String displayName;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    // Consider adding complexity requirements (e.g., @Pattern)
    private String password;

    @NotBlank(message = "First name cannot be blank")
    private String firstName;

    @NotBlank(message = "Last name cannot be blank")
    private String lastName;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Invalid email format")
    private String email;

    @NotNull(message = "Role cannot be null")
    private Set<Role> roles; // TOURIST or HOST

    @NotBlank(message = "Profile Picture cannot be blank")
    private String profilePictureUrl;

    @NotBlank(message = "Bio cannot be blank")
    private String bio;

}
