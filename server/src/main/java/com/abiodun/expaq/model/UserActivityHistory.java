package com.abiodun.expaq.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "user_activity_history")
@AllArgsConstructor
@NoArgsConstructor
public class UserActivityHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ActivityType activityType;

    @Column(nullable = false)
    private String description;

    @Column
    private String ipAddress;

    @Column
    private String deviceInfo;

    @Column
    private String location;

    @Column
    private String relatedEntityId;

    @Column
    private String relatedEntityType;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum ActivityType {
        LOGIN,
        LOGOUT,
        PROFILE_UPDATE,
        PASSWORD_CHANGE,
        BOOKING_CREATED,
        BOOKING_CANCELLED,
        REVIEW_POSTED,
        REVIEW_EDITED,
        PAYMENT_MADE,
        PREFERENCE_CHANGED,
        HOST_APPLICATION_SUBMITTED,
        HOST_APPLICATION_APPROVED,
        HOST_APPLICATION_REJECTED,
        ACTIVITY_CREATED,
        ACTIVITY_UPDATED,
        ACTIVITY_DELETED,
        MESSAGE_SENT,
        MESSAGE_RECEIVED,
        REPORT_SUBMITTED,
        REPORT_RESOLVED
    }
} 