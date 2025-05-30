package com.abiodun.expaq.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "bookings")
@AllArgsConstructor
@NoArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id", nullable = false)
    private Activity activity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id", nullable = false)
    private User host;

    @Column(nullable = false)
    private int numberOfParticipants;

    @Column(nullable = false)
    private LocalDateTime bookingDate;

    @Column(nullable = false)
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;

    @Column
    private String specialRequests;

    @Column
    private int numberOfGuests;

    @Column
    private String cancellationReason;

    @Column
    private LocalDateTime cancelledAt;

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private Review review;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime bookingDateTime;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Additional fields for payment tracking
    @Column
    private String paymentId;

    @Column
    private String paymentStatus;

    @Column
    private String bookingConfirmationCode;

    @Column
    private LocalDateTime paymentDate;

    // Additional fields for weather integration
    @Column
    private String weatherForecast;

    @Column
    private LocalDateTime weatherForecastUpdatedAt;

    @Column(nullable = false)
    private String guestEmail;

    // Method to calculate total price
    public void calculateTotalPrice() {
        if (activity != null) {
            this.totalPrice = activity.getPrice().multiply(BigDecimal.valueOf(numberOfParticipants));
        }
    }

    // Method to cancel booking
    public void cancel(String reason) {
        this.status = BookingStatus.CANCELLED;
        this.cancellationReason = reason;
        this.updatedAt = LocalDateTime.now();
    }

    // Method to confirm booking
    public void confirm() {
        this.status = BookingStatus.CONFIRMED;
        this.updatedAt = LocalDateTime.now();
    }

    // Define BookingStatus enum (can be in a separate file or nested)
    public enum BookingStatus {
        PENDING,
        CONFIRMED,
        CANCELLED,
        COMPLETED,
        REFUNDED
    }
}
