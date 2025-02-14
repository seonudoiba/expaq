package com.abiodun.expaq.controller;

import com.abiodun.expaq.model.ExpaqUserDetails;
import com.abiodun.expaq.model.Rating;
import com.abiodun.expaq.model.User;
import com.abiodun.expaq.repository.UserRepository;
import com.abiodun.expaq.response.RatingResponse;
import com.abiodun.expaq.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ratings")
public class RatingController {
    private final RatingService ratingService;
    private final UserRepository userRepository;

    @Autowired
    public RatingController(RatingService ratingService, UserRepository userRepository) {
        this.ratingService = ratingService;
        this.userRepository = userRepository;
    }


    @PostMapping("/activity/{activityId}/ratings")
    public ResponseEntity<RatingResponse> createNewRating(@PathVariable Long activityId, @RequestBody Rating rating,
                                                          @AuthenticationPrincipal ExpaqUserDetails currentUser
                                                          ) {

        // Fetch the logged-in user (assuming you have a method to get the current user)
        User loggedInUser = userRepository.findByUserName(currentUser.getUsername());



        // Set the activity and user for the rating
        RatingResponse createdRating = ratingService.createRating(activityId, rating, loggedInUser);
        return new ResponseEntity<>(createdRating, HttpStatus.CREATED);
    }

    @GetMapping("/activity/{activityId}/ratings")
    public List<RatingResponse> getRatingsByActivityId(@PathVariable(value = "activityId") Long activityId) {
        return ratingService.getRatingsByActivityId(activityId);
    }

    @GetMapping("/activity/{activityId}/ratings/{id}")
    public ResponseEntity<RatingResponse> getRatingById(@PathVariable(value = "activityId") Long activityId, @PathVariable(value = "id") Long ratingId) {
        RatingResponse ratingResponse = ratingService.getRatingById(activityId, ratingId);
        return new ResponseEntity<>(ratingResponse, HttpStatus.OK);
    }

    @PutMapping("/activity/{activityId}/ratings/{id}")
    public ResponseEntity<RatingResponse> updateRating(@PathVariable(value = "activityId") Long activityId, @PathVariable(value = "id") Long ratingId,
                                                  @RequestBody RatingResponse ratingResponse) {
        RatingResponse updatedRating = ratingService.updateRating(activityId, ratingId, ratingResponse);
        return new ResponseEntity<>(updatedRating, HttpStatus.OK);
    }

    @DeleteMapping("/activity/{activityId}/ratings/{id}")
    public ResponseEntity<String> deleteRating(@PathVariable(value = "activityId") Long activityId, @PathVariable(value = "id") Long ratingId) {
        ratingService.deleteRating(activityId, ratingId);
        return new ResponseEntity<>("Rating deleted successfully", HttpStatus.OK);
    }
}
