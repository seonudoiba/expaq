package com.abiodun.expaq.controller;

import com.abiodun.expaq.dto.ActivityDTO;
import com.abiodun.expaq.model.Activity;
import com.abiodun.expaq.model.ActivityType;
import com.abiodun.expaq.model.Booking;
import com.abiodun.expaq.model.ExpaqUserDetails;
import com.abiodun.expaq.repository.ActivityRepository;
import com.abiodun.expaq.repository.BookingRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Recommendations", description = "Activity recommendation engine")
public class RecommendationController {

    private final ActivityRepository activityRepository;
    private final BookingRepository bookingRepository;

    @GetMapping("/user")
    @Operation(summary = "Get personalized activity recommendations for authenticated user")
    public ResponseEntity<List<ActivityDTO>> getUserRecommendations(
            @RequestParam(defaultValue = "10") int limit) {
        
        try {
            ExpaqUserDetails userDetails = (ExpaqUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UUID userId = userDetails.getId();
            
            log.info("Getting recommendations for user: {}", userId);
            
            List<Activity> recommendations = generatePersonalizedRecommendations(userId, limit);
            List<ActivityDTO> recommendationDTOs = recommendations.stream()
                    .map(ActivityDTO::fromActivity)
                    .toList();

            return ResponseEntity.ok(recommendationDTOs);
            
        } catch (Exception e) {
            log.error("Error generating user recommendations: {}", e.getMessage());
            return ResponseEntity.ok(getFallbackRecommendations(limit));
        }
    }

    @GetMapping("/popular")
    @Operation(summary = "Get popular activities")
    public ResponseEntity<List<ActivityDTO>> getPopularActivities(
            @RequestParam(defaultValue = "10") int limit) {
        
        try {
            Pageable pageable = PageRequest.of(0, limit);
            List<Activity> popularActivities = activityRepository.findMostPopularActivities(pageable);
            
            List<ActivityDTO> activityDTOs = popularActivities.stream()
                    .map(ActivityDTO::fromActivity)
                    .toList();

            return ResponseEntity.ok(activityDTOs);
            
        } catch (Exception e) {
            log.error("Error fetching popular activities: {}", e.getMessage());
            return ResponseEntity.ok(getFallbackRecommendations(limit));
        }
    }

    @GetMapping("/similar/{activityId}")
    @Operation(summary = "Get activities similar to a specific activity")
    public ResponseEntity<List<ActivityDTO>> getSimilarActivities(
            @PathVariable UUID activityId,
            @RequestParam(defaultValue = "5") int limit) {
        
        try {
            Optional<Activity> activityOpt = activityRepository.findById(activityId);
            if (activityOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Activity activity = activityOpt.get();
            List<Activity> similarActivities = findSimilarActivities(activity, limit);
            
            List<ActivityDTO> activityDTOs = similarActivities.stream()
                    .map(ActivityDTO::fromActivity)
                    .toList();

            return ResponseEntity.ok(activityDTOs);
            
        } catch (Exception e) {
            log.error("Error finding similar activities: {}", e.getMessage());
            return ResponseEntity.ok(getFallbackRecommendations(limit));
        }
    }

    @GetMapping("/trending")
    @Operation(summary = "Get trending activities")
    public ResponseEntity<List<ActivityDTO>> getTrendingActivities(
            @RequestParam(defaultValue = "10") int limit) {
        
        try {
            // Get activities with recent bookings (trending)
            Pageable pageable = PageRequest.of(0, limit);
            List<Activity> trendingActivities = activityRepository.findTrendingActivities(pageable);
            
            List<ActivityDTO> activityDTOs = trendingActivities.stream()
                    .map(ActivityDTO::fromActivity)
                    .toList();

            return ResponseEntity.ok(activityDTOs);
            
        } catch (Exception e) {
            log.error("Error fetching trending activities: {}", e.getMessage());
            return ResponseEntity.ok(getFallbackRecommendations(limit));
        }
    }

    @GetMapping("/location")
    @Operation(summary = "Get location-based recommendations")
    public ResponseEntity<List<ActivityDTO>> getLocationBasedRecommendations(
            @RequestParam String city,
            @RequestParam(required = false) String country,
            @RequestParam(defaultValue = "10") int limit) {
        
        try {
            String location = country != null ? city + ", " + country : city;
            List<Activity> locationActivities = activityRepository.findByLocationContainingIgnoreCase(location);
            
            // Sort by rating and limit results
            List<Activity> topActivities = locationActivities.stream()
                    .sorted((a1, a2) -> Double.compare(a2.getAverageRating(), a1.getAverageRating()))
                    .limit(limit)
                    .toList();

            List<ActivityDTO> activityDTOs = topActivities.stream()
                    .map(ActivityDTO::fromActivity)
                    .toList();

            return ResponseEntity.ok(activityDTOs);
            
        } catch (Exception e) {
            log.error("Error fetching location-based recommendations: {}", e.getMessage());
            return ResponseEntity.ok(getFallbackRecommendations(limit));
        }
    }

    private List<Activity> generatePersonalizedRecommendations(UUID userId, int limit) {
        try {
            // Get user's booking history to understand preferences
            List<Activity> userBookedActivities = getUserBookedActivities(userId);
            
            if (userBookedActivities.isEmpty()) {
                // New user - return popular activities
                return activityRepository.findMostPopularActivities(PageRequest.of(0, limit));
            }
            
            // Analyze user preferences
            Map<ActivityType, Integer> typePreferences = analyzeUserActivityTypePreferences(userBookedActivities);

            // Get activities from preferred types and locations
            List<Activity> recommendations = new ArrayList<>();
            
            // Add activities from preferred types
            for (Map.Entry<ActivityType, Integer> entry : typePreferences.entrySet()) {
                ActivityType type = entry.getKey();
                List<Activity> typeActivities = activityRepository.findByActivityTypeAndActiveTrue(type);

                // Filter out already booked activities
                List<Activity> newActivities = typeActivities.stream()
                        .filter(activity -> !userBookedActivities.contains(activity))
                        .limit(limit / typePreferences.size() + 1)
                        .toList();

                recommendations.addAll(newActivities);
            }
            
            // Remove duplicates and limit
            List<Activity> finalRecommendations = new ArrayList<>(
                recommendations.stream()
                    .distinct()
                    .limit(limit)
                    .toList()
            );

            // If not enough recommendations, fill with popular activities
            if (finalRecommendations.size() < limit) {
                List<Activity> popularActivities = activityRepository.findMostPopularActivities(
                    PageRequest.of(0, limit - finalRecommendations.size())
                );
                
                List<Activity> additionalActivities = popularActivities.stream()
                    .filter(activity -> !finalRecommendations.contains(activity))
                    .toList();
                finalRecommendations.addAll(additionalActivities);
            }
            
            return finalRecommendations.stream().limit(limit).toList();

        } catch (Exception e) {
            log.error("Error in personalized recommendations: {}", e.getMessage());
            return activityRepository.findMostPopularActivities(PageRequest.of(0, limit));
        }
    }

    private List<Activity> getUserBookedActivities(UUID userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(Booking::getActivity)
                .distinct()
                .toList();
    }

    private Map<ActivityType, Integer> analyzeUserActivityTypePreferences(List<Activity> userActivities) {
        Map<ActivityType, Integer> typeCount = new HashMap<>();

        for (Activity activity : userActivities) {
            ActivityType type = activity.getActivityType();
            if (type != null) {
                typeCount.put(type, typeCount.getOrDefault(type, 0) + 1);
            }
        }
        
        return typeCount.entrySet().stream()
                .sorted(Map.Entry.<ActivityType, Integer>comparingByValue().reversed())
                .collect(Collectors.toMap(
                    Map.Entry::getKey,
                    Map.Entry::getValue,
                    (e1, e2) -> e1,
                    LinkedHashMap::new
                ));
    }

    private List<Activity> findSimilarActivities(Activity referenceActivity, int limit) {
        // Find activities with same activity type
        ActivityType activityType = referenceActivity.getActivityType();
        final UUID referenceId = referenceActivity.getId();
        List<Activity> similarActivities = activityType != null ?
                activityRepository.findByActivityTypeAndActiveTrue(activityType)
                        .stream()
                        .filter(activity -> !activity.getId().equals(referenceId))
                        .limit(limit)
                        .toList()
                : new ArrayList<>();

        // If not enough, add activities from same location
        if (similarActivities.size() < limit) {
            final List<Activity> currentSimilar = similarActivities;
            List<Activity> locationActivities = activityRepository.findByLocationContainingIgnoreCase(referenceActivity.getLocation())
                    .stream()
                    .filter(activity -> !activity.getId().equals(referenceId))
                    .filter(activity -> !currentSimilar.contains(activity))
                    .limit(limit - similarActivities.size())
                    .toList();

            similarActivities = new ArrayList<>(similarActivities);
            similarActivities.addAll(locationActivities);
        }
        
        return similarActivities;
    }

    private List<ActivityDTO> getFallbackRecommendations(int limit) {
        try {
            List<Activity> fallbackActivities = activityRepository.findByActiveTrue(PageRequest.of(0, limit));
            return fallbackActivities.stream()
                    .map(ActivityDTO::fromActivity)
                    .toList();
        } catch (Exception e) {
            log.error("Error in fallback recommendations: {}", e.getMessage());
            return new ArrayList<>();
        }
    }
}