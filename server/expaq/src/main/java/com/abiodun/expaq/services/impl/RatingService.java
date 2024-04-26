package com.abiodun.expaq.services.impl;

import com.abiodun.expaq.exception.InvalidRatingRequestException;
import com.abiodun.expaq.exception.InvalidRatingRequestException;
import com.abiodun.expaq.models.Activity;
import com.abiodun.expaq.models.Rating;
import com.abiodun.expaq.repository.RatingRepository;
import com.abiodun.expaq.services.IActivityService;
import com.abiodun.expaq.services.IRatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingService implements IRatingService {

    @Autowired
    private final RatingRepository ratingRepository;
    private final IActivityService activityService;
    @Override
    public List<Rating> getRatings() {
        return ratingRepository.findAll();
    }
    @Override
    public List<Rating> getAllRatingsByActivityId(Long activityId) {
        return ratingRepository.findByActivityId(activityId);
    }

    @Override
    public Rating saveRating(Long activityId, Rating ratingRequest) {
        Activity activity = activityService.getActivityById(activityId).get();
        List<Rating> existingRatings = activity.getRatings();
        return ratingRepository.save(ratingRequest);
    }
    public Double getAverageRating(Long activityId) {
        List<Rating> ratings = ratingRepository.findByActivityId(activityId);
        return ratings.stream().mapToDouble(Rating::getRating).average().orElse(0.0);
    }
}
