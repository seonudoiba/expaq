package com.abiodun.expaq.repository;

import com.abiodun.expaq.model.Activity;
import com.abiodun.expaq.model.ActivityType;
import org.locationtech.jts.geom.Point;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, UUID>, JpaSpecificationExecutor<Activity> {

    // Search and filter methods
    @Query("SELECT a FROM Activity a WHERE " +
           "LOWER(a.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Activity> searchActivities(@Param("query") String query, Pageable pageable);
    
    // Location-based queries
    @Query(value = "SELECT a FROM Activity a WHERE " +
           "function('ST_DWithin', a.locationPoint, :point, :distance) = true AND " +
           "a.isActive = true")
    List<Activity> findNearbyActivities(@Param("point") Point point, @Param("distance") double distance);

    // Featured activities
    Page<Activity> findByIsFeaturedTrueAndIsActiveTrue(Pageable pageable);
    
    // Active activities by host
    List<Activity> findByHostIdAndIsActiveTrue(UUID hostId);
    
    // Methods for recommendation system
    @Query("SELECT a FROM Activity a WHERE a.isActive = true ORDER BY (SELECT COUNT(b) FROM a.bookings b) DESC")
    List<Activity> findMostPopularActivities(Pageable pageable);
    
    @Query("SELECT a FROM Activity a WHERE a.isActive = true ORDER BY " +
           "(SELECT COUNT(b) FROM a.bookings b WHERE b.createdAt >= :since) DESC")
    List<Activity> findTrendingActivities(@Param("since") LocalDateTime since, Pageable pageable);
    
    // Overload for current trending (last 30 days)
    default List<Activity> findTrendingActivities(Pageable pageable) {
        return findTrendingActivities(LocalDateTime.now().minusDays(30), pageable);
    }
    
    // Basic activity queries
    List<Activity> findByActivityTypeAndIsActiveTrue(ActivityType activityType);
    List<Activity> findByLocationContainingIgnoreCase(String location);
    List<Activity> findByIsActiveTrue(Pageable pageable);
    
    // Analytics methods
    long countByIsActiveTrue();
    long countByIsActiveTrueAndCreatedAtAfter(LocalDateTime date);
    long countByCreatedAtBefore(LocalDateTime date);
    long countByHostId(UUID hostId);
    long countByHostIdAndIsActive(UUID hostId, boolean isActive);

    @Query("SELECT COALESCE(a.city.name, SUBSTRING(a.location, 1, LOCATE(',', CONCAT(a.location, ',')) - 1), 'Unknown'), COUNT(a) " +
           "FROM Activity a WHERE a.isActive = true " +
           "GROUP BY COALESCE(a.city.name, SUBSTRING(a.location, 1, LOCATE(',', CONCAT(a.location, ',')) - 1)) " +
           "ORDER BY COUNT(a) DESC")
    List<Object[]> getTopCitiesByActivityCount(Pageable pageable);

    @Query("SELECT a.activityType, COUNT(a) FROM Activity a WHERE a.isActive = true GROUP BY a.activityType")
    List<Object[]> getActivityCountByType();

//    @Query("SELECT a FROM Activity a WHERE a.isActive = false AND a.isVerified = false")
    long countByIsActiveFalseAndIsVerifiedFalse();
    
    // Additional search methods for new services
    @Query("SELECT a FROM Activity a WHERE " +
           "function('ST_DWithin', a.locationPoint, function('ST_MakePoint', :longitude, :latitude), :distance) = true")
    Page<Activity> findByLocationWithinDistance(@Param("latitude") Double latitude, 
                                                @Param("longitude") Double longitude,
                                                @Param("distance") Double distance,
                                                Pageable pageable);
    
    @Query("SELECT a FROM Activity a WHERE a.activityType = :activityType AND " +
           "function('ST_DWithin', a.locationPoint, :point, :distance) = true AND a.isActive = true")
    List<Activity> findNearbyActivitiesByActivityType(@Param("activityType") String activityType,
                                                      @Param("point") Point point,
                                                      @Param("distance") double distance);
    
    @Query("SELECT a FROM Activity a WHERE a.startDate >= :fromDate AND a.isActive = true")
    Page<Activity> findUpcomingActivities(@Param("fromDate") LocalDateTime fromDate, Pageable pageable);
    
    Page<Activity> findAllByOrderByBookedCapacityDesc(Pageable pageable);
    
    @Query("SELECT a FROM Activity a WHERE a.capacity > a.bookedCapacity AND a.isActive = true")
    List<Activity> findActivitiesWithAvailableSlots();
    
    @Query("SELECT a FROM Activity a WHERE a.price BETWEEN :minPrice AND :maxPrice AND a.isActive = true")
    Page<Activity> findByPriceRange(@Param("minPrice") BigDecimal minPrice,
                                    @Param("maxPrice") BigDecimal maxPrice,
                                    Pageable pageable);
}
