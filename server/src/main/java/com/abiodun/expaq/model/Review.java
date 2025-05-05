package com.abiodun.expaq.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;


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
    private int rating;

    @Column(length = 1000)
    private String comment;

    @Column(length = 1000)
    private String photos;

    @Column(name = "blockchain_tx_hash", length = 100)
    private String blockchainTxHash;

    @Column(name = "is_verified", nullable = false)
    private boolean verified;

    @Column(name = "is_edited", nullable = false)
    private boolean edited;

    @Column(name = "edit_reason", length = 200)
    private String editReason;

    @Column(name = "edited_at")
    private LocalDateTime editedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Additional fields for moderation
    @Column
    private boolean isFlagged = false;

    @Column
    private String flagReason;

    @Column
    private String moderatorNotes;

    // Method to verify review
    public void verify(String blockchainTxHash, String ipfsHash) {
        this.verified = true;
        this.blockchainTxHash = blockchainTxHash;
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
        this.verified = true;
        this.updatedAt = LocalDateTime.now();
    }

    // Method to unverify review
    public void unverify() {
        this.verified = false;
        this.updatedAt = LocalDateTime.now();
    }

    // Method to update review
    public void update(int rating, String comment, String photos, String editReason) {
        this.rating = rating;
        this.comment = comment;
        this.photos = photos;
        this.editReason = editReason;
        this.edited = true;
        this.editedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
