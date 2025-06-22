package com.abiodun.expaq.dto;

import com.abiodun.expaq.model.TimeSlot;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class TimeSlotDTO {
    private Long id;

    @NotBlank(message = "Start time is required")
    private String startTime;

    @NotBlank(message = "End time is required")
    private String endTime;

    @NotNull(message = "Max participants is required")
    @Min(value = 1, message = "Max participants must be at least 1")
    private Integer maxParticipants;

    private boolean isAvailable = true;

    @JsonBackReference
    private ActivityScheduleDTO schedule;

    public static TimeSlotDTO fromTimeSlot(TimeSlot timeSlot) {
        if (timeSlot == null) {
            return null;
        }

        TimeSlotDTO dto = new TimeSlotDTO();
        dto.setId(timeSlot.getId());
        dto.setStartTime(timeSlot.getStartTime());
        dto.setEndTime(timeSlot.getEndTime());
        dto.setMaxParticipants(timeSlot.getMaxParticipants());
        dto.setAvailable(timeSlot.isAvailable());

        return dto;
    }
}
