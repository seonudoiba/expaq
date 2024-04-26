package com.abiodun.expaq.services.impl;

import com.abiodun.expaq.exception.InternalServerException;
import com.abiodun.expaq.exception.ResourceNotFoundException;
import com.abiodun.expaq.models.Activity;
import com.abiodun.expaq.repository.ActivityRepository;
import com.abiodun.expaq.services.IActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.DataSource;
import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.datasource.DataSourceUtils;

@Service
@RequiredArgsConstructor
public class ActivityService implements IActivityService {
    private  final ActivityRepository activityRepository;
    private final DataSource dataSource;


    @Override
    public List<Activity> getAllActivities() {
        return activityRepository.findAll();
    }
    @Override
    public Activity addNewActivity(MultipartFile photo, String activityType, BigDecimal price) throws SQLException, IOException {
       Activity activity = new Activity();
       activity.setActivityType(activityType);
       activity.setPrice(price);
        if (!photo.isEmpty()){
            byte[] photoBytes = photo.getBytes();
            Blob photoBlob = new SerialBlob(photoBytes);
            activity.setPhoto(photoBlob);
        }
        return activityRepository.save(activity);

    }

    @Override
    public List<String> getAllActivityTypes() {
        return activityRepository.findDistinctActivityTypes();
    }


    @Override
    public byte[] getActivityPhotoByActivityId(Long activityId) throws SQLException {
        Optional<Activity> theActivity = activityRepository.findById(activityId);
        if (theActivity.isEmpty()) {
            throw new ResourceNotFoundException("Sorry, Activity not found!");
        }
        Blob photoBlob = theActivity.get().getPhoto();
        if(photoBlob != null){
            return photoBlob.getBytes(1, (int) photoBlob.length());
        }
        return null;
    }

    @Override
    public void deleteActivity(Long activityId) {
        Optional<Activity> theActivity = activityRepository.findById(activityId);
        if(theActivity.isPresent()){
            activityRepository.deleteById(activityId);
        }
    }

    @Override
    public Activity updateActivity(Long activityId, String activityType, BigDecimal Price, byte[] photoBytes) {
        Activity activity = activityRepository.findById(activityId).get();
        if (activityType != null) activity.setActivityType(activityType);
        if (Price != null) activity.setPrice(Price);
        if (photoBytes != null && photoBytes.length > 0) {
            try {
                activity.setPhoto(new SerialBlob(photoBytes));
            } catch (SQLException ex) {
                throw new InternalServerException("Fail updating activity", ex);
            }
        }
        return activityRepository.save(activity);
    }

//    @Override
//    public Optional<Activity> getActivityById(Long activityId) {
//        return Optional.of(activityRepository.findById(activityId).get());
//    }

    @Override
    public Optional<Activity> getActivityById(Long activityId) {
        return Optional.of(activityRepository.findById(activityId).get());
    }
    @Override
    public List<Activity> getAvailableActivities(LocalDate checkInDate, LocalDate checkOutDate, String roomType) {
        return activityRepository.findAvailableActivitiesByDatesAndType(checkInDate, checkOutDate, roomType);
    }

}
