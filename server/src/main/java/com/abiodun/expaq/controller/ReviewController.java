package com.abiodun.expaq.controller;

import com.abiodun.expaq.dto.*;
import com.abiodun.expaq.service.IReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
//@RequiredArgsConstructor
public class ReviewController {

    private final IReviewService reviewService;

    public ReviewController(IReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReviewResponse> createReview(
            @RequestBody @Valid CreateReviewRequest request,
            Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        ReviewResponse response = reviewService.createReview(request, userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{reviewId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable UUID reviewId,
            @RequestBody @Valid UpdateReviewRequest request,
            Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        ReviewResponse response = reviewService.updateReview(reviewId, request, userId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{reviewId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteReview(
            @PathVariable UUID reviewId,
            Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        reviewService.deleteReview(reviewId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{reviewId}")
    public ResponseEntity<ReviewResponse> getReviewById(@PathVariable UUID reviewId) {
        ReviewResponse response = reviewService.getReviewById(reviewId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/activity/{activityId}")
    public ResponseEntity<ReviewPageResponse> getReviewsByActivityId(
            @PathVariable UUID activityId,
            Pageable pageable) {
        ReviewPageResponse response = reviewService.getReviewsByActivityId(activityId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ReviewPageResponse> getReviewsByUserId(
            @PathVariable UUID userId,
            Pageable pageable) {
        ReviewPageResponse response = reviewService.getReviewsByUserId(userId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/host/{hostId}")
    public ResponseEntity<ReviewPageResponse> getReviewsByHostId(
            @PathVariable UUID hostId,
            Pageable pageable) {
        ReviewPageResponse response = reviewService.getReviewsByHostId(hostId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<ReviewPageResponse> searchReviews(
            @ModelAttribute ReviewSearchCriteria criteria,
            Pageable pageable) {
        ReviewPageResponse response = reviewService.searchReviews(criteria, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/activity/{activityId}/statistics")
    public ResponseEntity<ReviewStatistics> getReviewStatistics(@PathVariable UUID activityId) {
        ReviewStatistics statistics = reviewService.getReviewStatistics(activityId);
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/host/{hostId}/statistics")
    public ResponseEntity<ReviewStatistics> getHostReviewStatistics(@PathVariable UUID hostId) {
        ReviewStatistics statistics = reviewService.getHostReviewStatistics(hostId);
        return ResponseEntity.ok(statistics);
    }

    @PostMapping("/{reviewId}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> verifyReview(
            @PathVariable UUID reviewId,
            Authentication authentication) {
        UUID adminId = UUID.fromString(authentication.getName());
        reviewService.verifyReview(reviewId, adminId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{reviewId}/unverify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> unverifyReview(
            @PathVariable UUID reviewId,
            Authentication authentication) {
        UUID adminId = UUID.fromString(authentication.getName());
        reviewService.unverifyReview(reviewId, adminId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<ReviewResponse> getReviewByBookingId(@PathVariable UUID bookingId) {
        ReviewResponse response = reviewService.getReviewByBookingId(bookingId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check-activity-review")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Boolean> hasUserReviewedActivity(
            @RequestParam UUID activityId,
            Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        boolean hasReviewed = reviewService.hasUserReviewedActivity(userId, activityId);
        return ResponseEntity.ok(hasReviewed);
    }

    @GetMapping("/check-booking-review")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Boolean> hasUserReviewedBooking(
            @RequestParam UUID bookingId,
            Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        boolean hasReviewed = reviewService.hasUserReviewedBooking(userId, bookingId);
        return ResponseEntity.ok(hasReviewed);
    }
}
