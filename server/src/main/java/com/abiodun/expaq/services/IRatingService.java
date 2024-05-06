package com.abiodun.expaq.services;



import com.abiodun.expaq.dto.response.RatingResponse;

import java.util.List;

public interface IRatingService {
    RatingResponse createRating(Long activityId, RatingResponse ratingResponse);
    List<RatingResponse> getRatingsByActivityId(Long id);
    RatingResponse getRatingById(Long ratingId, Long activityId);
    RatingResponse updateRating(Long activityId, Long ratingId, RatingResponse ratingResponse);
    void deleteRating(Long activityId, Long ratingId);
}
