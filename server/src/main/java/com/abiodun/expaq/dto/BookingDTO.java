package com.abiodun.expaq.dto;

import com.abiodun.expaq.model.Activity;
import com.abiodun.expaq.model.Booking;
import com.abiodun.expaq.model.Booking.BookingStatus;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
public class BookingDTO {
    private UUID id;
    private UUID activityId;
    private String activityTitle;
    private String activityImage;
    private UUID userId;
    private String userName;
    private String userEmail;
    private int numberOfGuests;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BookingStatus status;
    private BigDecimal totalPrice;
    private String specialRequests;
    private String cancellationReason;
    private LocalDateTime cancelledAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static BookingDTO fromBooking(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setId(booking.getId());
        dto.setActivityId(booking.getActivity().getId());
        dto.setActivityTitle(booking.getActivity().getTitle());
        if (!booking.getActivity().getMediaUrls().isEmpty()) {
            dto.setActivityImage(booking.getActivity().getMediaUrls().get(0));
        }
        dto.setUserId(booking.getUser().getId());
        dto.setUserName(booking.getUser().getFirstName() + " " + booking.getUser().getLastName());
        dto.setUserEmail(booking.getUser().getEmail());
        dto.setNumberOfGuests(booking.getNumberOfGuests());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setStatus(booking.getStatus());
        dto.setTotalPrice(booking.getTotalPrice());
        dto.setSpecialRequests(booking.getSpecialRequests());
        dto.setCancellationReason(booking.getCancellationReason());
        dto.setCancelledAt(booking.getCancelledAt());
        dto.setCreatedAt(booking.getCreatedAt());
        dto.setUpdatedAt(booking.getUpdatedAt());
        return dto;
    }
}
