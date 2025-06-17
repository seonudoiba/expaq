package com.abiodun.expaq.dto;

import com.abiodun.expaq.model.Review;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
public class ReviewDTO {
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

    public static ReviewDTO fromReview(Review review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(review.getId());
//        dto.setBookingId(review.getBooking().getId());
        if (review.getBooking() != null) {
            dto.setBookingId(review.getBooking().getId());
        } else {
            dto.setBookingId(null);
        }
        dto.setActivityId(review.getActivity().getId());
        dto.setActivityTitle(review.getActivity().getTitle());
        dto.setUserId(review.getUser().getId());
        dto.setUserName(review.getUser().getFirstName() + " " + review.getUser().getLastName());
        dto.setUserProfilePicture(review.getUser().getProfilePicture());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setPhotos(review.getPhotos());
        dto.setBlockchainTxHash(review.getBlockchainTxHash());
        dto.setVerified(review.isVerified());
        dto.setEdited(review.isEdited());
        dto.setEditReason(review.getEditReason());
        dto.setEditedAt(review.getEditedAt());
        dto.setCreatedAt(review.getCreatedAt());
        dto.setUpdatedAt(review.getUpdatedAt());
        return dto;
    }
}
