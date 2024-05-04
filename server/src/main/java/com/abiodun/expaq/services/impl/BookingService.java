package com.abiodun.expaq.services.impl;

import com.abiodun.expaq.exception.InvalidBookingRequestException;
import com.abiodun.expaq.exception.ResourceNotFoundException;
import com.abiodun.expaq.models.Activity;
import com.abiodun.expaq.models.BookedActivity;
import com.abiodun.expaq.repository.BookingRepository;
import com.abiodun.expaq.services.IActivityService;
import com.abiodun.expaq.services.IBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class BookingService implements IBookingService {
    private final BookingRepository bookingRepository;
    private final IActivityService activityService;
    @Override
    public List<BookedActivity> getAllBookings() {
        return bookingRepository.findAll();
    }


    @Override
    public List<BookedActivity> getBookingsByUserEmail(String email) {
        return bookingRepository.findByGuestEmail(email);
    }

    @Override
    public void cancelBooking(Long bookingId) {
        bookingRepository.deleteById(bookingId);
    }

    @Override
    public List<BookedActivity> getAllBookingsByActivityId(Long activityId) {
        return bookingRepository.findByActivityId(activityId);
    }

    @Override
    public String saveBooking(Long activityId, BookedActivity bookingRequest) {
        if (bookingRequest.getCheckOutDate().isBefore(bookingRequest.getCheckInDate())){
            throw new InvalidBookingRequestException("Check-in date must come before check-out date");
        }
        Activity activity = activityService.getActivityById(activityId).get();
        List<BookedActivity> existingBookings = activity.getBookings();
        boolean ActivityIsAvailable = ActivityIsAvailable(bookingRequest,existingBookings);
        if (ActivityIsAvailable){
            activity.addBooking(bookingRequest);
            bookingRepository.save(bookingRequest);
        }else{
            throw  new InvalidBookingRequestException("Sorry, This Activity is not available for the selected dates;");
        }
        return bookingRequest.getBookingConfirmationCode();
    }

    @Override
    public BookedActivity findByBookingConfirmationCode(String confirmationCode) {
        return bookingRepository.findByBookingConfirmationCode(confirmationCode)
                .orElseThrow(() -> new ResourceNotFoundException("No booking found with booking code :"+confirmationCode));

    }


    private boolean ActivityIsAvailable(BookedActivity bookingRequest, List<BookedActivity> existingBookings) {
        return existingBookings.stream()
                .noneMatch(existingBooking ->
                        bookingRequest.getCheckInDate().equals(existingBooking.getCheckInDate())
                                || bookingRequest.getCheckOutDate().isBefore(existingBooking.getCheckOutDate())
                                || (bookingRequest.getCheckInDate().isAfter(existingBooking.getCheckInDate())
                                && bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckOutDate()))
                                || (bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckInDate())

                                && bookingRequest.getCheckOutDate().equals(existingBooking.getCheckOutDate()))
                                || (bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckInDate())

                                && bookingRequest.getCheckOutDate().isAfter(existingBooking.getCheckOutDate()))

                                || (bookingRequest.getCheckInDate().equals(existingBooking.getCheckOutDate())
                                && bookingRequest.getCheckOutDate().equals(existingBooking.getCheckInDate()))

                                || (bookingRequest.getCheckInDate().equals(existingBooking.getCheckOutDate())
                                && bookingRequest.getCheckOutDate().equals(bookingRequest.getCheckInDate()))
                );
    }
}
