package com.abiodun.expaq.repository;

import com.abiodun.expaq.model.ActivityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ActivityTypeRepository extends JpaRepository<ActivityType, UUID> {
    
    @Query("SELECT at, COUNT(a) as activityCount " +
           "FROM ActivityType at " +
           "LEFT JOIN at.activities a " +
           "GROUP BY at")
    List<Object[]> findAllWithActivityCount();
    
    @Query("SELECT at, COUNT(a) as activityCount " +
           "FROM ActivityType at " +
           "LEFT JOIN at.activities a " +
           "WHERE at.id = :id " +
           "GROUP BY at")
    List<Object[]> findByIdWithActivityCount(@Param("id") UUID id);
}
