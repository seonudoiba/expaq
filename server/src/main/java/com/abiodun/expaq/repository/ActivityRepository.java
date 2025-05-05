package com.abiodun.expaq.repository;

import com.abiodun.expaq.model.Activity;
import com.abiodun.expaq.model.Activity.ActivityCategory;
import org.locationtech.jts.geom.Point;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface ActivityRepository extends JpaRepository<Activity, UUID>, JpaSpecificationExecutor<Activity> {

    // Find activities by host ID
    List<Activity> findByHostId(UUID hostId);

    // Find activities by category
    List<Activity> findByCategory(ActivityCategory category);
    
    // Search and filter methods
    @Query("SELECT a FROM Activity a WHERE " +
           "LOWER(a.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Activity> searchActivities(@Param("query") String query, Pageable pageable);
    
    // Location-based queries
    @Query(value = "SELECT a FROM Activity a WHERE " +
           "function('ST_DWithin', a.location, :point, :distance) = true AND " +
           "a.isActive = true")
    List<Activity> findNearbyActivities(@Param("point") Point point, @Param("distance") double distance);
    
    // Category and location combined
    @Query(value = "SELECT a FROM Activity a WHERE " +
           "a.category = :category AND " +
           "ST_DWithin(a.location, :point, :distance) = true AND " +
           "a.isActive = true")
    List<Activity> findNearbyActivitiesByCategory(
            @Param("category") ActivityCategory category,
            @Param("point") Point point,
            @Param("distance") double distance);
    
    // Featured activities
    List<Activity> findByIsFeaturedTrueAndIsActiveTrue();
    
    // Active activities by host
    List<Activity> findByHostIdAndIsActiveTrue(UUID hostId);
    
    // Upcoming activities
    @Query("SELECT a FROM Activity a WHERE " +
           "a.isActive = true AND " +
           "EXISTS (SELECT 1 FROM a.bookings b WHERE b.bookingDateTime > :now)")
    List<Activity> findUpcomingActivities(@Param("now") LocalDateTime now);
    
    // Popular activities (by number of bookings)
    @Query("SELECT a FROM Activity a WHERE a.isActive = true " +
           "ORDER BY (SELECT COUNT(b) FROM a.bookings b) DESC")
    Page<Activity> findPopularActivities(Pageable pageable);
    
    // Activities with available slots
    @Query("SELECT a FROM Activity a WHERE " +
           "a.isActive = true AND " +
           "a.capacity > a.bookedCapacity")
    List<Activity> findActivitiesWithAvailableSlots();
    
    // Activities by price range
    List<Activity> findByPriceBetweenAndIsActiveTrue(BigDecimal minPrice, BigDecimal maxPrice);

    Page<Activity> findByHostId(UUID hostId, Pageable pageable);
    
    Page<Activity> findByCategory(ActivityCategory category, Pageable pageable);
    
    Page<Activity> findByIsActiveTrue(Pageable pageable);
    
    Page<Activity> findByIsVerifiedTrue(Pageable pageable);
    
    @Query("SELECT a FROM Activity a WHERE a.isActive = true AND a.isVerified = true AND a.price BETWEEN :minPrice AND :maxPrice")
    Page<Activity> findByPriceRange(@Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice, Pageable pageable);
    
    @Query(value = "SELECT * FROM activities a WHERE " +
           "ST_DWithin(a.location, ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326), :distance) AND " +
           "a.is_active = true", 
           nativeQuery = true)
    Page<Activity> findByLocationWithinDistance(@Param("longitude") double longitude, 
                                                @Param("latitude") double latitude, 
                                                @Param("distance") double distance, 
                                                Pageable pageable);
    
    @Query("SELECT a FROM Activity a WHERE a.isActive = true AND a.isVerified = true AND a.host.id = :hostId AND a.category = :category")
    Page<Activity> findByHostAndCategory(@Param("hostId") UUID hostId, @Param("category") ActivityCategory category, Pageable pageable);
    
//    @Query("SELECT a FROM Activity a WHERE a.isActive = true AND a.isVerified = true AND LOWER(a.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(a.description) LIKE LOWER(CONCAT('%', :query, '%'))")
//    Page<Activity> searchActivities(@Param("query") String query, Pageable pageable);
    
    @Query("SELECT a FROM Activity a WHERE a.isActive = true AND a.isVerified = true AND a.createdAt >= :startDate AND a.createdAt <= :endDate")
    Page<Activity> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate, Pageable pageable);
    
    @Query("SELECT a FROM Activity a WHERE a.isActive = true AND a.isVerified = true AND a.maxParticipants >= :minParticipants AND a.minParticipants <= :maxParticipants")
    Page<Activity> findByParticipantRange(@Param("minParticipants") int minParticipants, @Param("maxParticipants") int maxParticipants, Pageable pageable);
    
    @Query("SELECT a FROM Activity a WHERE a.isActive = true AND a.isVerified = true AND a.durationMinutes <= :maxDuration")
    Page<Activity> findByMaxDuration(@Param("maxDuration") int maxDuration, Pageable pageable);
    
    @Query("SELECT a FROM Activity a WHERE a.isActive = true AND a.isVerified = true AND a.id IN (SELECT b.activity.id FROM Booking b WHERE b.user.id = :userId)")
    Page<Activity> findBookedActivitiesByUser(@Param("userId") UUID userId, Pageable pageable);
    
    @Query("SELECT a FROM Activity a WHERE a.isActive = true AND a.isVerified = true AND a.id IN (SELECT r.activity.id FROM Review r WHERE r.rating >= :minRating)")
    Page<Activity> findByMinRating(@Param("minRating") int minRating, Pageable pageable);
    
    @Query("SELECT a FROM Activity a WHERE a.isActive = true AND a.isVerified = true AND a.id IN (SELECT b.activity.id FROM Booking b WHERE b.startTime >= :startTime AND b.endTime <= :endTime)")
    Page<Activity> findAvailableActivities(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime, Pageable pageable);
}
