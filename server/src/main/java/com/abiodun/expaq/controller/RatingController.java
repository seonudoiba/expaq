package com.abiodun.expaq.controller;

import com.abiodun.expaq.dto.RatingRequest;
import com.abiodun.expaq.model.ExpaqUserDetails;
import com.abiodun.expaq.model.User;
import com.abiodun.expaq.repository.UserRepository;
import com.abiodun.expaq.response.RatingResponse;
import com.abiodun.expaq.service.impl.RatingService;
import com.abiodun.expaq.exception.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/ratings")
public class RatingController {
    private final RatingService ratingService;
    private final UserRepository userRepository;

    public RatingController(RatingService ratingService, UserRepository userRepository) {
        this.ratingService = ratingService;
        this.userRepository = userRepository;
    }


    @PostMapping("/activity/{activityId}/ratings")
    public ResponseEntity<RatingResponse> createNewRating(@PathVariable UUID activityId, @RequestBody RatingRequest rating,
                                                          @AuthenticationPrincipal ExpaqUserDetails currentUser
                                                          ) {

        // Fetch the logged-in user (assuming you have a method to get the current user)
        User loggedInUser = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + currentUser.getUsername()));


        // Set the activity and user for the rating
        RatingResponse createdRating = ratingService.createRating(activityId, rating, loggedInUser);
        return new ResponseEntity<>(createdRating, HttpStatus.CREATED);
    }

    @GetMapping("/activity/{activityId}/ratings")
    public List<RatingResponse> getRatingsByActivityId(@PathVariable(value = "activityId") UUID activityId) {
        return ratingService.getRatingsByActivityId(activityId);
    }

    @GetMapping("/activity/{activityId}/ratings/{id}")
    public ResponseEntity<RatingResponse> getRatingById(@PathVariable(value = "activityId") UUID activityId, @PathVariable(value = "id") UUID ratingId) {
        RatingResponse ratingResponse = ratingService.getRatingById(activityId, ratingId);
        return new ResponseEntity<>(ratingResponse, HttpStatus.OK);
    }

    @PutMapping("/activity/{activityId}/ratings/{id}")
    public ResponseEntity<RatingResponse> updateRating(@PathVariable(value = "activityId") UUID activityId, @PathVariable(value = "id") UUID ratingId,
                                                  @RequestBody RatingResponse ratingResponse) {
        RatingResponse updatedRating = ratingService.updateRating(activityId, ratingId, ratingResponse);
        return new ResponseEntity<>(updatedRating, HttpStatus.OK);
    }

    @DeleteMapping("/activity/{activityId}/ratings/{id}")
    public ResponseEntity<String> deleteRating(@PathVariable(value = "activityId") UUID activityId, @PathVariable(value = "id") UUID ratingId) {
        ratingService.deleteRating(activityId, ratingId);
        return new ResponseEntity<>("Rating deleted successfully", HttpStatus.OK);
    }
}
