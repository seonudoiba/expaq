package com.abiodun.expaq.models;

import jakarta.persistence.*;
import lombok.*;
import org.apache.commons.lang3.RandomStringUtils;

import java.math.BigDecimal;
import java.util.ArrayList;
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
    private String location;
    private int capacity;
    private String activityType;
    private BigDecimal price;
    private boolean isBooked = false;
    private String photo;

    @OneToMany(mappedBy="activity", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<BookedActivity> bookings;

    @OneToMany(mappedBy="activity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rating> ratings = new ArrayList<>();

    private String hostName;// Store the concatenated first name and last name of the user

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    private User user;// Reference to the User entity

    public void addBooking(BookedActivity booking) {
        bookings.add(booking);
        booking.setActivity(this);
        isBooked = true;
        String bookingCode = RandomStringUtils.randomNumeric(10);
        booking.setBookingConfirmationCode(bookingCode);
    }

    public Activity(User user) {
        if (user != null) {
            this.user = user;
            this.hostName = user.getFirstName() + " " + user.getLastName();
        }
    }
    @PostLoad
    private void populateHostName() {
        if (user != null) {
            this.hostName = user.getFirstName() + " " + user.getLastName();
        }
    }
}