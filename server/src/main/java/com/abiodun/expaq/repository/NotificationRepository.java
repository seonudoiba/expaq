package com.abiodun.expaq.repository;

import com.abiodun.expaq.model.Notification;
import com.abiodun.expaq.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    Page<Notification> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    long countByUserAndIsReadFalse(User user);
    void deleteByUser(User user);
} 