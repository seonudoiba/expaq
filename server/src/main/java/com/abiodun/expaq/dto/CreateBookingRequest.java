package com.abiodun.expaq.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class CreateBookingRequest {
    @NotNull(message = "Activity ID is required")
    private UUID activityId;

    @NotNull(message = "Number of guests is required")
    @Min(value = 1, message = "Number of guests must be at least 1")
    private Integer numberOfGuests;

    private LocalDateTime bookingDateTime;


    @NotNull(message = "Start time is required")
    @Future(message = "Start time must be in the future")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    @Future(message = "End time must be in the future")
    private LocalDateTime endTime;

    @Size(max = 500, message = "Special requests cannot exceed 500 characters")
    private String specialRequests;
} 