package com.abiodun.expaq.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;

import java.math.BigDecimal;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private int capacity;
    private int booked_capacity;
    private String activityType;
    private BigDecimal price;
    private boolean isBooked = false;
    private String photo;
    private boolean isFeatured = false;
    private String address;
    private String city;
    private String country;


    @OneToMany(mappedBy="activity", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<BookedActivity> bookings;

    @OneToMany(mappedBy="activity", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rating> ratings;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    private User host;// Reference to the User entity


//    public void addBooking(BookedActivity booking) {
//        bookings.add(booking);
//        booking.setActivity(this);
//        isBooked = true;
//        String bookingCode = RandomStringUtils.randomNumeric(10);
//        booking.setBookingConfirmationCode(bookingCode);
//    }
    public boolean canAccommodateBooking(int additionalBookings) {
        return this.booked_capacity + additionalBookings <= this.capacity;
    }
    public void addBooking(BookedActivity booking) {
        if (!canAccommodateBooking(booking.getTotalNumOfGuest())) {
            throw new RuntimeException("Cannot add booking: Capacity exceeded.");
        }

        bookings.add(booking);
        booking.setActivity(this);
        this.booked_capacity += booking.getTotalNumOfGuest();
        String bookingCode = RandomStringUtils.randomNumeric(10);
        booking.setBookingConfirmationCode(bookingCode);
        if (this.booked_capacity >= this.capacity) {
            this.isBooked = true;
        }
    }

    public void cancelBooking(BookedActivity booking) {
        bookings.remove(booking);
        booking.setActivity(null);

        // Update the booked capacity
        this.booked_capacity -= booking.getTotalNumOfGuest();

        // Mark the activity as available if necessary
        if (this.booked_capacity < this.capacity) {
            this.isBooked = false;
        }
    }
//    public void addRating(Rating rating) {
//        ratings.add(rating);
//        rating.setActivity(this);
//    }

}