package com.abiodun.expaq.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "account_verifications")
@AllArgsConstructor
@NoArgsConstructor
public class UserVerification {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationLevel level = VerificationLevel.BASIC;

    @Column
    private String governmentIdUrl;

    @Column
    private String governmentIdType;

    @Column
    private String governmentIdNumber;

    @Column
    private String addressProofUrl;

    @Column
    private String phoneNumberVerified;

    @Column
    private String emailVerified;

    @Column
    private String socialMediaVerified;

    @Column
    private String bankAccountVerified;

    @Column
    private String taxIdVerified;

    @Column
    private String backgroundCheckStatus;

    @Column
    private String verificationNotes;

    @Column
    private UUID verifiedBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public enum VerificationLevel {
        BASIC,      // Email verification only
        STANDARD,   // Phone + Email verification
        PREMIUM,    // Government ID + Address verification
        ENTERPRISE  // Full verification including background check
    }

    public void updateVerificationLevel(VerificationLevel newLevel, UUID verifiedBy, String notes) {
        this.level = newLevel;
        this.verifiedBy = verifiedBy;
        this.verificationNotes = notes;
        this.updatedAt = LocalDateTime.now();
    }

    public void updateDocumentVerification(String documentType, String documentUrl, String documentNumber) {
        if ("GOVERNMENT_ID".equals(documentType)) {
            this.governmentIdUrl = documentUrl;
            this.governmentIdNumber = documentNumber;
        } else if ("ADDRESS_PROOF".equals(documentType)) {
            this.addressProofUrl = documentUrl;
        }
        this.updatedAt = LocalDateTime.now();
    }
} 