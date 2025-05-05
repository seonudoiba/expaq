package com.abiodun.expaq.service;

import com.abiodun.expaq.dto.*;
import com.abiodun.expaq.exception.ResourceNotFoundException;
import com.abiodun.expaq.exception.ReviewValidationException;
import com.abiodun.expaq.mapper.ReviewMapper;
import com.abiodun.expaq.model.*;
import com.abiodun.expaq.repository.ReviewRepository;
import com.abiodun.expaq.service.impl.ReviewServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private IActivityService activityService;

    @Mock
    private UserService userService;

    @Mock
    private IBookingService bookingService;

    @Mock
    private ReviewMapper reviewMapper;

    @InjectMocks
    private ReviewServiceImpl reviewService;

    private UUID userId;
    private UUID activityId;
    private UUID bookingId;
    private UUID reviewId;
    private User user;
    private Activity activity;
    private Booking booking;
    private Review review;
    private BookingDTO bookingDTO;
    private ReviewResponse reviewResponse;
    private CreateReviewRequest createReviewRequest;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        activityId = UUID.randomUUID();
        bookingId = UUID.randomUUID();
        reviewId = UUID.randomUUID();

        user = new User();
        user.setId(userId);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setProfilePicture("profile.jpg");

        activity = new Activity();
        activity.setId(activityId);
        activity.setTitle("Test Activity");
        activity.setHost(user);

        booking = new Booking();
        booking.setId(bookingId);
        booking.setUser(user);
        booking.setActivity(activity);
        booking.setStatus(Booking.BookingStatus.COMPLETED);

        bookingDTO = new BookingDTO();
        bookingDTO.setId(bookingId);
        bookingDTO.setActivityId(activityId);
        bookingDTO.setActivityTitle("Test Activity");
        bookingDTO.setUserId(userId);
        bookingDTO.setUserName("John Doe");
        bookingDTO.setStatus(Booking.BookingStatus.COMPLETED);

        review = new Review();
        review.setId(reviewId);
        review.setBooking(booking);
        review.setActivity(activity);
        review.setUser(user);
        review.setHost(user);
        review.setRating(5);
        review.setComment("Great experience!");
        review.setPhotos("photo1.jpg,photo2.jpg");
        review.setVerified(false);
        review.setEdited(false);
        review.setCreatedAt(LocalDateTime.now());
        review.setUpdatedAt(LocalDateTime.now());

        reviewResponse = ReviewResponse.fromReview(review);

        createReviewRequest = new CreateReviewRequest();
        createReviewRequest.setBookingId(bookingId);
        createReviewRequest.setRating(5);
        createReviewRequest.setComment("Great experience!");
        createReviewRequest.setPhotos("photo1.jpg,photo2.jpg");
    }

    @Test
    void createReview_Success() {
        when(bookingService.getBooking(bookingId, userId)).thenReturn(bookingDTO);
        when(reviewRepository.findByUserIdAndBookingId(userId, bookingId)).thenReturn(null);
        when(reviewMapper.toReview(any(CreateReviewRequest.class))).thenReturn(review);
        when(reviewRepository.save(any(Review.class))).thenReturn(review);
        when(reviewMapper.toReviewResponse(any(Review.class))).thenReturn(reviewResponse);

        ReviewResponse response = reviewService.createReview(createReviewRequest, userId);

        assertNotNull(response);
        assertEquals(reviewId, response.getId());
        assertEquals(bookingId, response.getBookingId());
        assertEquals(activityId, response.getActivityId());
        assertEquals(userId, response.getUserId());
        assertEquals("John Doe", response.getUserName());
        assertEquals("profile.jpg", response.getUserProfilePicture());
        assertEquals(5, response.getRating());
        assertEquals("Great experience!", response.getComment());
        assertEquals("photo1.jpg,photo2.jpg", response.getPhotos());
        assertFalse(response.isVerified());
        assertFalse(response.isEdited());

        verify(bookingService).getBooking(bookingId, userId);
        verify(reviewRepository).findByUserIdAndBookingId(userId, bookingId);
        verify(reviewMapper).toReview(any(CreateReviewRequest.class));
        verify(reviewRepository).save(any(Review.class));
        verify(reviewMapper).toReviewResponse(any(Review.class));
    }

    @Test
    void createReview_BookingNotFound() {
        when(bookingService.getBooking(bookingId, userId))
                .thenThrow(new ReviewValidationException("Booking not found"));

        assertThrows(ReviewValidationException.class, 
            () -> reviewService.createReview(createReviewRequest, userId));
        
        verify(bookingService).getBooking(bookingId, userId);
        verify(reviewRepository, never()).save(any(Review.class));
    }

    @Test
    void createReview_AlreadyReviewed() {
        when(bookingService.getBooking(bookingId, userId)).thenReturn(bookingDTO);
        when(reviewRepository.findByUserIdAndBookingId(userId, bookingId)).thenReturn(review);

        assertThrows(ReviewValidationException.class, 
            () -> reviewService.createReview(createReviewRequest, userId));
        
        verify(bookingService).getBooking(bookingId, userId);
        verify(reviewRepository).findByUserIdAndBookingId(userId, bookingId);
        verify(reviewRepository, never()).save(any(Review.class));
    }

    @Test
    void updateReview_Success() {
        UpdateReviewRequest request = new UpdateReviewRequest();
        request.setRating(4);
        request.setComment("Updated review");
        request.setPhotos("new_photo.jpg");
        request.setEditReason("Changed my mind");

        when(reviewRepository.findById(reviewId)).thenReturn(Optional.of(review));
        when(reviewRepository.save(any(Review.class))).thenReturn(review);
        when(reviewMapper.toReviewResponse(any(Review.class))).thenReturn(reviewResponse);

        ReviewResponse response = reviewService.updateReview(reviewId, request, userId);

        assertNotNull(response);
        assertEquals(reviewId, response.getId());
        assertEquals(4, response.getRating());
        assertEquals("Updated review", response.getComment());
        assertEquals("new_photo.jpg", response.getPhotos());
        assertTrue(response.isEdited());
        assertEquals("Changed my mind", response.getEditReason());

        verify(reviewRepository).findById(reviewId);
        verify(reviewRepository).save(any(Review.class));
        verify(reviewMapper).toReviewResponse(any(Review.class));
    }

    @Test
    void updateReview_NotFound() {
        UpdateReviewRequest request = new UpdateReviewRequest();
        when(reviewRepository.findById(reviewId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, 
            () -> reviewService.updateReview(reviewId, request, userId));
        
        verify(reviewRepository).findById(reviewId);
        verify(reviewRepository, never()).save(any(Review.class));
    }

    @Test
    void updateReview_Unauthorized() {
        UpdateReviewRequest request = new UpdateReviewRequest();
        UUID differentUserId = UUID.randomUUID();

        when(reviewRepository.findById(reviewId)).thenReturn(Optional.of(review));

        assertThrows(ReviewValidationException.class, 
            () -> reviewService.updateReview(reviewId, request, differentUserId));
        
        verify(reviewRepository).findById(reviewId);
        verify(reviewRepository, never()).save(any(Review.class));
    }

    @Test
    void deleteReview_Success() {
        when(reviewRepository.findById(reviewId)).thenReturn(Optional.of(review));

        reviewService.deleteReview(reviewId, userId);

        verify(reviewRepository).findById(reviewId);
        verify(reviewRepository).delete(review);
    }

    @Test
    void deleteReview_NotFound() {
        when(reviewRepository.findById(reviewId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, 
            () -> reviewService.deleteReview(reviewId, userId));
        
        verify(reviewRepository).findById(reviewId);
        verify(reviewRepository, never()).delete(any(Review.class));
    }

    @Test
    void deleteReview_Unauthorized() {
        UUID differentUserId = UUID.randomUUID();
        when(reviewRepository.findById(reviewId)).thenReturn(Optional.of(review));

        assertThrows(ReviewValidationException.class, 
            () -> reviewService.deleteReview(reviewId, differentUserId));
        
        verify(reviewRepository).findById(reviewId);
        verify(reviewRepository, never()).delete(any(Review.class));
    }

    @Test
    void getReviewById_Success() {
        when(reviewRepository.findById(reviewId)).thenReturn(Optional.of(review));
        when(reviewMapper.toReviewResponse(any(Review.class))).thenReturn(reviewResponse);

        ReviewResponse response = reviewService.getReviewById(reviewId);

        assertNotNull(response);
        assertEquals(reviewId, response.getId());
        verify(reviewRepository).findById(reviewId);
        verify(reviewMapper).toReviewResponse(any(Review.class));
    }

    @Test
    void getReviewById_NotFound() {
        when(reviewRepository.findById(reviewId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, 
            () -> reviewService.getReviewById(reviewId));
        
        verify(reviewRepository).findById(reviewId);
    }

    @Test
    void getReviewsByActivityId_Success() {
        Page<Review> reviewPage = new PageImpl<>(Collections.singletonList(review));
        when(reviewRepository.findByActivityId(activityId, any(Pageable.class))).thenReturn(reviewPage);
        when(reviewRepository.calculateAverageRatingByActivityId(activityId)).thenReturn(5.0);
        when(reviewRepository.countByActivityId(activityId)).thenReturn(1);
        when(reviewRepository.countByActivityIdAndRating(activityId, 5)).thenReturn(1);
        when(reviewRepository.countByActivityIdAndVerified(activityId, true)).thenReturn(0);
        when(reviewRepository.countByActivityIdAndEdited(activityId, true)).thenReturn(0);
        when(reviewMapper.toReviewResponse(any(Review.class))).thenReturn(reviewResponse);

        ReviewPageResponse response = reviewService.getReviewsByActivityId(activityId, Pageable.unpaged());

        assertNotNull(response);
        assertEquals(1, response.getReviews().size());
        assertEquals(1, response.getTotalElements());
        assertNotNull(response.getStatistics());
        assertEquals(5.0, response.getStatistics().getAverageRating());
        assertEquals(1, response.getStatistics().getTotalReviews());
        assertEquals(1, response.getStatistics().getFiveStarReviews());

        verify(reviewRepository).findByActivityId(activityId, any(Pageable.class));
        verify(reviewRepository).calculateAverageRatingByActivityId(activityId);
        verify(reviewRepository).countByActivityId(activityId);
        verify(reviewRepository).countByActivityIdAndRating(activityId, 5);
        verify(reviewRepository).countByActivityIdAndVerified(activityId, true);
        verify(reviewRepository).countByActivityIdAndEdited(activityId, true);
        verify(reviewMapper).toReviewResponse(any(Review.class));
    }

    @Test
    void getReviewStatistics_Success() {
        when(reviewRepository.calculateAverageRatingByActivityId(activityId)).thenReturn(5.0);
        when(reviewRepository.countByActivityId(activityId)).thenReturn(1);
        when(reviewRepository.countByActivityIdAndRating(activityId, 5)).thenReturn(1);
        when(reviewRepository.countByActivityIdAndRating(activityId, 4)).thenReturn(0);
        when(reviewRepository.countByActivityIdAndRating(activityId, 3)).thenReturn(0);
        when(reviewRepository.countByActivityIdAndRating(activityId, 2)).thenReturn(0);
        when(reviewRepository.countByActivityIdAndRating(activityId, 1)).thenReturn(0);
        when(reviewRepository.countByActivityIdAndVerified(activityId, true)).thenReturn(0);
        when(reviewRepository.countByActivityIdAndEdited(activityId, true)).thenReturn(0);

        ReviewStatistics statistics = reviewService.getReviewStatistics(activityId);

        assertNotNull(statistics);
        assertEquals(5.0, statistics.getAverageRating());
        assertEquals(1, statistics.getTotalReviews());
        assertEquals(1, statistics.getFiveStarReviews());
        assertEquals(0, statistics.getFourStarReviews());
        assertEquals(0, statistics.getThreeStarReviews());
        assertEquals(0, statistics.getTwoStarReviews());
        assertEquals(0, statistics.getOneStarReviews());
        assertEquals(0, statistics.getVerifiedReviews());
        assertEquals(0, statistics.getEditedReviews());
        assertEquals(100.0, statistics.getRatingPercentage());

        verify(reviewRepository).calculateAverageRatingByActivityId(activityId);
        verify(reviewRepository).countByActivityId(activityId);
        verify(reviewRepository).countByActivityIdAndRating(activityId, 5);
        verify(reviewRepository).countByActivityIdAndRating(activityId, 4);
        verify(reviewRepository).countByActivityIdAndRating(activityId, 3);
        verify(reviewRepository).countByActivityIdAndRating(activityId, 2);
        verify(reviewRepository).countByActivityIdAndRating(activityId, 1);
        verify(reviewRepository).countByActivityIdAndVerified(activityId, true);
        verify(reviewRepository).countByActivityIdAndEdited(activityId, true);
    }

    @Test
    void verifyReview_Success() {
        when(reviewRepository.findById(reviewId)).thenReturn(Optional.of(review));
        when(reviewRepository.save(any(Review.class))).thenReturn(review);

        reviewService.verifyReview(reviewId, userId);

        assertTrue(review.isVerified());
        verify(reviewRepository).findById(reviewId);
        verify(reviewRepository).save(any(Review.class));
    }

    @Test
    void unverifyReview_Success() {
        review.setVerified(true);
        when(reviewRepository.findById(reviewId)).thenReturn(Optional.of(review));
        when(reviewRepository.save(any(Review.class))).thenReturn(review);

        reviewService.unverifyReview(reviewId, userId);

        assertFalse(review.isVerified());
        verify(reviewRepository).findById(reviewId);
        verify(reviewRepository).save(any(Review.class));
    }

    @Test
    void getReviewByBookingId_Success() {
        when(reviewRepository.findByBookingId(bookingId)).thenReturn(review);
        when(reviewMapper.toReviewResponse(any(Review.class))).thenReturn(reviewResponse);

        ReviewResponse response = reviewService.getReviewByBookingId(bookingId);

        assertNotNull(response);
        assertEquals(reviewId, response.getId());
        assertEquals(bookingId, response.getBookingId());
        verify(reviewRepository).findByBookingId(bookingId);
        verify(reviewMapper).toReviewResponse(any(Review.class));
    }

    @Test
    void hasUserReviewedActivity_Success() {
        when(reviewRepository.findByUserIdAndActivityId(userId, activityId)).thenReturn(review);

        boolean hasReviewed = reviewService.hasUserReviewedActivity(userId, activityId);

        assertTrue(hasReviewed);
        verify(reviewRepository).findByUserIdAndActivityId(userId, activityId);
    }

    @Test
    void hasUserReviewedBooking_Success() {
        when(reviewRepository.findByUserIdAndBookingId(userId, bookingId)).thenReturn(review);

        boolean hasReviewed = reviewService.hasUserReviewedBooking(userId, bookingId);

        assertTrue(hasReviewed);
        verify(reviewRepository).findByUserIdAndBookingId(userId, bookingId);
    }
} 