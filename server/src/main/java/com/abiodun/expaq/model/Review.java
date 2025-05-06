package com.abiodun.expaq.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id", nullable = false)
    private User host;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id", nullable = false)
    private Activity activity;

    @Column(nullable = false)
    private int rating; // 1-5 stars

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(nullable = false)
    private boolean isVerified = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @Column
    private String flagReason;

    @Column
    private String moderatorNotes;

    // Additional fields for moderation
    @Column
    private boolean isFlagged = false;

    private boolean isEdited;
    private String editReason;
    private String photos; // URL or path to photos
    private String ipfsHash; // IPFS hash for photos
    private String blockchainTxHash; // Blockchain transaction hash for verification
    private String flaggedBy; // User who flagged the review
    private String flaggedAt; // Timestamp when the review was flagged
    private String flaggedByUserId; // User ID of the moderator who flagged the review
    private String flaggedByUsername; // Username of the moderator who flagged the review
    private String flaggedByEmail; // Email of the moderator who flagged the review
    private LocalDateTime EditedAt;
    // Method to verify review
    public void verify(String blockchainTxHash, String ipfsHash) {
        this.isVerified = true;
        this.updatedAt = LocalDateTime.now();
    }

    // Method to flag review
    public void flag(String reason) {
        this.isFlagged = true;
        this.flagReason = reason;
        this.updatedAt = LocalDateTime.now();
    }

    // Method to unflag review
    public void unflag() {
        this.isFlagged = false;
        this.flagReason = null;
        this.updatedAt = LocalDateTime.now();
    }

    // Method to verify review (without blockchain)
    public void verify() {
        this.isVerified = true;
        this.updatedAt = LocalDateTime.now();
    }

    // Method to unverify review
    public void unverify() {
        this.isVerified = false;
        this.updatedAt = LocalDateTime.now();
    }

    // Method to update review
    public void update(int rating, String comment, String photos, String editReason) {
        this.rating = rating;
        this.comment = comment;
        this.updatedAt = LocalDateTime.now();
    }
}
