package com.abiodun.expaq.models;

import jakarta.persistence.*;
import lombok.*;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.security.core.context.SecurityContextHolder;

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
    private String hostName;

    @OneToMany(mappedBy="activity", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<BookedActivity> bookings;

    @OneToMany(mappedBy="activity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rating> ratings = new ArrayList<>();

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
//    public void addUser(User user) {
//        users.add(user);
//        user.setActivity(this);
//        if (user != null) {
//            if (user.getFirstName() != null && user.getLastName() != null) {
//                this.hostName = user.getFirstName() + " " + user.getLastName();
//            }
//        }
//    }

//    public Activity(User user) {
//        if (user != null) {
//            this.user = user;
//            if (user.getFirstName() != null && user.getLastName() != null) {
//                this.hostName = user.getFirstName() + " " + user.getLastName();
//            }
//        }
//    }
//
//    @PostLoad
//    private void populateHostName() {
//        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        if (principal instanceof User currentUser) {
//            if (currentUser.getFirstName() != null && currentUser.getLastName() != null) {
//                this.hostName = currentUser.getFirstName() + " " + currentUser.getLastName();
//            }
//            this.user = currentUser; // Set the user field to the currently logged-in user
//        }
//    }
}