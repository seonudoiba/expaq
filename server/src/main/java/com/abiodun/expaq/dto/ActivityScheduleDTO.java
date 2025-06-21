package com.abiodun.expaq.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class ActivityScheduleDTO {
    @Valid
    @NotEmpty(message = "Time slots are required")
    private List<TimeSlotDTO> timeSlots;

    @NotEmpty(message = "Available days are required")
    private List<String> availableDays;

    @NotNull(message = "Time zone is required")
    private String timeZone;
}
