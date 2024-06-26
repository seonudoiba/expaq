package com.abiodun.expaq.services;

import com.abiodun.expaq.models.Activity;
import com.abiodun.expaq.models.User;
import com.abiodun.expaq.security.user.ExpaqUserDetails;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface IActivityService {
    Activity addNewActivity(MultipartFile photo, String activityType, BigDecimal price,
                            String title, String description, ExpaqUserDetails user, String address, String city,
                            String country, int capacity) throws SQLException, IOException;

    List<String> getAllActivityTypes();

    List<Activity> getAllActivities();

    Optional<Activity> getActivityById(Long activityId);
    List<Activity> getAllActivitiesByUserId(Long userId);
    List<Activity> getFeaturedActivities();

    void deleteActivity(Long activityId);

    Activity updateActivity(Long activityId, String activityType, BigDecimal price, MultipartFile photo, String title,
                            String description, ExpaqUserDetails CurrentUser, String address, String city, String country,
                            int capacity) throws SQLException, IOException;

    List<Activity> getAvailableActivities(LocalDate checkInDate, LocalDate checkOutDate, String activityType);
}
