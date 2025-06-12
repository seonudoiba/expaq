package com.abiodun.expaq.controller;

import com.abiodun.expaq.dto.PaymentAnalyticsDTO;
import com.abiodun.expaq.model.Payment.PaymentStatus;
import com.abiodun.expaq.service.IPaymentAnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/payments/analytics")
@RequiredArgsConstructor
public class PaymentAnalyticsController {

    private final IPaymentAnalyticsService paymentAnalyticsService;

    @GetMapping("/overall")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentAnalyticsDTO> getOverallAnalytics() {
        return ResponseEntity.ok(paymentAnalyticsService.getOverallAnalytics());
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentAnalyticsDTO> getAnalyticsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(paymentAnalyticsService.getAnalyticsByDateRange(startDate, endDate));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
    public ResponseEntity<PaymentAnalyticsDTO> getUserAnalytics(@PathVariable UUID userId) {
        return ResponseEntity.ok(paymentAnalyticsService.getUserAnalytics(userId));
    }

    @GetMapping("/booking/{bookingId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentAnalyticsDTO> getBookingAnalytics(@PathVariable UUID bookingId) {
        return ResponseEntity.ok(paymentAnalyticsService.getBookingAnalytics(bookingId));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentAnalyticsDTO> getAnalyticsByStatus(@PathVariable PaymentStatus status) {
        return ResponseEntity.ok(paymentAnalyticsService.getAnalyticsByStatus(status));
    }

    @GetMapping("/method/{paymentMethod}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentAnalyticsDTO> getAnalyticsByPaymentMethod(@PathVariable String paymentMethod) {
        return ResponseEntity.ok(paymentAnalyticsService.getAnalyticsByPaymentMethod(paymentMethod));
    }

    @GetMapping("/currency/{currency}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentAnalyticsDTO> getAnalyticsByCurrency(@PathVariable String currency) {
        return ResponseEntity.ok(paymentAnalyticsService.getAnalyticsByCurrency(currency));
    }

    @GetMapping("/time-period/{timePeriod}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentAnalyticsDTO> getAnalyticsByTimePeriod(@PathVariable String timePeriod) {
        return ResponseEntity.ok(paymentAnalyticsService.getAnalyticsByTimePeriod(timePeriod));
    }
} 