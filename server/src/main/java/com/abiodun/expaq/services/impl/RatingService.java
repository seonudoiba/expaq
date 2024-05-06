package com.abiodun.expaq.services.impl;

import com.abiodun.expaq.dto.response.RatingResponse;
import com.abiodun.expaq.exception.ActivityNotFoundException;
import com.abiodun.expaq.exception.RatingNotFoundException;
import com.abiodun.expaq.models.Activity;
import com.abiodun.expaq.models.Rating;
import com.abiodun.expaq.repository.ActivityRepository;
import com.abiodun.expaq.repository.RatingRepository;
import com.abiodun.expaq.services.IRatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RatingService implements IRatingService {
    private final RatingRepository ratingRepository;
    private final ActivityRepository activityRepository;

    @Autowired
    public RatingService(RatingRepository ratingRepository, ActivityRepository activityRepository) {
        this.ratingRepository = ratingRepository;
        this.activityRepository = activityRepository;
    }

    @Override
    public RatingResponse createRating(Long activityId, RatingResponse ratingResponse) {
        Rating rating = mapToEntity(ratingResponse);

        Activity activity = activityRepository.findById(activityId).orElseThrow(() -> new ActivityNotFoundException("Activity with associated Rating not found"));

        rating.setActivity(activity);

        Rating newRating = ratingRepository.save(rating);

        return mapToDto(newRating);
    }

    @Override
    public List<RatingResponse> getRatingsByActivityId(Long id) {
        List<Rating> ratings = ratingRepository.findByActivityId(id);

        return ratings.stream().map(rating -> mapToDto(rating)).collect(Collectors.toList());
    }

    @Override
    public RatingResponse getRatingById(Long ratingId, Long activityId) {
        Activity activity = activityRepository.findById(activityId).orElseThrow(() -> new ActivityNotFoundException("Activity with associated Rating not found"));

        Rating rating = ratingRepository.findById(ratingId).orElseThrow(() -> new RatingNotFoundException("Rating with associate activity not found"));

        if(rating.getActivity().getId() != activity.getId()) {
            throw new RatingNotFoundException("This Rating does not belond to a activity");
        }

        return mapToDto(rating);
    }

    @Override
    public RatingResponse updateRating(Long activityId, Long ratingId, RatingResponse ratingResponse) {
        Activity activity = activityRepository.findById(activityId).orElseThrow(() -> new ActivityNotFoundException("Activity with associated Rating not found"));

        Rating rating = ratingRepository.findById(ratingId).orElseThrow(() -> new RatingNotFoundException("Rating with associate activity not found"));

        if(rating.getActivity().getId() != activity.getId()) {
            throw new RatingNotFoundException("This Rating does not belong to a activity");
        }

        rating.setTitle(ratingResponse.getTitle());
        rating.setContent(ratingResponse.getContent());
        rating.setStars(ratingResponse.getStars());

        Rating updateRating = ratingRepository.save(rating);

        return mapToDto(updateRating);
    }

    @Override
    public void deleteRating(Long activityId, Long ratingId) {
        Activity activity = activityRepository.findById(activityId).orElseThrow(() -> new ActivityNotFoundException("Activity with associated Rating not found"));

        Rating rating = ratingRepository.findById(ratingId).orElseThrow(() -> new RatingNotFoundException("Rating with associate activity not found"));

        if(rating.getActivity().getId() != activity.getId()) {
            throw new RatingNotFoundException("This Rating does not belong to a activity");
        }

        ratingRepository.delete(rating);
    }

    private RatingResponse mapToDto(Rating rating) {
        RatingResponse ratingResponse = new RatingResponse();
        ratingResponse.setId(rating.getId());
        ratingResponse.setTitle(rating.getTitle());
        ratingResponse.setContent(rating.getContent());
        ratingResponse.setStars(rating.getStars());
        return ratingResponse;
    }

    private Rating mapToEntity(RatingResponse ratingResponse) {
        Rating rating = new Rating();
        rating.setId(ratingResponse.getId());
        rating.setTitle(ratingResponse.getTitle());
        rating.setContent(ratingResponse.getContent());
        rating.setStars(ratingResponse.getStars());
        return rating;
    }
}
