package com.abiodun.expaq.service.impl;

import com.abiodun.expaq.dto.BookingDTO;
import com.abiodun.expaq.dto.CreateBookingRequest;
import com.abiodun.expaq.exception.ResourceNotFoundException;
import com.abiodun.expaq.model.Activity;
import com.abiodun.expaq.model.Booking;
import com.abiodun.expaq.model.BookingStatus;
import com.abiodun.expaq.model.User;
import com.abiodun.expaq.repository.ActivityRepository;
import com.abiodun.expaq.repository.BookingRepository;
import com.abiodun.expaq.repository.UserRepository;
import com.abiodun.expaq.service.IBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements IBookingService {

    private final BookingRepository bookingRepository;
    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public BookingDTO createBooking(CreateBookingRequest request, UUID userId) {
        // Get activity and user
        Activity activity = activityRepository.findById(request.getActivityId())
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if activity can accommodate the booking
        if (!activity.canAccommodateBooking(request.getNumberOfGuests())) {
            throw new RuntimeException("Activity cannot accommodate the requested number of guests");
        }
        // Create booking
        Booking booking = new Booking();
        booking.setActivity(activity);
        booking.setUser(user);
        booking.setNumberOfGuests(request.getNumberOfGuests());
        booking.setSpecialRequests(request.getSpecialRequests());
        booking.setEndTime(request.getEndTime());
        booking.setStartTime(request.getStartTime());
        booking.setStatus(Booking.BookingStatus.PENDING);
        booking.setGuestEmail(user.getEmail());
        booking.setHost(activity.getHost());

        booking.calculateTotalPrice();

        // Save booking
        booking = bookingRepository.save(booking);

        // Update activity's booked capacity
        activity.addBooking(booking);
        activityRepository.save(activity);

        return BookingDTO.fromBooking(booking);
    }

    // @Override
    // List<BookingDTO> getActivityBookings(UUID activityId, UUID hostId){
    //     return  activityRepository.findAll();
    // }


    @Override
    @Transactional
    public void cancelBooking(UUID bookingId, UUID userId, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // Check if user owns the booking
        if (!booking.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to cancel this booking");
        }

        // Cancel booking
        booking.cancel(reason);
        bookingRepository.save(booking);

        // Update activity's booked capacity
        Activity activity = booking.getActivity();
        activity.cancelBooking(booking);
        activityRepository.save(activity);
    }

    @Override
    @Transactional
    public void confirmBooking(UUID bookingId, UUID hostId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // Check if user is the host
        if (!booking.getActivity().getHost().getId().equals(hostId)) {
            throw new RuntimeException("Unauthorized to confirm this booking");
        }

        // Confirm booking
        booking.confirm();
        bookingRepository.save(booking);
    }

    @Override
    public BookingDTO getBooking(UUID bookingId, UUID userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // Check if user is authorized to view the booking
        if (!booking.getUser().getId().equals(userId) && 
            !booking.getActivity().getHost().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to view this booking");
        }

        return BookingDTO.fromBooking(booking);
    }

    @Override
    public List<BookingDTO> getUserBookings(UUID userId) {
        return bookingRepository.findByUserId(userId)
                .stream()
                .map(booking -> BookingDTO.fromBooking((Booking) booking))
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingDTO> getActivityBookings(UUID activityId, UUID hostId) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));

        // Check if user is the host
        if (!activity.getHost().getId().equals(hostId)) {
            throw new RuntimeException("Unauthorized to view these bookings");
        }

        return activity.getBookings()
                .stream()
                .map(booking -> BookingDTO.fromBooking(booking))
                .collect(Collectors.toList());
    }

    // @Override
    // public List<BookingDTO> getUpcomingBookings(UUID userId) {
    //     LocalDateTime now = LocalDateTime.now();
    //     return bookingRepository.findByUserIdAndBookingDateTimeAfter(userId, now)
    //             .stream()
    //             .map(BookingDTO::fromBooking)
    //             .collect(Collectors.toList());
    // }

    // @Override
    // public List<BookingDTO> getPastBookings(UUID userId) {
    //     LocalDateTime now = LocalDateTime.now();
    //     return bookingRepository.findByUserIdAndBookingDateTimeBefore(userId, now)
    //             .stream()
    //             .map(BookingDTO::fromBooking)
    //             .collect(Collectors.toList());
    // }
    

    @Override
    public List<BookingDTO> getBookingsByStatus(UUID userId, BookingStatus status) {
        // Add Pageable parameter - using unpaged as default
        return bookingRepository.findByUserIdAndStatus(userId, Booking.BookingStatus.valueOf(status.name()), Pageable.unpaged())
                .stream()
                .map(BookingDTO::fromBooking)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingDTO> getBookingsByDateRange(UUID userId, LocalDateTime start, LocalDateTime end) {
        // Assuming this method returns Booking objects, not BookedActivity
        return bookingRepository.findByUserIdAndBookingDateTimeBetween(userId, start, end)
                .stream()
                .map(booking -> BookingDTO.fromBooking((Booking) booking))
                .collect(Collectors.toList());
    }


    @Override
    @Transactional
    public void updateBookingPayment(UUID bookingId, String paymentId, String paymentStatus) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        booking.setPaymentId(paymentId);
        booking.setPaymentStatus(paymentStatus);
        booking.setStatus(Booking.BookingStatus.PAID);
        booking.setPaymentDate(LocalDateTime.now());

        if ("SUCCESS".equals(paymentStatus)) {
            booking.confirm();
        }

        bookingRepository.save(booking);
    }

    @Override
    @Transactional
    public void updateBookingWeather(UUID bookingId, String weatherForecast) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        booking.setWeatherForecast(weatherForecast);
        booking.setWeatherForecastUpdatedAt(LocalDateTime.now());
        bookingRepository.save(booking);
    }

    @Override
    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(BookingDTO::fromBooking)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingDTO> getUpcomingBookings(UUID userId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getUpcomingBookings'");
    }

    @Override
    public List<BookingDTO> getPastBookings(UUID userId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getPastBookings'");
    }
}
