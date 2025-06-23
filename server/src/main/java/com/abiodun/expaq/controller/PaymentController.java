package com.abiodun.expaq.controller;

import com.abiodun.expaq.dto.PaymentDTO;
import com.abiodun.expaq.dto.PaymentResponseDTO;
import com.abiodun.expaq.dto.PaymentInitializeRequest;
import com.abiodun.expaq.exception.UnauthorizedException;
import com.abiodun.expaq.model.Payment;
import com.abiodun.expaq.model.Payment.PaymentStatus;
import com.abiodun.expaq.model.ExpaqUserDetails;
import com.abiodun.expaq.repository.PaymentRepository;
import com.abiodun.expaq.service.IPaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.ProblemDetail;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import static com.abiodun.expaq.dto.PaymentResponseDTO.*;

@Slf4j
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final IPaymentService paymentService;
    private final PaymentRepository paymentRepository;

    @PostMapping("/initialize")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> initializePayment(
            @RequestBody PaymentInitializeRequest request,
            jakarta.servlet.http.HttpServletRequest servletRequest) {
        try {
            PaymentDTO payment = paymentService.createPayment(request.getBookingId(), getCurrentUserId(), request.getPaymentMethod());
            return ResponseEntity.ok(PaymentResponseDTO.builder()
                    .paymentIntentId(payment.getPaymentProviderReference())
                    .status(payment.getStatus())
                    .provider(payment.getPaymentProvider())
                    .authorizationUrl(payment.getAuthorizationUrl())
                    .accessCode(payment.getAccess_code())
                    .build());
        } catch (Exception e) {
            log.error("Error initializing payment", e);
            return ResponseEntity.badRequest()
                    .body(ErrorResponse.builder(e, HttpStatus.BAD_REQUEST, servletRequest.getRequestURI())
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
    public ResponseEntity<?> updatePaymentStatus(
            @PathVariable UUID paymentId,
            @RequestParam PaymentStatus status,
            @RequestParam(required = false) String transactionId,
            jakarta.servlet.http.HttpServletRequest request) {
        try {
            return ResponseEntity.ok(paymentService.updatePaymentStatus(paymentId, status, transactionId));
        } catch (Exception e) {
            log.error("Error updating payment status", e);
            return ResponseEntity.badRequest()
                    .body(ErrorResponse.builder(e, HttpStatus.BAD_REQUEST, request.getRequestURI())
                            .build());
        }
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

    @GetMapping("/paystack/callback")
    public ResponseEntity<?> handlePaystackCallback(
            @RequestParam("reference") String reference,
            @RequestParam("trxref") String transactionReference,
            jakarta.servlet.http.HttpServletRequest request) {
        try {
            PaymentDTO payment = paymentService.updatePaymentStatus(
                UUID.fromString(reference),
                PaymentStatus.COMPLETED,
                transactionReference
            );
            return ResponseEntity.ok("Payment processed successfully");
        } catch (Exception e) {
            log.error("Error processing Paystack callback", e);
            return ResponseEntity.badRequest()
                    .body(ErrorResponse.builder(e, HttpStatus.BAD_REQUEST, request.getRequestURI())
                            .build());
        }
    }

    @GetMapping("/verify")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> verifyPayment(
            @RequestParam("reference") String reference,
            @RequestParam("trxref") String trxref,
            jakarta.servlet.http.HttpServletRequest request) {
        try {
            log.info("Verifying payment with reference: {}, trxref: {}", reference, trxref);
            PaymentDTO payment = paymentService.updatePaymentStatus(
                    fromPaymentProviderReference(reference),
                PaymentStatus.COMPLETED,
                trxref
            );
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            log.error("Error verifying payment with reference: {}, trxref: {}", reference, trxref, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ErrorResponse.builder(e, HttpStatus.INTERNAL_SERVER_ERROR, request.getRequestURI())
                            .build());
        }
    }

    private UUID getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof ExpaqUserDetails) {
            ExpaqUserDetails userDetails = (ExpaqUserDetails) authentication.getPrincipal();
            return userDetails.getId();
        }
        throw new UnauthorizedException("User not authenticated");
    }
    private UUID fromPaymentProviderReference(String reference) {
        try {
            Payment payment = paymentRepository.findByPaymentProviderReference(reference);
            return payment.getId();
        } catch (IllegalArgumentException e) {
            log.error("Invalid payment reference format: {}", reference, e);
            throw new IllegalArgumentException("Invalid payment reference format");
        }
    }
}
