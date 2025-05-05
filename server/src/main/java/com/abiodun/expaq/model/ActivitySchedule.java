package com.abiodun.expaq.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivitySchedule {
    private List<TimeSlot> timeSlots;
    private List<String> availableDays;
    private String timeZone;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TimeSlot {
        private String startTime;
        private String endTime;
        private int maxParticipants;
        private boolean isAvailable;
    }
}