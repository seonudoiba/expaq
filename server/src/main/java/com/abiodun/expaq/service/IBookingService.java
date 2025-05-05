package com.abiodun.expaq.service;

import com.abiodun.expaq.dto.BookingDTO;
import com.abiodun.expaq.dto.CreateBookingRequest;
import com.abiodun.expaq.model.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface IBookingService {
    BookingDTO createBooking(CreateBookingRequest request, UUID userId);
    void cancelBooking(UUID bookingId, UUID userId, String reason);
    void confirmBooking(UUID bookingId, UUID hostId);
    BookingDTO getBooking(UUID bookingId, UUID userId);
    List<BookingDTO> getUserBookings(UUID userId);
    List<BookingDTO> getActivityBookings(UUID activityId, UUID hostId);
    List<BookingDTO> getUpcomingBookings(UUID userId);
    List<BookingDTO> getPastBookings(UUID userId);
    List<BookingDTO> getBookingsByStatus(UUID userId, BookingStatus status);
    List<BookingDTO> getBookingsByDateRange(UUID userId, LocalDateTime start, LocalDateTime end);
    void updateBookingPayment(UUID bookingId, String paymentId, String paymentStatus);
    void updateBookingWeather(UUID bookingId, String weatherForecast);
}
