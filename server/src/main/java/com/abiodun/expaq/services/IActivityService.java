package com.abiodun.expaq.services;

import com.abiodun.expaq.models.Activity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface IActivityService {
    Activity addNewActivity(MultipartFile photo, String activityType, BigDecimal price,
                            String title, String description) throws SQLException, IOException;

    List<String> getAllActivityTypes();

    List<Activity> getAllActivities();

    byte[] getActivityPhotoByActivityId(Long id) throws SQLException;

    Optional<Activity> getActivityById(Long activityId);

    void deleteActivity(Long activityId);

    Activity updateActivity(Long activityId, String ActivityType, BigDecimal price, byte[] photoBytes);

    List<Activity> getAvailableActivities(LocalDate checkInDate, LocalDate checkOutDate, String activityType);
}
