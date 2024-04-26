package com.abiodun.expaq.services;

import com.abiodun.expaq.models.BookedActivity;
import com.abiodun.expaq.models.Rating;

import java.util.List;

public interface IRatingService {
    List<Rating> getRatings();
    Rating saveRating(Long ActivityId, Rating rating);
    Double getAverageRating(Long activityId);
    List<Rating> getAllRatingsByActivityId(Long activityId);

}
