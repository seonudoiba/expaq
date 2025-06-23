package com.abiodun.expaq.service.impl;

import com.abiodun.expaq.dto.*;
import com.abiodun.expaq.exception.ResourceNotFoundException;
import com.abiodun.expaq.mapper.ReviewMapper;
import com.abiodun.expaq.model.Activity;
import com.abiodun.expaq.model.Booking;
import com.abiodun.expaq.model.Review;
import com.abiodun.expaq.model.User;
import com.abiodun.expaq.repository.ActivityRepository;
import com.abiodun.expaq.repository.BookingRepository;
import com.abiodun.expaq.repository.ReviewRepository;
import com.abiodun.expaq.repository.UserRepository;
import com.abiodun.expaq.service.IReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements IReviewService {

    private final ReviewRepository reviewRepository;
    private final ActivityRepository activityRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ReviewMapper reviewMapper;

    @Override
    @Transactional
    public ReviewResponse createReview(CreateReviewRequest request, UUID userId) {
        // Get activity and user
        Activity activity = activityRepository.findById(request.getActivityId())
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));


        // Verify user has completed a booking for this activity
        List<Booking> userBookings = bookingRepository.findByUserIdAndActivityId(userId, request.getActivityId());
        if (userBookings.isEmpty() ||
                userBookings.stream().noneMatch(booking -> Booking.BookingStatus.COMPLETED.equals(booking.getStatus()))) {
            throw new RuntimeException("User has not completed any bookings for this activity");
        }

        // Check if user has already reviewed this activity
        if (reviewRepository.existsByActivityIdAndUserId(request.getActivityId(), userId)) {
            throw new RuntimeException("User has already reviewed this activity");
        }
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow( () -> new ResourceNotFoundException("Booking not found"));
//                .orElseThrow(() -> new ChangeSetPersister.NotFoundException("Booking not found"));
        // Create review
        Review review = reviewMapper.toReview(request);
        review.setActivity(activity);
        review.setUser(user);
        review.setHost(activity.getHost());
        review.setVerified(false);
        review.setEdited(false);
        review.setBooking(booking);
        review.setCreatedAt(LocalDateTime.now());

        // Save review
        review = reviewRepository.save(review);

        // Update activity's average rating
        activity.updateAverageRating();
        activityRepository.save(activity);

        return reviewMapper.toReviewResponse(review);
    }

    @Override
    @Transactional
    public ReviewResponse updateReview(UUID reviewId, UpdateReviewRequest request, UUID userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        // Check if user owns the review
        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to update this review");
        }

        // Update review
        review.update(
            request.getRating(),
            request.getComment(),
            request.getPhotos(),
            request.getEditReason()
        );

        review = reviewRepository.save(review);
        return reviewMapper.toReviewResponse(review);
    }

    @Override
    @Transactional
    public void deleteReview(UUID reviewId, UUID userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        // Check if user owns the review or is an admin
        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this review");
        }

        // Delete review
        reviewRepository.delete(review);

        // Update activity's average rating
        Activity activity = review.getActivity();
        activity.updateAverageRating();
        activityRepository.save(activity);
    }

    @Override
    public ReviewResponse getReviewById(UUID reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        return reviewMapper.toReviewResponse(review);
    }

    @Override
    public ReviewPageResponse getReviewsByActivityId(UUID activityId, Pageable pageable) {
        Page<Review> reviewPage = reviewRepository.findLatestByActivityId(activityId, pageable);
        List<ReviewResponse> reviews = reviewPage.getContent().stream()
                .map(reviewMapper::toReviewResponse)
                .collect(Collectors.toList());

        double averageRating = reviewRepository.calculateAverageRatingByActivityId(activityId);
        int totalReviews = reviewRepository.countByActivityId(activityId);
        int fiveStarReviews = reviewRepository.countByActivityIdAndRating(activityId, 5);
        int fourStarReviews = reviewRepository.countByActivityIdAndRating(activityId, 4);
        int threeStarReviews = reviewRepository.countByActivityIdAndRating(activityId, 3);
        int twoStarReviews = reviewRepository.countByActivityIdAndRating(activityId, 2);
        int oneStarReviews = reviewRepository.countByActivityIdAndRating(activityId, 1);
        int verifiedReviews = reviewRepository.countByActivityIdAndVerified(activityId, true);
        int editedReviews = reviewRepository.countByActivityIdAndEdited(activityId, true);

        ReviewStatistics statistics = new ReviewStatistics(
                averageRating, totalReviews, fiveStarReviews, fourStarReviews,
                threeStarReviews, twoStarReviews, oneStarReviews, verifiedReviews, editedReviews
        );

        return new ReviewPageResponse(
                reviews,
                reviewPage.getNumber(),
                reviewPage.getSize(),
                reviewPage.getTotalElements(),
                reviewPage.getTotalPages(),
                statistics

//                reviewPage.isFirst(),
//                reviewPage.isLast(),
//                reviewPage.hasNext(),
//                reviewPage.hasPrevious()
        );
    }

    @Override
    public ReviewPageResponse getReviewsByUserId(UUID userId, Pageable pageable) {
        Page<Review> reviewPage = reviewRepository.findByUserId(userId, pageable);
        List<ReviewResponse> reviews = reviewPage.getContent().stream()
                .map(reviewMapper::toReviewResponse)
                .collect(Collectors.toList());

        return new ReviewPageResponse(
                reviews,
                reviewPage.getNumber(),
                reviewPage.getTotalPages(),
                reviewPage.getTotalElements(),
                reviewPage.getSize(),
                null
        );
    }
//
//    @Override
//    public ReviewPageResponse getReviewsByHostId(UUID hostId, Pageable pageable) {
//        return null;
//    }

    @Override
    public ReviewPageResponse getReviewsByHostId(UUID hostId, Pageable pageable) {
        Page<Review> reviewPage = reviewRepository.findByHostId(hostId, pageable);
        List<ReviewResponse> reviews = reviewPage.getContent().stream()
                .map(reviewMapper::toReviewResponse)
                .collect(Collectors.toList());

        return new ReviewPageResponse(
                reviews,
                reviewPage.getNumber(),
                reviewPage.getTotalPages(),
                reviewPage.getTotalElements(),
                reviewPage.getSize(),
                null
        );
    }

    @Override
    public ReviewPageResponse searchReviews(ReviewSearchCriteria criteria, Pageable pageable) {
        // Implementation for search reviews
        return null;
    }

    @Override
    public ReviewStatistics getReviewStatistics(UUID activityId) {
        double averageRating = reviewRepository.calculateAverageRatingByActivityId(activityId);
        int totalReviews = reviewRepository.countByActivityId(activityId);
        int fiveStarReviews = reviewRepository.countByActivityIdAndRating(activityId, 5);
        int fourStarReviews = reviewRepository.countByActivityIdAndRating(activityId, 4);
        int threeStarReviews = reviewRepository.countByActivityIdAndRating(activityId, 3);
        int twoStarReviews = reviewRepository.countByActivityIdAndRating(activityId, 2);
        int oneStarReviews = reviewRepository.countByActivityIdAndRating(activityId, 1);
        int verifiedReviews = reviewRepository.countByActivityIdAndVerified(activityId, true);
        int editedReviews = reviewRepository.countByActivityIdAndEdited(activityId, true);

        return new ReviewStatistics(
                averageRating, totalReviews, fiveStarReviews, fourStarReviews,
                threeStarReviews, twoStarReviews, oneStarReviews, verifiedReviews, editedReviews
        );
    }

    @Override
    public ReviewStatistics getHostReviewStatistics(UUID hostId) {
        return null;
    }

//    @Override
//    public ReviewStatistics getHostReviewStatistics(UUID hostId) {
//        double averageRating = reviewRepository.calculateAverageRatingByHostId(hostId);
//        int totalReviews = reviewRepository.countByHostId(hostId);
//        int fiveStarReviews = reviewRepository.countByHostIdAndRating(hostId, 5);
//        int fourStarReviews = reviewRepository.countByHostIdAndRating(hostId, 4);
//        int threeStarReviews = reviewRepository.countByHostIdAndRating(hostId, 3);
//        int twoStarReviews = reviewRepository.countByHostIdAndRating(hostId, 2);
//        int oneStarReviews = reviewRepository.countByHostIdAndRating(hostId, 1);
//        int verifiedReviews = reviewRepository.countByHostIdAndVerified(hostId, true);
//        int editedReviews = reviewRepository.countByHostIdAndEdited(hostId, true);
//
//        return new ReviewStatistics(
//                averageRating, totalReviews, fiveStarReviews, fourStarReviews,
//                threeStarReviews, twoStarReviews, oneStarReviews, verifiedReviews, editedReviews
//        );
//    }

    @Override
    @Transactional
    public void verifyReview(UUID reviewId, UUID adminId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        review.verify();
        reviewRepository.save(review);
    }

    @Override
    @Transactional
    public void unverifyReview(UUID reviewId, UUID adminId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        review.unverify();
        reviewRepository.save(review);
    }

    @Override
    public ReviewResponse getReviewByBookingId(UUID bookingId) {
        Review review = reviewRepository.findByBookingId(bookingId);
        if (review == null) {
            throw new ResourceNotFoundException("Review not found for booking");
        }
        return reviewMapper.toReviewResponse(review);
    }

    @Override
    public boolean hasUserReviewedActivity(UUID userId, UUID activityId) {
        return false;
    }

    @Override
    public boolean hasUserReviewedBooking(UUID userId, UUID bookingId) {
        return false;
    }

//    @Override
//    public boolean hasUserReviewedActivity(UUID userId, UUID activityId) {
//        return reviewRepository.findByUserIdAndActivityId(userId, activityId) != null;
//    }
//
//    @Override
//    public boolean hasUserReviewedBooking(UUID userId, UUID bookingId) {
//        return reviewRepository.findByUserIdAndBookingId(userId, bookingId) != null;
//    }

    @Override
    public void flagReview(UUID reviewId, UUID userId, String reason) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        review.flag(reason);
        reviewRepository.save(review);
    }

    @Override
    public List<ReviewDTO> getVerifiedReviews(UUID activityId) {
        return reviewRepository.findByActivityIdAndVerified(activityId, true).stream()
                .map(ReviewDTO::fromReview)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewDTO> getFlaggedReviews() {
        return reviewRepository.findByIsFlagged(true).stream()
                .map(ReviewDTO::fromReview)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewDTO> getRecentReviews(LocalDateTime since) {
        return reviewRepository.findByCreatedAtAfter(since).stream()
                .map(ReviewDTO::fromReview)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewDTO> getReviewsByRating(UUID activityId, int rating) {
        return reviewRepository.findByActivityIdAndRating(activityId, rating).stream()
                .map(ReviewDTO::fromReview)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewDTO> getReviewsByDateRange(UUID activityId, LocalDateTime start, LocalDateTime end) {
        return reviewRepository.findByActivityIdAndCreatedAtBetween(activityId, start, end).stream()
                .map(ReviewDTO::fromReview)
                .collect(Collectors.toList());
    }

    @Override
    public double getAverageRating(UUID activityId) {
        return reviewRepository.calculateAverageRatingByActivityId(activityId);
    }

    @Override
    public List<Integer> getRatingDistribution(UUID activityId) {
        return List.of(
                reviewRepository.countByActivityIdAndRating(activityId, 1),
                reviewRepository.countByActivityIdAndRating(activityId, 2),
                reviewRepository.countByActivityIdAndRating(activityId, 3),
                reviewRepository.countByActivityIdAndRating(activityId, 4),
                reviewRepository.countByActivityIdAndRating(activityId, 5)
        );
    }
}
