package com.abiodun.expaq.repository;

import com.abiodun.expaq.dto.ActivityDTO;
import com.abiodun.expaq.model.Rating;
import com.abiodun.expaq.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RatingRepository extends JpaRepository<Rating, UUID> {
    List<Rating> findByActivityId(UUID activityId);
    Boolean existsByActivityAndUser(ActivityDTO activity, User user);
}
