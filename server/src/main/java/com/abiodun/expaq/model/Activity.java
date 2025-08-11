package com.abiodun.expaq.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.locationtech.jts.geom.Point;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

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

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column()
    private String location;

    @Column(nullable = false)
    private boolean isActive = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id", nullable = false)
    private User host;

    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Booking> bookings = new ArrayList<>();

    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime startDate;

    @Column(nullable = false)
    private LocalDateTime endDate;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column
    private Boolean isFeatured = false;

    @Column(nullable = false)
    private String address;

    @ManyToOne
    @JoinColumn(name = "city_id")
    private City city;

    @ManyToOne
    @JoinColumn(name = "country_id")
    private Country country;

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

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "schedule_id")
    private ActivitySchedule schedule;

    @ElementCollection
    @CollectionTable(name = "activity_media", joinColumns = @JoinColumn(name = "activity_id"))
    @Column(name = "media_url")
    private List<String> mediaUrls = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_type_id")
    private ActivityType activityType;


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