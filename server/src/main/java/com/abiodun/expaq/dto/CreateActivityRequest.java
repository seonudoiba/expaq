package com.abiodun.expaq.dto;

import com.abiodun.expaq.model.Activity.ActivityCategory;
import com.abiodun.expaq.model.ActivitySchedule;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CreateActivityRequest {
    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price must be non-negative")
    private BigDecimal price;

    @NotNull(message = "Latitude is required")
    @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
    @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
    @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
    private Double longitude;

    @NotNull(message = "Category is required")
    private ActivityCategory category;

    @Valid
    @NotNull(message = "Schedule is required")
    private ActivitySchedule schedule;

    @NotEmpty(message = "At least one media URL is required")
    private List<String> mediaUrls;

    @NotNull(message = "Maximum participants is required")
    @Min(value = 1, message = "Maximum participants must be at least 1")
    private Integer maxParticipants;

//    @NotNull(message = "Capacity should ")
//    @Min(value = 1, message = "Maximum participants must be at least 1")
    private Integer capacity;
    private Integer bookedCapacity;
    private String address;
    private String city;
    private String country;
    private Boolean isFeatured;

    @NotNull(message = "Minimum participants is required")
    @Min(value = 1, message = "Minimum participants must be at least 1")
    private Integer minParticipants;

    @NotNull(message = "Duration is required")
    @Min(value = 15, message = "Duration must be at least 15 minutes")
    @Max(value = 1440, message = "Duration cannot exceed 24 hours (1440 minutes)")
    private Integer durationMinutes;
} 