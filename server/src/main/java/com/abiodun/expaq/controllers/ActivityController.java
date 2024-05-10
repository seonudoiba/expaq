package com.abiodun.expaq.controllers;

import com.abiodun.expaq.dto.response.ActivityResponse;
import com.abiodun.expaq.dto.response.BookingResponse;
import com.abiodun.expaq.dto.response.HostResponse;
import com.abiodun.expaq.security.user.ExpaqUserDetails;
import org.springframework.security.access.AccessDeniedException;
import com.abiodun.expaq.exception.ResourceNotFoundException;
import com.abiodun.expaq.models.Activity;
import com.abiodun.expaq.models.BookedActivity;
import com.abiodun.expaq.models.User;
import com.abiodun.expaq.services.IActivityService;
import com.abiodun.expaq.services.impl.BookingService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/activities")
@RequiredArgsConstructor
public class ActivityController {
    private  final IActivityService activityService;
    private  final BookingService bookingService;
    @GetMapping("/")
    public ResponseEntity<List<ActivityResponse>> getAllActivities() throws SQLException {
        List<Activity> activities = activityService.getAllActivities();
        List<ActivityResponse> activityResponses = new ArrayList<>();

        for (Activity activity : activities) {
            ActivityResponse activityResponse = getActivityResponse(activity);
            activityResponses.add(activityResponse);
        }

        return ResponseEntity.ok(activityResponses);
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ActivityResponse>> getAllHostActivities(@PathVariable Long userId) throws SQLException {
        List<Activity> activities = activityService.getAllActivitiesByUserId(userId);
        List<ActivityResponse> activityResponses = new ArrayList<>();

        for (Activity activity : activities) {
            ActivityResponse activityResponse = getActivityResponse(activity);
            activityResponses.add(activityResponse);
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
    @GetMapping("/featured")
    public ResponseEntity<List<ActivityResponse>> getFeaturedActivities() throws SQLException {
        List<Activity> featuredActivities = activityService.getFeaturedActivities();
        List<ActivityResponse> activityResponses = new ArrayList<>();
        for (Activity activity : featuredActivities){
            ActivityResponse activityResponse = getActivityResponse(activity);
            activityResponses.add(activityResponse);
        }
        return ResponseEntity.ok(activityResponses);
    }

    @GetMapping("/available-activities")
    public ResponseEntity<List<ActivityResponse>> getAvailableActivities(
            @RequestParam("checkInDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
            @RequestParam("checkOutDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)LocalDate checkOutDate,
            @RequestParam("activityType") String activityType) throws SQLException {
        List<Activity> availableActivities = activityService.getAvailableActivities(checkInDate, checkOutDate, activityType);
        List<ActivityResponse> activityResponses = new ArrayList<>();
        for (Activity activity : availableActivities){
            ActivityResponse activityResponse = getActivityResponse(activity);
            activityResponses.add(activityResponse);
        }
        if(activityResponses.isEmpty()){
            return ResponseEntity.noContent().build();
        }else{
            return ResponseEntity.ok(activityResponses);
        }
    }
    @Transactional
    @PostMapping("/add/new-activities")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_HOST')")
    public ResponseEntity<ActivityResponse> addNewActivity(
            @RequestParam("photo") MultipartFile photo,
            @RequestParam("activityType") String activityType,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("price") BigDecimal price,
            @RequestParam("country") String country,
            @RequestParam("city") String city,
            @RequestParam("address") String address,
            @RequestParam("capacity") int capacity,
            @AuthenticationPrincipal ExpaqUserDetails currentUser) throws SQLException, IOException {
        Activity savedActivity = activityService.addNewActivity(photo, activityType, price, title, description,
                currentUser, address, city, country, capacity);
        ActivityResponse response = getActivityResponse(savedActivity);
        return ResponseEntity.ok(response);
    }


    @PutMapping("/update/{activityId}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_HOST')")
    public ResponseEntity<ActivityResponse> updateActivity(
            @PathVariable Long activityId,
            @RequestParam(required = false) MultipartFile photo,
            @RequestParam(required = false) String activityType,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) BigDecimal price,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) int capacity,
            @AuthenticationPrincipal ExpaqUserDetails currentUser) throws SQLException, IOException {
        Optional<Activity> activityOptional = activityService.getActivityById(activityId);
        if (activityOptional.isPresent()) {
            Activity theActivity = activityOptional.get();
            if (!theActivity.getHost().getId().equals(currentUser.getId())) {
                throw new AccessDeniedException("You are not authorized to update this activity");
            }
            theActivity = activityService.updateActivity(activityId, activityType, price, photo, title, description,
                    currentUser, address, city, country, capacity);
            ActivityResponse activityResponse = getActivityResponse(theActivity);
            return ResponseEntity.ok(activityResponse);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete/activity/{activityId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteActivity(@PathVariable Long activityId){
        activityService.deleteActivity(activityId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    public HostResponse mapToHostResponse(User user) {
        HostResponse hostResponse = new HostResponse();
        hostResponse.setId(user.getId());
        hostResponse.setEmail(user.getEmail());
        hostResponse.setFirstName(user.getFirstName());
        hostResponse.setLastName(user.getLastName());
        return hostResponse;
    }
    private ActivityResponse getActivityResponse(Activity activity) {
        List<BookedActivity> bookings = getAllBookingsByActivityId(activity.getId());
        HostResponse host = mapToHostResponse(activity.getHost());
        List<BookingResponse> bookingInfo = bookings
                .stream()
                .map(booking -> new BookingResponse(booking.getBookingId(),
                        booking.getCheckInDate(),
                        booking.getCheckOutDate(), booking.getBookingConfirmationCode())).toList();
        return new ActivityResponse(activity.getId(), activity.getTitle(), activity.getDescription(), activity.getAddress(),
                activity.getCapacity(), activity.getActivityType(), activity.getPrice(), activity.isBooked(), activity.isFeatured(),
                activity.getPhoto(), bookingInfo, host, activity.getCity(), activity.getCountry());
    }


    private List<BookedActivity> getAllBookingsByActivityId(Long activityId) {
        return bookingService.getAllBookingsByActivityId(activityId);
    }

}
