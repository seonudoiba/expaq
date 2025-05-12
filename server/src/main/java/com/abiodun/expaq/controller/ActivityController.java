package com.abiodun.expaq.controller;

import com.abiodun.expaq.dto.ActivityDTO;
import com.abiodun.expaq.dto.CreateActivityRequest;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // For role-based authorization
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
// Add CORS configuration if needed
public class ActivityController {

    private final IActivityService activityService;
    private static final Logger log = LoggerFactory.getLogger(ActivityController.class);

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
        log.info("Creating activity with user: {} and authorities: {}", 
            currentUser.getUsername(), 
            currentUser.getAuthorities());

        // Check if user has HOST role
        boolean hasHostRole = currentUser.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_HOST") || auth.getAuthority().equals("HOST"));
        log.info("User has HOST role: {}", hasHostRole);
        if (!hasHostRole) {
            throw new UnauthorizedException("User does not have HOST privileges");
        }
        
        UUID hostId = currentUser.getId();
        return ResponseEntity.ok(activityService.createActivity(request, hostId));
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

    @GetMapping("/categories")
    public ResponseEntity<ActivityCategory[]> findActivitiesCategories() {
        return ResponseEntity.ok(ActivityCategory.values());
    }
    @GetMapping("/cities")
    public ResponseEntity<Set<String>> findActivitiesCities() {
        return ResponseEntity.ok(activityService.findAllDistinctCities());
    }
    @GetMapping("/countries")
    public ResponseEntity<Set<String>> findActivitiesCountries() {
        return ResponseEntity.ok(activityService.findAllDistinctCountries());
    }

    @GetMapping("/nearby/{category}")
    public ResponseEntity<List<ActivityDTO>> findNearbyActivitiesByCategory(
            @PathVariable String category,
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam double distance) {
        return ResponseEntity.ok(activityService.findNearbyActivitiesByCategory(
                ActivityCategory.valueOf(category), latitude, longitude, distance));
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
