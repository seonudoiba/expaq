package com.abiodun.expaq.service;

import com.abiodun.expaq.dto.ActivityDTO;
import com.abiodun.expaq.dto.CreateActivityRequest;
import com.abiodun.expaq.dto.LocationStatsDTO;
import com.abiodun.expaq.dto.UpdateActivityRequest;
import com.abiodun.expaq.model.Activity;
import com.abiodun.expaq.model.Activity.ActivityCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.UUID;


public interface IActivityService {

    ActivityDTO createActivity(CreateActivityRequest request, UUID hostId);

    ActivityDTO updateActivity(UUID activityId, UpdateActivityRequest request, UUID hostId);

    ActivityDTO updateActivity(UUID activityId, ActivityDTO activityDTO, UUID hostId);

    void deleteActivity(UUID activityId, UUID hostId);

    ActivityDTO getActivityById(UUID activityId);

    List<ActivityDTO> getAllActivities(Specification<Activity> spec);

    ActivityDTO getActivity(UUID activityId);

    Page<ActivityDTO> searchActivities(String query, Pageable pageable);

    List<ActivityDTO> findNearbyActivities(double latitude, double longitude, double distance);

//    List<ActivityDTO> findNearbyActivitiesByCategory(ActivityCategory category, double latitude, double longitude, double distance);

    List<ActivityDTO> findFeaturedActivities();

    List<ActivityDTO> findHostActivities(UUID hostId);

    Page<ActivityDTO> findUpcomingActivities(Pageable pageable);

    Page<ActivityDTO> findPopularActivities(Pageable pageable);

    List<ActivityDTO> findActivitiesWithAvailableSlots();

    List<ActivityDTO> findActivitiesByPriceRange(BigDecimal minPrice, BigDecimal maxPrice);

    ActivityDTO uploadActivityImage(UUID activityId, MultipartFile file, UUID hostId);

    void deleteActivityImage(UUID activityId, String imageUrl, UUID hostId);

    ActivityDTO mapToActivityDTO(Activity activity);

    Page<ActivityDTO> findActivitiesByCity(String cityName, Pageable pageable);
    Page<ActivityDTO> findActivitiesByCountry(String countryName, Pageable pageable);
    Page<ActivityDTO> findActivitiesByActivityType(UUID typeId, Pageable pageable);

    List<ActivityDTO> findNearbyActivitiesByActivityType(String activityType, double latitude, double longitude, double distance);
}