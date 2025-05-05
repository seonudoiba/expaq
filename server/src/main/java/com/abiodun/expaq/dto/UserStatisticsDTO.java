package com.abiodun.expaq.dto;

import lombok.Data;

@Data
public class UserStatisticsDTO {
    private int totalBookings;
    private int completedBookings;
    private int cancelledBookings;
    private int totalReviews;
    private double averageRating;
    private int totalSpent;
    private int favoriteActivities;
} 