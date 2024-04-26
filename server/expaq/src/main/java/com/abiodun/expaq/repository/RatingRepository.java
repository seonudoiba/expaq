package com.abiodun.expaq.repository;

import com.abiodun.expaq.models.BookedActivity;
import com.abiodun.expaq.models.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByActivityId(Long activityId);
//    List<Rating> findByGuestEmail(String email);

}

