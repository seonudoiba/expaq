package com.abiodun.expaq.controller;

import com.abiodun.expaq.dto.ActivityDTO;
import com.abiodun.expaq.model.Activity;
import com.abiodun.expaq.model.ExpaqUserDetails;
import com.abiodun.expaq.model.User;
import com.abiodun.expaq.model.Wishlist;
import com.abiodun.expaq.repository.ActivityRepository;
import com.abiodun.expaq.repository.UserRepository;
import com.abiodun.expaq.repository.WishlistRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Wishlist", description = "User wishlist and favorites management")
public class WishlistController {

    private final WishlistRepository wishlistRepository;
    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Get user's wishlist")
    public ResponseEntity<List<ActivityDTO>> getUserWishlist(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        try {
            ExpaqUserDetails userDetails = (ExpaqUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UUID userId = userDetails.getId();
            
            Pageable pageable = PageRequest.of(page, size);
            Page<Wishlist> wishlistPage = wishlistRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
            
            List<ActivityDTO> activities = wishlistPage.getContent().stream()
                    .map(wishlist -> ActivityDTO.fromActivity(wishlist.getActivity()))
                    .collect(Collectors.toList());
            
            log.info("Retrieved {} wishlist items for user: {}", activities.size(), userId);
            return ResponseEntity.ok(activities);
            
        } catch (Exception e) {
            log.error("Error retrieving user wishlist: {}", e.getMessage());
            return ResponseEntity.ok(List.of());
        }
    }

    @PostMapping("/add/{activityId}")
    @Operation(summary = "Add activity to wishlist")
    public ResponseEntity<String> addToWishlist(@PathVariable UUID activityId) {
        try {
            ExpaqUserDetails userDetails = (ExpaqUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UUID userId = userDetails.getId();
            
            // Check if already in wishlist
            if (wishlistRepository.existsByUserIdAndActivityId(userId, activityId)) {
                return ResponseEntity.ok("Activity already in wishlist");
            }
            
            // Verify activity exists
            Activity activity = activityRepository.findById(activityId)
                    .orElseThrow(() -> new RuntimeException("Activity not found"));
            
            // Get user
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Create wishlist item
            Wishlist wishlist = new Wishlist();
            wishlist.setUser(user);
            wishlist.setActivity(activity);
            wishlist.setCreatedAt(LocalDateTime.now());
            
            wishlistRepository.save(wishlist);
            
            log.info("Added activity {} to wishlist for user: {}", activityId, userId);
            return ResponseEntity.ok("Activity added to wishlist");
            
        } catch (Exception e) {
            log.error("Error adding activity to wishlist: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to add activity to wishlist");
        }
    }

    @DeleteMapping("/remove/{activityId}")
    @Operation(summary = "Remove activity from wishlist")
    public ResponseEntity<String> removeFromWishlist(@PathVariable UUID activityId) {
        try {
            ExpaqUserDetails userDetails = (ExpaqUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UUID userId = userDetails.getId();
            
            Wishlist wishlist = wishlistRepository.findByUserIdAndActivityId(userId, activityId)
                    .orElseThrow(() -> new RuntimeException("Activity not in wishlist"));
            
            wishlistRepository.delete(wishlist);
            
            log.info("Removed activity {} from wishlist for user: {}", activityId, userId);
            return ResponseEntity.ok("Activity removed from wishlist");
            
        } catch (Exception e) {
            log.error("Error removing activity from wishlist: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to remove activity from wishlist");
        }
    }

    @GetMapping("/check/{activityId}")
    @Operation(summary = "Check if activity is in user's wishlist")
    public ResponseEntity<Boolean> isInWishlist(@PathVariable UUID activityId) {
        try {
            ExpaqUserDetails userDetails = (ExpaqUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UUID userId = userDetails.getId();
            
            boolean isInWishlist = wishlistRepository.existsByUserIdAndActivityId(userId, activityId);
            
            return ResponseEntity.ok(isInWishlist);
            
        } catch (Exception e) {
            log.error("Error checking wishlist status: {}", e.getMessage());
            return ResponseEntity.ok(false);
        }
    }

    @DeleteMapping("/clear")
    @Operation(summary = "Clear user's entire wishlist")
    public ResponseEntity<String> clearWishlist() {
        try {
            ExpaqUserDetails userDetails = (ExpaqUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UUID userId = userDetails.getId();
            
            List<Wishlist> userWishlist = wishlistRepository.findByUserId(userId);
            wishlistRepository.deleteAll(userWishlist);
            
            log.info("Cleared wishlist for user: {}", userId);
            return ResponseEntity.ok("Wishlist cleared successfully");
            
        } catch (Exception e) {
            log.error("Error clearing wishlist: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to clear wishlist");
        }
    }

    @GetMapping("/count")
    @Operation(summary = "Get wishlist item count")
    public ResponseEntity<Long> getWishlistCount() {
        try {
            ExpaqUserDetails userDetails = (ExpaqUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UUID userId = userDetails.getId();
            
            long count = wishlistRepository.countByUserId(userId);
            
            return ResponseEntity.ok(count);
            
        } catch (Exception e) {
            log.error("Error getting wishlist count: {}", e.getMessage());
            return ResponseEntity.ok(0L);
        }
    }

    @GetMapping("/popular")
    @Operation(summary = "Get most wishlisted activities")
    public ResponseEntity<List<ActivityDTO>> getPopularWishlistActivities(
            @RequestParam(defaultValue = "10") int limit) {
        
        try {
            Pageable pageable = PageRequest.of(0, limit);
            List<Object[]> popularActivities = wishlistRepository.findMostWishlistedActivities(pageable);
            
            List<ActivityDTO> activities = popularActivities.stream()
                    .map(result -> {
                        Activity activity = (Activity) result[0];
                        return ActivityDTO.fromActivity(activity);
                    })
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(activities);
            
        } catch (Exception e) {
            log.error("Error getting popular wishlist activities: {}", e.getMessage());
            return ResponseEntity.ok(List.of());
        }
    }

    @PostMapping("/bulk-add")
    @Operation(summary = "Add multiple activities to wishlist")
    public ResponseEntity<String> bulkAddToWishlist(@RequestBody List<UUID> activityIds) {
        try {
            ExpaqUserDetails userDetails = (ExpaqUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UUID userId = userDetails.getId();
            
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            int addedCount = 0;
            
            for (UUID activityId : activityIds) {
                // Skip if already in wishlist
                if (wishlistRepository.existsByUserIdAndActivityId(userId, activityId)) {
                    continue;
                }
                
                Activity activity = activityRepository.findById(activityId).orElse(null);
                if (activity != null) {
                    Wishlist wishlist = new Wishlist();
                    wishlist.setUser(user);
                    wishlist.setActivity(activity);
                    wishlist.setCreatedAt(LocalDateTime.now());
                    
                    wishlistRepository.save(wishlist);
                    addedCount++;
                }
            }
            
            log.info("Bulk added {} activities to wishlist for user: {}", addedCount, userId);
            return ResponseEntity.ok(String.format("Added %d activities to wishlist", addedCount));
            
        } catch (Exception e) {
            log.error("Error bulk adding to wishlist: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to bulk add to wishlist");
        }
    }

    @DeleteMapping("/bulk-remove")
    @Operation(summary = "Remove multiple activities from wishlist")
    public ResponseEntity<String> bulkRemoveFromWishlist(@RequestBody List<UUID> activityIds) {
        try {
            ExpaqUserDetails userDetails = (ExpaqUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UUID userId = userDetails.getId();
            
            int removedCount = 0;
            
            for (UUID activityId : activityIds) {
                Wishlist wishlist = wishlistRepository.findByUserIdAndActivityId(userId, activityId).orElse(null);
                if (wishlist != null) {
                    wishlistRepository.delete(wishlist);
                    removedCount++;
                }
            }
            
            log.info("Bulk removed {} activities from wishlist for user: {}", removedCount, userId);
            return ResponseEntity.ok(String.format("Removed %d activities from wishlist", removedCount));
            
        } catch (Exception e) {
            log.error("Error bulk removing from wishlist: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to bulk remove from wishlist");
        }
    }
}