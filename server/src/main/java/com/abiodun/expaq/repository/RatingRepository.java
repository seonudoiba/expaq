package com.abiodun.expaq.repository;

import com.abiodun.expaq.model.Activity;
import com.abiodun.expaq.model.Rating;
import com.abiodun.expaq.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByActivityId(Long activityId);
    boolean existsByActivityAndUser(Activity activity, User user);

}
