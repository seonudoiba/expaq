package com.abiodun.expaq.controllers;

import com.abiodun.expaq.dto.response.RatingResponse;
import com.abiodun.expaq.services.IRatingService;
import com.abiodun.expaq.services.impl.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/ratings")
public class RatingController {
    private final IRatingService ratingService;

    @Autowired
    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping("/activity/{activityId}/ratings")
    public ResponseEntity<RatingResponse> createRating(@PathVariable(value = "activityId") Long activityId, @RequestBody RatingResponse ratingResponse) {
        return new ResponseEntity<>(ratingService.createRating(activityId, ratingResponse), HttpStatus.CREATED);
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
