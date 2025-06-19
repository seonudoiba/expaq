package com.abiodun.expaq.controller;

import com.abiodun.expaq.dto.ActivityDTO;
import com.abiodun.expaq.dto.CreateActivityRequest;
import com.abiodun.expaq.dto.LocationStatsDTO;
import com.abiodun.expaq.dto.UpdateActivityRequest;
import com.abiodun.expaq.exception.UnauthorizedException;
import com.abiodun.expaq.model.Activity; // Import Activity for Specification
import com.abiodun.expaq.model.ActivityType;
import com.abiodun.expaq.model.ExpaqUserDetails;
import com.abiodun.expaq.service.IActivityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // For role-based authorization
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
// Add CORS configuration if needed
public class ActivityController {

    private final IActivityService activityService;
    private static final Logger logger = LoggerFactory.getLogger(ActivityController.class);

//    @Autowired
//    public ActivityController(IActivityService activityService) {
//        this.activityService = activityService;
//    }
    // GET /activities - List activities (publicly accessible, filtering added)
    @GetMapping
    public ResponseEntity<Page<ActivityDTO>> getAllActivities(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String activityType,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String querySearch,
            @RequestParam(required = false) String when,
            @RequestParam(required = false) String numOfPeople,
            @PageableDefault(size = 24) Pageable pageable
            ) {
        Specification<Activity> spec = Specification.where(null);

        if (city != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("city").get("name"), city));
        }
        if (country != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("country").get("name"), country));
        }

        if (activityType != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("activityType").get("name"), activityType));
        }

        if (minPrice != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice));
        }

        if (maxPrice != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice));
        }

        if (when != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

            LocalDateTime whenDateTime = LocalDateTime.parse(when, formatter);

            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.and(
                            criteriaBuilder.lessThanOrEqualTo(root.get("startDate"), whenDateTime),
                            criteriaBuilder.greaterThanOrEqualTo(root.get("endDate"), whenDateTime)
                    )
            );
        }
        if (numOfPeople != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                criteriaBuilder.and(
                        criteriaBuilder.greaterThanOrEqualTo(root.get("maxParticipants"), numOfPeople),
                        criteriaBuilder.lessThanOrEqualTo(root.get("minParticipants"), numOfPeople)
                )
            );
        }


        if (querySearch != null) {
            String likePattern = "%" + querySearch.toLowerCase() + "%";
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.or(
                            criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), likePattern),
                            criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), likePattern),
                            criteriaBuilder.like(criteriaBuilder.lower(root.get("activityType").get("name")), likePattern),
                            criteriaBuilder.like(criteriaBuilder.lower(root.get("country").get("name")), likePattern),
                            criteriaBuilder.like(criteriaBuilder.lower(root.get("address")), likePattern),
                            criteriaBuilder.like(criteriaBuilder.lower(root.get("city").get("name")), likePattern),
                            criteriaBuilder.like(criteriaBuilder.lower(root.get("host").get("firstName")), likePattern),
                            criteriaBuilder.like(criteriaBuilder.lower(root.get("host").get("lastName")), likePattern)
                    )
            );
        }


        Page<ActivityDTO> activities = activityService.getAllActivities(spec, sortBy, pageable);
        return ResponseEntity.ok(activities);
    }


    // GET /activities/{id} - View one activity (publicly accessible)
    @GetMapping("/{id}")
    public ResponseEntity<ActivityDTO> getActivityById(@PathVariable UUID id) {
        ActivityDTO activity = activityService.getActivityById(id);
        return ResponseEntity.ok(activity);
    }

    // POST /activities - Create activity (host only)
    @PostMapping
    @PreAuthorize("hasRole('HOST')")
    public ResponseEntity<ActivityDTO> createActivity(
            @AuthenticationPrincipal ExpaqUserDetails currentUser,
            @Valid @RequestBody CreateActivityRequest request) {
        logger.info("Creating activity with user: {} and authorities: {}",
            currentUser.getUsername(), 
            currentUser.getAuthorities());

        // Check if user has HOST role
        boolean hasHostRole = currentUser.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_HOST") || auth.getAuthority().equals("HOST"));
        logger.info("User has HOST role: {}", hasHostRole);
        if (!hasHostRole) {
            throw new UnauthorizedException("User does not have HOST privileges");
        }
        
        UUID hostId = currentUser.getId();
        return ResponseEntity.ok(activityService.createActivity(request, hostId));
    }

    // PRIVATE HELPER METHOD - ADD TO CONTROLLER
    private void validateJsonStructure(CreateActivityRequest request, String operation) {
        List<String> structureErrors = new ArrayList<>();

        try {
            Field[] fields = CreateActivityRequest.class.getDeclaredFields();
            for (Field field : fields) {
                field.setAccessible(true);
                try {
                    Object value = field.get(request);
                    logger.debug("{} - Field '{}' has value: {}", operation, field.getName(), value);
                } catch (Exception e) {
                    structureErrors.add("Error accessing field '" + field.getName() + "': " + e.getMessage());
                }
            }
        } catch (Exception e) {
            structureErrors.add("Error validating JSON structure: " + e.getMessage());
        }

        if (!structureErrors.isEmpty()) {
            String errorMessage = "JSON structure validation failed: " + String.join("; ", structureErrors);
            logger.error("{} - Structure Validation Errors: {}", operation, errorMessage);
            throw new IllegalArgumentException(errorMessage);
        }
    }

    // PUT /activities/{id} - Update activity (host only, owner only)
    @PutMapping("/{activityId}")
    @PreAuthorize("hasRole('HOST')") // Ensure only users with HOST role can access
    public ResponseEntity<ActivityDTO> updateActivity(
            @AuthenticationPrincipal ExpaqUserDetails currentUser,
            @PathVariable UUID activityId,
            @Valid @RequestBody UpdateActivityRequest request) {
        UUID hostId = currentUser.getId();
        return ResponseEntity.ok(activityService.updateActivity(activityId, request, hostId));
    }

    // DELETE /activities/{id} - Delete activity (host only, owner only)
    @DeleteMapping("/{activityId}")
    @PreAuthorize("hasRole('HOST')") // Ensure only users with HOST role can access
    @ResponseStatus(HttpStatus.NO_CONTENT) // Return 204 No Content on success
    public void deleteActivity(
            @AuthenticationPrincipal ExpaqUserDetails currentUser,
            @PathVariable UUID activityId) {
        UUID hostId = currentUser.getId();
        activityService.deleteActivity(activityId, hostId);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ActivityDTO>> searchActivities(
            @RequestParam String query,
            @PageableDefault(size = 24) Pageable pageable) {
        return ResponseEntity.ok(activityService.searchActivities(query, pageable));
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<ActivityDTO>> findNearbyActivities(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam double distance) {
        return ResponseEntity.ok(activityService.findNearbyActivities(latitude, longitude, distance));
    }
    @GetMapping("/sorted")
    public ResponseEntity<Page<ActivityDTO>> getSortedActivities(
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam(required = false) Double distance,
            @PageableDefault(size = 24) Pageable pageable) {
        Page<ActivityDTO> activities = activityService.getSortedActivities(sortBy, latitude, longitude, distance, pageable);
        return ResponseEntity.ok(activities);
    }
        @GetMapping("/by-type/{typeId}")
    public ResponseEntity<Page<ActivityDTO>> getActivitiesByType(
            @PathVariable UUID typeId,
            @PageableDefault(size = 24) Pageable pageable) {
        return ResponseEntity.ok(activityService.findActivitiesByActivityType(typeId, pageable));
    }

    @GetMapping("/by-city/{city}")
    public ResponseEntity<Page<ActivityDTO>> getActivitiesByCity(
            @PathVariable String city,
            @PageableDefault(size = 24) Pageable pageable) {
        return ResponseEntity.ok(activityService.findActivitiesByCity(city, pageable));
    }

    @GetMapping("/by-country/{country}")
    public ResponseEntity<Page<ActivityDTO>> getActivitiesByCountry(
            @PathVariable String country,
            @PageableDefault(size = 24) Pageable pageable) {
        return ResponseEntity.ok(activityService.findActivitiesByCountry(country, pageable));
    }
        @GetMapping("/nearby/{type}")
    public ResponseEntity<List<ActivityDTO>> findNearbyActivitiesByActivityType(
            @PathVariable String type,
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam double distance) {
        return ResponseEntity.ok(activityService.findNearbyActivitiesByActivityType(
                type, latitude, longitude, distance));
    }

    @GetMapping("/featured")
    public ResponseEntity<Page<ActivityDTO>> findFeaturedActivities(@PageableDefault(size = 24) Pageable pageable) {
        return ResponseEntity.ok(activityService.findFeaturedActivities(pageable));
    }

    @GetMapping("/host/{hostId}")
    public ResponseEntity<List<ActivityDTO>> findHostActivities(@PathVariable UUID hostId) {
        return ResponseEntity.ok(activityService.findHostActivities(hostId));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<Page<ActivityDTO>> findUpcomingActivities(@PageableDefault(size = 24) Pageable pageable) {
        return ResponseEntity.ok(activityService.findUpcomingActivities(pageable));
    }

    @GetMapping("/popular")
    public ResponseEntity<Page<ActivityDTO>> findPopularActivities(@PageableDefault(size = 24) Pageable pageable) {
        return ResponseEntity.ok(activityService.findPopularActivities(pageable));
    }

    @GetMapping("/available")
    public ResponseEntity<List<ActivityDTO>> findActivitiesWithAvailableSlots() {
        return ResponseEntity.ok(activityService.findActivitiesWithAvailableSlots());
    }

    @GetMapping("/price-range")
    public ResponseEntity<List<ActivityDTO>> findActivitiesByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice) {
        return ResponseEntity.ok(activityService.findActivitiesByPriceRange(minPrice, maxPrice));
    }

    @PostMapping("/{activityId}/images")
    public ResponseEntity<ActivityDTO> uploadActivityImage(
            @AuthenticationPrincipal ExpaqUserDetails currentUser,
            @PathVariable UUID activityId,
            @RequestParam("file") MultipartFile file) {
        UUID hostId = currentUser.getId();
        return ResponseEntity.ok(activityService.uploadActivityImage(activityId, file, hostId));
    }

    @DeleteMapping("/{activityId}/images")
    public ResponseEntity<ActivityDTO> deleteActivityImage(
            @AuthenticationPrincipal ExpaqUserDetails currentUser,
            @PathVariable UUID activityId,
            @RequestParam String imageUrl) {
        UUID hostId = currentUser.getId();
        activityService.deleteActivityImage(activityId, imageUrl, hostId);
//        return ResponseEntity.ok("Activity image" + imageUrl + "has been deleted successfully");
        return ResponseEntity.ok(activityService.getActivityById(activityId));
    }
}
