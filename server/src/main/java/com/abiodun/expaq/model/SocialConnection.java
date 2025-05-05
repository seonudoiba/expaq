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
@Table(name = "social_connections")
@AllArgsConstructor
@NoArgsConstructor
public class SocialConnection {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "connected_user_id", nullable = false)
    private User connectedUser;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConnectionType type;

    @Column
    private String notes;

    @Column
    private boolean isFavorite = false;

    @Column
    private boolean isBlocked = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum ConnectionType {
        FRIEND,
        FOLLOWING,
        FOLLOWER,
        BLOCKED
    }

    public void updateConnectionType(ConnectionType newType) {
        this.type = newType;
    }

    public void toggleFavorite() {
        this.isFavorite = !this.isFavorite;
    }

    public void toggleBlock() {
        this.isBlocked = !this.isBlocked;
        if (this.isBlocked) {
            this.type = ConnectionType.BLOCKED;
        }
    }
} 