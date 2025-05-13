package com.abiodun.expaq.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;
import org.locationtech.jts.geom.Point; // Import Point

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID; // Import UUID

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "activities")
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private Integer duration; // in hours

    private String imageUrl;

    @Column(nullable = false)
    private boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id", nullable = false)
    private User host;

    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Booking> bookings = new ArrayList<>();

    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    private ActivityCategory category;

//    @Column(nullable = false)
    private Boolean isFeatured;

    @Column
    private String address;

    @Column
    private String city;

    @Column
    private String country;

    @Column(columnDefinition = "geometry(Point,4326)")
    private Point locationPoint;

    private int capacity;

    @Column(nullable = false)
    private int bookedCapacity;

    @Column(nullable = false)
    private int minParticipants;

    @Column(nullable = false)
    private Integer maxParticipants;

    @Column(nullable = false)
    private int durationMinutes;

    @Column(nullable = false)
    private boolean isVerified = false;

    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Message> messages = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private ActivitySchedule schedule;

    @ElementCollection
    @CollectionTable(name = "activity_media", joinColumns = @JoinColumn(name = "activity_id"))
    @Column(name = "media_url")
    private List<String> mediaUrls = new ArrayList<>();

    public enum ActivityCategory {
        ADVENTURE,
        CULTURAL,
        FOOD_AND_DRINK,
        NATURE,
        SPORTS,
        WELLNESS,
        SIGHTSEEING,
        WORKSHOP
    }

    // Methods for booking management
    public boolean canAccommodateBooking(int numberOfGuests) {
        return (maxParticipants - bookings.size()) >= numberOfGuests;
    }

    public void addBooking(Booking booking) {
        if (canAccommodateBooking(booking.getNumberOfGuests())) {
            bookings.add(booking);
            booking.setActivity(this);
        } else {
            throw new IllegalStateException("Activity cannot accommodate the requested number of guests");
        }
    }

    public void cancelBooking(Booking booking) {
        if (bookings.remove(booking)) {
            booking.setActivity(null);
        }
    }

    // Method to calculate average rating
    public double getAverageRating() {
        if (reviews.isEmpty()) {
            return 0.0;
        }
        return reviews.stream()
                .mapToDouble(Review::getRating)
                .average()
                .orElse(0.0);
    }

    public void updateAverageRating() {
        // This method will be implemented by the repository
        // The actual calculation will be done in the database
        this.updatedAt = LocalDateTime.now();
    }
}