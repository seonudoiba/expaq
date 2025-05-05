package com.abiodun.expaq.dto;

import java.util.List;
import java.util.UUID;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateReviewRequest {
    @NotNull(message = "Booking ID cannot be null")
    private UUID bookingId;

    @NotNull(message = "Activity ID cannot be null")
    private UUID activityId;

    @NotNull(message = "Rating cannot be null")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;

    @Size(max = 1000, message = "Comment must not exceed 1000 characters")
    private String comment;

    private String photos;
} 