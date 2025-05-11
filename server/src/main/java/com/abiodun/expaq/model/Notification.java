package com.abiodun.expaq.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Type;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    @Column(columnDefinition = "jsonb")
    private Object data;

    @Column(nullable = false)
    private boolean read = false;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public void markAsRead() {
        this.read = true;
        this.readAt = LocalDateTime.now();
    }
} 