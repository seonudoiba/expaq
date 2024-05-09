package com.abiodun.expaq.services.impl;

import com.abiodun.expaq.exception.InternalServerException;
import com.abiodun.expaq.models.Activity;
import com.abiodun.expaq.models.BookedActivity;
import com.abiodun.expaq.models.User;
import com.abiodun.expaq.repository.ActivityRepository;
import com.abiodun.expaq.security.user.ExpaqUserDetails;
import com.abiodun.expaq.services.IActivityService;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.*;

import static org.hibernate.query.sqm.tree.SqmNode.log;

@Service
@RequiredArgsConstructor
public class ActivityService implements IActivityService {
    private  final ActivityRepository activityRepository;
    private final Cloudinary cloudinary;

    @Override
    public List<Activity> getAllActivities() {
        return activityRepository.findAll();
    }



    @Override
    public List<String> getAllActivityTypes() {
        return activityRepository.findDistinctActivityTypes();
    }

    @Override
    public Activity addNewActivity(MultipartFile photo, String activityType, BigDecimal price,
                                   String title, String description, ExpaqUserDetails user, String address,
                                   String city, String country, int capacity) throws SQLException, IOException {
        Activity activity = new Activity();
        activity.setActivityType(activityType);
        activity.setPrice(price);
        activity.setDescription(description);
        activity.setTitle(title);
        activity.setAddress(address);
        activity.setCity(city);
        activity.setCountry(country);
        activity.setCapacity(capacity);
        if(!user.isEnabled() & !user.isAccountNonExpired() & !user.isAccountNonLocked() & !user.isCredentialsNonExpired()){
            User currentUser = convertToUser(user);
            activity.setHost(currentUser);
        }
        if (!photo.isEmpty()){
            try {
                if (!Objects.requireNonNull(photo.getContentType()).startsWith("image/")) {
                    throw new IOException("Only image files are allowed");
                }
                if (photo.getSize() > 10485760) { // 10MB
                    throw new IOException("File size exceeds 10MB");
                }
                String photoUrl = cloudinary.uploader()
                        .upload(photo.getBytes(),
                                Map.of("public_id", UUID.randomUUID().toString()))
                        .get("url")
                        .toString();
                activity.setPhoto(photoUrl);
            } catch (IOException e) {
                throw new SQLException("Error uploading photo: " + e.getMessage());
            }
        }
        return activityRepository.save(activity);
    }

    @Override
    public Optional<Activity> getActivityById(Long activityId) {
        return Optional.of(activityRepository.findById(activityId).get());
    }
    @Override
    public List<Activity> getAllActivitiesByUserId(Long userId) {
        return activityRepository.findByHost_Id(userId);
    }


    @Override
    public List<Activity> getAvailableActivities(LocalDate checkInDate, LocalDate checkOutDate, String roomType) {
        return activityRepository.findAvailableActivitiesByDatesAndType(checkInDate, checkOutDate, roomType);
    }
    @Override
    public void deleteActivity(Long activityId) {
        Optional<Activity> theActivity = activityRepository.findById(activityId);
        if(theActivity.isPresent()){
            activityRepository.deleteById(activityId);
        }
    }

    @Override
    public Activity updateActivity(Long activityId, String activityType, BigDecimal price, MultipartFile photo, String title,
                                   String description, ExpaqUserDetails currentUser, String address, String city, String country,
                                   int capacity) throws SQLException, IOException {
        Optional<Activity> activityOptional = activityRepository.findById(activityId);
        if (activityOptional.isPresent()) {
            Activity activity = activityOptional.get();
            if (activityType != null) activity.setActivityType(activityType);
            if (price != null) activity.setPrice(price);
            if (title != null) activity.setTitle(title);
            if (description != null) activity.setDescription(description);
            if (photo != null && !photo.isEmpty()) {
                try {
                    String photoUrl = cloudinary.uploader()
                            .upload(photo, ObjectUtils.asMap(
                                    "public_id", UUID.randomUUID().toString()
                            )).get("url").toString();
                    activity.setPhoto(photoUrl);
                } catch (IOException ex) {
                    log.error("Error uploading photo to Cloudinary", ex);
                    throw new InternalServerException("Fail uploading photo to Cloudinary", ex);
                }
            }
            return activityRepository.save(activity);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Activity not found");
        }
    }
    private User convertToUser(ExpaqUserDetails currentUser) {
        User user = new User();
        user.setId(currentUser.getId());
        user.setEmail(currentUser.getUsername());
        user.setPassword(currentUser.getPassword());
        return user;
    }
}
