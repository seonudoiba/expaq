package com.abiodun.expaq.service;

import com.abiodun.expaq.model.Rating;
import com.abiodun.expaq.model.User;
import com.abiodun.expaq.response.RatingResponse;

import java.util.List;
import java.util.UUID;

public interface IRatingService {
    public RatingResponse createRating(UUID activityId, Rating rating, User loggedInUser);
    public List<RatingResponse> getRatingsByActivityId(UUID id);
    public RatingResponse getRatingById(UUID activityId, UUID ratingId);
    public RatingResponse updateRating(UUID activityId, UUID ratingId, RatingResponse ratingResponse);
    public void deleteRating(UUID activityId, UUID ratingId);

}
