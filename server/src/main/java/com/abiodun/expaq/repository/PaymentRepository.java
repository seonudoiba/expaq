package com.abiodun.expaq.repository;

import com.abiodun.expaq.model.Payment;
import com.abiodun.expaq.model.Payment.PaymentMethod;
import com.abiodun.expaq.model.Payment.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    
    List<Payment> findByUserId(UUID userId);
    
    List<Payment> findByBookingId(UUID bookingId);
    
    List<Payment> findByStatus(PaymentStatus status);
    
    List<Payment> findByPaymentMethod(PaymentMethod paymentMethod);
    
    List<Payment> findByCurrency(String currency);
    
    @Query("SELECT p FROM Payment p WHERE p.user.id = :userId AND p.createdAt BETWEEN :startDate AND :endDate")
    List<Payment> findByUserIdAndDateRange(
            @Param("userId") UUID userId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT p FROM Payment p WHERE p.createdAt BETWEEN :startDate AND :endDate")
    List<Payment> findByDateRange(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT p FROM Payment p WHERE p.booking.id = :bookingId AND p.status = :status")
    Payment findByBookingIdAndStatus(
            @Param("bookingId") UUID bookingId,
            @Param("status") PaymentStatus status
    );
    
    Page<Payment> findByUserId(UUID userId, Pageable pageable);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.user.id = :userId AND p.status = :status")
    BigDecimal getTotalAmountByUserIdAndStatus(
            @Param("userId") UUID userId,
            @Param("status") PaymentStatus status
    );

    Payment findByPaymentProviderReference(String paymentProviderReference);
}