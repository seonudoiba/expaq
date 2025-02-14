package com.abiodun.expaq.controller;

import com.abiodun.expaq.model.*;
import com.abiodun.expaq.repository.UserRepository;
import com.abiodun.expaq.response.ActivityResponse;
import com.abiodun.expaq.response.BookingResponse;
import com.abiodun.expaq.response.HostResponse;
import com.abiodun.expaq.response.RatingResponse;
import com.abiodun.expaq.service.ActivityService;
import com.abiodun.expaq.service.UserService;
import org.springframework.security.access.AccessDeniedException;
import com.abiodun.expaq.exception.ResourceNotFoundException;
import com.abiodun.expaq.service.interf.IActivityService;
import com.abiodun.expaq.service.BookingService;
import jakarta.transaction.Transactional;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
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
public class ActivityController {
    private  final IActivityService activityService;
    private  final BookingService bookingService;
    private final UserRepository userRepository;

    public ActivityController(ActivityService activityService, BookingService bookingService, UserService userService, UserRepository userRepository) {
        this.activityService = activityService;
        this.bookingService = bookingService;
        this.userRepository = userRepository;
    }

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
    @PostMapping( "/new-activity")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HOST')")
    public ResponseEntity<ActivityResponse> addNewActivity(
            @AuthenticationPrincipal ExpaqUserDetails currentUser,
            @RequestParam("photo") MultipartFile photo,
            @RequestParam("activityType") String activityType,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("price") BigDecimal price,
            @RequestParam("country") String country,
            @RequestParam("city") String city,
            @RequestParam("address") String address,
            @RequestParam("capacity") int capacity) throws SQLException, IOException {

        // Verify authentication
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new RuntimeException("User not authenticated");
        }

        Activity savedActivity = activityService.addNewActivity(
                photo, activityType, price, title, description,
                address, city, country, capacity
                );
        ActivityResponse response = getActivityResponse(savedActivity);
        return ResponseEntity.ok(response);
    }


    @PutMapping("/update/{activityId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HOST')")
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

        User user = convertToUser(currentUser);

        Optional<Activity> activityOptional = activityService.getActivityById(activityId);
        if (activityOptional.isPresent()) {
            Activity theActivity = activityOptional.get();
            if (!theActivity.getHost().getId().equals(user.getId())) {
                throw new AccessDeniedException("You are not authorized to update this activity");
            }
            theActivity = activityService.updateActivity(activityId, photo, activityType, price, title, description,
                    address, city, country, capacity);

            ActivityResponse response = getActivityResponse(theActivity);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete/activity/{activityId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HOST')")
    public ResponseEntity<Optional<Activity>> deleteActivity(@PathVariable Long activityId,@AuthenticationPrincipal ExpaqUserDetails currentUser){


        User user = convertToUser(currentUser);

        Optional<Activity> activityOptional = activityService.getActivityById(activityId);
        if (activityOptional.isPresent()) {
            Activity theActivity = activityOptional.get();
            if (!theActivity.getHost().getId().equals(user.getId())) {
                throw new AccessDeniedException("You are not authorized to delete this activity");
            }
            activityService.deleteActivity(activityId);
            return new ResponseEntity<>(activityOptional, HttpStatus.OK);
        } else {
            return ResponseEntity.notFound().build();
        }

    }

    public HostResponse mapToHostResponse(User user) {
        HostResponse hostResponse = new HostResponse();
        hostResponse.setId(Long.valueOf(user.getId()));
        hostResponse.setEmail(user.getUserName());
        hostResponse.setFirstName(user.getFirstName());
        hostResponse.setLastName(user.getLastName());
        return hostResponse;
    }
    public RatingResponse mapToRatingResponse(Rating rating) {
        RatingResponse ratingResponse = new RatingResponse();
        ratingResponse.setId(rating.getId());
        ratingResponse.setTitle(rating.getTitle());
        ratingResponse.setContent(rating.getContent());
        ratingResponse.setStars(rating.getStars());

        return ratingResponse;
    }


    private ActivityResponse getActivityResponse(Activity activity) {
        List<BookedActivity> bookings = getAllBookingsByActivityId(activity.getId());
        HostResponse host = mapToHostResponse(activity.getHost());
        List<RatingResponse> ratings = activity.getRatings().stream()
                .map(this::mapToRatingResponse)
                .toList();
        List<BookingResponse> bookingInfo = bookings
                .stream()
                .map(booking -> new BookingResponse(booking.getBookingId(),
                        booking.getCheckInDate(),
                        booking.getCheckOutDate(), booking.getBookingConfirmationCode())).toList();
        return new ActivityResponse(activity.getId(), activity.getTitle(), activity.getDescription(), activity.getAddress(),
                activity.getCapacity(), activity.getActivityType(), activity.getPrice(), activity.isBooked(), activity.isFeatured(),
                activity.getPhoto(), bookingInfo, host, ratings, activity.getCity(), activity.getCountry());
    }


    private List<BookedActivity> getAllBookingsByActivityId(Long activityId) {
        return bookingService.getAllBookingsByActivityId(activityId);
    }
    private User convertToUser(ExpaqUserDetails currentUser) {
        // Fetch the user from the database using the username
        return userRepository.findByUserName(currentUser.getUsername());
    }

}
