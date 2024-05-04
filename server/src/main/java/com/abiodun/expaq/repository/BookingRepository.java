package com.abiodun.expaq.repository;

import com.abiodun.expaq.models.BookedActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<BookedActivity, Long> {
    Optional<BookedActivity> findByBookingConfirmationCode(String confirmationCode);

    List<BookedActivity> findByGuestEmail(String email);

    List<BookedActivity> findByActivityId(Long activityId);

}
