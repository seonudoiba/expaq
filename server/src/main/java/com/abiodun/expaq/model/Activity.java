package com.abiodun.expaq.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID; // Import UUID
import com.abiodun.expaq.model.ActivityCategory; // Import the new enum

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Activity {
    @Id
    @GeneratedValue // Use default UUID generation
    @UuidGenerator // Specify UUID generator
    private UUID id; // Changed type to UUID

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Simple text location for now, consider PostGIS later
    private String location;
    private BigDecimal latitude;
    private BigDecimal longitude;

    @Column(nullable = false)
    private BigDecimal price;

    @Enumerated(EnumType.STRING) // Added category field
    @Column(nullable = false)
    private ActivityCategory category;

    // Store image URLs as a JSONB array or a simple delimited string
    @JdbcTypeCode(SqlTypes.JSON) // Or use @Convert for a custom converter
    @Column(columnDefinition = "jsonb") // Use jsonb for PostgreSQL
    private List<String> mediaUrls; // Renamed from images to mediaUrls

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id", nullable = false) // host_id is UUID in User entity
    private User host;

    // Schedule representation - JSONB is flexible
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private String schedule; // Store schedule details as JSON string or map

    // Removed capacity, booked_capacity, activityType, isBooked, photo, isFeatured, address, city, country
    // Removed bookings and ratings relationships (will be mapped from Booking/Review)

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Removed addBooking, cancelBooking, canAccommodateBooking methods - booking logic moved
}