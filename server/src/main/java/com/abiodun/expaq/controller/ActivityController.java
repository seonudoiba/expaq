package com.abiodun.expaq.controller;

import com.abiodun.expaq.dto.ActivityDTO;
import com.abiodun.expaq.dto.CreateActivityRequest;
import com.abiodun.expaq.dto.LocationStatsDTO;
import com.abiodun.expaq.dto.UpdateActivityRequest;
import com.abiodun.expaq.exception.UnauthorizedException;
import com.abiodun.expaq.model.Activity; // Import Activity for Specification
import com.abiodun.expaq.model.Activity.ActivityCategory;
import com.abiodun.expaq.model.ExpaqUserDetails;
import com.abiodun.expaq.service.IActivityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    public ResponseEntity<List<ActivityDTO>> getAllActivities(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice
    ) {
        Specification<Activity> spec = Specification.where(null);

        if (location != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("location"), location));
        }

        if (type != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("type"), type));
        }


        if (minPrice != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice));
        }

        if (maxPrice != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice));
        }

        List<ActivityDTO> activities = activityService.getAllActivities(spec);
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

    @PostMapping("/activities")
    public ResponseEntity<ActivityDTO> createActivity(
            @Valid @RequestBody CreateActivityRequest request,
            @RequestHeader("X-User-ID") UUID hostId) {

        String operation = "createActivity_Controller";

        try {
            logger.info("{} - Received request to create activity for hostId: {}", operation, hostId);

            // Additional JSON structure validation at controller level
            validateJsonStructure(request, operation);

            ActivityDTO activity = activityService.createActivity(request, hostId);
            logger.info("{} - Activity created successfully with ID: {}", operation, activity.getId());

            return ResponseEntity.status(HttpStatus.CREATED).body(activity);

        } catch (IllegalArgumentException e) {
            logger.error("{} - Validation Error: {}", operation, e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("{} - Unexpected Error: {}", operation, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
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
            Pageable pageable) {
        return ResponseEntity.ok(activityService.searchActivities(query, pageable));
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<ActivityDTO>> findNearbyActivities(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam double distance) {
        return ResponseEntity.ok(activityService.findNearbyActivities(latitude, longitude, distance));
    }

        @GetMapping("/by-type/{typeId}")
    public ResponseEntity<Page<ActivityDTO>> getActivitiesByType(
            @PathVariable UUID typeId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(activityService.findActivitiesByActivityType(typeId, pageable));
    }

    @GetMapping("/by-city/{city}")
    public ResponseEntity<Page<ActivityDTO>> getActivitiesByCity(
            @PathVariable String city,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(activityService.findActivitiesByCity(city, pageable));
    }

    @GetMapping("/by-country/{country}")
    public ResponseEntity<Page<ActivityDTO>> getActivitiesByCountry(
            @PathVariable String country,
            @PageableDefault(size = 20) Pageable pageable) {
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
    public ResponseEntity<List<ActivityDTO>> findFeaturedActivities() {
        return ResponseEntity.ok(activityService.findFeaturedActivities());
    }

    @GetMapping("/host/{hostId}")
    public ResponseEntity<List<ActivityDTO>> findHostActivities(@PathVariable UUID hostId) {
        return ResponseEntity.ok(activityService.findHostActivities(hostId));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<Page<ActivityDTO>> findUpcomingActivities(Pageable pageable) {
        return ResponseEntity.ok(activityService.findUpcomingActivities(pageable));
    }

    @GetMapping("/popular")
    public ResponseEntity<Page<ActivityDTO>> findPopularActivities(Pageable pageable) {
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
