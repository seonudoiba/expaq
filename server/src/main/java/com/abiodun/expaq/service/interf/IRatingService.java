package com.abiodun.expaq.service.interf;



import com.abiodun.expaq.model.Rating;
import com.abiodun.expaq.model.User;
import com.abiodun.expaq.response.RatingResponse;

import java.util.List;

public interface IRatingService {
    RatingResponse createRating(Long activityId, Rating rating, User user);
    List<RatingResponse> getRatingsByActivityId(Long id);
    RatingResponse getRatingById(Long ratingId, Long activityId);
    RatingResponse updateRating(Long activityId, Long ratingId, RatingResponse ratingResponse);
    void deleteRating(Long activityId, Long ratingId);
}
