package com.abiodun.expaq.controllers;

import com.abiodun.expaq.dto.response.ActivityResponse;
import com.abiodun.expaq.dto.response.BookingResponse;
import com.abiodun.expaq.exception.PhotoRetrievalException;
import com.abiodun.expaq.exception.ResourceNotFoundException;
import com.abiodun.expaq.models.Activity;
import com.abiodun.expaq.models.BookedActivity;
import com.abiodun.expaq.services.IActivityService;
import com.abiodun.expaq.services.impl.BookingService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/activities")
public class ActivityController {
    private  final IActivityService activityService;
    private  final BookingService bookingService;

    @GetMapping("/")
    public ResponseEntity<List<ActivityResponse>> getAllActivities() throws SQLException {
        List<Activity> activities = activityService.getAllActivities();
        List<ActivityResponse> activityResponses = new ArrayList<>();

        for (Activity activity : activities) {
            byte[] photoBytes = activityService.getActivityPhotoByActivityId(activity.getId());
            if (photoBytes != null && photoBytes.length > 0) {
                String base64Photo = Base64.encodeBase64String(photoBytes);
                ActivityResponse activityResponse = getActivityResponse(activity);
                activityResponse.setPhoto(base64Photo);
                activityResponses.add(activityResponse);
            }
        }

        return ResponseEntity.ok(activityResponses);
    }
    @GetMapping("/activity/types")
    public List<String> getActivityTypes() {
        return activityService.getAllActivityTypes();
    }
    @GetMapping("/activity/{activityId}")
    public ResponseEntity<Optional<ActivityResponse>> getActivityById(@PathVariable Long activityId){
        Optional<Activity> theActivity = activityService.getActivityById(activityId);
        return theActivity.map(activity -> {
            ActivityResponse activityResponse = getActivityResponse(activity);
            return  ResponseEntity.ok(Optional.of(activityResponse));
        }).orElseThrow(() -> new ResourceNotFoundException("Activity not found"));
    }

    @GetMapping("/available-activities")
    public ResponseEntity<List<ActivityResponse>> getAvailableActivities(
            @RequestParam("checkInDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
            @RequestParam("checkOutDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)LocalDate checkOutDate,
            @RequestParam("activityType") String activityType) throws SQLException {
        List<Activity> availableActivities = activityService.getAvailableActivities(checkInDate, checkOutDate, activityType);
        List<ActivityResponse> activityResponses = new ArrayList<>();
        for (Activity activity : availableActivities){
            byte[] photoBytes = activityService.getActivityPhotoByActivityId(activity.getId());
            if (photoBytes != null && photoBytes.length > 0){
                String photoBase64 = Base64.encodeBase64String(photoBytes);
                ActivityResponse activityResponse = getActivityResponse(activity);
                activityResponse.setPhoto(photoBase64);
                activityResponses.add(activityResponse);
            }
        }
        if(activityResponses.isEmpty()){
            return ResponseEntity.noContent().build();
        }else{
            return ResponseEntity.ok(activityResponses);
        }
    }
    @Transactional
    @PostMapping("/add/new-activities")
    public ResponseEntity<ActivityResponse> addNewActivity(
            @RequestParam("photo") MultipartFile photo,
            @RequestParam("activityType") String activityType,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("price") BigDecimal price) throws SQLException, IOException {
        Activity savedActivity = activityService.addNewActivity(photo, activityType, price, title, description );
        ActivityResponse response = new ActivityResponse(savedActivity.getId(), savedActivity.getActivityType(), savedActivity.getPrice());
        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/delete/activity/{activityId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteActivity(@PathVariable Long activityId){
        activityService.deleteActivity(activityId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/update/{activityId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ActivityResponse> updateActivity(@PathVariable Long activityId,
                                                   @RequestParam(required = false)  String activityType,
                                                   @RequestParam(required = false) BigDecimal activityPrice,
                                                   @RequestParam(required = false) MultipartFile photo) throws SQLException, IOException {
        byte[] photoBytes = photo != null && !photo.isEmpty() ?
                photo.getBytes() : activityService.getActivityPhotoByActivityId(activityId);
        Blob photoBlob = photoBytes != null && photoBytes.length >0 ? new SerialBlob(photoBytes): null;
        Activity theActivity = activityService.updateActivity(activityId, activityType, activityPrice, photoBytes);
        theActivity.setPhoto(photoBlob);
        ActivityResponse activityResponse = getActivityResponse(theActivity);
        return ResponseEntity.ok(activityResponse);
    }

    private ActivityResponse getActivityResponse(Activity activity) {
        List<BookedActivity> bookings = getAllBookingsByActivityId(activity.getId());
        List<BookingResponse> bookingInfo = bookings
                .stream()
                .map(booking -> new BookingResponse(booking.getBookingId(),
                        booking.getCheckInDate(),
                        booking.getCheckOutDate(), booking.getBookingConfirmationCode())).toList();
        byte[] photoBytes = null;
        Blob photoBlob = activity.getPhoto();
        if (photoBlob != null) {
            try {
                photoBytes = photoBlob.getBytes(1, (int) photoBlob.length());
            } catch (SQLException e) {
                throw new PhotoRetrievalException("Error retrieving photo");
            }
        }
        return new ActivityResponse(activity.getId(), activity.getTitle(), activity.getDescription(), activity.getLocation(), activity.getCapacity(),
                activity.getActivityType(), activity.getPrice(),
                activity.isBooked(), photoBytes, bookingInfo, activity.getHostName());
    }

    private List<BookedActivity> getAllBookingsByActivityId(Long activityId) {
        return bookingService.getAllBookingsByActivityId(activityId);
    }

}