package com.abiodun.expaq.repository;

import com.abiodun.expaq.model.Wishlist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, UUID> {
    
    // Find wishlist items by user ID
    List<Wishlist> findByUserId(UUID userId);
    
    // Find wishlist items by user ID with pagination, ordered by creation date
    Page<Wishlist> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);
    
    // Find specific wishlist item
    Optional<Wishlist> findByUserIdAndActivityId(UUID userId, UUID activityId);
    
    // Check if activity is in user's wishlist
    boolean existsByUserIdAndActivityId(UUID userId, UUID activityId);
    
    // Count wishlist items for a user
    long countByUserId(UUID userId);
    
    // Find wishlist items by activity ID
    List<Wishlist> findByActivityId(UUID activityId);
    
    // Count how many users have wishlisted an activity
    long countByActivityId(UUID activityId);
    
    // Get most wishlisted activities
    @Query("SELECT w.activity, COUNT(w) as wishlistCount " +
           "FROM Wishlist w " +
           "WHERE w.activity.isActive = true " +
           "GROUP BY w.activity " +
           "ORDER BY COUNT(w) DESC")
    List<Object[]> findMostWishlistedActivities(Pageable pageable);
    
    // Get wishlist statistics for admin
    @Query("SELECT COUNT(w) FROM Wishlist w")
    long getTotalWishlistItems();
    
    @Query("SELECT COUNT(DISTINCT w.user.id) FROM Wishlist w")
    long getUniqueUsersWithWishlists();
    
    @Query("SELECT COUNT(DISTINCT w.activity.id) FROM Wishlist w")
    long getUniqueWishlistedActivities();
    
    // Get wishlist trends (activities added to wishlist in last X days)
    @Query("SELECT w.activity, COUNT(w) as recentWishlistCount " +
           "FROM Wishlist w " +
           "WHERE w.createdAt >= :since AND w.activity.isActive = true " +
           "GROUP BY w.activity " +
           "ORDER BY COUNT(w) DESC")
    List<Object[]> findTrendingWishlistActivities(@Param("since") java.time.LocalDateTime since, Pageable pageable);
    
    // Get user's wishlist count for specific activity type
    @Query("SELECT COUNT(w) FROM Wishlist w " +
           "WHERE w.user.id = :userId AND w.activity.activityType.id = :activityTypeId")
    long countByUserIdAndActivityTypeId(@Param("userId") UUID userId, @Param("activityTypeId") UUID activityTypeId);
    
    // Get activities in user's wishlist by price range
    @Query("SELECT w FROM Wishlist w " +
           "WHERE w.user.id = :userId " +
           "AND w.activity.price BETWEEN :minPrice AND :maxPrice " +
           "ORDER BY w.createdAt DESC")
    List<Wishlist> findByUserIdAndPriceRange(@Param("userId") UUID userId, 
                                             @Param("minPrice") java.math.BigDecimal minPrice, 
                                             @Param("maxPrice") java.math.BigDecimal maxPrice);
    
    // Get activities in user's wishlist by location
    @Query("SELECT w FROM Wishlist w " +
           "WHERE w.user.id = :userId " +
           "AND LOWER(w.activity.location) LIKE LOWER(CONCAT('%', :location, '%')) " +
           "ORDER BY w.createdAt DESC")
    List<Wishlist> findByUserIdAndLocation(@Param("userId") UUID userId, @Param("location") String location);
    
    // Delete all wishlist items for a specific activity (when activity is deleted)
    void deleteByActivityId(UUID activityId);
    
    // Delete all wishlist items for a specific user (when user is deleted)
    void deleteByUserId(UUID userId);
}