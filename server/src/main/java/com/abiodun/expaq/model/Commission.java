package com.abiodun.expaq.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "commissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Commission {
    
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(updatable = false, nullable = false)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id", nullable = false)
    private User host;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id", nullable = false)
    private Activity activity;
    
    @Column(name = "booking_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal bookingAmount;
    
    @Column(name = "commission_rate", nullable = false, precision = 5, scale = 4)
    private BigDecimal commissionRate;
    
    @Column(name = "commission_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal commissionAmount;
    
    @Column(name = "host_earnings", nullable = false, precision = 19, scale = 2)
    private BigDecimal hostEarnings;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private CommissionStatus status;
    
    @Column(name = "processed_at")
    private LocalDateTime processedAt;
    
    @Column(name = "paid_out_at")
    private LocalDateTime paidOutAt;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "notes")
    private String notes;
    
    @Column(name = "payment_reference")
    private String paymentReference;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = CommissionStatus.PENDING;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum CommissionStatus {
        PENDING,      // Commission calculated but not yet processed
        PROCESSED,    // Commission processed and ready for payout
        PAID_OUT,     // Commission has been paid to host
        CANCELLED,    // Commission cancelled (e.g., booking refunded)
        DISPUTED,     // Commission under dispute
        ON_HOLD       // Commission on hold for review
    }
    
    // Helper methods
    public void markAsProcessed() {
        this.status = CommissionStatus.PROCESSED;
        this.processedAt = LocalDateTime.now();
    }
    
    public void markAsPaidOut() {
        this.status = CommissionStatus.PAID_OUT;
        this.paidOutAt = LocalDateTime.now();
    }
    
    public void markAsCancelled() {
        this.status = CommissionStatus.CANCELLED;
    }
    
    public void markAsDisputed() {
        this.status = CommissionStatus.DISPUTED;
    }
    
    public void putOnHold() {
        this.status = CommissionStatus.ON_HOLD;
    }
    
    public boolean canBePaidOut() {
        return status == CommissionStatus.PROCESSED;
    }
    
    public boolean isPaid() {
        return status == CommissionStatus.PAID_OUT;
    }
    
    public boolean isPending() {
        return status == CommissionStatus.PENDING;
    }
}