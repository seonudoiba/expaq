package com.abiodun.expaq.service;

import com.abiodun.expaq.model.User;
import com.abiodun.expaq.response.RatingResponse;
import com.abiodun.expaq.exception.ActivityNotFoundException;
import com.abiodun.expaq.exception.RatingNotFoundException;
import com.abiodun.expaq.model.Activity;
import com.abiodun.expaq.model.Rating;
import com.abiodun.expaq.repository.ActivityRepository;
import com.abiodun.expaq.repository.RatingRepository;
import com.abiodun.expaq.service.interf.IRatingService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RatingService implements IRatingService {
    private final RatingRepository ratingRepository;
    private final ActivityRepository activityRepository;
    private final ActivityService activityService;

    @Autowired
    public RatingService(RatingRepository ratingRepository, ActivityRepository activityRepository, ActivityService activityService) {
        this.ratingRepository = ratingRepository;
        this.activityRepository = activityRepository;
        this.activityService = activityService;
    }


//    @Override
//    public RatingResponse createRating(Long activityId, Rating rating, User loggedInUser) {
//        // Fetch the activity by ID
//        Activity activity = activityService.getActivityById(activityId)
//                .orElseThrow(() -> new RuntimeException("Activity not found"));
//
//        // Set the activity for the rating
//        rating.setActivity(activity);
//        System.out.println(rating.toString() + " " + activity.toString() + "-----------------------------------------------------------------------------------------");
//
//        // Save the rating
//        return mapToDto(ratingRepository.save(rating));
//
//    }

    @Override
    @Transactional
    public RatingResponse createRating(Long activityId, Rating rating, User loggedInUser) {
        // Fetch the activity by ID
        Activity activity = activityService.getActivityById(activityId)
                .orElseThrow(() -> new RuntimeException("Activity not found"));

        // Check if the user has already rated this activity
        boolean hasUserRated = ratingRepository.existsByActivityAndUser(activity, loggedInUser);
        if (hasUserRated) {
            throw new RuntimeException("You have already rated this activity.");
        }

        // Set the activity and user for the rating
        rating.setActivity(activity);
        rating.setUser(loggedInUser); // Ensure the Rating entity has a reference to the User


        // Save the rating
        Rating savedRating = ratingRepository.save(rating);
        return mapToDto(savedRating);
    }


    @Override
    public List<RatingResponse> getRatingsByActivityId(Long id) {
        List<Rating> ratings = ratingRepository.findByActivityId(id);

        return ratings.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public RatingResponse getRatingById(Long activityId, Long ratingId) {
        Activity activity = activityRepository.findById(activityId).orElseThrow(() -> new ActivityNotFoundException("Activity with associated Rating not found"+ activityId + "okay"));

        Rating rating = ratingRepository.findById(ratingId).orElseThrow(() -> new RatingNotFoundException("Rating with associate activity not found"+ ratingId + "okay"));

        if(rating.getActivity().getId() != activity.getId()) {
            throw new RatingNotFoundException("This Rating does not belong to a activity"+ rating.getActivity().getId()+" a "+ activity.getId());
        }

        return mapToDto(rating);
    }

    @Override
    public RatingResponse updateRating(Long activityId, Long ratingId, RatingResponse ratingResponse) {
        Activity activity = activityRepository.findById(activityId).orElseThrow(() -> new ActivityNotFoundException("Activity with associated Rating not found" + activityId + "okay"));

        Rating rating = ratingRepository.findById(ratingId).orElseThrow(() -> new RatingNotFoundException("Rating with associate activity not found" + ratingId + "okay"));

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
