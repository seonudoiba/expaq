//// File: c:\Users\Starr\Desktop\projects\expaq\server\src\main\java\com\abiodun\expaq\service\ActivityService.java
//package com.abiodun.expaq.service;
//
//import com.abiodun.expaq.dto.ActivityDTO; // Import DTO
//import com.abiodun.expaq.exception.ResourceNotFoundException; // Import custom exception
//import com.abiodun.expaq.model.Activity;
//import com.abiodun.expaq.model.ExpaqUserDetails;
//import com.abiodun.expaq.model.User;
//import com.abiodun.expaq.repository.ActivityRepository;
//import com.abiodun.expaq.repository.UserRepository;
//import com.abiodun.expaq.service.IActivityService;
//import lombok.RequiredArgsConstructor;
//import org.modelmapper.ModelMapper; // Import ModelMapper
//import org.locationtech.jts.geom.Coordinate; // Import Coordinate
//import org.locationtech.jts.geom.GeometryFactory; // Import GeometryFactory
//import org.locationtech.jts.geom.Point; // Import Point
//import org.locationtech.jts.geom.PrecisionModel; // Import PrecisionModel
//import org.springframework.http.HttpStatus;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Service;
//import org.springframework.web.server.ResponseStatusException;
//import org.springframework.data.jpa.domain.Specification;
//
//import java.math.BigDecimal;
//import java.time.LocalDate;
//import java.util.*;
//
//@Service
//@RequiredArgsConstructor
//public class ActivityService implements IActivityService {
//    private final ActivityRepository activityRepository;
//    private final UserRepository userRepository;
//    private final ModelMapper modelMapper; // Inject ModelMapper
//
//    // GeometryFactory for creating Point objects (SRID 4326 for WGS 84)
//    private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
//
//    // Helper method to get current authenticated user
//    private User getCurrentUser() {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (authentication == null || !authentication.isAuthenticated() || !(authentication.getPrincipal() instanceof ExpaqUserDetails)) {
//            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
//        }
//        ExpaqUserDetails userDetails = (ExpaqUserDetails) authentication.getPrincipal();
//        // Fetch the full User entity if needed, assuming ExpaqUserDetails has username or ID
//        return userRepository.findByUserName(userDetails.getUsername())
//                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found in database"));
//    }
//
//    // Helper method to convert Lat/Lon to Point
//    private Point createPoint(BigDecimal latitude, BigDecimal longitude) {
//        if (latitude == null || longitude == null) {
//            return null; // Or throw validation exception
//        }
//        // Ensure latitude and longitude are within valid ranges if necessary
//        return geometryFactory.createPoint(new Coordinate(longitude.doubleValue(), latitude.doubleValue()));
//    }
//
//    // Helper method to convert Point to Lat/Lon for DTO
//    private void mapPointToDto(Point point, ActivityDTO dto) {
//        if (point != null) {
//            dto.setLatitude(BigDecimal.valueOf(point.getY()));
//            dto.setLongitude(BigDecimal.valueOf(point.getX()));
//        }
//    }
//
//    @Override
//    public ActivityDTO addNewActivity(ActivityDTO activityDTO) throws Exception {
//        User host = getCurrentUser(); // Get authenticated host
//
//        // TODO: Add validation to ensure user has HOST role
//
//        Activity activity = modelMapper.map(activityDTO, Activity.class);
//
//        // Map location from DTO's lat/lon to entity's Point
//        activity.setLocation(createPoint(activityDTO.getLatitude(), activityDTO.getLongitude()));
//
//        activity.setHost(host);
//        activity.setId(null); // Ensure ID is null for creation
//
//        // TODO: Handle schedule mapping (Object to JSON String/Map)
//        // TODO: Handle mediaUrls upload and saving URLs
//
//        Activity savedActivity = activityRepository.save(activity);
//
//        ActivityDTO savedActivityDTO = modelMapper.map(savedActivity, ActivityDTO.class);
//        // Map location from entity's Point back to DTO's lat/lon
//        mapPointToDto(savedActivity.getLocation(), savedActivityDTO);
//        savedActivityDTO.setHostId(host.getId()); // Set host ID in DTO
//        // Optionally set host name if needed in DTO
//        // savedActivityDTO.setHostName(host.getName());
//
//        return savedActivityDTO;
//    }
//
//    @Override
//    public List<ActivityDTO> getAllActivities() {
//        List<Activity> activities = activityRepository.findAll();
//        return getActivityDTOS(activities);
//    }
//    @Override
//    public List<ActivityDTO> getAllActivities(Specification<Activity> spec) {
//        List<Activity> activities = activityRepository.findAll(spec);
//        return getActivityDTOS(activities);
//    }
//
//    @Override
//    public List<String> getAllActivityTypes() {
//        // This method is likely obsolete based on the new schema (uses category enum)
//        // return activityRepository.findDistinctActivityTypes();
//        throw new UnsupportedOperationException("getAllActivityTypes is deprecated, use filtering by category.");
//    }
//
//    @Override
//    public Optional<Activity> getActivityById(UUID activityId) { // Changed Long to UUID
//        // TODO: Return Optional<ActivityDTO> and handle mapping including Point -> Lat/Lon
//        return activityRepository.findById(activityId);
//                // .map(activity -> modelMapper.map(activity, ActivityDTO.class)); // Basic mapping example
//    }
//
//    @Override
//    public List<Activity> getAllActivitiesByUserId(UUID userId) { // Changed Long to UUID
//        // TODO: Return List<ActivityDTO> and handle mapping including Point -> Lat/Lon
//        return activityRepository.findByHostId(userId);
//    }
//
//    @Override
//    public List<Activity> getFeaturedActivities() {
//        // This method seems obsolete based on the documentation/schema
//        // return activityRepository.findByIsFeaturedTrue();
//        throw new UnsupportedOperationException("getFeaturedActivities is deprecated.");
//    }
//
//    @Override
//    public List<Activity> getAvailableActivities(LocalDate checkInDate, LocalDate checkOutDate, String roomType) {
//        // This method seems related to room booking, not activities based on current schema
//        // return activityRepository.findAvailableActivitiesByDatesAndType(checkInDate, checkOutDate, roomType);
//         throw new UnsupportedOperationException("getAvailableActivities seems unrelated to the current activity schema.");
//    }
//
//    @Override
//    public List<Object[]> getAllActivityDestinationCountries() {
//        // This method seems obsolete (location is Point, not separate country/city fields)
//        // return activityRepository.findCountries();
//        throw new UnsupportedOperationException("getAllActivityDestinationCountries is deprecated.");
//
//    }
//
//    @Override
//    public List<Object[]> getAllActivityDestinationCities() {
//         // This method seems obsolete
//        // return activityRepository.findDistinctCities();
//        throw new UnsupportedOperationException("getAllActivityDestinationCities is deprecated.");
//    }
//
//    @Override
//    public void deleteActivity(UUID activityId) { // Changed Long to UUID
//        if (!activityRepository.existsById(activityId)) {
//            throw new ResourceNotFoundException("Activity with ID " + activityId + " not found");
//        }
//        // TODO: Add authorization check - only host or admin can delete
//        activityRepository.deleteById(activityId);
//    }
//
//    @Override
//    public Activity updateActivity(UUID activityId, ActivityDTO activityDTO) throws Exception { // Refactored signature
//         // TODO: Implement update logic using DTO, handle mapping (Point, schedule, media), authorization
//         throw new UnsupportedOperationException("updateActivity not fully implemented yet.");
//    }
//
//    private List<ActivityDTO> getActivityDTOS(List<Activity> activities) {
//        List<ActivityDTO> activityDTOs = new ArrayList<>();
//        for (Activity activity : activities) {
//            ActivityDTO dto = modelMapper.map(activity, ActivityDTO.class);
//            mapPointToDto(activity.getLocation(), dto); // Map Point to Lat/Lon
//            activityDTOs.add(dto);
//        }
//        return activityDTOs;
//    }
//
//
//}