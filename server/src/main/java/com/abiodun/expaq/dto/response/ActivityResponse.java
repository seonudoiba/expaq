package com.abiodun.expaq.dto.response;

import com.abiodun.expaq.models.BookedActivity;
import com.abiodun.expaq.models.User;
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
    private String location;
    private int capacity; //capacity or maximum number of participants
    private String activityType; // e.g., Cooking Class, Language Exchange Meetup, Artisan Workshop, etc.
    private BigDecimal price;
    private boolean isBooked = false;
    private String photo;
    private List<BookingResponse> bookings;
    private String hostName;

    public ActivityResponse(Long id, String title, String description, String location, int capacity, String activityType,
                            BigDecimal price, boolean isBooked, String photo,
                            List<BookingResponse> bookings, String hostName) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.location = location;
        this.capacity = capacity;
        this.activityType = activityType;
        this.price = price;
        this.isBooked = isBooked;
        this.photo = photo;
        this.bookings = bookings;
        this.hostName = hostName;
    }

    public ActivityResponse(Long id, String activityType, BigDecimal price) {
        this.id = id;
        this.activityType = activityType;
        this.price = price;
    }

}
