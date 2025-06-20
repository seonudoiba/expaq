package com.abiodun.expaq.controller;

import com.abiodun.expaq.dto.PaymentDTO;
import com.abiodun.expaq.dto.PaymentResponseDTO;
import com.abiodun.expaq.model.Payment.PaymentStatus;
import com.abiodun.expaq.service.IPaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final IPaymentService paymentService;

    @PostMapping("/create")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PaymentResponseDTO> createPayment(
            @RequestParam UUID bookingId,
            @RequestParam String paymentMethod) {
        try {
            PaymentDTO payment = paymentService.createPayment(bookingId, getCurrentUserId(), paymentMethod);
            return ResponseEntity.ok(PaymentResponseDTO.builder()
                    .paymentIntentId(payment.getPaymentProviderReference())
                    .status(payment.getStatus().name())
                    .provider(payment.getPaymentProvider())
                    .build());
        } catch (Exception e) {
            log.error("Error creating payment", e);
            return ResponseEntity.badRequest().body(PaymentResponseDTO.builder()
                    .status("ERROR")
                    .message(e.getMessage())
                    .build());
        }
    }

    @GetMapping("/{paymentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PaymentDTO> getPayment(@PathVariable UUID paymentId) {
        return ResponseEntity.ok(paymentService.getPayment(paymentId));
    }

    @GetMapping("/user")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<PaymentDTO>> getUserPayments() {
        return ResponseEntity.ok(paymentService.getUserPayments(getCurrentUserId()));
    }

    @GetMapping("/booking/{bookingId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<PaymentDTO>> getBookingPayments(@PathVariable UUID bookingId) {
        return ResponseEntity.ok(paymentService.getBookingPayments(bookingId));
    }

    @PutMapping("/{paymentId}/status")
    public ResponseEntity<PaymentDTO> updatePaymentStatus(
            @PathVariable UUID paymentId,
            @RequestParam PaymentStatus status,
            @RequestParam(required = false) String transactionId) {
        return ResponseEntity.ok(paymentService.updatePaymentStatus(paymentId, status, transactionId));
    }

    @PostMapping("/{paymentId}/refund")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentDTO> processRefund(
            @PathVariable UUID paymentId,
            @RequestParam String reason) {
        return ResponseEntity.ok(paymentService.processRefund(paymentId, reason));
    }

    @GetMapping("/user/date-range")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByDateRange(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        return ResponseEntity.ok(paymentService.getPaymentsByDateRange(
                getCurrentUserId(), startDate, endDate));
    }

    @GetMapping("/user/paginated")
    public ResponseEntity<Page<PaymentDTO>> getUserPaymentsPaginated(
            @RequestAttribute("userId") UUID userId,
            Pageable pageable) {
        return ResponseEntity.ok(paymentService.getUserPaymentsPaginated(userId, pageable));
    }

    @GetMapping("/user/total")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BigDecimal> getTotalAmountByStatus(
            @RequestParam PaymentStatus status) {
        return ResponseEntity.ok(paymentService.getTotalAmountByUserAndStatus(
                getCurrentUserId(), status));
    }

    @PostMapping("/{paymentId}/cancel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> cancelPayment(@PathVariable UUID paymentId) {
        paymentService.cancelPayment(paymentId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/booking/{bookingId}/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PaymentDTO> getPaymentByBookingAndStatus(
            @PathVariable UUID bookingId,
            @RequestParam PaymentStatus status) {
        return ResponseEntity.ok(paymentService.getPaymentByBookingAndStatus(bookingId, status));
    }

    private UUID getCurrentUserId() {

        // TODO: Implement getting current user ID from security context
        return UUID.randomUUID(); // Placeholder
    }
} 