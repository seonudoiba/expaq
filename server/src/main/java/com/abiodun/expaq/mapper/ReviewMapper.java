package com.abiodun.expaq.mapper;

import com.abiodun.expaq.dto.*;
import com.abiodun.expaq.model.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ReviewMapper {
    ReviewMapper INSTANCE = Mappers.getMapper(ReviewMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "editedAt", ignore = true)
    @Mapping(target = "verified", constant = "false")
    @Mapping(target = "edited", constant = "false")
    @Mapping(target = "blockchainTxHash", ignore = true)
    @Mapping(target = "editReason", ignore = true)
    Review toReview(CreateReviewRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "editedAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "edited", constant = "true")
    @Mapping(target = "verified", ignore = true)
    @Mapping(target = "blockchainTxHash", ignore = true)
    Review toReview(UpdateReviewRequest request);

    @Mapping(target = "activityId", source = "activity.id")
    @Mapping(target = "activityTitle", source = "activity.title")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userName", expression = "java(review.getUser().getFirstName() + \" \" + review.getUser().getLastName())")
    @Mapping(target = "userProfilePicture", source = "user.profilePicture")
    ReviewResponse toReviewResponse(Review review);

    @Mapping(target = "activityId", source = "activity.id")
    @Mapping(target = "activityTitle", source = "activity.title")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userName", expression = "java(review.getUser().getFirstName() + \" \" + review.getUser().getLastName())")
    @Mapping(target = "userProfilePicture", source = "user.profilePicture")
    ReviewDTO toReviewDTO(Review review);
} 