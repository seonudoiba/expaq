package com.abiodun.expaq.service.impl;

import com.abiodun.expaq.dto.ActivityDTO;
import com.abiodun.expaq.dto.CreateActivityRequest;
import com.abiodun.expaq.dto.LocationStatsDTO;
import com.abiodun.expaq.dto.UpdateActivityRequest;
import com.abiodun.expaq.exception.ResourceNotFoundException;
import com.abiodun.expaq.exception.UnauthorizedException;
import com.abiodun.expaq.model.Activity;
import com.abiodun.expaq.model.Activity.ActivityCategory;
import com.abiodun.expaq.model.Role;
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
import java.util.*;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.abiodun.expaq.exception.ServiceException;

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
        try {
            // Validate that the host exists
            User host = userRepository.findById(hostId)
                    .orElseThrow(() -> new ResourceNotFoundException("Host not found with ID: " + hostId));

            // Validate that the host has the HOST role
            boolean isHost = host.getRoles().stream()
                    .anyMatch(role -> role.getName().equals("HOST") || role.getName().equals("ROLE_HOST"));
            if (!isHost) {
                throw new UnauthorizedException("User does not have HOST privileges");
            }

            try {
                // Create Point for location
                Point location = geometryFactory.createPoint(
                        new Coordinate(request.getLongitude(), request.getLatitude())
                );

                // Create activity with validation
                Activity activity = new Activity();
                activity.setTitle(request.getTitle());
                activity.setDescription(request.getDescription());
                activity.setLocation(String.valueOf(location));
                activity.setLocationPoint(location);
                activity.setPrice(request.getPrice());
                activity.setStartDate(request.getStartDate());
                activity.setEndDate(request.getEndDate());

                // Validate activity category
                try {
                    activity.setActivityType(request.getActivityType());
                } catch (IllegalArgumentException e) {
                    throw new IllegalArgumentException("Invalid activity activity type: " + request.getActivityType() +
                            ". Valid categories are: " + String.join(", ",
                            Arrays.stream(Activity.ActivityCategory.values())
                                    .map(Enum::name)
                                    .collect(Collectors.toList())));
                }
                activity.setBookedCapacity(0);

                // Set address fields
                activity.setAddress(request.getAddress());
                activity.setCity(request.getCity());
                activity.setCountry(request.getCountry());

                // Set schedule with validation
                if (request.getSchedule() == null) {
                    throw new IllegalArgumentException("Activity schedule is required");
                }
                activity.setSchedule(request.getSchedule());

                // Set host and default values
                activity.setHost(host);
                activity.setActive(true);
                activity.setIsFeatured( false);
                activity.setMinParticipants(request.getMinParticipants());
                activity.setMaxParticipants(request.getMaxParticipants());
                activity.setDurationMinutes(request.getDurationMinutes());
                // Convert minutes to hours for the duration field
                activity.setDuration((int) Math.ceil(request.getDurationMinutes() / 60.0));

                // Save activity
                activity = activityRepository.save(activity);

                return ActivityDTO.fromActivity(activity);

            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid activity data: " + e.getMessage());
            } catch (Exception e) {
                throw new RuntimeException("Error creating activity: " + e.getMessage(), e);
            }
        } catch (ResourceNotFoundException | UnauthorizedException e) {
            throw e; // Let these pass through unchanged
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error creating activity", e);
        }
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
            activity.setLocation(String.valueOf(geometryFactory.createPoint(
                    new Coordinate(request.getLongitude(), request.getLatitude())
            )));
            activity.setLocationPoint(geometryFactory.createPoint(
                    new Coordinate(request.getLongitude(), request.getLatitude())
            ));
        }
        if (request.getPrice() != null) activity.setPrice(request.getPrice());
        if (request.getActivityType() != null) activity.setActivityType(request.getActivityType());
        if (request.getCapacity() != null) activity.setCapacity(request.getCapacity()); // Changed from getCapacity
        if (request.getAddress() != null) activity.setAddress(request.getAddress()); // Changed from getAddress
        if (request.getCity() != null) activity.setCity(request.getCity()); // Changed from getCity
        if (request.getCountry() != null) activity.setCountry(request.getCountry()); // Changed from getCountry
        if (request.getSchedule() != null) activity.setSchedule(request.getSchedule());
        if (request.getIsActive() != null) activity.setActive(request.getIsActive()); // Changed from getIsActive
        if (request.getIsFeatured() != null) activity.setIsFeatured(request.getIsFeatured()); // Changed from getIsFeatured
        if (request.getStartDate() != null) activity.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) activity.setEndDate(request.getEndDate());
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
    @Transactional(readOnly = true)
    public ActivityDTO getActivityById(UUID activityId) {
        return activityRepository.findById(activityId)
                .map(this::mapToActivityDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + activityId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityDTO> getAllActivities(Specification<Activity> spec) {
        List<Activity> activities = activityRepository.findAll(spec);
        return activities.stream()
                .map(this::mapToActivityDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ActivityDTO getActivity(UUID activityId) {
        return getActivityById(activityId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ActivityDTO> searchActivities(String query, Pageable pageable) {
        return activityRepository.searchActivities(query, pageable)
                .map(this::mapToActivityDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityDTO> findNearbyActivities(double latitude, double longitude, double distance) {
        Point point = createPoint(latitude, longitude);
        return activityRepository.findNearbyActivities(point, distance).stream()
                .map(this::mapToActivityDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityDTO> findNearbyActivitiesByActivityType(
            String type, double latitude, double longitude, double distance) {
        Point point = createPoint(latitude, longitude);
        return activityRepository.findNearbyActivitiesByActivityType(type, point, distance)
                .stream()
                .map(this::mapToActivityDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityDTO> findFeaturedActivities() {
        return activityRepository.findByIsFeaturedTrueAndIsActiveTrue()
                .stream()
                .map(this::mapToActivityDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityDTO> findHostActivities(UUID hostId) {
        return activityRepository.findByHostIdAndIsActiveTrue(hostId)
                .stream()
                .map(this::mapToActivityDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ActivityDTO> findUpcomingActivities(Pageable pageable) {
        return activityRepository.findUpcomingActivities(LocalDateTime.now(), pageable)
                .map(this::mapToActivityDTO);
    }

    private static final Logger log = LoggerFactory.getLogger(ActivityServiceImpl.class);
    
    /**
     * Retrieves a page of activities ordered by booked capacity in descending order.
     *
     * @param pageable pagination information (page number, size, sort)
     * @return Page of ActivityDTOs representing popular activities
     * @throws IllegalArgumentException if pageable is null
     * @throws ServiceException if an error occurs while retrieving activities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<ActivityDTO> findPopularActivities(Pageable pageable) {
        log.debug("Finding popular activities with pageable: {}", pageable);
        
        try {
            Objects.requireNonNull(pageable, "Pageable must not be null");
            
            Page<Activity> activities = activityRepository.findAllByOrderByBookedCapacityDesc(pageable);
            log.debug("Found {} popular activities", activities.getNumberOfElements());
            
            return activities.map(this::mapToActivityDTO);
        } catch (IllegalArgumentException e) {
            log.error("Invalid input parameter: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error retrieving popular activities", e);
            throw new ServiceException("Failed to retrieve popular activities", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityDTO> findActivitiesWithAvailableSlots() {
        return activityRepository.findActivitiesWithAvailableSlots()
                .stream()
                .map(this::mapToActivityDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityDTO> findActivitiesByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return activityRepository.findByPriceRange(minPrice, maxPrice, Pageable.unpaged()).getContent()
                .stream()
                .map(this::mapToActivityDTO)
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
        imageUrl = "https://res.cloudinary.com/do0rdj8oj/image/upload/v1747010925/" + imageUrl;
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

    private User findUserByIdAndValidateRole(UUID userId, Role requiredRole, String roleErrorMessage) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        if (requiredRole != null && !user.getRoles().contains(requiredRole)) { // Use equals instead of !=
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
    @Transactional(readOnly = true)
    public ActivityDTO mapToActivityDTO(Activity activity) {
        if (activity == null) {
            return null;
        }
        return ActivityDTO.fromActivity(activity);
    }

    @Override
    public Page<ActivityDTO> findActivitiesByCity(String cityName, Pageable pageable) {
        return null;
    }

    @Override
    public Page<ActivityDTO> findActivitiesByCountry(String countryName, Pageable pageable) {
        return null;
    }

    @Override
    public Page<ActivityDTO> findActivitiesByActivityType(UUID typeId, Pageable pageable) {
        return null;
    }


}
