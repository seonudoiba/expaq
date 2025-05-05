package com.abiodun.expaq.model;

import jakarta.persistence.*;
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


@Data
@Entity
@NoArgsConstructor
@Table(name = "activities")
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id", nullable = false)
    private User host;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private Boolean isFeatured;
    private String address;
    private String city;
    private String country;

    @Column(columnDefinition = "geometry(Point,4326)")
    private Point location;

    @Column(nullable = false)
    private int capacity;

    @Column(nullable = false)
    private int bookedCapacity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ActivityCategory category;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private ActivitySchedule schedule;

    @ElementCollection
    @CollectionTable(name = "activity_media", joinColumns = @JoinColumn(name = "activity_id"))
    @Column(name = "media_url")
    private List<String> mediaUrls = new ArrayList<>();

    @Column(nullable = false)
    private int maxParticipants;

    @Column(nullable = false)
    private int minParticipants;

    @Column(nullable = false)
    private int durationMinutes;

    @Column(nullable = false)
    private boolean isActive = true;

    @Column(nullable = false)
    private boolean isVerified = false;

    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Booking> bookings = new ArrayList<>();

    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Message> messages = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public enum ActivityCategory {
        OUTDOOR,
        FOOD,
        ART,
        CULTURE,
        ADVENTURE,
        SPORTS,
        WELLNESS,
        EDUCATION,
        OTHER
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