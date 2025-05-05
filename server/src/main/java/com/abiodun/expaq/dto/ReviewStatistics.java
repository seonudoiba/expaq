package com.abiodun.expaq.dto;

import lombok.Data;

@Data
public class ReviewStatistics {
    private double averageRating;
    private int totalReviews;
    private int fiveStarReviews;
    private int fourStarReviews;
    private int threeStarReviews;
    private int twoStarReviews;
    private int oneStarReviews;
    private int verifiedReviews;
    private int editedReviews;
    private double ratingPercentage;

    public ReviewStatistics(double averageRating, int totalReviews, int fiveStarReviews,
                          int fourStarReviews, int threeStarReviews, int twoStarReviews,
                          int oneStarReviews, int verifiedReviews, int editedReviews) {
        this.averageRating = averageRating;
        this.totalReviews = totalReviews;
        this.fiveStarReviews = fiveStarReviews;
        this.fourStarReviews = fourStarReviews;
        this.threeStarReviews = threeStarReviews;
        this.twoStarReviews = twoStarReviews;
        this.oneStarReviews = oneStarReviews;
        this.verifiedReviews = verifiedReviews;
        this.editedReviews = editedReviews;
        this.ratingPercentage = totalReviews > 0 ? (double) (fiveStarReviews + fourStarReviews) / totalReviews * 100 : 0;
    }
} 