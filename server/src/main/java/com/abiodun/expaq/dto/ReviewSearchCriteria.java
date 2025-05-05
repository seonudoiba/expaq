package com.abiodun.expaq.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class ReviewSearchCriteria {
    private UUID activityId;
    private UUID userId;
    private UUID hostId;
    private Integer minRating;
    private Integer maxRating;
    private boolean isVerified;
    private boolean isEdited;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String searchTerm;
    private List<Integer> ratings;
    private String sortBy;
    private String sortDirection;
    private Integer page;
    private Integer size;
} 