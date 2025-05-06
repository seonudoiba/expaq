package com.abiodun.expaq.repository;

import com.abiodun.expaq.model.Review;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {

    Page<Review> findByActivityHostId(UUID hostId, Pageable pageable);

    @Query("SELECT r FROM Review r WHERE r.booking.id = :bookingId")
    Review findByBookingId(@Param("bookingId") UUID bookingId);

    Page<Review> findByHostId(UUID hostId, Pageable pageable);

//    @Query("SELECT r FROM Review r WHERE r.tourist.id = :userId AND r.activity.id = :activityId")
//    Review findByUserIdAndActivityId(@Param("userId") UUID userId, @Param("activityId") UUID activityId);
//
//    @Query("SELECT r FROM Review r WHERE r.tourist.id = :userId AND r.booking.id = :bookingId")
//    Review findByUserIdAndBookingId(@Param("userId") UUID userId, @Param("bookingId") UUID bookingId);

    @Query("SELECT r FROM Review r WHERE r.activity.id = :activityId AND r.rating >= :minRating AND r.rating <= :maxRating")
    Page<Review> findByActivityIdAndRatingRange(
            @Param("activityId") UUID activityId,
            @Param("minRating") int minRating,
            @Param("maxRating") int maxRating,
            Pageable pageable);

    @Query("SELECT r FROM Review r WHERE r.activity.host.id = :hostId AND r.rating >= :minRating AND r.rating <= :maxRating")
    Page<Review> findByHostIdAndRatingRange(
            @Param("hostId") UUID hostId,
            @Param("minRating") int minRating,
            @Param("maxRating") int maxRating,
            Pageable pageable);

    @Query("SELECT r FROM Review r WHERE r.activity.id = :activityId AND r.isVerified = :verified")
    Page<Review> findByActivityIdAndVerified(
            @Param("activityId") UUID activityId,
            @Param("verified") boolean verified,
            Pageable pageable);

    @Query("SELECT r FROM Review r WHERE r.activity.host.id = :hostId AND r.isVerified = :verified")
    Page<Review> findByHostIdAndVerified(
            @Param("hostId") UUID hostId,
            @Param("verified") boolean verified,
            Pageable pageable);

    @Query("SELECT r FROM Review r WHERE r.activity.id = :activityId AND r.isEdited = :edited")
    Page<Review> findByActivityIdAndEdited(
            @Param("activityId") UUID activityId,
            @Param("edited") boolean edited,
            Pageable pageable);

    @Query("SELECT r FROM Review r WHERE r.activity.host.id = :hostId AND r.isEdited = :edited")
    Page<Review> findByHostIdAndEdited(
            @Param("hostId") UUID hostId,
            @Param("edited") boolean edited,
            Pageable pageable);

    @Query("SELECT r FROM Review r WHERE r.activity.id = :activityId AND r.createdAt BETWEEN :startDate AND :endDate")
    Page<Review> findByActivityIdAndDateRange(
            @Param("activityId") UUID activityId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);

    @Query("SELECT r FROM Review r WHERE r.activity.host.id = :hostId AND r.createdAt BETWEEN :startDate AND :endDate")
    Page<Review> findByHostIdAndDateRange(
            @Param("hostId") UUID hostId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);

    @Query("SELECT r FROM Review r WHERE r.activity.id = :activityId AND r.rating IN :ratings")
    Page<Review> findByActivityIdAndRatings(
            @Param("activityId") UUID activityId,
            @Param("ratings") List<Integer> ratings,
            Pageable pageable);

    @Query("SELECT r FROM Review r WHERE r.activity.host.id = :hostId AND r.rating IN :ratings")
    Page<Review> findByHostIdAndRatings(
            @Param("hostId") UUID hostId,
            @Param("ratings") List<Integer> ratings,
            Pageable pageable);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.activity.id = :activityId")
    Double calculateAverageRatingByActivityId(@Param("activityId") UUID activityId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.activity.host.id = :hostId")
    Double calculateAverageRatingByHostId(@Param("hostId") UUID hostId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.activity.id = :activityId")
    int countByActivityId(@Param("activityId") UUID activityId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.activity.id = :activityId AND r.rating = :rating")
    int countByActivityIdAndRating(@Param("activityId") UUID activityId, @Param("rating") int rating);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.activity.id = :activityId AND r.isVerified = :verified")
    int countByActivityIdAndVerified(@Param("activityId") UUID activityId, @Param("verified") boolean verified);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.activity.id = :activityId AND r.isEdited = :edited")
    int countByActivityIdAndEdited(@Param("activityId") UUID activityId, @Param("edited") boolean edited);

    @Query("SELECT r FROM Review r WHERE r.activity.id = :activityId ORDER BY r.createdAt DESC")
    Page<Review> findLatestByActivityId(@Param("activityId") UUID activityId, Pageable pageable);

    @Query("SELECT r FROM Review r WHERE " +
            "(:activityId IS NULL OR r.activity.id = :activityId) AND " +
            "(:userId IS NULL OR r.user.id = :userId) AND " +
            "(:hostId IS NULL OR r.activity.host.id = :hostId) AND " +
            "(:minRating IS NULL OR r.rating >= :minRating) AND " +
            "(:maxRating IS NULL OR r.rating <= :maxRating) AND " +
            "(:isVerified IS NULL OR r.isVerified = :isVerified) AND " +
            "(:isEdited IS NULL OR r.isEdited = :isEdited) AND " +
            "(:startDate IS NULL OR r.createdAt >= :startDate) AND " +
            "(:endDate IS NULL OR r.createdAt <= :endDate) AND " +
            "(:searchTerm IS NULL OR " +
            "LOWER(r.comment) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(r.activity.title) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
            "(:ratings IS NULL OR r.rating IN :ratings)")
    Page<Review> searchReviews(
            @Param("activityId") UUID activityId,
            @Param("userId") UUID userId,
            @Param("hostId") UUID hostId,
            @Param("minRating") Integer minRating,
            @Param("maxRating") Integer maxRating,
            @Param("isVerified") Boolean isVerified,
            @Param("isEdited") Boolean isEdited,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("searchTerm") String searchTerm,
            @Param("ratings") List<Integer> ratings,
            Pageable pageable);

    @Query("SELECT r FROM Review r WHERE r.activity.id = :activityId AND r.isVerified = :verified")
    List<Review> findByActivityIdAndVerified(@Param("activityId") UUID activityId, @Param("verified") boolean verified);

    @Query("SELECT r FROM Review r WHERE r.isFlagged = :isFlagged")
    List<Review> findByIsFlagged(@Param("isFlagged") boolean isFlagged);

    @Query("SELECT r FROM Review r WHERE r.createdAt > :since")
    List<Review> findByCreatedAtAfter(@Param("since") LocalDateTime since);

    @Query("SELECT r FROM Review r WHERE r.activity.id = :activityId AND r.rating = :rating")
    List<Review> findByActivityIdAndRating(@Param("activityId") UUID activityId, @Param("rating") int rating);

    @Query("SELECT r FROM Review r WHERE r.activity.id = :activityId AND r.createdAt BETWEEN :start AND :end")
    List<Review> findByActivityIdAndCreatedAtBetween(
            @Param("activityId") UUID activityId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);


    List<Review> findByActivityId(UUID activityId, Pageable pageable);
    double findAverageRatingByActivityId(UUID activityId);

    Page<Review> findByUserId(UUID userId, Pageable pageable);

    boolean existsByActivityIdAndUserId(@NotNull(message = "Activity ID cannot be null") UUID activityId, UUID userId);

    boolean findByUserIdAndActivityId(UUID userId, UUID activityId);

    boolean findByUserIdAndBookingId(UUID userId, UUID bookingId);
}
