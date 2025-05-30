package com.abiodun.expaq.dto;

import com.abiodun.expaq.model.Activity;
import com.abiodun.expaq.model.Activity.ActivityCategory;
import com.abiodun.expaq.model.ActivitySchedule;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.locationtech.jts.geom.Point;

import java.awt.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
public class ActivityDTO {
    private UUID id;
    private UUID hostId;
    private String hostName;
    private String hostProfilePicture;
    private String title;
    private String description;
    private BigDecimal price;
    private double latitude;
    private double longitude;
    private ActivityCategory category;
    private ActivitySchedule schedule;
    private List<String> mediaUrls;
    private int maxParticipants;
    private int minParticipants;
    private int durationMinutes;
    private boolean isActive;
    private boolean isFeatured;
    private boolean isVerified;
    private double averageRating;
    private int totalReviews;
    private Point locationPoint;
    private  String address;
    private String city;
    private String country;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    public static ActivityDTO fromActivity(Activity activity) {
        ActivityDTO dto = new ActivityDTO();
        dto.setId(activity.getId());
        dto.setHostId(activity.getHost().getId());
        dto.setHostName(activity.getHost().getFirstName() + " " + activity.getHost().getLastName());
        dto.setHostProfilePicture(activity.getHost().getProfilePicture());
        dto.setTitle(activity.getTitle());
        dto.setDescription(activity.getDescription());
        dto.setPrice(activity.getPrice());
        if (activity.getLocation() != null) {
            dto.setLatitude(activity.getLocationPoint().getY());
            dto.setLongitude(activity.getLocationPoint().getX());
        }
        dto.setCategory(activity.getCategory());
        dto.setSchedule(activity.getSchedule());
        dto.setMediaUrls(activity.getMediaUrls());
        dto.setMaxParticipants(activity.getMaxParticipants());
        dto.setMinParticipants(activity.getMinParticipants());
        dto.setDurationMinutes(activity.getDurationMinutes());
        dto.setActive(activity.isActive());
        dto.setVerified(activity.isVerified());
        dto.setFeatured(false);
        dto.setTotalReviews(activity.getReviews().size());
        dto.setAverageRating(activity.getAverageRating());
        dto.setCreatedAt(activity.getCreatedAt());
        dto.setUpdatedAt(activity.getUpdatedAt());
        dto.setStartDate(activity.getStartDate());
        dto.setEndDate(activity.getEndDate());
//        dto.setLocationPoint(activity.getLocationPoint());
        dto.setAddress(activity.getAddress());
        dto.setCity(activity.getCity());
        dto.setCountry(activity.getCountry());


        return dto;
    }

}
