package com.abiodun.expaq.repository;

import com.abiodun.expaq.models.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    @Query("SELECT DISTINCT r.activityType FROM Activity r")
    List<String> findDistinctActivityTypes();
    @Query(" SELECT r FROM Activity r " +
            " WHERE r.activityType LIKE %:activityType% " +
            " AND r.id NOT IN (" +
            "  SELECT br.activity.id FROM BookedActivity br " +
            "  WHERE ((br.checkInDate <= :checkOutDate) AND (br.checkOutDate >= :checkInDate))" +
            ")")

    List<Activity> findAvailableActivitiesByDatesAndType(LocalDate checkInDate, LocalDate checkOutDate, String activityType);

}