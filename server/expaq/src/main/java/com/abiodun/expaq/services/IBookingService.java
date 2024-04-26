package com.abiodun.expaq.services;

import com.abiodun.expaq.models.BookedActivity;

import java.util.List;

public interface IBookingService {
    void cancelBooking(Long bookingId);

    List<BookedActivity> getAllBookingsByActivityId(Long activityId);

    String saveBooking(Long ActivityId, BookedActivity bookingRequest);

    BookedActivity findByBookingConfirmationCode(String confirmationCode);

    List<BookedActivity> getAllBookings();

    List<BookedActivity> getBookingsByUserEmail(String email);
}
