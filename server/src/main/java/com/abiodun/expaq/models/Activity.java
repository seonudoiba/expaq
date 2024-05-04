package com.abiodun.expaq.models;

import jakarta.persistence.*;
import lombok.*;
import org.apache.commons.lang3.RandomStringUtils;

import java.math.BigDecimal;
import java.sql.Blob;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
public class Activity {
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
    @Lob
    private Blob photo;

    @OneToMany(mappedBy="activity", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<BookedActivity> bookings;

    @OneToMany(mappedBy="activity", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Rating> ratings;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id")
    private User hostName;

    public Activity() {
        this.bookings = new ArrayList<>();
    }

    public void addBooking(BookedActivity booking) {
        if (bookings == null) {
            bookings = new ArrayList<>();
        }
        bookings.add(booking);
        booking.setActivity(this);
        isBooked = true;
        String bookingCode = RandomStringUtils.randomNumeric(10);
        booking.setBookingConfirmationCode(bookingCode);
    }
}
