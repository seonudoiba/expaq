package com.abiodun.expaq.service;

import com.abiodun.expaq.dto.ReviewDTO;
import jakarta.validation.Valid;

import java.util.List;
import java.util.UUID;

public interface IReviewService {

    /**
     * Creates a new review for a completed booking.
     *
     * @param reviewDTO The review details.
     * @param userId The ID of the user submitting the review.
     * @return The created review DTO.
     * @throws com.abiodun.expaq.exception.ResourceNotFoundException if the booking is not found.
     * @throws com.abiodun.expaq.exception.UnauthorizedException if the user doesn't own the booking.
     * @throws IllegalStateException if the booking is not completed or already reviewed.
     */
    ReviewDTO createReview(@Valid ReviewDTO reviewDTO, UUID userId);

    /**
     * Retrieves all reviews for a specific activity.
     *
     * @param activityId The ID of the activity.
     * @return A list of review DTOs for the activity.
     */
    List<ReviewDTO> getReviewsForActivity(UUID activityId);

    // Optional: Get review by booking ID
    // Optional<ReviewDTO> getReviewByBookingId(UUID bookingId);

    // Optional: Get reviews by user ID
    // List<ReviewDTO> getReviewsByUser(UUID userId);
}
