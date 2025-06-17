package com.abiodun.expaq.service.impl;

import com.abiodun.expaq.dto.ActivityDTO;
import com.abiodun.expaq.dto.RatingRequest;
import com.abiodun.expaq.model.User;
import com.abiodun.expaq.response.RatingResponse;
import com.abiodun.expaq.exception.ActivityNotFoundException;
import com.abiodun.expaq.exception.RatingNotFoundException;
import com.abiodun.expaq.model.Activity;
import com.abiodun.expaq.model.Rating;
import com.abiodun.expaq.repository.ActivityRepository;
import com.abiodun.expaq.repository.RatingRepository;
import com.abiodun.expaq.service.IActivityService;
import com.abiodun.expaq.service.IRatingService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RatingService implements IRatingService {
    private final RatingRepository ratingRepository;
    private final ActivityRepository activityRepository;
    private final IActivityService activityService;

    @Autowired
    public RatingService(RatingRepository ratingRepository, ActivityRepository activityRepository, IActivityService activityService) {
        this.ratingRepository = ratingRepository;
        this.activityRepository = activityRepository;
        this.activityService = activityService;
    }

    @Transactional
    @Override
    public RatingResponse createRating(UUID activityId, RatingRequest requestRating, User loggedInUser) {
        // Fetch the activity by ID
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ActivityNotFoundException("Activity not found"));

        // Map Activity to ActivityDTO
        ActivityDTO activityDTO = activityService.mapToActivityDTO(activity);

        Rating rating = new Rating();

        // Check if the user has already rated this activity
        boolean hasUserRated = ratingRepository.existsByActivityAndUser(activity, loggedInUser);
        if (hasUserRated) {
            throw new RuntimeException("You have already rated this activity.");
        }

        // Set the activity and user for the rating
        rating.setContent(requestRating.getContent());
        rating.setTitle(requestRating.getTitle());
        rating.setStars(requestRating.getStars());
        rating.setActivity(activity);
        rating.setUser(loggedInUser); // Ensure the Rating entity has a reference to the User

        // Save the rating
        Rating savedRating = ratingRepository.save(rating);
        return mapToDto(savedRating);
    }

    @Override
    public List<RatingResponse> getRatingsByActivityId(UUID id) {
        List<Rating> ratings = ratingRepository.findByActivityId(id);

        return ratings.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public RatingResponse getRatingById(UUID activityId, UUID ratingId) {
        Activity activity = activityRepository.findById(activityId).orElseThrow(() -> new ActivityNotFoundException("Activity with associated Rating not found"));

        Rating rating = ratingRepository.findById(ratingId).orElseThrow(() -> new RatingNotFoundException("Rating with associate activity not found"));

        if(rating.getActivity().getId() != activity.getId()) {
            throw new RatingNotFoundException("This Rating" + ratingId + "does not belong to a activity" + " with id: " + activityId);
        }

        return mapToDto(rating);
    }

    @Override
    public RatingResponse updateRating(UUID activityId, UUID ratingId, RatingResponse ratingResponse) {
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
    public void deleteRating(UUID activityId, UUID ratingId) {
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
