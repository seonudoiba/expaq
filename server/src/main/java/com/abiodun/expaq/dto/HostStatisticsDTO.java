package com.abiodun.expaq.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class HostStatisticsDTO {
    private int totalActivities;
    private int activeActivities;
    private int totalBookings;
    private int completedBookings;
    private int cancelledBookings;
    private int totalReviews;
    private double averageRating;
    private int totalEarnings;
    private int responseRate;
    private int averageResponseTime;
    private LocalDateTime lastUpdated;

}