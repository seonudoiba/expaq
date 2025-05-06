package com.abiodun.expaq.service;

import com.abiodun.expaq.dto.*;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface IReviewService {
    ReviewResponse createReview(CreateReviewRequest request, UUID userId);
    ReviewResponse updateReview(UUID reviewId, UpdateReviewRequest request, UUID userId);
    void deleteReview(UUID reviewId, UUID userId);
    ReviewResponse getReviewById(UUID reviewId);
    ReviewPageResponse getReviewsByActivityId(UUID activityId, Pageable pageable);
    ReviewPageResponse getReviewsByUserId(UUID userId, Pageable pageable);
    ReviewPageResponse getReviewsByHostId(UUID hostId, Pageable pageable);
    ReviewPageResponse searchReviews(ReviewSearchCriteria criteria, Pageable pageable);
    ReviewStatistics getReviewStatistics(UUID activityId);
    ReviewStatistics getHostReviewStatistics(UUID hostId);
    void verifyReview(UUID reviewId, UUID adminId);
    void unverifyReview(UUID reviewId, UUID adminId);
    ReviewResponse getReviewByBookingId(UUID bookingId);
    boolean hasUserReviewedActivity(UUID userId, UUID activityId);
    boolean hasUserReviewedBooking(UUID userId, UUID bookingId);
    void flagReview(UUID reviewId, UUID userId, String reason);
    List<ReviewDTO> getVerifiedReviews(UUID activityId);
    List<ReviewDTO> getFlaggedReviews();
    List<ReviewDTO> getRecentReviews(LocalDateTime since);
    List<ReviewDTO> getReviewsByRating(UUID activityId, int rating);
    List<ReviewDTO> getReviewsByDateRange(UUID activityId, LocalDateTime start, LocalDateTime end);
    double getAverageRating(UUID activityId);
    List<Integer> getRatingDistribution(UUID activityId);
}