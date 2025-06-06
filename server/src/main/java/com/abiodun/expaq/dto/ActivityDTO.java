package com.abiodun.expaq.dto;

import com.abiodun.expaq.model.*;
import com.abiodun.expaq.model.Activity.ActivityCategory;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.locationtech.jts.geom.Point;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ActivityDTO {
    private UUID id;
    private UUID hostId;
    private String hostName;
    private String hostProfilePicture;
    private String title;
    private String description;
    private BigDecimal price;
    private Double latitude;
    private Double longitude;
    private ActivityTypeDTO activityType;
    private ActivitySchedule schedule;
    private List<String> mediaUrls;
    private Integer maxParticipants;
    private Integer minParticipants;
    private Integer durationMinutes;
    private Boolean isActive;
    private Boolean isFeatured;
    private Boolean isVerified;
    private Double averageRating;
    private Integer totalReviews;
    private String address;
    private CityDTO city;
    private CountryDTO country;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    public static ActivityDTO fromActivity(Activity activity) {
        if (activity == null) {
            return null;
        }

        ActivityDTO dto = new ActivityDTO();
        dto.setId(activity.getId());
        
        // Handle host information
        if (activity.getHost() != null) {
            dto.setHostId(activity.getHost().getId());
            dto.setHostName(activity.getHost().getFirstName() + " " + activity.getHost().getLastName());
            dto.setHostProfilePicture(activity.getHost().getProfilePicture());
        }
        
        dto.setTitle(activity.getTitle());
        dto.setDescription(activity.getDescription());
        dto.setPrice(activity.getPrice());
        
        // Handle location
        if (activity.getLocationPoint() != null) {
            dto.setLatitude(activity.getLocationPoint().getY());
            dto.setLongitude(activity.getLocationPoint().getX());
        }
        
        // Handle activity type
        if (activity.getActivityType() != null) {
            dto.setActivityType(ActivityTypeDTO.fromActivityType(activity.getActivityType()));
        }
        
        dto.setSchedule(activity.getSchedule());
        dto.setMediaUrls(activity.getMediaUrls());
        dto.setMaxParticipants(activity.getMaxParticipants());
        dto.setMinParticipants(activity.getMinParticipants());
        dto.setDurationMinutes(activity.getDurationMinutes());
        dto.setIsActive(activity.isActive());
        dto.setIsVerified(activity.isVerified());
        dto.setIsFeatured(activity.getIsFeatured() != null ? activity.getIsFeatured() : false);
        
        // Handle reviews
        if (activity.getReviews() != null) {
            dto.setTotalReviews(activity.getReviews().size());
            dto.setAverageRating(activity.getAverageRating());
        } else {
            dto.setTotalReviews(0);
            dto.setAverageRating(0.0);
        }
        
        dto.setCreatedAt(activity.getCreatedAt());
        dto.setUpdatedAt(activity.getUpdatedAt());
//        dto.setStartDate(activity.getStartDate());
//        dto.setEndDate(activity.getEndDate());
        dto.setAddress(activity.getAddress());
        
        // Handle city and country
        if (activity.getCity() != null) {
            dto.setCity(CityDTO.fromCity(activity.getCity()));
        }
        if (activity.getCountry() != null) {
            dto.setCountry(CountryDTO.fromCountry(activity.getCountry()));
        }

        return dto;
    }

}
