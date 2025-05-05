package com.abiodun.expaq.controller;

import com.abiodun.expaq.dto.*;
import com.abiodun.expaq.service.ReviewService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReviewControllerTest {

    @Mock
    private ReviewService reviewService;

    @Mock
    private Authentication authentication;

    @Mock
    private SecurityContext securityContext;

    @InjectMocks
    private ReviewController reviewController;

    private UUID userId;
    private UUID activityId;
    private UUID bookingId;
    private UUID reviewId;
    private CreateReviewRequest createRequest;
    private UpdateReviewRequest updateRequest;
    private ReviewResponse reviewResponse;
    private ReviewPageResponse reviewPageResponse;
    private ReviewStatistics reviewStatistics;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        activityId = UUID.randomUUID();
        bookingId = UUID.randomUUID();
        reviewId = UUID.randomUUID();

        createRequest = new CreateReviewRequest();
        createRequest.setBookingId(bookingId);
        createRequest.setRating(5);
        createRequest.setComment("Great experience!");
        createRequest.setPhotos("photo1.jpg,photo2.jpg");

        updateRequest = new UpdateReviewRequest();
        updateRequest.setRating(4);
        updateRequest.setComment("Updated review");
        updateRequest.setPhotos("new_photo.jpg");
        updateRequest.setEditReason("Changed my mind");

        reviewResponse = new ReviewResponse();
        reviewResponse.setId(reviewId);
        reviewResponse.setBookingId(bookingId);
        reviewResponse.setActivityId(activityId);
        reviewResponse.setUserId(userId);
        reviewResponse.setUserName("John Doe");
        reviewResponse.setUserProfilePicture("profile.jpg");
        reviewResponse.setRating(5);
        reviewResponse.setComment("Great experience!");
        reviewResponse.setPhotos("photo1.jpg,photo2.jpg");
        reviewResponse.setVerified(false);
        reviewResponse.setEdited(false);
        reviewResponse.setCreatedAt(LocalDateTime.now());
        reviewResponse.setUpdatedAt(LocalDateTime.now());

        reviewPageResponse = new ReviewPageResponse(
                Collections.singletonList(reviewResponse),
                0,
                1,
                1,
                10,
                reviewStatistics
        );

        reviewStatistics = new ReviewStatistics(
                5.0,
                1,
                1,
                0,
                0,
                0,
                0,
                0,
                0
        );

        when(authentication.getName()).thenReturn(userId.toString());
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void createReview_Success() {
        when(reviewService.createReview(any(CreateReviewRequest.class), any(UUID.class)))
                .thenReturn(reviewResponse);

        ResponseEntity<ReviewResponse> response = reviewController.createReview(createRequest, authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(reviewId, response.getBody().getId());
        assertEquals(bookingId, response.getBody().getBookingId());
        assertEquals(activityId, response.getBody().getActivityId());
        assertEquals(userId, response.getBody().getUserId());
        assertEquals("John Doe", response.getBody().getUserName());
        assertEquals("profile.jpg", response.getBody().getUserProfilePicture());
        assertEquals(5, response.getBody().getRating());
        assertEquals("Great experience!", response.getBody().getComment());
        assertEquals("photo1.jpg,photo2.jpg", response.getBody().getPhotos());
        assertFalse(response.getBody().isVerified());
        assertFalse(response.getBody().isEdited());

        verify(reviewService).createReview(any(CreateReviewRequest.class), any(UUID.class));
    }

    @Test
    void updateReview_Success() {
        when(reviewService.updateReview(any(UUID.class), any(UpdateReviewRequest.class), any(UUID.class)))
                .thenReturn(reviewResponse);

        ResponseEntity<ReviewResponse> response = reviewController.updateReview(reviewId, updateRequest, authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(reviewId, response.getBody().getId());

        verify(reviewService).updateReview(any(UUID.class), any(UpdateReviewRequest.class), any(UUID.class));
    }

    @Test
    void deleteReview_Success() {
        ResponseEntity<Void> response = reviewController.deleteReview(reviewId, authentication);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertNull(response.getBody());

        verify(reviewService).deleteReview(any(UUID.class), any(UUID.class));
    }

    @Test
    void getReviewById_Success() {
        when(reviewService.getReviewById(any(UUID.class))).thenReturn(reviewResponse);

        ResponseEntity<ReviewResponse> response = reviewController.getReviewById(reviewId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(reviewId, response.getBody().getId());

        verify(reviewService).getReviewById(any(UUID.class));
    }

    @Test
    void getReviewsByActivityId_Success() {
        when(reviewService.getReviewsByActivityId(any(UUID.class), any(Pageable.class)))
                .thenReturn(reviewPageResponse);

        ResponseEntity<ReviewPageResponse> response = reviewController.getReviewsByActivityId(activityId, Pageable.unpaged());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().getReviews().size());
        assertEquals(1, response.getBody().getTotalElements());

        verify(reviewService).getReviewsByActivityId(any(UUID.class), any(Pageable.class));
    }

    @Test
    void getReviewsByUserId_Success() {
        when(reviewService.getReviewsByUserId(any(UUID.class), any(Pageable.class)))
                .thenReturn(reviewPageResponse);

        ResponseEntity<ReviewPageResponse> response = reviewController.getReviewsByUserId(userId, Pageable.unpaged());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().getReviews().size());
        assertEquals(1, response.getBody().getTotalElements());

        verify(reviewService).getReviewsByUserId(any(UUID.class), any(Pageable.class));
    }

    @Test
    void getReviewsByHostId_Success() {
        when(reviewService.getReviewsByHostId(any(UUID.class), any(Pageable.class)))
                .thenReturn(reviewPageResponse);

        ResponseEntity<ReviewPageResponse> response = reviewController.getReviewsByHostId(userId, Pageable.unpaged());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().getReviews().size());
        assertEquals(1, response.getBody().getTotalElements());

        verify(reviewService).getReviewsByHostId(any(UUID.class), any(Pageable.class));
    }

    @Test
    void searchReviews_Success() {
        ReviewSearchCriteria criteria = new ReviewSearchCriteria();
        when(reviewService.searchReviews(any(ReviewSearchCriteria.class), any(Pageable.class)))
                .thenReturn(reviewPageResponse);

        ResponseEntity<ReviewPageResponse> response = reviewController.searchReviews(criteria, Pageable.unpaged());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().getReviews().size());
        assertEquals(1, response.getBody().getTotalElements());

        verify(reviewService).searchReviews(any(ReviewSearchCriteria.class), any(Pageable.class));
    }

    @Test
    void getReviewStatistics_Success() {
        when(reviewService.getReviewStatistics(any(UUID.class))).thenReturn(reviewStatistics);

        ResponseEntity<ReviewStatistics> response = reviewController.getReviewStatistics(activityId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(5.0, response.getBody().getAverageRating());
        assertEquals(1, response.getBody().getTotalReviews());
        assertEquals(1, response.getBody().getFiveStarReviews());

        verify(reviewService).getReviewStatistics(any(UUID.class));
    }

    @Test
    void getHostReviewStatistics_Success() {
        when(reviewService.getHostReviewStatistics(any(UUID.class))).thenReturn(reviewStatistics);

        ResponseEntity<ReviewStatistics> response = reviewController.getHostReviewStatistics(userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(5.0, response.getBody().getAverageRating());
        assertEquals(1, response.getBody().getTotalReviews());
        assertEquals(1, response.getBody().getFiveStarReviews());

        verify(reviewService).getHostReviewStatistics(any(UUID.class));
    }

    @Test
    void verifyReview_Success() {
        ResponseEntity<Void> response = reviewController.verifyReview(reviewId, authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNull(response.getBody());

        verify(reviewService).verifyReview(any(UUID.class), any(UUID.class));
    }

    @Test
    void unverifyReview_Success() {
        ResponseEntity<Void> response = reviewController.unverifyReview(reviewId, authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNull(response.getBody());

        verify(reviewService).unverifyReview(any(UUID.class), any(UUID.class));
    }

    @Test
    void getReviewByBookingId_Success() {
        when(reviewService.getReviewByBookingId(any(UUID.class))).thenReturn(reviewResponse);

        ResponseEntity<ReviewResponse> response = reviewController.getReviewByBookingId(bookingId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(reviewId, response.getBody().getId());
        assertEquals(bookingId, response.getBody().getBookingId());

        verify(reviewService).getReviewByBookingId(any(UUID.class));
    }

    @Test
    void hasUserReviewedActivity_Success() {
        when(reviewService.hasUserReviewedActivity(any(UUID.class), any(UUID.class))).thenReturn(true);

        ResponseEntity<Boolean> response = reviewController.hasUserReviewedActivity(activityId, authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody());

        verify(reviewService).hasUserReviewedActivity(any(UUID.class), any(UUID.class));
    }

    @Test
    void hasUserReviewedBooking_Success() {
        when(reviewService.hasUserReviewedBooking(any(UUID.class), any(UUID.class))).thenReturn(true);

        ResponseEntity<Boolean> response = reviewController.hasUserReviewedBooking(bookingId, authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody());

        verify(reviewService).hasUserReviewedBooking(any(UUID.class), any(UUID.class));
    }
} 