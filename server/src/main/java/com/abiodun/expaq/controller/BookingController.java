package com.abiodun.expaq.controller;

import com.abiodun.expaq.dto.BookingDTO;
import com.abiodun.expaq.dto.CreateBookingRequest;
import com.abiodun.expaq.model.Booking;
import com.abiodun.expaq.model.ExpaqUserDetails;
import com.abiodun.expaq.service.IBookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
            @AuthenticationPrincipal ExpaqUserDetails currentUser,
            @Valid @RequestBody CreateBookingRequest request) {
        UUID userId = currentUser.getId();
        return ResponseEntity.ok(bookingService.createBooking(request, userId));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingDTO>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<Void> cancelBooking(
            @AuthenticationPrincipal ExpaqUserDetails currentUser,
            @PathVariable UUID bookingId,
            @RequestParam String reason) {
        UUID userId = currentUser.getId();
        bookingService.cancelBooking(bookingId, userId, reason);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{bookingId}/confirm")
    @PreAuthorize("hasRole('HOST')")
    public ResponseEntity<Void> confirmBooking(
            @AuthenticationPrincipal ExpaqUserDetails currentUser,
            @PathVariable UUID bookingId) {
        UUID hostId = currentUser.getId();
        bookingService.confirmBooking(bookingId, hostId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingDTO> getBooking(
            @RequestAttribute("userId") UUID userId,
            @AuthenticationPrincipal ExpaqUserDetails currentUser,
            @PathVariable UUID bookingId) {
        return ResponseEntity.ok(bookingService.getBooking(bookingId, userId));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingDTO>> getUserBookings(
            @AuthenticationPrincipal ExpaqUserDetails currentUser
            ) {
        UUID userId = currentUser.getId();
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }

    @GetMapping("/activity/{activityId}")
    public ResponseEntity<List<BookingDTO>> getActivityBookings(
            @AuthenticationPrincipal ExpaqUserDetails currentUser,
            @PathVariable UUID activityId) {
        UUID hostId = currentUser.getId();
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
        Booking.BookingStatus bookingStatus = Booking.BookingStatus.valueOf(status);
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
