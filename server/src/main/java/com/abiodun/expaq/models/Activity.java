package com.abiodun.expaq.models;

import com.abiodun.expaq.security.user.ExpaqUserDetails;
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
    private int capacity;
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

    @OneToMany(mappedBy="activity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rating> ratings = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    private User host;// Reference to the User entity


    public void addBooking(BookedActivity booking) {
        bookings.add(booking);
        booking.setActivity(this);
        isBooked = true;
        String bookingCode = RandomStringUtils.randomNumeric(10);
        booking.setBookingConfirmationCode(bookingCode);
    }
}