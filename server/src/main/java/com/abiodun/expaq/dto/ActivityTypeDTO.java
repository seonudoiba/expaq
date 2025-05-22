package com.abiodun.expaq.dto;

import com.abiodun.expaq.model.ActivityType;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.UUID;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ActivityTypeDTO {
    private UUID id;
    private String name;
    private String image;
    private Long activityCount;

    public static ActivityTypeDTO fromActivityType(ActivityType activityType) {
        if (activityType == null) {
            return null;
        }
        
        ActivityTypeDTO dto = new ActivityTypeDTO();
        dto.setId(activityType.getId());
        dto.setName(activityType.getName());
        dto.setImage(activityType.getImage());
        
        // Set the activity count if activities are loaded
        if (activityType.getActivities() != null) {
            dto.setActivityCount((long) activityType.getActivities().size());
        }
        
        return dto;
    }
    
    // Additional method to create DTO with activity count
    public static ActivityTypeDTO fromActivityTypeWithCount(ActivityType activityType, Long activityCount) {
        ActivityTypeDTO dto = fromActivityType(activityType);
        if (dto != null) {
            dto.setActivityCount(activityCount);
        }
        return dto;
    }
}
