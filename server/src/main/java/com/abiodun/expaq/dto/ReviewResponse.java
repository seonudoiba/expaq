package com.abiodun.expaq.dto;

import com.abiodun.expaq.model.Review;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
public class ReviewResponse {
    private UUID id;
    private UUID bookingId;
    private UUID activityId;
    private String activityTitle;
    private UUID userId;
    private String userName;
    private String userProfilePicture;
    private int rating;
    private String comment;
    private String photos;
    private String blockchainTxHash;
    private boolean isVerified;
    private boolean isEdited;
    private String editReason;
    private LocalDateTime editedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ReviewResponse fromReview(Review review) {
        ReviewResponse response = new ReviewResponse();
        response.setId(review.getId());
        response.setBookingId(review.getBooking().getId());
        response.setActivityId(review.getActivity().getId());
        response.setActivityTitle(review.getActivity().getTitle());
        response.setUserId(review.getUser().getId());
        response.setUserName(review.getUser().getFirstName() + " " + review.getUser().getLastName());
        response.setUserProfilePicture(review.getUser().getProfilePicture());
        response.setRating(review.getRating());
        response.setComment(review.getComment());
        response.setPhotos(review.getPhotos());
        response.setBlockchainTxHash(review.getBlockchainTxHash());
        response.setVerified(review.isVerified());
        response.setEdited(review.isEdited());
        response.setEditReason(review.getEditReason());
        response.setEditedAt(review.getEditedAt());
        response.setCreatedAt(review.getCreatedAt());
        response.setUpdatedAt(review.getUpdatedAt());
        return response;
    }
} 