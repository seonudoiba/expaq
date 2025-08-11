package com.abiodun.expaq.repository;

import com.abiodun.expaq.model.UserPreferences;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserSettingsRepository extends JpaRepository<UserPreferences, UUID> {
    
    @Query("SELECT up FROM UserPreferences up WHERE up.user.id = :userId")
    Optional<UserPreferences> findByUserId(@Param("userId") UUID userId);
    
    @Query("SELECT up FROM UserPreferences up WHERE up.user.email = :email")
    Optional<UserPreferences> findByUserEmail(@Param("email") String email);
    
    @Query("DELETE FROM UserPreferences up WHERE up.user.id = :userId")
    void deleteByUserId(@Param("userId") UUID userId);
    
    @Query("SELECT COUNT(up) FROM UserPreferences up WHERE up.emailNotifications = true")
    long countByEmailNotificationsEnabled();
    
    @Query("SELECT COUNT(up) FROM UserPreferences up WHERE up.pushNotifications = true")
    long countByPushNotificationsEnabled();
    
    @Query("SELECT COUNT(up) FROM UserPreferences up WHERE up.marketingEmails = true")
    long countByMarketingEmailsEnabled();
}