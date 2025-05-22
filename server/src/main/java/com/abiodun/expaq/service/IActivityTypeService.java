package com.abiodun.expaq.service;

import com.abiodun.expaq.dto.ActivityTypeDTO;
import com.abiodun.expaq.model.ActivityType;

import java.util.List;
import java.util.UUID;

public interface IActivityTypeService {
    ActivityTypeDTO createActivityType(ActivityTypeDTO activityTypeDTO);
    ActivityTypeDTO getActivityTypeById(UUID id);
    List<ActivityTypeDTO> getAllActivityTypes();
    ActivityTypeDTO updateActivityType(UUID id, ActivityTypeDTO activityTypeDTO);
    void deleteActivityType(UUID id);
}
