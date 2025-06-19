package com.abiodun.expaq.service.impl;

import com.abiodun.expaq.dto.ActivityDTO;
import com.abiodun.expaq.dto.CreateActivityRequest;
import com.abiodun.expaq.dto.UpdateActivityRequest;
import com.abiodun.expaq.exception.ResourceNotFoundException;
import com.abiodun.expaq.exception.UnauthorizedException;
import com.abiodun.expaq.model.Activity;
import com.abiodun.expaq.model.Role;
import com.abiodun.expaq.model.User;
import com.abiodun.expaq.repository.ActivityRepository;
import com.abiodun.expaq.repository.UserRepository;
import com.abiodun.expaq.service.CloudinaryService;
import com.abiodun.expaq.service.IActivityService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
import org.springframework.dao.DataIntegrityViolationException;

@Service
@RequiredArgsConstructor
public class ActivityServiceImpl implements IActivityService {

    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final CloudinaryService cloudinaryService;
    private final GeometryFactory geometryFactory = new GeometryFactory();
    private static final String folder = "activities";

    private static final Logger logger = LoggerFactory.getLogger(ActivityServiceImpl.class);;

    @Override
    @Transactional
    public ActivityDTO createActivity(CreateActivityRequest request, UUID hostId) {
        String operation = "createActivity";
        logger.debug(String.valueOf(request));

        try {
            // Validate input parameters
            if (request == null) {
                String error = "CreateActivityRequest cannot be null - request body is missing or malformed";
                logger.error("{} - Validation Error: {}", operation, error);
                throw new IllegalArgumentException(error);
            }

            // Log the incoming request for debugging
            try {
                logger.debug("{} - Received request: title={}, activityType={},  " +
                                "price={}, minParticipants={}, maxParticipants={}, startDate={}, endDate={}, durationMinutes={}, " +
                                "latitude={}, longitude={}, address={}, city={}, country={}",
                        operation, request.getTitle(), request.getActivityType(),
                        request.getStartDate(), request.getEndDate(),
                        request.getPrice(),
                        request.getMinParticipants(), request.getMaxParticipants(),
                        request.getDurationMinutes(), request.getLatitude(),
                        request.getLongitude(), request.getAddress(),
                        request.getCity(), request.getCountry());
            } catch (Exception e) {
                logger.warn("{} - Could not log request details due to potential JSON parsing issues: {}",
                        operation, e.getMessage());
            }

            if (hostId == null) {
                String error = "Host ID cannot be null";
                logger.error("{} - Validation Error: {}", operation, error);
                throw new IllegalArgumentException(error);
            }

            logger.info("{} - Starting activity creation for hostId: {}", operation, hostId);
            logger.info(" request.getEndDate(): {}", request.getEndDate());

            // Validate that the host exists
            User host;
            try {
                host = userRepository.findById(hostId)
                        .orElseThrow(() -> {
                            String error = "Host not found with ID: " + hostId;
                            logger.error("{} - Database Error: {}", operation, error);
                            return new ResourceNotFoundException(error);
                        });
                logger.debug("{} - Host found: {}", operation, host.getId());
            } catch (Exception e) {
                String error = "Database error while fetching host with ID: " + hostId;
                logger.error("{} - Database Error: {} - Exception: {}", operation, error, e.getMessage(), e);
                throw new RuntimeException(error, e);
            }

            // Validate that the host has the HOST role
            try {
                boolean isHost = host.getRoles().stream()
                        .anyMatch(role -> role.getName().equals("HOST") || role.getName().equals("ROLE_HOST"));
                if (!isHost) {
                    String error = "User " + hostId + " does not have HOST privileges. Current roles: " +
                            host.getRoles().stream().map(Role::getName).collect(Collectors.joining(", "));
                    logger.error("{} - Authorization Error: {}", operation, error);
                    throw new UnauthorizedException(error);
                }
                logger.debug("{} - Host authorization validated", operation);
            } catch (UnauthorizedException e) {
                throw e;
            } catch (Exception e) {
                String error = "Error validating host roles for user: " + hostId;
                logger.error("{} - Role Validation Error: {} - Exception: {}", operation, error, e.getMessage(), e);
                throw new RuntimeException(error, e);
            }

            // Validate request data
            validateActivityRequest(request, operation);

            // Create Point for location
            Point location;
            try {
                if (request.getLongitude() == null || request.getLatitude() == null) {
                    String error = "Longitude and latitude are required for location";
                    logger.error("{} - Location Validation Error: {}", operation, error);
                    throw new IllegalArgumentException(error);
                }

                location = geometryFactory.createPoint(
                        new Coordinate(request.getLongitude(), request.getLatitude())
                );
                logger.debug("{} - Location point created: lat={}, lng={}", operation,
                        request.getLatitude(), request.getLongitude());
            } catch (IllegalArgumentException e) {
                throw e;
            } catch (Exception e) {
                String error = "Error creating location point with coordinates: lat=" +
                        request.getLatitude() + ", lng=" + request.getLongitude();
                logger.error("{} - Geometry Error: {} - Exception: {}", operation, error, e.getMessage(), e);
                throw new RuntimeException(error, e);
            }

            // Create and populate activity
            Activity activity;
            try {
                activity = createActivityEntity(request, host, location, operation);
                logger.debug("{} - Activity entity created successfully", operation);
            } catch (IllegalArgumentException e) {
                throw e;
            } catch (Exception e) {
                String error = "Error creating activity entity";
                logger.error("{} - Entity Creation Error: {} - Exception: {}", operation, error, e.getMessage(), e);
                throw new RuntimeException(error, e);
            }
            if (request.getDurationMinutes() == null) {
                throw new IllegalArgumentException("Duration must not be null");
            }

            // Save activity to database
            try {
                activity = activityRepository.save(activity);
                logger.info("{} - Activity saved successfully with ID: {}", operation, activity.getId());
            } catch (DataIntegrityViolationException e) {
                String error = "Data integrity violation while saving activity. Possible duplicate or constraint violation";
                logger.error("{} - Database Constraint Error: {} - Exception: {} ", operation, error, e.getMessage(), e );
                logger.error("{} - Activity Details: {}", operation, activity);
                throw new RuntimeException(error, e);
            } catch (Exception e) {
                String error = "Database error while saving activity";
                logger.error("{} - Database Save Error: {} - Exception: {}", operation, error, e.getMessage(), e);
                throw new RuntimeException(error, e);
            }

            // Convert to DTO
            try {
                ActivityDTO dto = ActivityDTO.fromActivity(activity);
                logger.info("{} - Activity creation completed successfully. Activity ID: {}", operation, activity.getId());
                return dto;
            } catch (Exception e) {
                String error = "Error converting activity to DTO for activity ID: " + activity.getId();
                logger.error("{} - DTO Conversion Error: {} - Exception: {}", operation, error, e.getMessage(), e);
                throw new RuntimeException(error, e);
            }

        }  catch (Exception e) {
            String error = "Unexpected error during activity creation for hostId: " + hostId;
            logger.error("{} - Unexpected Error: {} - Exception: {}", operation, error, e.getMessage(), e);
            throw new RuntimeException(error, e);
        }


    }

    // PRIVATE HELPER METHODS - ADD THESE TO THE SAME SERVICE CLASS
    private void validateActivityRequest(CreateActivityRequest request, String operation) {
        List<String> errors = new ArrayList<>();
        List<String> jsonErrors = new ArrayList<>();

        try {
            // String fields validation
            try {
                String title = request.getTitle();
                if (title == null || title.trim().isEmpty()) {
                    errors.add("Activity title is required and cannot be empty");
                } else if (title.length() > 200) {
                    errors.add("Activity title cannot exceed 200 characters");
                }
            } catch (Exception e) {
                jsonErrors.add("Error accessing 'title' field: " + e.getMessage() + " - Expected: string");
            }

            // Add other validations here (price, dates, coordinates, etc.)
            // ... (rest of validation logic from previous artifact)

        } catch (Exception e) {
            jsonErrors.add("General JSON parsing error: " + e.getMessage());
        }

        if (!jsonErrors.isEmpty()) {
            String jsonErrorMessage = "JSON parsing/mapping errors detected: " + String.join("; ", jsonErrors);
            logger.error("{} - JSON Errors: {}", operation, jsonErrorMessage);
            throw new IllegalArgumentException(jsonErrorMessage);
        }

        if (!errors.isEmpty()) {
            String errorMessage = "Activity validation failed: " + String.join("; ", errors);
            logger.error("{} - Validation Errors: {}", operation, errorMessage);
            throw new IllegalArgumentException(errorMessage);
        }
    }

    private Activity createActivityEntity(CreateActivityRequest request, User host, Point location, String operation) {
        try {
            Activity activity = new Activity();
            activity.setTitle(request.getTitle().trim());
            activity.setDescription(request.getDescription().trim());
            activity.setLocation(String.valueOf(location));
            activity.setLocationPoint(location);
            activity.setPrice(request.getPrice());
            activity.setStartDate(request.getStartDate());
            activity.setEndDate(request.getEndDate());
            activity.setActivityType(request.getActivityType());
            activity.setBookedCapacity(0);
            activity.setAddress(request.getAddress().trim());
            activity.setCity(request.getCity());
            activity.setCountry(request.getCountry());
            activity.setSchedule(request.getSchedule());
            activity.setHost(host);
            activity.setActive(true);
            activity.setIsFeatured(false);
            activity.setMinParticipants(request.getMinParticipants());
            activity.setMaxParticipants(request.getMaxParticipants());
            activity.setDurationMinutes(request.getDurationMinutes());
//            activity.setDuration((int) Math.ceil(request.getDurationMinutes() / 60.0));

            logger.debug("{} - Activity entity populated successfully", operation);
            return activity;

        } catch (Exception e) {
            String error = "Error populating activity entity fields";
            logger.error("{} - Entity Population Error: {} - Exception: {}", operation, error, e.getMessage(), e);
            throw new RuntimeException(error, e);
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
    public Page<ActivityDTO> getAllActivities(Specification<Activity> spec, String sortBy, Pageable pageable) {
        List<Activity> activities;
        Sort sort;

        if ("lowPrice".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "price");
        } else if ("highPrice".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "price");
        } else if ("alphabetical".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "title");
        } else if ("highRating".equalsIgnoreCase(sortBy)) {
            sort = Sort.by("reviews");
        } else if ("lowRating".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "reviews");
        } else if ("minParticipants".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "minParticipants");
        } else {
            sort = Sort.unsorted();
        }

        // If pageable has sort, use it instead
        if (pageable.getSort().isSorted()) {
            sort = pageable.getSort();
        }

        activities = activityRepository.findAll(spec, sort);

        // Convert to DTOs
        List<ActivityDTO> dtos = activities.stream()
                .map(this::mapToActivityDTO)
                .collect(Collectors.toList());

        // Create a proper page
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), dtos.size());

        // Handle case where start might be >= dtos.size()
        if (start >= dtos.size()) {
            return new PageImpl<>(Collections.emptyList(), pageable, dtos.size());
        }

        List<ActivityDTO> pageContent = dtos.subList(start, end);
        return new PageImpl<>(pageContent, pageable, dtos.size());
    }

    @Override
    public Page<ActivityDTO> getSortedActivities(String sortBy, Double latitude, Double longitude, Double distance, Pageable pageable) {
        if ("lowPrice".equalsIgnoreCase(sortBy)) {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("price").ascending());
        } else if ("highPrice".equalsIgnoreCase(sortBy)) {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("price").descending());
        } else if ("alphabetical".equalsIgnoreCase(sortBy)) {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("title").ascending());
        } else if ("nearby".equalsIgnoreCase(sortBy) && latitude != null && longitude != null && distance != null) {
            Point point = geometryFactory.createPoint(new Coordinate(longitude, latitude));
            return activityRepository.findByLocationWithinDistance(longitude, latitude, distance, pageable)
                    .map(this::mapToActivityDTO);
        }
        return activityRepository.findAll(pageable).map(this::mapToActivityDTO);
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
    public Page<ActivityDTO> findFeaturedActivities(Pageable pageable) {
        return activityRepository.findByIsFeaturedTrueAndIsActiveTrue(pageable)
                .map(this::mapToActivityDTO);
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


        // Set activity to active when the first image is added
        if (!activity.isActive() && !activity.getMediaUrls().isEmpty()) {
            activity.setActive(true);
            log.info("Activity {} activated after image upload", activityId);
        }

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
