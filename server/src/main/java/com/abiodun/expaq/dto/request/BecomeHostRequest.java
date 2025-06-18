package com.abiodun.expaq.dto.request;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BecomeHostRequest {

    @NotBlank(message = "Last name is required")
    private String displayName;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Description about yourself is required")
    private String bio;

    @NotBlank(message = "ID verification document is required")
    private String identificationDocument;

    private String languages;
}
