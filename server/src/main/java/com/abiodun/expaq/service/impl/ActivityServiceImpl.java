package com.abiodun.expaq.service.impl;

import com.abiodun.expaq.dto.ActivityDTO;
import com.abiodun.expaq.dto.CreateActivityRequest;
import com.abiodun.expaq.dto.UpdateActivityRequest;
import com.abiodun.expaq.exception.ResourceNotFoundException;
import com.abiodun.expaq.exception.UnauthorizedException;
import com.abiodun.expaq.model.Activity;
import com.abiodun.expaq.model.Activity.ActivityCategory;
import com.abiodun.expaq.model.User;
import com.abiodun.expaq.repository.ActivityRepository;
import com.abiodun.expaq.repository.UserRepository;
import com.abiodun.expaq.service.CloudinaryService;
import com.abiodun.expaq.service.IActivityService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityServiceImpl implements IActivityService {

    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final CloudinaryService cloudinaryService;
    private final GeometryFactory geometryFactory = new GeometryFactory();
    private static final String folder = "activities";



    @Override
    @Transactional
    public ActivityDTO createActivity(CreateActivityRequest request, UUID hostId) {
        User host = userRepository.findById(hostId)
                .orElseThrow(() -> new ResourceNotFoundException("Host not found"));

        // Create Point for location
        Point location = geometryFactory.createPoint(
                new Coordinate(request.getLongitude(), request.getLatitude())
        );

        // Create activity
        Activity activity = new Activity();
        activity.setTitle(request.getTitle());
        activity.setDescription(request.getDescription());
        activity.setLocation(location);
        activity.setPrice(request.getPrice());
        activity.setCategory(request.getCategory());

        // Set capacity - adjust method name based on your DTO structure
        activity.setCapacity(request.getCapacity()); // Changed from getCapacity
        activity.setBookedCapacity(0);

        // Address fields - adjust method names based on your DTO structure
        activity.setAddress(request.getAddress()); // Changed from getAddress
        activity.setCity(request.getCity()); // Changed from getCity
        activity.setCountry(request.getCountry()); // Changed from getCountry

        activity.setSchedule(request.getSchedule());
        activity.setHost(host);
        activity.setActive(true);
        activity.setFeatured(false);

        // Save activity
        activity = activityRepository.save(activity);

        return ActivityDTO.fromActivity(activity);
    }


    @Transactional
    @Override
    public ActivityDTO updateActivity(UUID activityId, UpdateActivityRequest request, UUID hostId) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));

        // Check if user is the host
        if (!activity.getHost().getId().equals(hostId)) {
            throw new RuntimeException("Unauthorized to update this activity");
        }

        // Update fields
        if (request.getTitle() != null) activity.setTitle(request.getTitle());
        if (request.getDescription() != null) activity.setDescription(request.getDescription());
        if (request.getLongitude() != null && request.getLatitude() != null) {
            activity.setLocation(geometryFactory.createPoint(
                    new Coordinate(request.getLongitude(), request.getLatitude())
            ));
        }
        if (request.getPrice() != null) activity.setPrice(request.getPrice());
        if (request.getCategory() != null) activity.setCategory(request.getCategory());
        if (request.getCapacity() != null) activity.setCapacity(request.getCapacity()); // Changed from getCapacity
        if (request.getAddress() != null) activity.setAddress(request.getAddress()); // Changed from getAddress
        if (request.getCity() != null) activity.setCity(request.getCity()); // Changed from getCity
        if (request.getCountry() != null) activity.setCountry(request.getCountry()); // Changed from getCountry
        if (request.getSchedule() != null) activity.setSchedule(request.getSchedule());
        if (request.getIsActive() != null) activity.setActive(request.getIsActive()); // Changed from getIsActive
        if (request.getIsFeatured() != null) activity.setFeatured(request.getIsFeatured()); // Changed from getIsFeatured

        // Save activity
        activity = activityRepository.save(activity);

        return ActivityDTO.fromActivity(activity);
    }

    @Override
    public ActivityDTO updateActivity(UUID activityId, ActivityDTO activityDTO, UUID hostId) {
        return null;
    }

    @Override
    @Transactional
    public void deleteActivity(UUID activityId, UUID hostId) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));

        // Check if user is the host
        if (!activity.getHost().getId().equals(hostId)) {
            throw new RuntimeException("Unauthorized to delete this activity");
        }

        activityRepository.delete(activity);
    }

    @Override
    public ActivityDTO getActivityById(UUID activityId) {
        return activityRepository.findById(activityId)
                .map(ActivityDTO::fromActivity)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));
    }

    @Override
    public List<ActivityDTO> getAllActivities(Specification<Activity> spec) {
        List<Activity> activities = activityRepository.findAll(spec);
        return activities.stream()
                .map(ActivityDTO::fromActivity)
                .collect(Collectors.toList());
    }

    @Override
    public ActivityDTO getActivity(UUID activityId) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));
        return ActivityDTO.fromActivity(activity);
    }

    @Override
    public Page<ActivityDTO> searchActivities(String query, Pageable pageable) {
        return activityRepository.searchActivities(query, pageable)
                .map(ActivityDTO::fromActivity);
    }

    @Override
    public List<ActivityDTO> findNearbyActivities(double latitude, double longitude, double distance) {
        Point point = geometryFactory.createPoint(new Coordinate(longitude, latitude));
        return activityRepository.findNearbyActivities(point, distance)
                .stream()
                .map(ActivityDTO::fromActivity)
                .collect(Collectors.toList());
    }

    @Override
    public List<ActivityDTO> findNearbyActivitiesByCategory(
            ActivityCategory category, double latitude, double longitude, double distance) {
        Point point = geometryFactory.createPoint(new Coordinate(longitude, latitude));
        return activityRepository.findNearbyActivitiesByCategory(
                        (Activity.ActivityCategory) category, point, distance) // Cast to correct type
                .stream()
                .map(ActivityDTO::fromActivity)
                .collect(Collectors.toList());
    }

    @Override
    public List<ActivityDTO> findFeaturedActivities() {
        return activityRepository.findByIsFeaturedTrueAndIsActiveTrue()
                .stream()
                .map(ActivityDTO::fromActivity)
                .collect(Collectors.toList());
    }

    @Override
    public List<ActivityDTO> findHostActivities(UUID hostId) {
        return activityRepository.findByHostIdAndIsActiveTrue(hostId)
                .stream()
                .map(ActivityDTO::fromActivity)
                .collect(Collectors.toList());
    }

    @Override
    public List<ActivityDTO> findUpcomingActivities() {
        return activityRepository.findUpcomingActivities(LocalDateTime.now())
                .stream()
                .map(ActivityDTO::fromActivity)
                .collect(Collectors.toList());
    }

    @Override
    public Page<ActivityDTO> findPopularActivities(Pageable pageable) {
        return activityRepository.findPopularActivities(pageable)
                .map(ActivityDTO::fromActivity);
    }

    @Override
    public List<ActivityDTO> findActivitiesWithAvailableSlots() {
        return activityRepository.findActivitiesWithAvailableSlots()
                .stream()
                .map(ActivityDTO::fromActivity)
                .collect(Collectors.toList());
    }

    @Override
    public List<ActivityDTO> findActivitiesByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return activityRepository.findByPriceBetweenAndIsActiveTrue(minPrice, maxPrice)
                .stream()
                .map(ActivityDTO::fromActivity)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public ActivityDTO uploadActivityImage(UUID activityId, MultipartFile file, UUID hostId) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));

        // Check if user is the host
        if (!activity.getHost().getId().equals(hostId)) {
            throw new RuntimeException("Unauthorized to update this activity");
        }

        // Upload image to Cloudinary
        String imageUrl = cloudinaryService.uploadImage(file, folder); // Check correct method name

        // Add image URL to activity
        activity.getMediaUrls().add(imageUrl);
        activity = activityRepository.save(activity);

        return ActivityDTO.fromActivity(activity);
    }

    @Transactional
    @Override
    public void deleteActivityImage(UUID activityId, String imageUrl, UUID hostId) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));

        // Check if user is the host
        if (!activity.getHost().getId().equals(hostId)) {
            throw new RuntimeException("Unauthorized to update this activity");
        }

        // Remove image URL from activity
        activity.getMediaUrls().remove(imageUrl);
        activityRepository.save(activity);

        // Delete image from Cloudinary
        cloudinaryService.deleteImage(imageUrl);
    }

    // --- Helper Methods ---

    private User findUserByIdAndValidateRole(UUID userId, User.UserRole requiredRole, String roleErrorMessage) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        if (requiredRole != null && !user.getRole().equals(requiredRole)) { // Use equals instead of !=
            throw new UnauthorizedException(roleErrorMessage != null ? roleErrorMessage : "User does not have the required role.");
        }
        return user;
    }

    private Activity findActivityById(UUID activityId) {
        return activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + activityId));
    }

    private void mapDtoToEntity(ActivityDTO dto, Activity entity) {
        // Use ModelMapper, but be careful about overwriting relationships or generated values
        modelMapper.map(dto, entity);
        // Explicitly null out fields that shouldn't be mapped from DTO during update/create
        entity.setId(entity.getId()); // Keep existing ID if updating
        entity.setHost(entity.getHost()); // Keep existing host
        // TODO: Handle location/schedule mapping
    }

    private ActivityDTO mapEntityToDto(Activity entity) {
        ActivityDTO dto = modelMapper.map(entity, ActivityDTO.class);
        if (entity.getHost() != null) {
            dto.setHostId(entity.getHost().getId());
            dto.setHostName(entity.getHost().getFirstName() + " " + entity.getHost().getLastName()); // Or username
        }
        // TODO: Handle location/schedule mapping for response DTO
        return dto;
    }

    // Helper method to create a Point object for location
    private Point createPoint(Double latitude, Double longitude) {
        GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326); // WGS 84
        return geometryFactory.createPoint(new Coordinate(longitude, latitude));
    }
    @Override
    public ActivityDTO mapToActivityDTO(Activity activity) {
        return ActivityDTO.fromActivity(activity);
    }

    // TODO: Implement methods for parsing location/schedule if complex types are used
    // private Point parseLocation(String locationString) { ... }
    // private Object parseSchedule(Object scheduleObject) { ... }
}
