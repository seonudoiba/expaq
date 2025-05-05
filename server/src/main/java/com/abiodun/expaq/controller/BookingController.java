package com.abiodun.expaq.controller;

import com.abiodun.expaq.dto.BookingDTO;
import com.abiodun.expaq.dto.CreateBookingRequest;
import com.abiodun.expaq.model.BookingStatus;
import com.abiodun.expaq.service.IBookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
// Add CORS configuration if needed
public class BookingController {

    private final IBookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(
            @RequestAttribute("userId") UUID userId,
            @Valid @RequestBody CreateBookingRequest request) {
        return ResponseEntity.ok(bookingService.createBooking(request, userId));
    }

    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<Void> cancelBooking(
            @RequestAttribute("userId") UUID userId,
            @PathVariable UUID bookingId,
            @RequestParam String reason) {
        bookingService.cancelBooking(bookingId, userId, reason);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{bookingId}/confirm")
    public ResponseEntity<Void> confirmBooking(
            @RequestAttribute("userId") UUID hostId,
            @PathVariable UUID bookingId) {
        bookingService.confirmBooking(bookingId, hostId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingDTO> getBooking(
            @RequestAttribute("userId") UUID userId,
            @PathVariable UUID bookingId) {
        return ResponseEntity.ok(bookingService.getBooking(bookingId, userId));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingDTO>> getUserBookings(
            @RequestAttribute("userId") UUID userId) {
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }

    @GetMapping("/activity/{activityId}")
    public ResponseEntity<List<BookingDTO>> getActivityBookings(
            @RequestAttribute("userId") UUID hostId,
            @PathVariable UUID activityId) {
        return ResponseEntity.ok(bookingService.getActivityBookings(activityId, hostId));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<BookingDTO>> getUpcomingBookings(
            @RequestAttribute("userId") UUID userId) {
        return ResponseEntity.ok(bookingService.getUpcomingBookings(userId));
    }

    @GetMapping("/past")
    public ResponseEntity<List<BookingDTO>> getPastBookings(
            @RequestAttribute("userId") UUID userId) {
        return ResponseEntity.ok(bookingService.getPastBookings(userId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<BookingDTO>> getBookingsByStatus(
            @RequestAttribute("userId") UUID userId,
            @PathVariable String status) {
        BookingStatus bookingStatus = BookingStatus.valueOf(status);
        return ResponseEntity.ok(bookingService.getBookingsByStatus(userId, bookingStatus));
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<BookingDTO>> getBookingsByDateRange(
            @RequestAttribute("userId") UUID userId,
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end) {
        return ResponseEntity.ok(bookingService.getBookingsByDateRange(userId, start, end));
    }

    @PutMapping("/{bookingId}/payment")
    public ResponseEntity<Void> updateBookingPayment(
            @PathVariable UUID bookingId,
            @RequestParam String paymentId,
            @RequestParam String paymentStatus) {
        bookingService.updateBookingPayment(bookingId, paymentId, paymentStatus);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{bookingId}/weather")
    public ResponseEntity<Void> updateBookingWeather(
            @PathVariable UUID bookingId,
            @RequestParam String weatherForecast) {
        bookingService.updateBookingWeather(bookingId, weatherForecast);
        return ResponseEntity.ok().build();
    }
}
