package com.abiodun.expaq.response;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
public class ActivityResponse {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID id;
    private String title;
    private String description;
    private int capacity; //capacity or maximum number of participants
    private String activityType; // e.g., Cooking Class, Language Exchange Meetup, Artisan Workshop, etc.
    private BigDecimal price;
    private boolean isBooked = false;
    private String photo;
    private List<BookingResponse> bookings;
    private HostResponse host;
    private List<RatingResponse> ratings;
    private String address;
    private String city;
    private String country;
    private boolean isFeatured = false;

    public ActivityResponse(UUID id, String title, String description, String address, int capacity, String activityType,
                            BigDecimal price, boolean isBooked, boolean isFeatured, String photo,
                            List<BookingResponse> bookings, HostResponse host, List<RatingResponse> ratings, String city, String country) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.capacity = capacity;
        this.activityType = activityType;
        this.price = price;
        this.isBooked = isBooked;
        this.photo = photo;
        this.bookings = bookings;
        this.isFeatured = isFeatured;
        this.host = host;
        this.address = address;
        this.city = city;
        this.country = country;
        this.ratings = ratings;
    }

    public ActivityResponse(UUID id, String activityType, BigDecimal price) {
        this.id = id;
        this.activityType = activityType;
        this.price = price;
    }

}
