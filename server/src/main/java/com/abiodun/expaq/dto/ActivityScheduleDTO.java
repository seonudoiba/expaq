package com.abiodun.expaq.dto;

import com.abiodun.expaq.model.ActivitySchedule;
import com.abiodun.expaq.model.TimeSlot;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class ActivityScheduleDTO {
    private Long id;

    @Valid
    @NotEmpty(message = "Time slots are required")
    @JsonManagedReference
    private List<TimeSlotDTO> timeSlots;

    @NotEmpty(message = "Available days are required")
    private List<String> availableDays;

    @NotNull(message = "Time zone is required")
    private String timeZone;

    public static ActivityScheduleDTO fromActivitySchedule(ActivitySchedule schedule) {
        if (schedule == null) {
            return null;
        }

        ActivityScheduleDTO dto = new ActivityScheduleDTO();
        dto.setId(schedule.getId());
        dto.setTimeZone(schedule.getTimeZone());
        dto.setAvailableDays(schedule.getAvailableDays());

        if (schedule.getTimeSlots() != null) {
            dto.setTimeSlots(schedule.getTimeSlots().stream()
                .map(TimeSlotDTO::fromTimeSlot)
                .collect(Collectors.toList()));
        }

        return dto;
    }
}
