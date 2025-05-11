package com.abiodun.expaq.repository;

import com.abiodun.expaq.model.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    Page<Notification> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);
    List<Notification> findByUserIdAndReadFalseOrderByCreatedAtDesc(UUID userId);
    Long countByUserIdAndReadFalse(UUID userId);
    List<Notification> findByUserIdAndReadFalse(UUID userId);
    void deleteByUserId(UUID userId);
} 