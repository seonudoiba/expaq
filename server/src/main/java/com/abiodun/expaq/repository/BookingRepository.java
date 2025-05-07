package com.abiodun.expaq.repository;

import com.abiodun.expaq.model.Activity;
import com.abiodun.expaq.model.Booking;
import com.abiodun.expaq.model.Booking.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {

    // Find bookings by user ID
    List<Booking> findByUserId(UUID userId);

    // Find bookings by activity ID
    List<Booking> findByActivityId(UUID activityId);

    // Find a specific booking by user and booking ID (useful for cancellation checks)
    Optional<Booking> findByIdAndUserId(UUID id, UUID userId);

    // Optional: Find bookings by host ID (joining through activity)
    @Query("SELECT b FROM Booking b JOIN b.activity a WHERE a.host.id = :hostId")
    List<Booking> findByHostId(@Param("hostId") UUID hostId);

    List<Booking> findByGuestEmail(String email);

    Optional<Booking> findByBookingConfirmationCode(String confirmationCode);

    Page<Booking> findByUserId(UUID userId, Pageable pageable);
    
    Page<Booking> findByActivityId(UUID activityId, Pageable pageable);
    
    Page<Booking> findByStatus(BookingStatus status, Pageable pageable);

    // In BookingRepository.java
    List<Booking> findByUserIdAndBookingDateTimeBetween(UUID userId, LocalDateTime start, LocalDateTime end);

    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId AND b.status = :status")
    Page<Booking> findByUserIdAndStatus(@Param("userId") UUID userId, @Param("status") BookingStatus status, Pageable pageable);
    
    @Query("SELECT b FROM Booking b WHERE b.activity.id = :activityId AND b.status = :status")
    Page<Booking> findByActivityIdAndStatus(@Param("activityId") UUID activityId, @Param("status") BookingStatus status, Pageable pageable);
    
    @Query("SELECT b FROM Booking b WHERE b.activity.host.id = :hostId")
    Page<Booking> findByHostId(@Param("hostId") UUID hostId, Pageable pageable);
    
    @Query("SELECT b FROM Booking b WHERE b.activity.host.id = :hostId AND b.status = :status")
    Page<Booking> findByHostIdAndStatus(@Param("hostId") UUID hostId, @Param("status") BookingStatus status, Pageable pageable);
    
    @Query("SELECT b FROM Booking b WHERE b.startTime >= :startTime AND b.endTime <= :endTime")
    Page<Booking> findByTimeRange(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime, Pageable pageable);
    
    @Query("SELECT b FROM Booking b WHERE b.activity.id = :activityId AND b.startTime >= :startTime AND b.endTime <= :endTime")
    Page<Booking> findByActivityIdAndTimeRange(@Param("activityId") UUID activityId, @Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime, Pageable pageable);
    
    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId AND b.startTime >= :startTime AND b.endTime <= :endTime")
    Page<Booking> findByUserIdAndTimeRange(@Param("userId") UUID userId, @Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime, Pageable pageable);
    
    @Query("SELECT b FROM Booking b WHERE b.activity.host.id = :hostId AND b.startTime >= :startTime AND b.endTime <= :endTime")
    Page<Booking> findByHostIdAndTimeRange(@Param("hostId") UUID hostId, @Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime, Pageable pageable);
    
    @Query("SELECT b FROM Booking b WHERE b.activity.id = :activityId AND b.startTime >= :startTime AND b.endTime <= :endTime AND b.status = :status")
    Page<Booking> findByActivityIdAndTimeRangeAndStatus(@Param("activityId") UUID activityId, @Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime, @Param("status") BookingStatus status, Pageable pageable);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.activity.id = :activityId AND b.startTime >= :startTime AND b.endTime <= :endTime AND b.status = :status")
    long countByActivityIdAndTimeRangeAndStatus(@Param("activityId") UUID activityId, @Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime, @Param("status") BookingStatus status);
    
    @Query("SELECT b FROM Booking b WHERE b.activity.id = :activityId AND b.startTime >= :startTime AND b.endTime <= :endTime AND b.status IN :statuses")
    Page<Booking> findByActivityIdAndTimeRangeAndStatusIn(@Param("activityId") UUID activityId, @Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime, @Param("statuses") List<BookingStatus> statuses, Pageable pageable);

    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId AND b.activity.id = :activityId")
    List<Booking> findByUserIdAndActivityId(@Param("userId") UUID userId, @Param("activityId") UUID activityId);

    @Query("SELECT COUNT(r) > 0 FROM Review r WHERE r.activity.id = :activityId AND r.user.id = :userId")
    boolean existsByActivityIdAndUserId(@Param("activityId") UUID activityId, @Param("userId") UUID userId);

    Optional<Activity> findByUserIdAndBookingDateTimeAfter(UUID userId, LocalDateTime now);

    Optional<Activity> findByUserIdAndBookingDateTimeBefore(UUID userId, LocalDateTime now);

    List<Booking> findByActivityIdAndStatus(UUID activityId, Booking.BookingStatus status);

    List<Booking> findByUserIdAndStatus(UUID userId, Booking.BookingStatus status);

    List<Booking> findByBookingDateBetween(LocalDateTime start, LocalDateTime end);

    boolean existsByActivityIdAndUserIdAndStatus(UUID activityId, UUID userId, Booking.BookingStatus status);

    long countByHostId(UUID hostId);

    double getTotalRevenueByHostId(UUID hostId);

    long countByHostIdAndStatus(UUID hostId, BookingStatus attr0);
}
