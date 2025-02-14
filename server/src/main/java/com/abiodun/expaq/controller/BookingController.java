package com.abiodun.expaq.controller;

import com.abiodun.expaq.request.BookingRequest;
import com.abiodun.expaq.response.ActivityResponse;
import com.abiodun.expaq.response.BookingResponse;
import com.abiodun.expaq.exception.InvalidBookingRequestException;
import com.abiodun.expaq.exception.ResourceNotFoundException;
import com.abiodun.expaq.model.Activity;
import com.abiodun.expaq.model.BookedActivity;
import com.abiodun.expaq.service.interf.IActivityService;
import com.abiodun.expaq.service.interf.IBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/bookings")
public class BookingController {
    private final IBookingService bookingService;
    private final IActivityService activityService;

    @GetMapping("/all-bookings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponse>> getAllBookings(){
        List<BookedActivity> bookings = bookingService.getAllBookings();
        List<BookingResponse> bookingResponses = new ArrayList<>();
        for (BookedActivity booking : bookings){
            BookingResponse bookingResponse = getBookingResponse(booking);
            bookingResponses.add(bookingResponse);
        }
        return ResponseEntity.ok(bookingResponses);
    }

    //Add new booking r Booking
    @PostMapping("/activity/{activityId}/booking")
    public ResponseEntity<?> saveBooking(@PathVariable Long activityId,
                                         @RequestParam("checkInDate") LocalDate checkInDate,
                                         @RequestParam("checkOutDate") LocalDate checkOutDate,
                                         @RequestParam("guestFullName") String guestFullName,
                                         @RequestParam("guestEmail") String guestEmail,
                                         @RequestParam("numOfAdults") int numOfAdults,
                                         @RequestParam("numOfChildren") int numOfChildren) {

        // Create a BookingRequest object and set the parameters
        BookingRequest bookingRequest = new BookingRequest();
        bookingRequest.setCheckInDate(checkInDate);
        bookingRequest.setCheckOutDate(checkOutDate);
        bookingRequest.setGuestFullName(guestFullName);
        bookingRequest.setGuestEmail(guestEmail);
        bookingRequest.setNumOfAdults(numOfAdults);
        bookingRequest.setNumOfChildren(numOfChildren);

        // Map BookingRequest to BookedActivity using the mapper
        BookedActivity bookRequest = toBookedActivity(bookingRequest);


        try{
            String confirmationCode = bookingService.saveBooking(activityId, bookRequest);
            return ResponseEntity.ok(
                    "Activity booked successfully, Your booking confirmation code is :"+confirmationCode);

        }catch (InvalidBookingRequestException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/confirmation/{confirmationCode}")
    public ResponseEntity<?> getBookingByConfirmationCode(@PathVariable String confirmationCode){
        try{
            BookedActivity booking = bookingService.findByBookingConfirmationCode(confirmationCode);
            BookingResponse bookingResponse = getBookingResponse(booking);
            return ResponseEntity.ok(bookingResponse);
        }catch (ResourceNotFoundException ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @GetMapping("/user/{email}/bookings")
    public ResponseEntity<List<BookingResponse>> getBookingsByUserEmail(@PathVariable String email) {
        List<BookedActivity> bookings = bookingService.getBookingsByUserEmail(email);
        List<BookingResponse> bookingResponses = new ArrayList<>();
        for (BookedActivity booking : bookings) {
            BookingResponse bookingResponse = getBookingResponse(booking);
            bookingResponses.add(bookingResponse);
        }
        return ResponseEntity.ok(bookingResponses);
    }

    @DeleteMapping("/booking/{bookingId}/delete")
    public void cancelBooking(@PathVariable Long bookingId){
        bookingService.cancelBooking(bookingId);
    }

    private BookingResponse getBookingResponse(BookedActivity booking) {
        Activity theActivity = activityService.getActivityById(booking.getActivity().getId()).get();
        ActivityResponse activity = new ActivityResponse(
                theActivity.getId(),
                theActivity.getActivityType(),
                theActivity.getPrice());
        return new BookingResponse(
                booking.getBookingId(), booking.getCheckInDate(),
                booking.getCheckOutDate(),booking.getGuestFullName(),
                booking.getGuestEmail(), booking.getNumOfAdults(),
                booking.getNumOfChildren(), booking.getTotalNumOfGuest(),
                booking.getBookingConfirmationCode(), activity);
    }

    public static BookedActivity toBookedActivity(BookingRequest bookingRequest) {
        BookedActivity bookedActivity = new BookedActivity();
        bookedActivity.setCheckInDate(bookingRequest.getCheckInDate());
        bookedActivity.setCheckOutDate(bookingRequest.getCheckOutDate());
        bookedActivity.setGuestFullName(bookingRequest.getGuestFullName());
        bookedActivity.setGuestEmail(bookingRequest.getGuestEmail());
        bookedActivity.setNumOfAdults(bookingRequest.getNumOfAdults());
        bookedActivity.setNumOfChildren(bookingRequest.getNumOfChildren());
        bookedActivity.calculateTotalGuest();

        // You can set the bookingConfirmationCode here if you have a method to generate it
        // bookedActivity.setBookingConfirmationCode(generateConfirmationCode());

        return bookedActivity;
    }
}
