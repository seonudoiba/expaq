package com.abiodun.expaq.service;

import com.abiodun.expaq.model.ActivityType;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IActivityTypeService {
    ActivityType save(ActivityType activityType);
    Optional<ActivityType> findById(UUID id);
    List<ActivityType> findAll();
    ActivityType update(UUID id, ActivityType activityType);
    void deleteById(UUID id);
}
