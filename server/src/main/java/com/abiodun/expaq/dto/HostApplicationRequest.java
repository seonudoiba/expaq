package com.abiodun.expaq.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class HostApplicationRequest {
    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Experience is required")
    private String experience;

    @NotBlank(message = "Document URL is required")
    private String documentUrl; // URL to verification document
} 