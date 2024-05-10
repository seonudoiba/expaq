package com.abiodun.expaq.dto.response;

import com.abiodun.expaq.models.BookedActivity;
import com.abiodun.expaq.models.User;
import com.abiodun.expaq.security.user.ExpaqUserDetails;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.tomcat.util.codec.binary.Base64;

import java.math.BigDecimal;
import java.sql.Blob;
import java.util.List;

@Data
@NoArgsConstructor
public class ActivityResponse {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private int capacity; //capacity or maximum number of participants
    private String activityType; // e.g., Cooking Class, Language Exchange Meetup, Artisan Workshop, etc.
    private BigDecimal price;
    private boolean isBooked = false;
    private String photo;
    private List<BookingResponse> bookings;
    private HostResponse host;
    private String address;
    private String city;
    private String country;
    private boolean isFeatured = false;

    public ActivityResponse(Long id, String title, String description, String address, int capacity, String activityType,
                            BigDecimal price, boolean isBooked, boolean isFeatured, String photo,
                            List<BookingResponse> bookings, HostResponse host, String city, String country) {
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
        

    }

    public ActivityResponse(Long id, String activityType, BigDecimal price) {
        this.id = id;
        this.activityType = activityType;
        this.price = price;
    }
}
